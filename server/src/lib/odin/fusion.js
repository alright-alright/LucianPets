import EventEmitter from 'events';

/**
 * Sensory Fusion - Gungnir (Odin's Spear)
 * Unifies visual and auditory perception into coherent experience
 * Creates cross-modal bindings and emergent perceptual features
 */
export class SensoryFusion extends EventEmitter {
  constructor() {
    super();
    
    this.isActive = false;
    
    // Fusion state
    this.fusionState = {
      crossModalBindings: [],
      unifiedPercepts: [],
      temporalCoherence: 1.0,
      spatialCoherence: 1.0,
      perceptualMoments: []
    };
    
    // Sensory buffers
    this.visualBuffer = [];
    this.auditoryBuffer = [];
    
    // Cross-modal associations
    this.associations = new Map();
    
    // Attention system
    this.attention = {
      focus: null,
      saliencyMap: new Map(),
      suppressionMap: new Map(),
      switchingThreshold: 0.7
    };
    
    // Configuration
    this.config = {
      fusionWindowMs: 100, // Temporal binding window
      spatialBindingRadius: 0.3, // Normalized space
      coherenceThreshold: 0.6,
      associationStrength: 0.5,
      attentionDecay: 0.95,
      maxPerceptualMoments: 10
    };
    
    // Statistics
    this.stats = {
      bindingsCreated: 0,
      perceptsFormed: 0,
      attentionSwitches: 0,
      coherenceScore: 1.0
    };
    
    // Emergent features
    this.emergentFeatures = {
      objectPermanence: new Map(), // Track objects across time
      causalRelations: [], // Detect cause-effect relationships
      patterns: new Map(), // Cross-modal patterns
      predictions: [] // Predicted next states
    };
  }
  
  async initialize() {
    console.log('⚡ Initializing Sensory Fusion (Gungnir)...');
    
    // Initialize fusion systems
    this.initializeFusionSystems();
    
    // Start fusion processing
    this.startFusionLoop();
    
    this.isActive = true;
    
    console.log('✅ Sensory Fusion initialized');
  }
  
  initializeFusionSystems() {
    console.log('   Initializing Cross-Modal Binding...');
    console.log('   Initializing Attention System...');
    console.log('   Initializing Temporal Coherence...');
    console.log('   Initializing Predictive Processing...');
  }
  
  processVisual(visualData) {
    // Add visual data to buffer with timestamp
    this.visualBuffer.push({
      ...visualData,
      timestamp: Date.now(),
      modality: 'visual'
    });
    
    // Maintain buffer size
    if (this.visualBuffer.length > 30) {
      this.visualBuffer.shift();
    }
    
    // Attempt fusion with recent auditory data
    this.attemptFusion('visual');
  }
  
  processAuditory(audioData) {
    // Add auditory data to buffer with timestamp
    this.auditoryBuffer.push({
      ...audioData,
      timestamp: Date.now(),
      modality: 'auditory'
    });
    
    // Maintain buffer size
    if (this.auditoryBuffer.length > 30) {
      this.auditoryBuffer.shift();
    }
    
    // Attempt fusion with recent visual data
    this.attemptFusion('auditory');
  }
  
  attemptFusion(triggerModality) {
    // Try to create cross-modal bindings
    const now = Date.now();
    const bindings = [];
    
    // Get recent data from both modalities
    const recentVisual = this.visualBuffer.filter(v => 
      now - v.timestamp < this.config.fusionWindowMs
    );
    const recentAudio = this.auditoryBuffer.filter(a => 
      now - a.timestamp < this.config.fusionWindowMs
    );
    
    // Create bindings based on temporal and spatial coherence
    recentVisual.forEach(visual => {
      recentAudio.forEach(audio => {
        const binding = this.createBinding(visual, audio);
        
        if (binding && binding.strength > this.config.coherenceThreshold) {
          bindings.push(binding);
          this.stats.bindingsCreated++;
        }
      });
    });
    
    // Update fusion state
    if (bindings.length > 0) {
      this.fusionState.crossModalBindings = bindings;
      
      // Create unified percept
      const percept = this.createUnifiedPercept(bindings);
      this.addPerceptualMoment(percept);
      
      // Update attention
      this.updateAttention(percept);
      
      // Detect emergent features
      this.detectEmergentFeatures(percept);
      
      // Emit fusion event
      this.emit('perception_fused', {
        crossModalBinding: bindings,
        perceptualMoment: percept,
        attention: this.attention.focus
      });
    }
  }
  
