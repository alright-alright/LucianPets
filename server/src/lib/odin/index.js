import EventEmitter from 'events';
import { VisualCortex } from './visual.js';
import { AuditoryCortex } from './auditory.js';
import { SensoryFusion } from './fusion.js';

/**
 * ODIN Sensory System
 * Omnidirectional Direct Input Network
 * Real sensory perception through webcam and microphone
 */
export class OdinSensorySystem extends EventEmitter {
  constructor() {
    super();
    
    this.isActive = false;
    
    // Sensory components (Huginn & Muninn - Odin's ravens)
    this.visualCortex = new VisualCortex();    // Huginn (thought)
    this.auditoryCortex = new AuditoryCortex(); // Muninn (memory)
    this.sensoryFusion = new SensoryFusion();   // Gungnir (spear - unified perception)
    
    // Perception state
    this.perceptionState = {
      visual: {
        active: false,
        lastFrame: null,
        fps: 0,
        objects: [],
        motion: null,
        attention: null
      },
      auditory: {
        active: false,
        lastSample: null,
        volume: 0,
        sounds: [],
        speech: null,
        emotion: null
      },
      fusion: {
        active: false,
        crossModalBinding: [],
        attentionFocus: null,
        perceptualMoment: null
      }
    };
    
    // Configuration
    this.config = {
      visualEnabled: true,
      auditoryEnabled: true,
      fusionEnabled: true,
      perceptionRate: 100, // 10Hz perception cycle
      attentionThreshold: 0.7,
      motionSensitivity: 0.3,
      audioSensitivity: 0.2
    };
    
    // Statistics
    this.stats = {
      framesProcessed: 0,
      audioSamplesProcessed: 0,
      objectsDetected: 0,
      soundsIdentified: 0,
      fusionEvents: 0
    };
  }
  
  async initialize() {
    console.log('👁️ Initializing ODIN Sensory System...');
    
    // Initialize sensory components
    await Promise.all([
      this.visualCortex.initialize(),
      this.auditoryCortex.initialize(),
      this.sensoryFusion.initialize()
    ]);
    
    // Connect sensory streams
    this.connectSensoryStreams();
    
    // Start perception cycle
    this.startPerceptionCycle();
    
    this.isActive = true;
    
    console.log('✅ ODIN Sensory System initialized');
    console.log('   👁️ Huginn (Visual) ready');
    console.log('   👂 Muninn (Auditory) ready');
    console.log('   ⚡ Gungnir (Fusion) ready');
  }
  
  connectSensoryStreams() {
    // Connect visual processing
    this.visualCortex.on('frame_processed', (visualData) => {
      this.perceptionState.visual = {
        ...this.perceptionState.visual,
        ...visualData,
        active: true,
        lastFrame: Date.now()
      };
      
      this.stats.framesProcessed++;
      
      // Send to fusion
      if (this.config.fusionEnabled) {
        this.sensoryFusion.processVisual(visualData);
      }
    });
    
    // Connect auditory processing
    this.auditoryCortex.on('audio_processed', (audioData) => {
      this.perceptionState.auditory = {
        ...this.perceptionState.auditory,
        ...audioData,
        active: true,
        lastSample: Date.now()
      };
      
      this.stats.audioSamplesProcessed++;
      
      // Send to fusion
      if (this.config.fusionEnabled) {
        this.sensoryFusion.processAuditory(audioData);
      }
    });
    
    // Connect fusion output
    this.sensoryFusion.on('perception_fused', (fusedData) => {
      this.perceptionState.fusion = {
        ...this.perceptionState.fusion,
        ...fusedData,
        active: true
      };
      
      this.stats.fusionEvents++;
      
      // Emit unified perception
      this.emitPerception();
    });
    
    // Object detection events
    this.visualCortex.on('object_detected', (object) => {
      this.stats.objectsDetected++;
      this.emit('object_detected', object);
    });
    
    // Sound identification events
    this.auditoryCortex.on('sound_identified', (sound) => {
      this.stats.soundsIdentified++;
      this.emit('sound_identified', sound);
    });
    
    // Attention events
    this.sensoryFusion.on('attention_shift', (focus) => {
      this.emit('attention_shift', focus);
    });
  }
  
  startPerceptionCycle() {
    // Main perception processing cycle
    setInterval(() => {
      if (this.isActive) {
        this.processPerceptionCycle();
      }
    }, this.config.perceptionRate);
  }
  
