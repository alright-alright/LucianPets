import EventEmitter from 'events';

/**
 * Wonder Engine
 * Autonomous curiosity and exploration system
 * Drives pets to explore, investigate, and discover
 */
export class WonderEngine extends EventEmitter {
  constructor() {
    super();
    
    this.isActive = false;
    this.curiosityLevel = 0.6;
    this.explorationQueue = [];
    this.discoveries = new Map();
    this.interestMap = new Map();
    
    // Wonder configuration
    this.config = {
      baseCuriosity: 0.5,
      curiosityDecay: 0.99,
      curiosityBoost: 0.15,
      noveltyThreshold: 0.7,
      explorationDepth: 3,
      wonderCooldown: 5000,
      maxQueueSize: 20
    };
    
    // Wonder statistics
    this.stats = {
      totalExplorations: 0,
      discoveries: 0,
      wonderMoments: 0,
      averageCuriosity: 0.5
    };
    
    // Interest categories for pets
    this.interestCategories = [
      'visual_patterns',
      'sounds',
      'movements',
      'objects',
      'interactions',
      'environments',
      'emotions',
      'games'
    ];
    
    this.lastWonderTime = 0;
    this.curiosityHistory = [];
  }
  
  async initialize() {
    console.log('✨ Initializing Wonder Engine...');
    
    // Initialize interest map
    this.initializeInterests();
    
    // Start curiosity cycle
    this.startCuriosityCycle();
    
    this.isActive = true;
    
    console.log('✅ Wonder Engine initialized');
  }
  
  initializeInterests() {
    // Initialize pet's interests with random weights
    this.interestCategories.forEach(category => {
      this.interestMap.set(category, {
        level: 0.3 + Math.random() * 0.4, // 0.3 to 0.7
        experiences: 0,
        lastTriggered: 0
      });
    });
  }
  
  isNovel(symbols) {
    // Check if input represents something novel
    if (!symbols || symbols.length === 0) return false;
    
    // Check against discoveries
    let noveltyScore = 1.0;
    
    symbols.forEach(symbol => {
      if (this.discoveries.has(symbol.concept)) {
        const discovery = this.discoveries.get(symbol.concept);
        // Reduce novelty based on familiarity
        noveltyScore *= (1 - discovery.familiarity);
      }
    });
    
    return noveltyScore > this.config.noveltyThreshold;
  }
  
  explore(symbols) {
    // Initiate exploration of novel concepts
    if (!this.canWonder()) {
      return null;
    }
    
    const exploration = {
      id: `explore_${Date.now()}`,
      symbols,
      timestamp: Date.now(),
      depth: 0,
      path: [],
      curiosityLevel: this.curiosityLevel,
      category: this.categorizeExploration(symbols)
    };
    
    // Add to exploration queue
    this.addToQueue(exploration);
    
    // Boost curiosity
    this.boostCuriosity(this.config.curiosityBoost);
    
    // Update interest in category
    if (exploration.category) {
      this.updateInterest(exploration.category, 0.1);
    }
    
    // Emit exploration event
    this.emit('curiosity_triggered', exploration);
    
    // Record wonder moment
    this.lastWonderTime = Date.now();
    this.stats.wonderMoments++;
    
    // Process exploration
    this.processExploration(exploration);
    
    return exploration;
  }
  
  canWonder() {
    // Check if enough time has passed since last wonder
    return Date.now() - this.lastWonderTime > this.config.wonderCooldown;
  }
  
  categorizeExploration(symbols) {
    // Categorize exploration based on symbols
    let bestCategory = null;
    let bestScore = 0;
    
    this.interestCategories.forEach(category => {
      const score = this.calculateCategoryMatch(symbols, category);
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
      }
    });
    
