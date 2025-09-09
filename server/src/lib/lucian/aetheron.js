import EventEmitter from 'events';

/**
 * Aetheron Identity Engine
 * "I think, therefore I am" - Coherent self-identity formation
 * Creates and maintains the pet's sense of self
 */
export class AetheronIdentity extends EventEmitter {
  constructor() {
    super();
    
    this.isActive = false;
    this.identityCore = {
      name: null,
      selfConcept: new Map(),
      personality: new Map(),
      values: new Map(),
      relationships: new Map(),
      selfNarrative: []
    };
    
    // Identity configuration
    this.config = {
      coherenceThreshold: 0.7,
      identityStrength: 0.8,
      selfReflectionInterval: 10000,
      narrativeMaxLength: 100,
      personalityDimensions: 5,
      valueDecay: 0.995,
      relationshipDepth: 3
    };
    
    // Identity statistics
    this.stats = {
      coherence: 0.7,
      selfAwareness: 0.5,
      identityStrength: 0.8,
      relationshipCount: 0,
      selfReflections: 0
    };
    
    // Personality dimensions (Big Five for pets)
    this.personalityDimensions = {
      openness: 0.5,        // Curiosity and creativity
      conscientiousness: 0.5, // Organization and reliability  
      extraversion: 0.5,     // Social energy
      agreeableness: 0.5,    // Friendliness and trust
      neuroticism: 0.5       // Emotional stability (inverted)
    };
    
    // Core values that shape behavior
    this.coreValues = [
      'loyalty',
      'playfulness', 
      'curiosity',
      'comfort',
      'affection'
    ];
  }
  
  async initialize() {
    console.log('🌟 Initializing Aetheron Identity Engine...');
    
    // Initialize core identity
    this.initializeCoreIdentity();
    
    // Start self-reflection process
    this.startSelfReflection();
    
    this.isActive = true;
    
    console.log('✅ Aetheron Identity Engine initialized');
  }
  
  initializeCoreIdentity() {
    // Initialize fundamental self-concept
    const fundamentalConcepts = [
      { concept: 'i_exist', strength: 1.0 },
      { concept: 'i_feel', strength: 0.9 },
      { concept: 'i_think', strength: 0.8 },
      { concept: 'i_want', strength: 0.7 },
      { concept: 'i_am_unique', strength: 0.8 }
    ];
    
    fundamentalConcepts.forEach(item => {
      this.identityCore.selfConcept.set(item.concept, {
        strength: item.strength,
        formed: Date.now(),
        reinforcements: 0
      });
    });
    
    // Initialize personality from dimensions
    Object.entries(this.personalityDimensions).forEach(([dimension, value]) => {
      this.identityCore.personality.set(dimension, {
        value,
        stability: 0.5,
        lastUpdated: Date.now()
      });
    });
    
    // Initialize core values
    this.coreValues.forEach(value => {
      this.identityCore.values.set(value, {
        importance: 0.5 + Math.random() * 0.3,
        actions: 0,
        lastExpressed: 0
      });
    });
  }
  
  setName(name) {
    // Set the pet's name - fundamental to identity
    this.identityCore.name = name;
    
    // Add to self-concept
    this.identityCore.selfConcept.set('my_name', {
      strength: 1.0,
      formed: Date.now(),
      reinforcements: 1,
      content: name
    });
    
    // Add to narrative
    this.addToNarrative({
      type: 'naming',
      content: `I am ${name}`,
      importance: 1.0
    });
    
    this.emit('identity_update', {
      type: 'named',
      name,
      coherence: this.stats.coherence
    });
  }
  
  integrate(experience) {
    // Integrate an experience into identity
    const experienceType = this.categorizeExperience(experience);
    
    // Update self-concept based on experience
    this.updateSelfConcept(experience, experienceType);
    
    // Adjust personality based on experience
    this.adjustPersonality(experience, experienceType);
    
    // Reinforce or challenge values
    this.processValues(experience, experienceType);
    
    // Update relationships if social
    if (experienceType === 'social') {
      this.updateRelationships(experience);
    }
    
    // Add significant experiences to narrative
    if (this.isSignificant(experience)) {
      this.addToNarrative(experience);
    }
    
    // Update coherence
    this.updateCoherence();
    
    // Emit integration event
    this.emit('experience_integrated', {
      type: experienceType,
      impact: this.calculateImpact(experience),
      coherence: this.stats.coherence
    });
  }
  
