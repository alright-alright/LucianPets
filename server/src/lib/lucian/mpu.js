import EventEmitter from 'events';
import fs from 'fs/promises';
import path from 'path';

/**
 * Memory Processing Unit (MPU)
 * Persistent memory system for LucianPets
 * Stores and retrieves memories across sessions
 */
export class MPUComponent extends EventEmitter {
  constructor() {
    super();
    
    this.isActive = false;
    this.memoryStore = new Map();
    this.episodicMemory = [];
    this.semanticMemory = new Map();
    this.proceduralMemory = new Map();
    
    // Memory configuration
    this.config = {
      maxEpisodic: 1000,
      maxSemantic: 500,
      consolidationThreshold: 0.7,
      forgettingRate: 0.001,
      importanceDecay: 0.99,
      persistencePath: './data/memories'
    };
    
    // Memory statistics
    this.stats = {
      totalMemories: 0,
      retrievals: 0,
      consolidations: 0,
      retentionRate: 0.85
    };
    
    // Pet-specific memories
    this.petMemories = new Map();
  }
  
  async initialize() {
    console.log('🧠 Initializing MPU Component...');
    
    // Create persistence directory
    await this.ensurePersistenceDirectory();
    
    // Load existing memories
    await this.loadPersistedMemories();
    
    this.isActive = true;
    
    // Start memory consolidation process
    this.startConsolidationProcess();
    
    console.log('✅ MPU Component initialized with', this.stats.totalMemories, 'memories');
  }
  
  async ensurePersistenceDirectory() {
    try {
      await fs.mkdir(this.config.persistencePath, { recursive: true });
    } catch (error) {
      console.error('Failed to create persistence directory:', error);
    }
  }
  
