import EventEmitter from 'events';

/**
 * Ghost Loops
 * Crystallized successful behavior patterns that persist
 * Like muscle memory for consciousness
 */
export class GhostLoops extends EventEmitter {
  constructor() {
    super();
    
    this.isActive = false;
    this.crystallizedPatterns = new Map();
    this.activeLoops = new Set();
    this.loopHistory = [];
    
    // Ghost Loop configuration
    this.config = {
      crystallizationThreshold: 0.8,
      successRequirement: 5,
      loopStrength: 1.0,
      decayRate: 0.999,
      reinforcementBonus: 0.1,
      maxActiveLoops: 10,
      resonanceThreshold: 0.6
    };
    
    // Statistics
    this.stats = {
      totalCrystallized: 0,
      activeLoopCount: 0,
      successfulTriggers: 0,
      averageStrength: 0.8
    };
    
    // Pet behavior patterns
    this.behaviorCategories = [
      'greeting',
      'playing',
      'feeding',
      'sleeping',
      'exploring',
      'learning',
      'bonding',
      'comfort'
    ];
  }
  
  async initialize() {
    console.log('👻 Initializing Ghost Loops...');
    
    // Initialize core behavior loops
    this.initializeCoreBehaviors();
    
    // Start loop monitoring
    this.startLoopMonitoring();
    
    this.isActive = true;
    
    console.log('✅ Ghost Loops initialized');
  }
  
  initializeCoreBehaviors() {
    // Create fundamental behavior loops
    const coreBehaviors = [
      {
        name: 'friendly_greeting',
        pattern: {
          trigger: ['see_owner', 'morning', 'return'],
          response: ['excitement', 'approach', 'vocalize_happy'],
          category: 'greeting'
        }
      },
      {
        name: 'hunger_response',
        pattern: {
          trigger: ['hunger', 'see_food', 'feeding_time'],
          response: ['approach_food', 'eat', 'satisfaction'],
          category: 'feeding'
        }
      },
      {
        name: 'play_initiation',
        pattern: {
          trigger: ['boredom', 'see_toy', 'energy_high'],
          response: ['grab_toy', 'playful_movement', 'invite_play'],
          category: 'playing'
        }
      },
      {
        name: 'comfort_seeking',
        pattern: {
          trigger: ['tired', 'stress', 'cold'],
          response: ['find_cozy_spot', 'curl_up', 'relax'],
          category: 'comfort'
        }
      },
      {
        name: 'curiosity_response',
        pattern: {
          trigger: ['novel_stimulus', 'unknown_object', 'strange_sound'],
          response: ['approach_cautiously', 'investigate', 'assess'],
          category: 'exploring'
        }
      }
    ];
    
    coreBehaviors.forEach(behavior => {
      this.crystallizePattern({
        name: behavior.name,
        pattern: behavior.pattern,
        strength: 0.9,
        successCount: 10, // Pre-trained
        category: behavior.pattern.category
      });
    });
  }
  
  crystallizePattern(patternData) {
    // Crystallize a successful pattern into a ghost loop
    const loopId = patternData.name || `loop_${Date.now()}`;
    
    const ghostLoop = {
      id: loopId,
      pattern: patternData.pattern || patternData,
      strength: patternData.strength || this.config.loopStrength,
      successCount: patternData.successCount || 0,
      failureCount: 0,
      lastTriggered: 0,
      createdAt: Date.now(),
      category: patternData.category || 'general',
      resonanceSignature: this.generateResonanceSignature(patternData.pattern)
    };
    
    this.crystallizedPatterns.set(loopId, ghostLoop);
    this.stats.totalCrystallized++;
    
    // Emit crystallization event
    this.emit('pattern_crystallized', {
      id: loopId,
      loop: ghostLoop
    });
    
    return ghostLoop;
  }
  
  generateResonanceSignature(pattern) {
    // Generate unique signature for pattern matching
    const elements = [];
    
    if (pattern.trigger) {
      elements.push(...pattern.trigger);
    }
    if (pattern.response) {
      elements.push(...pattern.response);
    }
    if (pattern.action) {
      elements.push(pattern.action);
    }
    
    return elements.sort().join('_');
  }
  
  checkResonance(input) {
    // Check if input resonates with any ghost loops
    const resonatingLoops = [];
    
    this.crystallizedPatterns.forEach((loop, id) => {
      const resonance = this.calculateLoopResonance(input, loop);
      
      if (resonance > this.config.resonanceThreshold) {
        resonatingLoops.push({
          loop,
          resonance,
          id
        });
      }
    });
    
    // Sort by resonance strength
    resonatingLoops.sort((a, b) => b.resonance - a.resonance);
    
    return resonatingLoops;
  }
  