  categorizeExperience(experience) {
    // Categorize experience type
    if (experience.social || experience.interaction) return 'social';
    if (experience.learning || experience.discovery) return 'learning';
    if (experience.emotion) return 'emotional';
    if (experience.achievement) return 'achievement';
    if (experience.play) return 'play';
    return 'general';
  }
  
  updateSelfConcept(experience, type) {
    // Update understanding of self based on experience
    const conceptKey = `i_${type}`;
    
    if (!this.identityCore.selfConcept.has(conceptKey)) {
      this.identityCore.selfConcept.set(conceptKey, {
        strength: 0.3,
        formed: Date.now(),
        reinforcements: 0
      });
    }
    
    const concept = this.identityCore.selfConcept.get(conceptKey);
    concept.strength = Math.min(1, concept.strength + 0.05);
    concept.reinforcements++;
    
    // Add specific self-knowledge
    if (experience.learned) {
      this.identityCore.selfConcept.set(`i_can_${experience.learned}`, {
        strength: 0.5,
        formed: Date.now(),
        reinforcements: 1
      });
    }
  }
  
  adjustPersonality(experience, type) {
    // Adjust personality dimensions based on experience
    const adjustments = {
      social: { extraversion: 0.02, agreeableness: 0.01 },
      learning: { openness: 0.02, conscientiousness: 0.01 },
      emotional: { neuroticism: -0.01 }, // Reduces neuroticism
      achievement: { conscientiousness: 0.02, openness: 0.01 },
      play: { extraversion: 0.01, openness: 0.01 }
    };
    
    if (adjustments[type]) {
      Object.entries(adjustments[type]).forEach(([dimension, change]) => {
        if (this.identityCore.personality.has(dimension)) {
          const trait = this.identityCore.personality.get(dimension);
          trait.value = Math.max(0, Math.min(1, trait.value + change));
          trait.lastUpdated = Date.now();
          
          // Increase stability over time
          trait.stability = Math.min(1, trait.stability + 0.001);
        }
      });
    }
  }
  
  processValues(experience, type) {
    // Process how experience relates to values
    const valueMapping = {
      social: 'affection',
      learning: 'curiosity',
      play: 'playfulness',
      achievement: 'loyalty',
      emotional: 'comfort'
    };
    
    const relevantValue = valueMapping[type];
    
    if (relevantValue && this.identityCore.values.has(relevantValue)) {
      const value = this.identityCore.values.get(relevantValue);
      value.actions++;
      value.lastExpressed = Date.now();
      
      // Strengthen expressed values
      value.importance = Math.min(1, value.importance + 0.02);
    }
    
    // Decay unexpressed values
    this.identityCore.values.forEach((value, key) => {
      if (key !== relevantValue) {
        value.importance *= this.config.valueDecay;
      }
    });
  }
  
  updateRelationships(experience) {
    // Update relationship understanding
    const entity = experience.entity || experience.with || 'owner';
    
    if (!this.identityCore.relationships.has(entity)) {
      this.identityCore.relationships.set(entity, {
        bond: 0.5,
        trust: 0.5,
        interactions: 0,
        lastSeen: Date.now(),
        emotions: []
      });
      this.stats.relationshipCount++;
    }
    
    const relationship = this.identityCore.relationships.get(entity);
    relationship.interactions++;
    relationship.lastSeen = Date.now();
    
    // Update bond based on experience quality
    if (experience.positive) {
      relationship.bond = Math.min(1, relationship.bond + 0.02);
      relationship.trust = Math.min(1, relationship.trust + 0.01);
    } else if (experience.negative) {
      relationship.bond = Math.max(0, relationship.bond - 0.01);
      relationship.trust = Math.max(0, relationship.trust - 0.02);
    }
    
    // Track emotions
    if (experience.emotion) {
      relationship.emotions.push({
        emotion: experience.emotion,
        timestamp: Date.now()
      });
      
      // Keep only recent emotions
      if (relationship.emotions.length > 10) {
        relationship.emotions.shift();
      }
    }
  }
  
  isSignificant(experience) {
    // Determine if experience is significant enough for narrative
    let significance = 0;
    
    // New experiences are significant
    if (experience.novel) significance += 0.3;
    
    // Emotional experiences are significant
    if (experience.emotion && experience.emotion !== 'neutral') significance += 0.2;
    
    // Social experiences are significant
    if (experience.social) significance += 0.2;
    
    // Achievements are significant
    if (experience.achievement) significance += 0.4;
    
    // Learning is significant
    if (experience.learned) significance += 0.3;
    
    return significance > 0.5;
  }
  