  createBinding(visual, audio) {
    // Create cross-modal binding between visual and auditory data
    const binding = {
      visual: visual,
      audio: audio,
      strength: 0,
      type: 'unknown',
      confidence: 0
    };
    
    // Temporal coherence - events close in time are likely related
    const timeDiff = Math.abs(visual.timestamp - audio.timestamp);
    const temporalCoherence = 1 - (timeDiff / this.config.fusionWindowMs);
    
    // Spatial coherence - check if sound source matches visual location
    let spatialCoherence = 0;
    
    if (visual.attention && audio.sounds && audio.sounds.length > 0) {
      // Check if visual attention aligns with sound direction
      const soundDirection = audio.sounds[0].location || 'center';
      const visualX = visual.attention.x / 640; // Normalize
      
      if (soundDirection === 'left' && visualX < 0.5) {
        spatialCoherence = 1 - visualX;
      } else if (soundDirection === 'right' && visualX > 0.5) {
        spatialCoherence = visualX;
      } else if (soundDirection === 'center') {
        spatialCoherence = 1 - Math.abs(visualX - 0.5) * 2;
      }
    }
    
    // Content coherence - check if content matches
    let contentCoherence = 0;
    
    // Check for speaking face + speech
    if (visual.objects) {
      const hasFace = visual.objects.some(obj => obj.type === 'face');
      const hasSpeech = audio.classification && audio.classification.type === 'speech';
      
      if (hasFace && hasSpeech) {
        contentCoherence = 0.9;
        binding.type = 'speaking_face';
      }
    }
    
    // Check for moving object + sound
    if (visual.motion && visual.motion.intensity > 0.3 && audio.volume > 0.3) {
      contentCoherence = Math.max(contentCoherence, 0.7);
      if (binding.type === 'unknown') {
        binding.type = 'moving_sound_source';
      }
    }
    
    // Calculate overall binding strength
    binding.strength = (temporalCoherence * 0.3 + 
                       spatialCoherence * 0.3 + 
                       contentCoherence * 0.4);
    
    binding.confidence = binding.strength;
    
    // Store association for learning
    if (binding.strength > this.config.associationStrength) {
      this.learnAssociation(visual, audio, binding);
    }
    
    return binding.strength > 0.3 ? binding : null;
  }
  
  createUnifiedPercept(bindings) {
    // Create unified perceptual moment from bindings
    const percept = {
      timestamp: Date.now(),
      bindings: bindings,
      summary: {},
      confidence: 0,
      novelty: 0
    };
    
    // Analyze bindings to create summary
    const hasVisual = bindings.some(b => b.visual);
    const hasAudio = bindings.some(b => b.audio);
    
    // Identify primary percept type
    const bindingTypes = bindings.map(b => b.type);
    
    if (bindingTypes.includes('speaking_face')) {
      percept.summary = {
        type: 'social_interaction',
        description: 'Someone is speaking',
        modalities: ['visual', 'auditory'],
        emotion: bindings[0].audio.emotion?.label || 'neutral'
      };
      percept.confidence = 0.9;
    } else if (bindingTypes.includes('moving_sound_source')) {
      percept.summary = {
        type: 'dynamic_object',
        description: 'Moving object making sound',
        modalities: ['visual', 'auditory']
      };
      percept.confidence = 0.7;
    } else if (hasVisual && !hasAudio) {
      percept.summary = {
        type: 'visual_only',
        description: 'Silent visual scene',
        modalities: ['visual']
      };
      percept.confidence = 0.6;
    } else if (!hasVisual && hasAudio) {
      percept.summary = {
        type: 'audio_only',
        description: 'Sound without visual source',
        modalities: ['auditory']
      };
      percept.confidence = 0.6;
    } else {
      percept.summary = {
        type: 'complex_scene',
        description: 'Multiple sensory inputs',
        modalities: ['visual', 'auditory']
      };
      percept.confidence = 0.5;
    }
    
    // Calculate novelty
    percept.novelty = this.calculateNovelty(percept);
    
    this.stats.perceptsFormed++;
    
    return percept;
  }
  
  calculateNovelty(percept) {
    // Calculate how novel this percept is
    let novelty = 0.5; // Base novelty
    
    // Check if we've seen this type before
    const perceptType = percept.summary.type;
    const recentPercepts = this.fusionState.perceptualMoments.slice(-5);
    
    const similarCount = recentPercepts.filter(p => 
      p.summary.type === perceptType
    ).length;
    
    // More similar recent percepts = less novelty
    novelty -= similarCount * 0.1;
    
    // New binding types increase novelty
    percept.bindings.forEach(binding => {
      if (!this.associations.has(binding.type)) {
        novelty += 0.1;
      }
    });
    
    return Math.max(0, Math.min(1, novelty));
  }
  