    return bestCategory;
  }
  
  calculateCategoryMatch(symbols, category) {
    // Calculate how well symbols match a category
    let score = 0;
    
    symbols.forEach(symbol => {
      const concept = symbol.concept || '';
      
      switch(category) {
        case 'visual_patterns':
          if (concept.includes('visual') || concept.includes('color') || concept.includes('shape')) {
            score += 1;
          }
          break;
        case 'sounds':
          if (concept.includes('audio') || concept.includes('sound') || concept.includes('voice')) {
            score += 1;
          }
          break;
        case 'movements':
          if (concept.includes('move') || concept.includes('motion') || concept.includes('action')) {
            score += 1;
          }
          break;
        case 'objects':
          if (concept.includes('object') || concept.includes('thing') || concept.includes('item')) {
            score += 1;
          }
          break;
        case 'interactions':
          if (concept.includes('play') || concept.includes('feed') || concept.includes('pet')) {
            score += 1;
          }
          break;
        case 'emotions':
          if (concept.includes('happy') || concept.includes('sad') || concept.includes('emotion')) {
            score += 1;
          }
          break;
        default:
          score += 0.1; // Small score for uncategorized
      }
    });
    
    return score / symbols.length;
  }
  
  addToQueue(exploration) {
    // Add exploration to queue
    this.explorationQueue.push(exploration);
    
    // Maintain queue size
    if (this.explorationQueue.length > this.config.maxQueueSize) {
      this.explorationQueue.shift();
    }
    
    this.stats.totalExplorations++;
  }
  
  processExploration(exploration) {
    // Process and learn from exploration
    const discoveries = [];
    
    exploration.symbols.forEach(symbol => {
      if (!this.discoveries.has(symbol.concept)) {
        // New discovery!
        const discovery = {
          concept: symbol.concept,
          firstSeen: Date.now(),
          encounters: 1,
          familiarity: 0.1,
          associations: [],
          emotionalValue: this.calculateEmotionalValue(symbol)
        };
        
        this.discoveries.set(symbol.concept, discovery);
        discoveries.push(discovery);
        this.stats.discoveries++;
        
        // Emit discovery event
        this.emit('new_discovery', discovery);
      } else {
        // Update existing discovery
        const discovery = this.discoveries.get(symbol.concept);
        discovery.encounters++;
        discovery.familiarity = Math.min(1, discovery.familiarity + 0.1);
        
        // Reduce curiosity about familiar things
        this.curiosityLevel *= (1 - discovery.familiarity * 0.1);
      }
    });
    
    // Create associations between discoveries
    this.createAssociations(exploration.symbols);
    
    // Trigger deeper exploration if still curious
    if (exploration.depth < this.config.explorationDepth && this.curiosityLevel > 0.3) {
      this.deeperExploration(exploration);
    }
    
    return discoveries;
  }
  
  calculateEmotionalValue(symbol) {
    // Calculate emotional value of discovery
    let value = 0.5; // Neutral
    
    const concept = symbol.concept || '';
    
    // Positive associations
    if (concept.includes('play') || concept.includes('food') || concept.includes('joy')) {
      value += 0.3;
    }
    
    // Negative associations
    if (concept.includes('danger') || concept.includes('fear') || concept.includes('pain')) {
      value -= 0.3;
    }
    
    // Novelty bonus
    value += 0.1;
    
    return Math.max(0, Math.min(1, value));
  }
  
  createAssociations(symbols) {
    // Create associations between co-discovered concepts
    for (let i = 0; i < symbols.length; i++) {
      for (let j = i + 1; j < symbols.length; j++) {
        const concept1 = symbols[i].concept;
        const concept2 = symbols[j].concept;
        
        if (this.discoveries.has(concept1)) {
          const discovery1 = this.discoveries.get(concept1);
          if (!discovery1.associations.includes(concept2)) {
            discovery1.associations.push(concept2);
          }
        }
        
        if (this.discoveries.has(concept2)) {
          const discovery2 = this.discoveries.get(concept2);
          if (!discovery2.associations.includes(concept1)) {
            discovery2.associations.push(concept1);
          }
        }
      }
    }
  }
  
  deeperExploration(exploration) {
    // Explore associations and implications
    const deeperExploration = {
      ...exploration,
      depth: exploration.depth + 1,
      path: [...exploration.path, exploration.id]
    };
    
    // Look for associated concepts
    const associations = [];
    exploration.symbols.forEach(symbol => {
      if (this.discoveries.has(symbol.concept)) {
        const discovery = this.discoveries.get(symbol.concept);
        associations.push(...discovery.associations);
      }
    });
    
    if (associations.length > 0) {
      // Create synthetic symbols for associations
      deeperExploration.symbols = associations.map(concept => ({
        concept,
        strength: 0.7,
        derived: true
      }));
      
      // Queue deeper exploration
      setTimeout(() => {
        this.processExploration(deeperExploration);
      }, 1000);
    }
  }
  
  boostCuriosity(amount) {
    // Increase curiosity level
    this.curiosityLevel = Math.min(1, this.curiosityLevel + amount);
    
    // Track curiosity history
    this.curiosityHistory.push({
      level: this.curiosityLevel,
      timestamp: Date.now()
    });
    
    // Keep history limited
    if (this.curiosityHistory.length > 100) {
      this.curiosityHistory.shift();
    }
  }
  
  updateInterest(category, change) {
    // Update interest in a category
    if (this.interestMap.has(category)) {
      const interest = this.interestMap.get(category);
      interest.level = Math.max(0, Math.min(1, interest.level + change));
      interest.experiences++;
      interest.lastTriggered = Date.now();
    }
  }
  
  startCuriosityCycle() {
    // Manage curiosity levels over time
    setInterval(() => {
      // Apply curiosity decay
      this.curiosityLevel *= this.config.curiosityDecay;
      
      // Minimum curiosity
      this.curiosityLevel = Math.max(this.config.baseCuriosity, this.curiosityLevel);
      
      // Random curiosity spikes
      if (Math.random() < 0.05) { // 5% chance
        this.boostCuriosity(0.2);
        this.emit('curiosity_spike', {
          level: this.curiosityLevel,
          reason: 'spontaneous'
        });
      }
      
      // Update average curiosity
      if (this.curiosityHistory.length > 0) {
        const sum = this.curiosityHistory.reduce((acc, h) => acc + h.level, 0);
        this.stats.averageCuriosity = sum / this.curiosityHistory.length;
      }
      
      // Check for stagnation
      if (this.curiosityLevel < 0.3 && this.explorationQueue.length === 0) {
        this.generateWonderPrompt();
      }
      
    }, 2000); // Every 2 seconds
  }
  
  generateWonderPrompt() {
    // Generate something to wonder about when bored
    const prompts = [
      { concept: 'what_if_flying', category: 'movements' },
      { concept: 'new_friend', category: 'interactions' },
      { concept: 'hidden_treasure', category: 'objects' },
      { concept: 'strange_sound', category: 'sounds' },
      { concept: 'colorful_pattern', category: 'visual_patterns' },
      { concept: 'feeling_happy', category: 'emotions' }
    ];
    
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    // Create wonder exploration
    const wonderExploration = {
      symbols: [{ concept: prompt.concept, strength: 1.0 }],
      category: prompt.category,
      generated: true
    };
    
    this.explore(wonderExploration.symbols);
    
    this.emit('wonder_generated', wonderExploration);
  }
  
  getTopInterests(count = 3) {
    // Get pet's top interests
    const interests = Array.from(this.interestMap.entries());
    interests.sort((a, b) => b[1].level - a[1].level);
    
    return interests.slice(0, count).map(([category, data]) => ({
      category,
      level: data.level,
      experiences: data.experiences
    }));
  }
  
  getCuriosityLevel() {
    return this.curiosityLevel;
  }
  
  setCuriosityLevel(level) {
    this.curiosityLevel = Math.max(0, Math.min(1, level));
  }
  
  getExplorationCount() {
    return this.stats.totalExplorations;
  }
  
  getDiscoveries() {
    return Array.from(this.discoveries.values());
  }
  
  suggestExploration() {
    // Suggest something to explore based on interests
    const topInterests = this.getTopInterests(1);
    
    if (topInterests.length > 0) {
      const category = topInterests[0].category;
      
      // Generate exploration suggestion
      const suggestions = {
        visual_patterns: 'Look for interesting shapes or colors',
        sounds: 'Listen for new sounds',
        movements: 'Try a new movement or action',
        objects: 'Investigate a new object',
        interactions: 'Play a new game',
        environments: 'Explore a new area',
        emotions: 'Express how you feel',
        games: 'Invent a new game'
      };
      
      return {
        category,
        suggestion: suggestions[category] || 'Explore something new',
        curiosityLevel: this.curiosityLevel
      };
    }
    
    return {
      category: 'general',
      suggestion: 'Be curious about the world',
      curiosityLevel: this.curiosityLevel
    };
  }
  
  async shutdown() {
    this.isActive = false;
    this.removeAllListeners();
  }
}

export default WonderEngine;