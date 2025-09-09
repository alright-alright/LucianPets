import EventEmitter from 'events';

/**
 * Hierarchical Autonomous Symbolic Representation (HASR)
 * Single-shot learning through pattern recognition and resonance
 * Enables pets to learn from single examples
 */
export class HASRComponent extends EventEmitter {
  constructor() {
    super();
    
    this.isActive = false;
    this.patterns = new Map();
    this.resonanceNetwork = new Map();
    this.hierarchies = [];
    
    // Learning configuration
    this.config = {
      learningRate: 0.15,
      resonanceThreshold: 0.6,
      hierarchyDepth: 5,
      patternDecay: 0.995,
      noveltyBonus: 0.3,
      reinforcementFactor: 1.2
    };
    
    // Learning statistics
    this.stats = {
      patternsLearned: 0,
      singleShotSuccesses: 0,
      hierarchyLevels: 0,
      averageConfidence: 0.7
    };
    
    // Pet-specific learning profiles
    this.petLearningProfiles = new Map();
  }
  
  async initialize() {
    console.log('🎓 Initializing HASR Component...');
    
    // Initialize base patterns
    this.initializeBasePatterns();
    
    // Build initial hierarchy
    this.buildHierarchy();
    
    this.isActive = true;
    
    // Start resonance monitoring
    this.startResonanceMonitoring();
    
    console.log('✅ HASR Component initialized');
  }
  
  initializeBasePatterns() {
    // Initialize fundamental patterns
    const basePatterns = [
      { name: 'interaction_positive', template: ['joy', 'engagement', 'reward'] },
      { name: 'interaction_negative', template: ['fear', 'avoidance', 'punishment'] },
      { name: 'exploration', template: ['curiosity', 'movement', 'discovery'] },
      { name: 'rest', template: ['calm', 'stillness', 'recovery'] },
      { name: 'play', template: ['excitement', 'movement', 'joy'] },
      { name: 'learning', template: ['attention', 'repetition', 'understanding'] }
    ];
    
    basePatterns.forEach(pattern => {
      this.patterns.set(pattern.name, {
        template: pattern.template,
        strength: 1.0,
        instances: [],
        confidence: 0.9,
        level: 0
      });
      this.stats.patternsLearned++;
    });
  }
  
  buildHierarchy() {
    // Build hierarchical representation structure
    this.hierarchies = [];
    
    for (let level = 0; level < this.config.hierarchyDepth; level++) {
      this.hierarchies.push({
        level,
        patterns: new Map(),
        connections: new Map(),
        abstractionDegree: level / this.config.hierarchyDepth
      });
    }
    
    this.stats.hierarchyLevels = this.config.hierarchyDepth;
  }
  
  processPattern(input) {
    // Process and learn from input pattern
    const processedPattern = this.preprocessInput(input);
    
    // Check for resonance with existing patterns
    const resonanceResult = this.findResonance(processedPattern);
    
    if (resonanceResult.resonance > this.config.resonanceThreshold) {
      // Pattern resonates - strengthen existing pattern
      this.strengthenPattern(resonanceResult.pattern, processedPattern);
      
      // Single-shot learning success
      if (resonanceResult.resonance > 0.8 && resonanceResult.pattern.instances.length === 1) {
        this.stats.singleShotSuccesses++;
        this.emit('single_shot_success', {
          pattern: resonanceResult.pattern,
          confidence: resonanceResult.resonance
        });
      }
    } else {
      // Novel pattern - create new pattern
      this.learnNovelPattern(processedPattern);
    }
    
    // Update hierarchy
    this.updateHierarchy(processedPattern);
    
    // Emit learning event
    this.emit('pattern_learned', {
      pattern: processedPattern,
      resonance: resonanceResult.resonance,
      novel: resonanceResult.resonance < this.config.resonanceThreshold
    });
    
    return {
      learned: true,
      resonance: resonanceResult.resonance,
      pattern: resonanceResult.pattern
    };
  }
  