  processPerceptionCycle() {
    // Process one perception cycle
    const cycleStart = Date.now();
    
    // Check for stale sensory data
    this.checkSensoryHealth();
    
    // Process attention
    this.updateAttention();
    
    // Generate perception snapshot
    const perception = this.generatePerceptionSnapshot();
    
    // Emit perception event for cognitive processing
    if (perception.quality > 0.3) {
      this.emit('perception', perception);
    }
    
    // Update FPS
    if (this.perceptionState.visual.lastFrame) {
      const timeDiff = cycleStart - this.perceptionState.visual.lastFrame;
      this.perceptionState.visual.fps = timeDiff > 0 ? 1000 / timeDiff : 0;
    }
  }
  
  checkSensoryHealth() {
    // Check if sensory inputs are healthy
    const now = Date.now();
    
    // Check visual health
    if (this.perceptionState.visual.lastFrame) {
      const visualAge = now - this.perceptionState.visual.lastFrame;
      if (visualAge > 5000) {
        this.perceptionState.visual.active = false;
        this.emit('visual_lost');
      }
    }
    
    // Check auditory health
    if (this.perceptionState.auditory.lastSample) {
      const audioAge = now - this.perceptionState.auditory.lastSample;
      if (audioAge > 5000) {
        this.perceptionState.auditory.active = false;
        this.emit('audio_lost');
      }
    }
  }
  
  updateAttention() {
    // Update attention based on sensory input
    const attentionTargets = [];
    
    // Visual attention targets
    if (this.perceptionState.visual.objects) {
      this.perceptionState.visual.objects.forEach(obj => {
        if (obj.confidence > this.config.attentionThreshold) {
          attentionTargets.push({
            type: 'visual',
            target: obj,
            salience: obj.confidence * (obj.motion || 1)
          });
        }
      });
    }
    
    // Auditory attention targets
    if (this.perceptionState.auditory.sounds) {
      this.perceptionState.auditory.sounds.forEach(sound => {
        if (sound.confidence > this.config.attentionThreshold) {
          attentionTargets.push({
            type: 'auditory',
            target: sound,
            salience: sound.confidence * sound.volume
          });
        }
      });
    }
    
    // Select highest salience target
    if (attentionTargets.length > 0) {
      attentionTargets.sort((a, b) => b.salience - a.salience);
      const newFocus = attentionTargets[0];
      
      if (!this.perceptionState.fusion.attentionFocus || 
          newFocus.salience > this.perceptionState.fusion.attentionFocus.salience * 1.2) {
        this.perceptionState.fusion.attentionFocus = newFocus;
        this.emit('attention_captured', newFocus);
      }
    }
  }
  
  generatePerceptionSnapshot() {
    // Generate complete perception snapshot
    const snapshot = {
      timestamp: Date.now(),
      visual: null,
      auditory: null,
      fusion: null,
      attention: this.perceptionState.fusion.attentionFocus,
      quality: 0,
      metadata: {
        fps: this.perceptionState.visual.fps,
        visualActive: this.perceptionState.visual.active,
        auditoryActive: this.perceptionState.auditory.active
      }
    };
    
    // Add visual perception
    if (this.perceptionState.visual.active) {
      snapshot.visual = {
        objects: this.perceptionState.visual.objects,
        motion: this.perceptionState.visual.motion,
        scene: this.perceptionState.visual.scene
      };
      snapshot.quality += 0.5;
    }
    
    // Add auditory perception
    if (this.perceptionState.auditory.active) {
      snapshot.auditory = {
        sounds: this.perceptionState.auditory.sounds,
        volume: this.perceptionState.auditory.volume,
        speech: this.perceptionState.auditory.speech,
        emotion: this.perceptionState.auditory.emotion
      };
      snapshot.quality += 0.3;
    }
    
    // Add fusion perception
    if (this.perceptionState.fusion.active) {
      snapshot.fusion = {
        crossModalBinding: this.perceptionState.fusion.crossModalBinding,
        perceptualMoment: this.perceptionState.fusion.perceptualMoment
      };
      snapshot.quality += 0.2;
    }
    
    return snapshot;
  }
  