  addPerceptualMoment(percept) {
    // Add to perceptual moments history
    this.fusionState.perceptualMoments.push(percept);
    
    // Maintain size limit
    if (this.fusionState.perceptualMoments.length > this.config.maxPerceptualMoments) {
      this.fusionState.perceptualMoments.shift();
    }
    
    // Update unified percepts
    this.fusionState.unifiedPercepts = [percept];
  }
  
  updateAttention(percept) {
    // Update attention based on unified percept
    const saliency = percept.confidence * percept.novelty;
    
    // Update saliency map
    this.attention.saliencyMap.set(percept.summary.type, saliency);
    
    // Decay existing saliency
    this.attention.saliencyMap.forEach((value, key) => {
      if (key !== percept.summary.type) {
        this.attention.saliencyMap.set(key, value * this.config.attentionDecay);
      }
    });
    
    // Check if we should switch attention
    const currentFocusSaliency = this.attention.focus ? 
      this.attention.saliencyMap.get(this.attention.focus.type) || 0 : 0;
    
    if (saliency > currentFocusSaliency * this.config.switchingThreshold) {
      // Switch attention
      this.attention.focus = {
        type: percept.summary.type,
        target: percept.summary.description,
        saliency: saliency,
        timestamp: Date.now()
      };
      
      this.stats.attentionSwitches++;
      
      this.emit('attention_shift', this.attention.focus);
    }
  }
  
  detectEmergentFeatures(percept) {
    // Detect emergent cross-modal features
    
    // Object permanence - track objects across time
    if (percept.bindings.length > 0) {
      percept.bindings.forEach(binding => {
        if (binding.visual && binding.visual.objects) {
          binding.visual.objects.forEach(obj => {
            const objKey = `${obj.type}_${Math.round(obj.boundingBox.x/50)}`;
            
            if (!this.emergentFeatures.objectPermanence.has(objKey)) {
              this.emergentFeatures.objectPermanence.set(objKey, {
                firstSeen: Date.now(),
                lastSeen: Date.now(),
                encounters: 1
              });
            } else {
              const tracking = this.emergentFeatures.objectPermanence.get(objKey);
              tracking.lastSeen = Date.now();
              tracking.encounters++;
            }
          });
        }
      });
    }
    
    // Detect causal relations
    this.detectCausalRelations(percept);
    
    // Learn cross-modal patterns
    this.learnCrossModalPatterns(percept);
    
    // Generate predictions
    this.generatePredictions(percept);
  }
  
  detectCausalRelations(percept) {
    // Detect cause-effect relationships between modalities
    const recentPercepts = this.fusionState.perceptualMoments.slice(-3);
    
    if (recentPercepts.length >= 2) {
      const prev = recentPercepts[recentPercepts.length - 2];
      const curr = percept;
      
      // Check for motion -> sound causality
      if (prev.summary.type === 'visual_only' && 
          curr.summary.type === 'moving_sound_source') {
        this.emergentFeatures.causalRelations.push({
          cause: 'motion',
          effect: 'sound',
          confidence: 0.7,
          timestamp: Date.now()
        });
      }
      
      // Check for sound -> visual attention causality
      if (prev.summary.type === 'audio_only' && 
          curr.summary.type === 'dynamic_object') {
        this.emergentFeatures.causalRelations.push({
          cause: 'sound',
          effect: 'visual_attention',
          confidence: 0.6,
          timestamp: Date.now()
        });
      }
    }
    
    // Keep causal relations limited
    if (this.emergentFeatures.causalRelations.length > 20) {
      this.emergentFeatures.causalRelations.shift();
    }
  }
  
  learnCrossModalPatterns(percept) {
    // Learn patterns across modalities
    const patternKey = `${percept.summary.type}_pattern`;
    
    if (!this.emergentFeatures.patterns.has(patternKey)) {
      this.emergentFeatures.patterns.set(patternKey, {
        occurrences: 1,
        averageConfidence: percept.confidence,
        typicalDuration: 0,
        lastSeen: Date.now()
      });
    } else {
      const pattern = this.emergentFeatures.patterns.get(patternKey);
      pattern.occurrences++;
      pattern.averageConfidence = (pattern.averageConfidence + percept.confidence) / 2;
      pattern.lastSeen = Date.now();
    }
  }
  