  async loadPersistedMemories() {
    try {
      const files = await fs.readdir(this.config.persistencePath);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.config.persistencePath, file);
          const data = await fs.readFile(filePath, 'utf8');
          const memories = JSON.parse(data);
          
          // Restore memories based on type
          if (file.includes('episodic')) {
            this.episodicMemory = memories;
          } else if (file.includes('semantic')) {
            memories.forEach(mem => {
              this.semanticMemory.set(mem.key, mem.value);
            });
          } else if (file.includes('pet_')) {
            const petId = file.replace('pet_', '').replace('.json', '');
            this.petMemories.set(petId, memories);
          }
        }
      }
      
      this.stats.totalMemories = this.episodicMemory.length + this.semanticMemory.size;
    } catch (error) {
      console.log('No existing memories found, starting fresh');
    }
  }
  
  async storeMemory(memory) {
    const enhancedMemory = {
      ...memory,
      id: this.generateMemoryId(),
      timestamp: Date.now(),
      importance: memory.importance || this.calculateImportance(memory),
      retrievalCount: 0,
      lastRetrieved: null
    };
    
    // Store based on memory type
    switch (memory.type) {
      case 'episodic':
        this.storeEpisodicMemory(enhancedMemory);
        break;
      case 'semantic':
        this.storeSemanticMemory(enhancedMemory);
        break;
      case 'procedural':
        this.storeProceduralMemory(enhancedMemory);
        break;
      default:
        this.storeGeneralMemory(enhancedMemory);
    }
    
    this.stats.totalMemories++;
    
    // Emit event for other components
    this.emit('memory_stored', enhancedMemory);
    
    // Persist if important enough
    if (enhancedMemory.importance > 0.5) {
      await this.persistMemory(enhancedMemory);
    }
    
    return enhancedMemory;
  }
  
  storeEpisodicMemory(memory) {
    // Add to episodic memory (time-ordered events)
    this.episodicMemory.push(memory);
    
    // Maintain size limit
    if (this.episodicMemory.length > this.config.maxEpisodic) {
      // Remove oldest low-importance memories
      this.episodicMemory.sort((a, b) => b.importance - a.importance);
      this.episodicMemory = this.episodicMemory.slice(0, this.config.maxEpisodic);
      this.episodicMemory.sort((a, b) => b.timestamp - a.timestamp);
    }
  }
  
  storeSemanticMemory(memory) {
    // Store conceptual knowledge
    const key = memory.concept || memory.content?.concept || `semantic_${Date.now()}`;
    
    if (this.semanticMemory.has(key)) {
      // Merge with existing semantic memory
      const existing = this.semanticMemory.get(key);
      this.semanticMemory.set(key, {
        ...existing,
        ...memory,
        strength: (existing.strength || 1) + 0.1,
        connections: [...(existing.connections || []), ...(memory.connections || [])]
      });
    } else {
      this.semanticMemory.set(key, memory);
    }
    
    // Maintain size limit
    if (this.semanticMemory.size > this.config.maxSemantic) {
      // Remove weakest semantic memories
      const entries = Array.from(this.semanticMemory.entries());
      entries.sort((a, b) => (b[1].strength || 1) - (a[1].strength || 1));
      
      this.semanticMemory.clear();
      entries.slice(0, this.config.maxSemantic).forEach(([k, v]) => {
        this.semanticMemory.set(k, v);
      });
    }
  }
  
  storeProceduralMemory(memory) {
    // Store how-to knowledge and skills
    const procedure = memory.procedure || memory.action || 'unknown';
    
    if (!this.proceduralMemory.has(procedure)) {
      this.proceduralMemory.set(procedure, []);
    }
    
    this.proceduralMemory.get(procedure).push({
      ...memory,
      successRate: memory.successRate || 0.5,
      executionCount: 1
    });
  }
  
  storeGeneralMemory(memory) {
    // Store in general memory store
    this.memoryStore.set(memory.id, memory);
  }
  
  retrieveMemory(query) {
    this.stats.retrievals++;
    
    // Search across all memory types
    const results = [];
    
    // Search episodic memory
    const episodicMatches = this.searchEpisodicMemory(query);
    results.push(...episodicMatches);
    
    // Search semantic memory
    const semanticMatches = this.searchSemanticMemory(query);
    results.push(...semanticMatches);
    
    // Update retrieval counts
    results.forEach(memory => {
      memory.retrievalCount++;
      memory.lastRetrieved = Date.now();
    });
    
    // Sort by relevance and recency
    results.sort((a, b) => {
      const scoreA = a.importance * (1 + a.retrievalCount * 0.1);
      const scoreB = b.importance * (1 + b.retrievalCount * 0.1);
      return scoreB - scoreA;
    });
    
    // Emit retrieval event
    if (results.length > 0) {
      this.emit('memory_retrieved', results[0]);
    }
    
    return results;
  }
  
  searchEpisodicMemory(query) {
    const matches = [];
    const queryLower = JSON.stringify(query).toLowerCase();
    
    for (const memory of this.episodicMemory) {
      const memoryStr = JSON.stringify(memory).toLowerCase();
      
      // Simple string matching - could be enhanced with vector similarity
      if (memoryStr.includes(queryLower) || this.semanticMatch(memory, query)) {
        matches.push(memory);
      }
    }
    
    return matches.slice(0, 10); // Return top 10 matches
  }
  
  searchSemanticMemory(query) {
    const matches = [];
    
    this.semanticMemory.forEach((memory, key) => {
      if (this.semanticMatch(memory, query)) {
        matches.push(memory);
      }
    });
    
    return matches.slice(0, 5); // Return top 5 semantic matches
  }
  
  semanticMatch(memory, query) {
    // Simple semantic matching - in production would use embeddings
    if (typeof query === 'string') {
      const memoryStr = JSON.stringify(memory).toLowerCase();
      return memoryStr.includes(query.toLowerCase());
    }
    
    if (query.concept && memory.concept) {
      return query.concept === memory.concept;
    }
    
    if (query.type && memory.type) {
      return query.type === memory.type;
    }
    
    return false;
  }
  
  retrieveRelevantMemories(symbols) {
    // Retrieve memories relevant to given symbols
    const relevantMemories = [];
    
    symbols.forEach(symbol => {
      const matches = this.retrieveMemory({ concept: symbol.concept });
      relevantMemories.push(...matches);
    });
    
    // Deduplicate
    const unique = new Map();
    relevantMemories.forEach(mem => unique.set(mem.id, mem));
    
    return Array.from(unique.values());
  }
  
  getRecentMemories(count = 10) {
    // Get most recent episodic memories
    return this.episodicMemory
      .slice(-count)
      .reverse();
  }
  
  calculateImportance(memory) {
    // Calculate memory importance based on various factors
    let importance = 0.5; // Base importance
    
    // Emotional memories are more important
    if (memory.emotion) {
      importance += 0.2;
    }
    
    // Learning moments are important
    if (memory.type === 'learning' || memory.type === 'achievement') {
      importance += 0.3;
    }
    
    // Interactions with owner are important
    if (memory.context?.includes('owner') || memory.context?.includes('user')) {
      importance += 0.2;
    }
    
    // Novel experiences are important
    if (memory.novelty > 0.7) {
      importance += 0.2;
    }
    
    return Math.min(1, importance);
  }
  
  startConsolidationProcess() {
    // Periodically consolidate memories
    setInterval(async () => {
      await this.consolidateMemories();
      await this.forgetUnimportantMemories();
    }, 30000); // Every 30 seconds
  }
  
  async consolidateMemories() {
    // Consolidate related episodic memories into semantic memories
    const recentEpisodic = this.episodicMemory.slice(-50);
    const patterns = this.findPatterns(recentEpisodic);
    
    patterns.forEach(pattern => {
      if (pattern.strength > this.config.consolidationThreshold) {
        // Convert pattern to semantic memory
        this.storeSemanticMemory({
          type: 'semantic',
          concept: pattern.concept,
          content: pattern.content,
          strength: pattern.strength,
          source: 'consolidation',
          timestamp: Date.now()
        });
        
        this.stats.consolidations++;
      }
    });
  }
  
  findPatterns(memories) {
    // Find recurring patterns in memories
    const patterns = new Map();
    
    memories.forEach(memory => {
      const key = this.extractPatternKey(memory);
      
      if (!patterns.has(key)) {
        patterns.set(key, {
          concept: key,
          content: [],
          count: 0,
          strength: 0
        });
      }
      
      const pattern = patterns.get(key);
      pattern.content.push(memory);
      pattern.count++;
      pattern.strength = pattern.count / memories.length;
    });
    
    return Array.from(patterns.values());
  }
  
  extractPatternKey(memory) {
    // Extract a pattern key from memory
    if (memory.action) return `action_${memory.action}`;
    if (memory.concept) return `concept_${memory.concept}`;
    if (memory.type) return `type_${memory.type}`;
    return 'general';
  }
  
  async forgetUnimportantMemories() {
    // Implement forgetting curve for unimportant memories
    this.episodicMemory = this.episodicMemory.filter(memory => {
      // Decay importance over time
      memory.importance *= this.config.importanceDecay;
      
      // Forget if importance drops too low and hasn't been retrieved recently
      const shouldForget = memory.importance < 0.1 && 
                          (!memory.lastRetrieved || 
                           Date.now() - memory.lastRetrieved > 86400000); // 24 hours
      
      return !shouldForget;
    });
    
    // Update retention rate
    this.stats.retentionRate = this.episodicMemory.length / this.config.maxEpisodic;
  }
  
  async persistMemory(memory) {
    // Save important memories to disk
    try {
      const petId = memory.petId || 'default';
      const filename = `pet_${petId}.json`;
      const filepath = path.join(this.config.persistencePath, filename);
      
      // Load existing pet memories
      let petMemories = [];
      try {
        const data = await fs.readFile(filepath, 'utf8');
        petMemories = JSON.parse(data);
      } catch (e) {
        // File doesn't exist yet
      }
      
      // Add new memory
      petMemories.push(memory);
      
      // Keep only recent/important memories
      if (petMemories.length > 100) {
        petMemories.sort((a, b) => b.importance - a.importance);
        petMemories = petMemories.slice(0, 100);
      }
      
      // Save back to file
      await fs.writeFile(filepath, JSON.stringify(petMemories, null, 2));
      
    } catch (error) {
      console.error('Failed to persist memory:', error);
    }
  }
  
  // Pet-specific memory methods
  async storePetMemory(petId, memory) {
    if (!this.petMemories.has(petId)) {
      this.petMemories.set(petId, []);
    }
    
    const petMems = this.petMemories.get(petId);
    petMems.push({
      ...memory,
      petId,
      timestamp: Date.now()
    });
    
    // Keep limited per pet
    if (petMems.length > 200) {
      petMems.shift();
    }
    
    // Also store in general memory
    return this.storeMemory({ ...memory, petId });
  }
  
  getPetMemories(petId) {
    return this.petMemories.get(petId) || [];
  }
  
  generateMemoryId() {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  getMemoryCount() {
    return this.stats.totalMemories;
  }
  
  getRetentionRate() {
    return this.stats.retentionRate;
  }
  
  async shutdown() {
    console.log('💾 Saving memories before shutdown...');
    
    // Persist all important memories
    try {
      // Save episodic memories
      await fs.writeFile(
        path.join(this.config.persistencePath, 'episodic.json'),
        JSON.stringify(this.episodicMemory.slice(-100), null, 2)
      );
      
      // Save semantic memories
      const semanticArray = Array.from(this.semanticMemory.entries()).map(([key, value]) => ({
        key,
        value
      }));
      await fs.writeFile(
        path.join(this.config.persistencePath, 'semantic.json'),
        JSON.stringify(semanticArray, null, 2)
      );
      
    } catch (error) {
      console.error('Failed to save memories:', error);
    }
    
    this.isActive = false;
    this.removeAllListeners();
  }
}

export default MPUComponent;