  emitPerception() {
    // Emit complete perception event
    const perception = {
      visual: this.perceptionState.visual,
      auditory: this.perceptionState.auditory,
      fusion: this.perceptionState.fusion,
      timestamp: Date.now(),
      metadata: {
        quality: this.calculatePerceptionQuality(),
        attention: this.perceptionState.fusion.attentionFocus
      }
    };
    
    this.emit('perception_complete', perception);
  }
  
  calculatePerceptionQuality() {
    // Calculate overall perception quality
    let quality = 0;
    
    if (this.perceptionState.visual.active) quality += 0.4;
    if (this.perceptionState.auditory.active) quality += 0.3;
    if (this.perceptionState.fusion.active) quality += 0.3;
    
    // Reduce quality if data is stale
    const now = Date.now();
    
    if (this.perceptionState.visual.lastFrame) {
      const age = now - this.perceptionState.visual.lastFrame;
      if (age > 1000) quality *= 0.8;
    }
    
    if (this.perceptionState.auditory.lastSample) {
      const age = now - this.perceptionState.auditory.lastSample;
      if (age > 1000) quality *= 0.8;
    }
    
    return quality;
  }
  
  // Camera control methods
  async startCamera(deviceId = null) {
    if (this.config.visualEnabled) {
      await this.visualCortex.startCamera(deviceId);
      this.perceptionState.visual.active = true;
      this.emit('camera_started');
    }
  }
  
  async stopCamera() {
    await this.visualCortex.stopCamera();
    this.perceptionState.visual.active = false;
    this.emit('camera_stopped');
  }
  
  // Microphone control methods
  async startMicrophone(deviceId = null) {
    if (this.config.auditoryEnabled) {
      await this.auditoryCortex.startMicrophone(deviceId);
      this.perceptionState.auditory.active = true;
      this.emit('microphone_started');
    }
  }
  
  async stopMicrophone() {
    await this.auditoryCortex.stopMicrophone();
    this.perceptionState.auditory.active = false;
    this.emit('microphone_stopped');
  }
  
  // Process external sensory input
  processVideoFrame(frameData) {
    // Process video frame from external source
    if (this.config.visualEnabled && this.visualCortex) {
      this.visualCortex.processFrame(frameData);
    }
  }
  
  processAudioSample(audioData) {
    // Process audio sample from external source
    if (this.config.auditoryEnabled && this.auditoryCortex) {
      this.auditoryCortex.processSample(audioData);
    }
  }
  
  // Configuration methods
  setVisualEnabled(enabled) {
    this.config.visualEnabled = enabled;
    if (!enabled) {
      this.stopCamera();
    }
  }
  
  setAuditoryEnabled(enabled) {
    this.config.auditoryEnabled = enabled;
    if (!enabled) {
      this.stopMicrophone();
    }
  }
  
  setMotionSensitivity(sensitivity) {
    this.config.motionSensitivity = Math.max(0, Math.min(1, sensitivity));
    if (this.visualCortex) {
      this.visualCortex.setMotionSensitivity(sensitivity);
    }
  }
  
  setAudioSensitivity(sensitivity) {
    this.config.audioSensitivity = Math.max(0, Math.min(1, sensitivity));
    if (this.auditoryCortex) {
      this.auditoryCortex.setSensitivity(sensitivity);
    }
  }
  
  // Get current perception state
  getPerceptionState() {
    return {
      ...this.perceptionState,
      stats: this.stats,
      config: this.config
    };
  }
  
  // Pet-specific perception methods
  lookAt(target) {
    // Direct attention to specific target
    this.perceptionState.fusion.attentionFocus = {
      type: 'directed',
      target,
      salience: 1.0
    };
    
    this.emit('looking_at', target);
  }
  
  listenFor(sound) {
    // Listen for specific sound
    if (this.auditoryCortex) {
      this.auditoryCortex.listenFor(sound);
    }
  }
  
  async shutdown() {
    console.log('🛑 Shutting down ODIN Sensory System...');
    
    this.isActive = false;
    
    // Stop sensory inputs
    await this.stopCamera();
    await this.stopMicrophone();
    
    // Shutdown components
    await Promise.all([
      this.visualCortex.shutdown(),
      this.auditoryCortex.shutdown(),
      this.sensoryFusion.shutdown()
    ]);
    
    this.removeAllListeners();
    
    console.log('✅ ODIN shutdown complete');
  }
}

export default OdinSensorySystem;