  calculateLoopResonance(input, loop) {
    // Calculate how strongly input resonates with a loop
    let resonance = 0;
    const pattern = loop.pattern;
    
    // Convert input to comparable format
    const inputFeatures = this.extractFeatures(input);
    
    // Check trigger match
    if (pattern.trigger) {
      const triggerMatch = this.calculateFeatureMatch(inputFeatures, pattern.trigger);
      resonance += triggerMatch * 0.6; // Triggers are most important
    }
    
    // Check context match
    if (input.context && pattern.context) {
      const contextMatch = this.calculateContextMatch(input.context, pattern.context);
      resonance += contextMatch * 0.2;
    }
    
    // Factor in loop strength
    resonance *= loop.strength;
    
    // Boost recently successful loops
    if (loop.lastTriggered && Date.now() - loop.lastTriggered < 60000) {
      resonance *= 1.1;
    }
    
    return Math.min(1, resonance);
  }
  
  extractFeatures(input) {
    // Extract features from input for matching
    const features = [];
    
    if (typeof input === 'string') {
      features.push(input.toLowerCase());
    } else if (typeof input === 'object') {
      if (input.action) features.push(input.action);
      if (input.trigger) features.push(input.trigger);
      if (input.state) features.push(input.state);
      if (input.emotion) features.push(input.emotion);
      if (input.concept) features.push(input.concept);
      if (Array.isArray(input.features)) {
        features.push(...input.features);
      }
    }
    
    return features;
  }
  
  calculateFeatureMatch(features1, features2) {
    // Calculate similarity between feature sets
    if (!features1 || !features2) return 0;
    
    const set1 = new Set(features1);
    const set2 = new Set(features2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }
  
  calculateContextMatch(context1, context2) {
    // Calculate context similarity
    let matches = 0;
    let total = 0;
    
    Object.keys(context1).forEach(key => {
      if (key in context2) {
        total++;
        if (context1[key] === context2[key]) {
          matches++;
        }
      }
    });
    
    return total > 0 ? matches / total : 0;
  }
  
  triggerLoop(loopId) {
    // Trigger a specific ghost loop
    if (!this.crystallizedPatterns.has(loopId)) {
      return null;
    }
    
    const loop = this.crystallizedPatterns.get(loopId);
    
    // Check if loop can be activated
    if (this.activeLoops.size >= this.config.maxActiveLoops) {
      // Deactivate oldest loop
      const oldest = Array.from(this.activeLoops)[0];
      this.deactivateLoop(oldest);
    }
    
    // Activate loop
    this.activeLoops.add(loopId);
    loop.lastTriggered = Date.now();
    
    // Generate response based on loop pattern
    const response = this.generateLoopResponse(loop);
    
    // Track activation
    this.loopHistory.push({
      loopId,
      timestamp: Date.now(),
      response
    });
    
    // Keep history limited
    if (this.loopHistory.length > 100) {
      this.loopHistory.shift();
    }
    
    // Update stats
    this.stats.activeLoopCount = this.activeLoops.size;
    this.stats.successfulTriggers++;
    
    // Emit trigger event
    this.emit('loop_triggered', {
      loopId,
      loop,
      response
    });
    
    return response;
  }
  
  generateLoopResponse(loop) {
    // Generate response from ghost loop pattern
    const pattern = loop.pattern;
    const response = {
      action: pattern.response ? pattern.response[0] : 'default_response',
      sequence: pattern.response || ['acknowledge'],
      emotion: this.inferEmotion(pattern),
      strength: loop.strength,
      category: loop.category
    };
    
    // Add variation based on strength
    if (loop.strength < 0.5) {
      response.confidence = 'low';
      response.variation = Math.random() * 0.3; // More variation when weak
    } else {
      response.confidence = 'high';
      response.variation = Math.random() * 0.1; // Less variation when strong
    }
    
    return response;
  }
  
  inferEmotion(pattern) {
    // Infer emotion from pattern
    const response = pattern.response || [];
    const trigger = pattern.trigger || [];
    
    // Check for emotional indicators
    const allElements = [...response, ...trigger].join(' ');
    
    if (allElements.includes('happy') || allElements.includes('joy') || allElements.includes('play')) {
      return 'happy';
    }
    if (allElements.includes('sad') || allElements.includes('tired') || allElements.includes('stress')) {
      return 'sad';
    }
    if (allElements.includes('excitement') || allElements.includes('energy')) {
      return 'excited';
    }
    if (allElements.includes('comfort') || allElements.includes('relax') || allElements.includes('calm')) {
      return 'content';
    }
    if (allElements.includes('curious') || allElements.includes('investigate')) {
      return 'curious';
    }
    
    return 'neutral';
  }
  
  reinforceLoop(loopId, success = true) {
    // Reinforce or weaken a loop based on outcome
    if (!this.crystallizedPatterns.has(loopId)) {
      return;
    }
    
    const loop = this.crystallizedPatterns.get(loopId);
    
    if (success) {
      loop.successCount++;
      loop.strength = Math.min(1, loop.strength + this.config.reinforcementBonus);
      
      this.emit('loop_reinforced', {
        loopId,
        strength: loop.strength
      });
    } else {
      loop.failureCount++;
      loop.strength = Math.max(0.1, loop.strength - this.config.reinforcementBonus * 0.5);
      
      this.emit('loop_weakened', {
        loopId,
        strength: loop.strength
      });
    }
  }
  
  deactivateLoop(loopId) {
    // Deactivate an active loop
    this.activeLoops.delete(loopId);
    this.stats.activeLoopCount = this.activeLoops.size;
  }
  
  getRelevantPattern(action) {
    // Get most relevant crystallized pattern for an action
    let bestMatch = null;
    let bestScore = 0;
    
    this.crystallizedPatterns.forEach((loop, id) => {
      const pattern = loop.pattern;
      
      // Check if pattern matches action
      let score = 0;
      
      if (pattern.trigger && pattern.trigger.includes(action)) {
        score += 0.5;
      }
      
      if (pattern.response && pattern.response.some(r => r.includes(action))) {
        score += 0.3;
      }
      
      if (loop.category && action.includes(loop.category)) {
        score += 0.2;
      }
      
      // Factor in loop strength
      score *= loop.strength;
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = loop;
      }
    });
    
    return bestMatch;
  }
  