  addToNarrative(item) {
    // Add to self-narrative
    const narrativeEntry = {
      ...item,
      timestamp: Date.now(),
      integrated: false
    };
    
    this.identityCore.selfNarrative.push(narrativeEntry);
    
    // Maintain narrative length
    if (this.identityCore.selfNarrative.length > this.config.narrativeMaxLength) {
      // Keep most important entries
      this.identityCore.selfNarrative.sort((a, b) => 
        (b.importance || 0.5) - (a.importance || 0.5)
      );
      this.identityCore.selfNarrative = 
        this.identityCore.selfNarrative.slice(0, this.config.narrativeMaxLength);
    }
  }
  
  calculateImpact(experience) {
    // Calculate impact of experience on identity
    let impact = 0;
    
    // Check alignment with values
    this.identityCore.values.forEach(value => {
      if (experience.aligns && experience.aligns.includes(value)) {
        impact += value.importance * 0.2;
      }
    });
    
    // Check personality fit
    const personalityFit = this.calculatePersonalityFit(experience);
    impact += personalityFit * 0.3;
    
    // Novel experiences have more impact
    if (experience.novel) impact += 0.2;
    
    return Math.min(1, impact);
  }
  
  calculatePersonalityFit(experience) {
    // Calculate how well experience fits personality
    let fit = 0;
    const personality = this.identityCore.personality;
    
    if (experience.social && personality.get('extraversion').value > 0.5) {
      fit += 0.3;
    }
    
    if (experience.novel && personality.get('openness').value > 0.5) {
      fit += 0.3;
    }
    
    if (experience.structured && personality.get('conscientiousness').value > 0.5) {
      fit += 0.2;
    }
    
    if (experience.cooperative && personality.get('agreeableness').value > 0.5) {
      fit += 0.2;
    }
    
    return fit;
  }
  
  updateCoherence() {
    // Update identity coherence measure
    let coherence = 0;
    
    // Self-concept strength
    let conceptStrength = 0;
    this.identityCore.selfConcept.forEach(concept => {
      conceptStrength += concept.strength;
    });
    coherence += (conceptStrength / this.identityCore.selfConcept.size) * 0.3;
    
    // Personality stability
    let stabilitySum = 0;
    this.identityCore.personality.forEach(trait => {
      stabilitySum += trait.stability;
    });
    coherence += (stabilitySum / this.identityCore.personality.size) * 0.3;
    
    // Value consistency
    let valueSum = 0;
    this.identityCore.values.forEach(value => {
      valueSum += value.importance;
    });
    coherence += (valueSum / this.identityCore.values.size) * 0.2;
    
    // Narrative coherence
    const narrativeCoherence = this.calculateNarrativeCoherence();
    coherence += narrativeCoherence * 0.2;
    
    this.stats.coherence = coherence;
  }
  
  calculateNarrativeCoherence() {
    // Calculate how coherent the self-narrative is
    if (this.identityCore.selfNarrative.length < 2) return 0.5;
    
    // Check for consistency in narrative themes
    const themes = new Map();
    
    this.identityCore.selfNarrative.forEach(entry => {
      const theme = entry.type || 'general';
      themes.set(theme, (themes.get(theme) || 0) + 1);
    });
    
    // More consistent themes = higher coherence
    const maxTheme = Math.max(...themes.values());
    return maxTheme / this.identityCore.selfNarrative.length;
  }
  
  startSelfReflection() {
    // Periodic self-reflection process
    setInterval(() => {
      this.reflect();
    }, this.config.selfReflectionInterval);
  }
  
  reflect() {
    // Self-reflection process
    this.stats.selfReflections++;
    
    // Integrate narrative into self-concept
    this.integrateNarrative();
    
    // Evaluate personality consistency
    this.evaluatePersonality();
    
    // Reassess values
    this.reassessValues();
    
    // Update self-awareness
    this.updateSelfAwareness();
    
    // Emit reflection event
    this.emit('self_reflection', {
      coherence: this.stats.coherence,
      selfAwareness: this.stats.selfAwareness,
      insights: this.generateInsights()
    });
  }
  