  preprocessInput(input) {
    // Preprocess input into standard pattern format
    if (Array.isArray(input)) {
      return {
        features: input,
        timestamp: Date.now(),
        context: {}
      };
    }
    
    if (typeof input === 'object') {
      return {
        features: this.extractFeatures(input),
        timestamp: input.timestamp || Date.now(),
        context: input.context || {}
      };
    }
    
    // Convert primitive to pattern
    return {
      features: [input],
      timestamp: Date.now(),
      context: {}
    };
  }
  
  extractFeatures(obj) {
    // Extract learnable features from object
    const features = [];
    
    if (obj.symbols) {
      obj.symbols.forEach(symbol => {
        features.push(symbol.concept);
      });
    }
    
    if (obj.content) {
      if (typeof obj.content === 'string') {
        features.push(obj.content);
      } else if (Array.isArray(obj.content)) {
        features.push(...obj.content);
      }
    }
    
    if (obj.type) {
      features.push(`type:${obj.type}`);
    }
    
    if (obj.emotion) {
      features.push(`emotion:${obj.emotion}`);
    }
    
    if (obj.action) {
      features.push(`action:${obj.action}`);
    }
    
    return features.length > 0 ? features : ['unknown'];
  }
  
  findResonance(pattern) {
    // Find resonance with existing patterns
    let maxResonance = 0;
    let bestPattern = null;
    
    this.patterns.forEach((storedPattern, name) => {
      const resonance = this.calculateResonance(pattern, storedPattern);
      
      if (resonance > maxResonance) {
        maxResonance = resonance;
        bestPattern = storedPattern;
      }
    });
    
    // Check hierarchical patterns
    this.hierarchies.forEach(level => {
      level.patterns.forEach((hierarchicalPattern, name) => {
        const resonance = this.calculateResonance(pattern, hierarchicalPattern);
        
        if (resonance > maxResonance) {
          maxResonance = resonance;
          bestPattern = hierarchicalPattern;
        }
      });
    });
    
    return {
      resonance: maxResonance,
      pattern: bestPattern
    };
  }
  
  calculateResonance(pattern1, pattern2) {
    // Calculate resonance between two patterns
    if (!pattern1.features || !pattern2.template) {
      return 0;
    }
    
    const features1 = new Set(pattern1.features);
    const features2 = new Set(pattern2.template);
    
    // Calculate Jaccard similarity
    const intersection = new Set([...features1].filter(x => features2.has(x)));
    const union = new Set([...features1, ...features2]);
    
    if (union.size === 0) return 0;
    
    const similarity = intersection.size / union.size;
    
    // Apply confidence factor
    const confidence = pattern2.confidence || 1;
    
    return similarity * confidence;
  }
  
  strengthenPattern(pattern, newInstance) {
    // Strengthen existing pattern with new instance
    pattern.instances.push(newInstance);
    
    // Update pattern strength
    pattern.strength = Math.min(1, pattern.strength * this.config.reinforcementFactor);
    
    // Update template with common features
    if (pattern.instances.length > 1) {
      pattern.template = this.findCommonFeatures(pattern.instances);
    }
    
    // Update confidence based on consistency
    pattern.confidence = this.calculatePatternConfidence(pattern);
    
    // Apply reinforcement to connected patterns
    this.reinforceConnections(pattern);
  }
  