  startLoopMonitoring() {
    // Monitor and maintain ghost loops
    setInterval(() => {
      // Apply decay to inactive loops
      this.crystallizedPatterns.forEach((loop, id) => {
        if (!this.activeLoops.has(id)) {
          loop.strength *= this.config.decayRate;
          
          // Remove very weak loops
          if (loop.strength < 0.01) {
            this.crystallizedPatterns.delete(id);
            this.stats.totalCrystallized--;
          }
        }
      });
      
      // Calculate average strength
      let totalStrength = 0;
      let count = 0;
      
      this.crystallizedPatterns.forEach(loop => {
        totalStrength += loop.strength;
        count++;
      });
      
      this.stats.averageStrength = count > 0 ? totalStrength / count : 0;
      
      // Clear old active loops
      this.activeLoops.forEach(loopId => {
        const loop = this.crystallizedPatterns.get(loopId);
        if (loop && Date.now() - loop.lastTriggered > 30000) {
          this.deactivateLoop(loopId);
        }
      });
      
    }, 5000); // Every 5 seconds
  }
  
  mergePatterns(pattern1Id, pattern2Id) {
    // Merge two similar patterns into a stronger one
    if (!this.crystallizedPatterns.has(pattern1Id) || 
        !this.crystallizedPatterns.has(pattern2Id)) {
      return null;
    }
    
    const loop1 = this.crystallizedPatterns.get(pattern1Id);
    const loop2 = this.crystallizedPatterns.get(pattern2Id);
    
    // Create merged pattern
    const mergedPattern = {
      trigger: [...new Set([...(loop1.pattern.trigger || []), ...(loop2.pattern.trigger || [])])],
      response: [...new Set([...(loop1.pattern.response || []), ...(loop2.pattern.response || [])])],
      category: loop1.category // Keep first pattern's category
    };
    
    const mergedLoop = {
      name: `merged_${pattern1Id}_${pattern2Id}`,
      pattern: mergedPattern,
      strength: (loop1.strength + loop2.strength) / 2,
      successCount: loop1.successCount + loop2.successCount,
      category: loop1.category
    };
    
    // Remove old patterns
    this.crystallizedPatterns.delete(pattern1Id);
    this.crystallizedPatterns.delete(pattern2Id);
    
    // Add merged pattern
    return this.crystallizePattern(mergedLoop);
  }
  
  getCrystallizedCount() {
    return this.stats.totalCrystallized;
  }
  
  getActiveLoops() {
    return Array.from(this.activeLoops).map(id => ({
      id,
      loop: this.crystallizedPatterns.get(id)
    }));
  }
  
  getLoopsByCategory(category) {
    const loops = [];
    
    this.crystallizedPatterns.forEach((loop, id) => {
      if (loop.category === category) {
        loops.push({ id, ...loop });
      }
    });
    
    return loops.sort((a, b) => b.strength - a.strength);
  }
  
  async shutdown() {
    this.isActive = false;
    this.activeLoops.clear();
    this.removeAllListeners();
  }
}

export default GhostLoops;