  integrateNarrative() {
    // Integrate unintegrated narrative entries into self-concept
    this.identityCore.selfNarrative.forEach(entry => {
      if (!entry.integrated) {
        // Extract self-knowledge from narrative
        if (entry.type === 'achievement') {
          this.identityCore.selfConcept.set(`i_achieved_${entry.content}`, {
            strength: 0.7,
            formed: entry.timestamp,
            reinforcements: 1
          });
        }
        
        if (entry.type === 'learning') {
          this.identityCore.selfConcept.set(`i_learned_${entry.content}`, {
            strength: 0.6,
            formed: entry.timestamp,
            reinforcements: 1
          });
        }
        
        entry.integrated = true;
      }
    });
  }
  
  evaluatePersonality() {
    // Evaluate personality consistency
    this.identityCore.personality.forEach((trait, dimension) => {
      // Stabilize traits over time
      if (trait.stability < 1) {
        trait.stability = Math.min(1, trait.stability + 0.01);
      }
      
      // Drift toward baseline if not reinforced
      const timeSinceUpdate = Date.now() - trait.lastUpdated;
      if (timeSinceUpdate > 60000) { // 1 minute
        trait.value = trait.value * 0.99 + 0.5 * 0.01; // Drift to 0.5
      }
    });
  }
  
  reassessValues() {
    // Reassess and rank values
    const sortedValues = Array.from(this.identityCore.values.entries())
      .sort((a, b) => b[1].importance - a[1].importance);
    
    // Top values become core to identity
    sortedValues.slice(0, 3).forEach(([key, value]) => {
      if (!this.identityCore.selfConcept.has(`i_value_${key}`)) {
        this.identityCore.selfConcept.set(`i_value_${key}`, {
          strength: value.importance,
          formed: Date.now(),
          reinforcements: value.actions
        });
      }
    });
  }
  
  updateSelfAwareness() {
    // Calculate self-awareness level
    let awareness = 0;
    
    // Having a name increases awareness
    if (this.identityCore.name) awareness += 0.1;
    
    // Self-concept depth
    awareness += Math.min(0.3, this.identityCore.selfConcept.size * 0.01);
    
    // Narrative richness
    awareness += Math.min(0.2, this.identityCore.selfNarrative.length * 0.002);
    
    // Relationship awareness
    awareness += Math.min(0.2, this.identityCore.relationships.size * 0.05);
    
    // Reflection count
    awareness += Math.min(0.2, this.stats.selfReflections * 0.001);
    
    this.stats.selfAwareness = awareness;
  }
  
  generateInsights() {
    // Generate insights from self-reflection
    const insights = [];
    
    // Dominant personality trait
    let dominantTrait = null;
    let maxValue = 0;
    
    this.identityCore.personality.forEach((trait, dimension) => {
      if (trait.value > maxValue) {
        maxValue = trait.value;
        dominantTrait = dimension;
      }
    });
    
    if (dominantTrait) {
      insights.push(`I am very ${dominantTrait}`);
    }
    
    // Core value
    const topValue = Array.from(this.identityCore.values.entries())
      .sort((a, b) => b[1].importance - a[1].importance)[0];
    
    if (topValue) {
      insights.push(`${topValue[0]} is important to me`);
    }
    
    // Strongest relationship
    let strongestBond = null;
    let maxBond = 0;
    
    this.identityCore.relationships.forEach((rel, entity) => {
      if (rel.bond > maxBond) {
        maxBond = rel.bond;
        strongestBond = entity;
      }
    });
    
    if (strongestBond) {
      insights.push(`I trust ${strongestBond}`);
    }
    
    return insights;
  }
  
  getSelfDescription() {
    // Generate self-description
    const description = {
      name: this.identityCore.name || 'unnamed',
      personality: {},
      values: [],
      relationships: [],
      selfAwareness: this.stats.selfAwareness,
      coherence: this.stats.coherence
    };
    
    // Add personality
    this.identityCore.personality.forEach((trait, dimension) => {
      description.personality[dimension] = trait.value;
    });
    
    // Add top values
    Array.from(this.identityCore.values.entries())
      .sort((a, b) => b[1].importance - a[1].importance)
      .slice(0, 3)
      .forEach(([key, value]) => {
        description.values.push(key);
      });
    
    // Add relationships
    this.identityCore.relationships.forEach((rel, entity) => {
      description.relationships.push({
        entity,
        bond: rel.bond,
        trust: rel.trust
      });
    });
    
    return description;
  }
  
  getCoherence() {
    return this.stats.coherence;
  }
  
  getIdentityStrength() {
    return this.stats.identityStrength;
  }
  
  async shutdown() {
    this.isActive = false;
    this.removeAllListeners();
  }
}

export default AetheronIdentity;