  learnNovelPattern(pattern) {
    // Learn a completely new pattern
    const patternName = `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    const newPattern = {
      template: pattern.features,
      strength: 0.5 + this.config.noveltyBonus,
      instances: [pattern],
      confidence: 0.5,
      level: 0,
      timestamp: Date.now()
    };
    
    this.patterns.set(patternName, newPattern);
    this.stats.patternsLearned++;
    
    // Create resonance connections
    this.createResonanceConnections(patternName, newPattern);
    
    // Emit novel pattern event
    this.emit('novel_pattern_learned', {
      name: patternName,
      pattern: newPattern
    });
  }
  
  findCommonFeatures(instances) {
    // Find features common across instances
    if (instances.length === 0) return [];
    
    const featureCounts = new Map();
    
    instances.forEach(instance => {
      instance.features.forEach(feature => {
        featureCounts.set(feature, (featureCounts.get(feature) || 0) + 1);
      });
    });
    
    // Keep features present in >50% of instances
    const threshold = instances.length * 0.5;
    const commonFeatures = [];
    
    featureCounts.forEach((count, feature) => {
      if (count >= threshold) {
        commonFeatures.push(feature);
      }
    });
    
    return commonFeatures;
  }
  
  calculatePatternConfidence(pattern) {
    // Calculate confidence based on pattern consistency
    if (pattern.instances.length < 2) {
      return 0.5;
    }
    
    // Calculate variance in features
    const allFeatures = new Set();
    pattern.instances.forEach(instance => {
      instance.features.forEach(f => allFeatures.add(f));
    });
    
    const consistency = pattern.template.length / allFeatures.size;
    
    // Factor in number of instances
    const experienceFactor = Math.min(1, pattern.instances.length / 10);
    
    return consistency * 0.7 + experienceFactor * 0.3;
  }
  
  createResonanceConnections(patternName, pattern) {
    // Create connections to similar patterns
    const connections = [];
    
    this.patterns.forEach((otherPattern, otherName) => {
      if (otherName !== patternName) {
        const resonance = this.calculateResonance(
          { features: pattern.template },
          otherPattern
        );
        
        if (resonance > 0.3) {
          connections.push({
            target: otherName,
            strength: resonance
          });
        }
      }
    });
    
    this.resonanceNetwork.set(patternName, connections);
  }
  
  reinforceConnections(pattern) {
    // Reinforce connected patterns through resonance
    const patternName = this.findPatternName(pattern);
    
    if (patternName && this.resonanceNetwork.has(patternName)) {
      const connections = this.resonanceNetwork.get(patternName);
      
      connections.forEach(connection => {
        const connectedPattern = this.patterns.get(connection.target);
        if (connectedPattern) {
          connectedPattern.strength *= (1 + connection.strength * 0.1);
        }
      });
    }
  }
  
  findPatternName(pattern) {
    // Find the name of a pattern object
    for (const [name, p] of this.patterns.entries()) {
      if (p === pattern) return name;
    }
    return null;
  }
  
  updateHierarchy(pattern) {
    // Update hierarchical representations
    let currentPattern = pattern;
    
    for (let level = 0; level < this.hierarchies.length - 1; level++) {
      const hierarchy = this.hierarchies[level];
      const abstractPattern = this.abstractPattern(currentPattern, level);
      
      // Store at this hierarchy level
      const levelKey = `L${level}_${abstractPattern.signature}`;
      hierarchy.patterns.set(levelKey, abstractPattern);
      
      // Create connections to lower level
      if (level > 0) {
        this.createHierarchicalConnection(level - 1, level, currentPattern, abstractPattern);
      }
      
      currentPattern = abstractPattern;
    }
  }
  
  abstractPattern(pattern, level) {
    // Create more abstract representation of pattern
    const abstractionDegree = (level + 1) / this.config.hierarchyDepth;
    
    // Reduce features through abstraction
    const abstractFeatures = pattern.features
      .filter(() => Math.random() > abstractionDegree * 0.5)
      .map(f => {
        // Abstract feature representation
        if (f.includes(':')) {
          return f.split(':')[0]; // Keep only category
        }
        return f;
      });
    
    return {
      features: abstractFeatures,
      signature: abstractFeatures.join('_'),
      level: level + 1,
      abstraction: abstractionDegree,
      source: pattern
    };
  }
  
  createHierarchicalConnection(fromLevel, toLevel, fromPattern, toPattern) {
    // Create connection between hierarchy levels
    const fromHierarchy = this.hierarchies[fromLevel];
    const toHierarchy = this.hierarchies[toLevel];
    
    const connectionKey = `${fromLevel}_to_${toLevel}`;
    
    if (!fromHierarchy.connections.has(connectionKey)) {
      fromHierarchy.connections.set(connectionKey, []);
    }
    
    fromHierarchy.connections.get(connectionKey).push({
      from: fromPattern,
      to: toPattern,
      strength: 1.0
    });
  }
  
  findBestPattern(symbols, memories) {
    // Find best matching pattern for given input
    const features = symbols.map(s => s.concept);
    const testPattern = { features };
    
    const resonanceResult = this.findResonance(testPattern);
    
    // Consider memory context
    if (memories && memories.length > 0) {
      // Boost patterns that match memory context
      memories.forEach(memory => {
        if (memory.pattern && this.patterns.has(memory.pattern)) {
          const pattern = this.patterns.get(memory.pattern);
          const resonance = this.calculateResonance(testPattern, pattern);
          
          if (resonance > resonanceResult.resonance) {
            resonanceResult.resonance = resonance;
            resonanceResult.pattern = pattern;
          }
        }
      });
    }
    
    return resonanceResult.pattern;
  }
  
  consolidate(memories) {
    // Consolidate memories into learned patterns
    const consolidatedPattern = {
      features: [],
      strength: 0,
      confidence: 0
    };
    
    // Extract features from all memories
    memories.forEach(memory => {
      if (memory.content) {
        const features = this.extractFeatures(memory);
        consolidatedPattern.features.push(...features);
      }
    });
    
    // Find unique features
    consolidatedPattern.features = [...new Set(consolidatedPattern.features)];
    
    // Calculate strength based on memory importance
    consolidatedPattern.strength = memories.reduce((sum, mem) => 
      sum + (mem.importance || 0.5), 0) / memories.length;
    
    // Process as new pattern
    if (consolidatedPattern.features.length > 0) {
      this.processPattern(consolidatedPattern);
    }
    
    return consolidatedPattern;
  }
  
  startResonanceMonitoring() {
    // Monitor and decay pattern strengths
    setInterval(() => {
      this.patterns.forEach(pattern => {
        // Apply decay
        pattern.strength *= this.config.patternDecay;
        
        // Remove very weak patterns
        if (pattern.strength < 0.01) {
          const name = this.findPatternName(pattern);
          if (name) {
            this.patterns.delete(name);
            this.resonanceNetwork.delete(name);
          }
        }
      });
      
      // Update average confidence
      let totalConfidence = 0;
      let count = 0;
      
      this.patterns.forEach(pattern => {
        totalConfidence += pattern.confidence;
        count++;
      });
      
      this.stats.averageConfidence = count > 0 ? totalConfidence / count : 0;
      
    }, 5000); // Every 5 seconds
  }
  
  // Pet-specific learning methods
  initializePetProfile(petId) {
    if (!this.petLearningProfiles.has(petId)) {
      this.petLearningProfiles.set(petId, {
        learnedPatterns: new Set(),
        learningSpeed: this.config.learningRate,
        preferences: new Map(),
        achievements: []
      });
    }
  }
  
  learnPetBehavior(petId, behavior) {
    this.initializePetProfile(petId);
    const profile = this.petLearningProfiles.get(petId);
    
    // Process behavior pattern
    const result = this.processPattern(behavior);
    
    // Track in pet profile
    if (result.pattern) {
      const patternName = this.findPatternName(result.pattern);
      if (patternName) {
        profile.learnedPatterns.add(patternName);
      }
    }
    
    // Update preferences
    if (behavior.preference) {
      profile.preferences.set(
        behavior.preference,
        (profile.preferences.get(behavior.preference) || 0) + 1
      );
    }
    
    return result;
  }
  
  getPatternCount() {
    return this.patterns.size;
  }
  
  getLearningRate() {
    return this.config.learningRate;
  }
  
  setLearningRate(rate) {
    this.config.learningRate = Math.max(0.01, Math.min(1, rate));
  }
  
  async shutdown() {
    this.isActive = false;
    this.removeAllListeners();
  }
}

export default HASRComponent;