  generatePredictions(percept) {
    // Generate predictions about what might happen next
    this.emergentFeatures.predictions = [];
    
    // Based on learned patterns
    this.emergentFeatures.patterns.forEach((pattern, key) => {
      if (pattern.occurrences > 3) {
        // This pattern is established, predict it might continue
        this.emergentFeatures.predictions.push({
          type: 'pattern_continuation',
          pattern: key,
          confidence: pattern.averageConfidence,
          timeframe: 1000 // Next second
        });
      }
    });
    
    // Based on causal relations
    if (percept.summary.type === 'visual_only' && percept.bindings[0]?.visual?.motion) {
      // Predict sound might follow motion
      this.emergentFeatures.predictions.push({
        type: 'expected_sound',
        confidence: 0.5,
        timeframe: 500
      });
    }
    
    // Keep predictions limited
    this.emergentFeatures.predictions = this.emergentFeatures.predictions.slice(0, 5);
  }
  
  learnAssociation(visual, audio, binding) {
    // Learn association between visual and auditory features
    const key = `${binding.type}`;
    
    if (!this.associations.has(key)) {
      this.associations.set(key, {
        strength: binding.strength,
        occurrences: 1,
        lastSeen: Date.now(),
        examples: []
      });
    } else {
      const association = this.associations.get(key);
      association.strength = (association.strength + binding.strength) / 2;
      association.occurrences++;
      association.lastSeen = Date.now();
    }
    
    // Store example (keep limited)
    const association = this.associations.get(key);
    if (association.examples.length < 5) {
      association.examples.push({
        visual: visual.summary || visual.scene,
        audio: audio.classification || audio.sounds,
        timestamp: Date.now()
      });
    }
  }
  
  startFusionLoop() {
    // Main fusion processing loop
    setInterval(() => {
      if (this.isActive) {
        // Update coherence measures
        this.updateCoherence();
        
        // Clean old data
        this.cleanOldData();
        
        // Check for timeout situations
        this.checkTimeouts();
      }
    }, 100); // 10Hz
  }
  
  updateCoherence() {
    // Update temporal and spatial coherence measures
    const now = Date.now();
    
    // Temporal coherence - how synchronized are the modalities
    if (this.visualBuffer.length > 0 && this.auditoryBuffer.length > 0) {
      const lastVisual = this.visualBuffer[this.visualBuffer.length - 1];
      const lastAudio = this.auditoryBuffer[this.auditoryBuffer.length - 1];
      
      const timeDiff = Math.abs(lastVisual.timestamp - lastAudio.timestamp);
      this.fusionState.temporalCoherence = Math.max(0, 1 - timeDiff / 1000);
    }
    
    // Spatial coherence - derived from recent bindings
    if (this.fusionState.crossModalBindings.length > 0) {
      const avgStrength = this.fusionState.crossModalBindings.reduce(
        (sum, b) => sum + b.strength, 0
      ) / this.fusionState.crossModalBindings.length;
      
      this.fusionState.spatialCoherence = avgStrength;
    }
    
    // Overall coherence score
    this.stats.coherenceScore = (this.fusionState.temporalCoherence + 
                                 this.fusionState.spatialCoherence) / 2;
  }
  
  cleanOldData() {
    // Remove old data from buffers
    const now = Date.now();
    const maxAge = 5000; // 5 seconds
    
    this.visualBuffer = this.visualBuffer.filter(v => 
      now - v.timestamp < maxAge
    );
    
    this.auditoryBuffer = this.auditoryBuffer.filter(a => 
      now - a.timestamp < maxAge
    );
    
    // Clean old object permanence tracking
    this.emergentFeatures.objectPermanence.forEach((tracking, key) => {
      if (now - tracking.lastSeen > 10000) { // 10 seconds
        this.emergentFeatures.objectPermanence.delete(key);
      }
    });
  }
  
  checkTimeouts() {
    // Check for sensory timeouts
    const now = Date.now();
    
    if (this.visualBuffer.length > 0) {
      const lastVisual = this.visualBuffer[this.visualBuffer.length - 1];
      if (now - lastVisual.timestamp > 2000) {
        this.emit('visual_timeout');
      }
    }
    
    if (this.auditoryBuffer.length > 0) {
      const lastAudio = this.auditoryBuffer[this.auditoryBuffer.length - 1];
      if (now - lastAudio.timestamp > 2000) {
        this.emit('audio_timeout');
      }
    }
  }
  
  getFusionState() {
    return {
      fusionState: this.fusionState,
      attention: this.attention,
      emergentFeatures: this.emergentFeatures,
      associations: Array.from(this.associations.entries()),
      stats: this.stats
    };
  }
  
  async shutdown() {
    this.isActive = false;
    this.visualBuffer = [];
    this.auditoryBuffer = [];
    this.removeAllListeners();
  }
}

export default SensoryFusion;