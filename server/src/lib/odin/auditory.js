import EventEmitter from 'events';

/**
 * Auditory Cortex - Muninn (Memory)
 * Processes audio input from microphone
 * Implements layered audio processing similar to biological hearing
 */
export class AuditoryCortex extends EventEmitter {
  constructor() {
    super();
    
    this.isActive = false;
    this.audioStream = null;
    this.audioBuffer = [];
    
    // Auditory processing layers (A1-A2 + specialized regions)
    this.layers = {
      a1: { // Primary auditory cortex - basic sound features
        frequencies: [],
        amplitudes: [],
        temporalPatterns: []
      },
      a2: { // Secondary auditory cortex - complex sounds
        harmonics: [],
        timbre: [],
        rhythm: []
      },
      speech: { // Speech processing (Wernicke's area analog)
        phonemes: [],
        words: [],
        prosody: null
      },
      emotion: { // Emotional processing
        valence: 0, // Positive/negative
        arousal: 0, // Calm/excited
        dominance: 0 // Submissive/dominant
      },
      music: { // Musical processing
        pitch: null,
        tempo: null,
        melody: []
      }
    };
    
    // Configuration
    this.config = {
      sampleRate: 16000, // 16kHz sampling
      bufferSize: 2048,
      sensitivity: 0.3,
      volumeThreshold: 0.1,
      speechDetectionThreshold: 0.6,
      emotionSensitivity: 0.5
    };
    
    // Statistics
    this.stats = {
      samplesProcessed: 0,
      soundsIdentified: 0,
      speechDetected: 0,
      emotionalEvents: 0,
      lastSampleTime: 0
    };
    
    // Sound classification
    this.soundCategories = {
      speech: { confidence: 0, active: false },
      music: { confidence: 0, active: false },
      noise: { confidence: 0, active: false },
      silence: { confidence: 0, active: true }
    };
    
    // Attention mechanism
    this.attention = {
      focus: null,
      interestingSounds: [],
      speechTracking: false
    };
  }
  
  async initialize() {
    console.log('👂 Initializing Auditory Cortex (Muninn)...');
    
    // Initialize processing layers
    this.initializeLayers();
    
    // Start audio processing loop
    this.startProcessingLoop();
    
    this.isActive = true;
    
    console.log('✅ Auditory Cortex initialized');
  }
  
  initializeLayers() {
    // Initialize auditory processing layers
    console.log('   Initializing A1 (Primary Auditory)...');
    console.log('   Initializing A2 (Secondary Auditory)...');
    console.log('   Initializing Speech Processing...');
    console.log('   Initializing Emotion Detection...');
    console.log('   Initializing Music Processing...');
  }
  
  async startMicrophone(deviceId = null) {
    try {
      // Request microphone access
      const constraints = {
        audio: {
          sampleRate: this.config.sampleRate,
          echoCancellation: true,
          noiseSuppression: true,
          deviceId: deviceId ? { exact: deviceId } : undefined
        }
      };
      
      // Note: In Node.js backend, we'd receive audio via WebSocket
      console.log('🎤 Microphone access requested with constraints:', constraints);
      
      // In production: this.audioStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      this.emit('microphone_ready');
      
    } catch (error) {
      console.error('Failed to start microphone:', error);
      this.emit('microphone_error', error);
    }
  }
  
  async stopMicrophone() {
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }
    
    this.emit('microphone_stopped');
  }
  
  processSample(audioData) {
    // Process audio sample
    const processingStart = Date.now();
    
    // Add to buffer
    this.addToBuffer(audioData);
    
    // Layer 1: Basic feature extraction
    const features = this.extractBasicFeatures(audioData);
    this.layers.a1 = features.basic;
    
    // Layer 2: Complex sound analysis
    const complexFeatures = this.extractComplexFeatures(features);
    this.layers.a2 = complexFeatures;
    
    // Classify sound type
    const classification = this.classifySound(features, complexFeatures);
    this.updateSoundCategories(classification);
    
    // Speech processing if detected
    if (classification.type === 'speech') {
      const speechAnalysis = this.processSpeech(audioData, features);
      this.layers.speech = speechAnalysis;
      
      if (speechAnalysis.words.length > 0) {
        this.stats.speechDetected++;
        this.emit('speech_detected', speechAnalysis);
      }
    }
    
    // Emotion detection
    const emotion = this.detectEmotion(features, classification);
    this.layers.emotion = emotion;
    
    if (emotion.intensity > 0.5) {
      this.stats.emotionalEvents++;
      this.emit('emotion_detected', emotion);
    }
    
    // Music processing if detected
    if (classification.type === 'music') {
      const musicAnalysis = this.processMusic(features);
      this.layers.music = musicAnalysis;
      this.emit('music_detected', musicAnalysis);
    }
    
    // Update attention
    this.updateAttention(classification, emotion);
    
    // Statistics
    this.stats.samplesProcessed++;
    this.stats.lastSampleTime = Date.now() - processingStart;
    
    // Emit processed audio
    this.emit('audio_processed', {
      sounds: this.identifySounds(features),
      volume: features.basic.volume,
      speech: this.layers.speech,
      emotion: this.layers.emotion,
      classification,
      timestamp: Date.now()
    });
  }
  
  addToBuffer(audioData) {
    // Maintain audio buffer for temporal processing
    this.audioBuffer.push({
      data: audioData,
      timestamp: Date.now()
    });
    
    // Keep buffer size limited
    if (this.audioBuffer.length > this.config.bufferSize / 256) {
      this.audioBuffer.shift();
    }
  }
  
  extractBasicFeatures(audioData) {
    // Extract basic audio features
    const features = {
      basic: {
        frequencies: [],
        amplitudes: [],
        temporalPatterns: [],
        volume: 0,
        pitch: 0,
        zeroCrossingRate: 0
      }
    };
    
    // Simulate feature extraction
    // In production, use Web Audio API or audio processing library
    
    // Volume/amplitude analysis
    features.basic.volume = Math.random() * 0.8 + 0.1;
    
    // Frequency analysis (simulate FFT)
    const freqCount = 32;
    for (let i = 0; i < freqCount; i++) {
      features.basic.frequencies.push({
        bin: i,
        frequency: (i + 1) * (this.config.sampleRate / 2 / freqCount),
        magnitude: Math.random()
      });
    }
    
    // Dominant frequency (pitch)
    const dominantFreq = features.basic.frequencies.reduce((max, freq) => 
      freq.magnitude > max.magnitude ? freq : max
    );
    features.basic.pitch = dominantFreq.frequency;
    
    // Zero crossing rate (useful for speech/music discrimination)
    features.basic.zeroCrossingRate = Math.random() * 0.5;
    
    // Temporal patterns
    features.basic.temporalPatterns = this.extractTemporalPatterns();
    
    return features;
  }
  
  extractComplexFeatures(basicFeatures) {
    // Extract complex audio features
    const complexFeatures = {
      harmonics: [],
      timbre: {},
      rhythm: {}
    };
    
    // Harmonic analysis
    const fundamentalFreq = basicFeatures.basic.pitch;
    for (let i = 2; i <= 5; i++) {
      complexFeatures.harmonics.push({
        harmonic: i,
        frequency: fundamentalFreq * i,
        strength: Math.random() * 0.5
      });
    }
    
    // Timbre characteristics
    complexFeatures.timbre = {
      brightness: Math.random(), // High frequency content
      roughness: Math.random() * 0.5, // Dissonance
      warmth: Math.random() // Low frequency richness
    };
    
    // Rhythm analysis
    complexFeatures.rhythm = {
      tempo: 60 + Math.random() * 120, // BPM
      regularity: Math.random(), // How regular the rhythm is
      syncopation: Math.random() * 0.3 // Off-beat emphasis
    };
    
    return complexFeatures;
  }
  
  extractTemporalPatterns() {
    // Extract temporal patterns from buffer
    const patterns = [];
    
    if (this.audioBuffer.length < 2) {
      return patterns;
    }
    
    // Analyze amplitude envelope
    const envelope = this.audioBuffer.map(sample => sample.amplitude || Math.random());
    
    // Detect onsets (sudden increases)
    for (let i = 1; i < envelope.length; i++) {
      const diff = envelope[i] - envelope[i-1];
      if (diff > 0.3) {
        patterns.push({
          type: 'onset',
          time: i * (1000 / this.config.sampleRate),
          strength: diff
        });
      }
    }
    
    return patterns;
  }
  
  classifySound(features, complexFeatures) {
    // Classify the type of sound
    const classification = {
      type: 'unknown',
      confidence: 0,
      subtype: null
    };
    
    // Simple classification based on features
    const zcr = features.basic.zeroCrossingRate;
    const volume = features.basic.volume;
    const brightness = complexFeatures.timbre.brightness;
    
    if (volume < this.config.volumeThreshold) {
      classification.type = 'silence';
      classification.confidence = 0.9;
    } else if (zcr > 0.3 && brightness > 0.6) {
      classification.type = 'speech';
      classification.confidence = 0.7 + Math.random() * 0.2;
      classification.subtype = brightness > 0.8 ? 'female' : 'male';
    } else if (complexFeatures.rhythm.regularity > 0.7) {
      classification.type = 'music';
      classification.confidence = 0.6 + Math.random() * 0.3;
      classification.subtype = complexFeatures.rhythm.tempo > 120 ? 'fast' : 'slow';
    } else {
      classification.type = 'noise';
      classification.confidence = 0.5 + Math.random() * 0.3;
      classification.subtype = volume > 0.7 ? 'loud' : 'ambient';
    }
    
    return classification;
  }
  
  updateSoundCategories(classification) {
    // Update sound category tracking
    Object.keys(this.soundCategories).forEach(category => {
      if (category === classification.type) {
        this.soundCategories[category].confidence = classification.confidence;
        this.soundCategories[category].active = true;
      } else {
        this.soundCategories[category].confidence *= 0.9; // Decay
        this.soundCategories[category].active = false;
      }
    });
  }
  
  processSpeech(audioData, features) {
    // Process speech (simplified - in production use speech recognition API)
    const speechAnalysis = {
      phonemes: [],
      words: [],
      prosody: {
        intonation: 'neutral',
        stress: 0.5,
        rate: 'normal'
      }
    };
    
    // Simulate phoneme detection
    const phonemeTypes = ['ah', 'ee', 'oh', 'oo', 'ay', 'eh'];
    const phonemeCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < phonemeCount; i++) {
      speechAnalysis.phonemes.push({
        phoneme: phonemeTypes[Math.floor(Math.random() * phonemeTypes.length)],
        timestamp: Date.now() + i * 100,
        duration: 50 + Math.random() * 150
      });
    }
    
    // Simulate word detection (very simplified)
    if (Math.random() > 0.6) {
      const words = ['hello', 'good', 'pet', 'come', 'play', 'food', 'sit', 'stay'];
      speechAnalysis.words.push({
        word: words[Math.floor(Math.random() * words.length)],
        confidence: Math.random() * 0.4 + 0.6,
        timestamp: Date.now()
      });
    }
    
    // Prosody analysis
    const pitch = features.basic.pitch;
    if (pitch > 300) {
      speechAnalysis.prosody.intonation = 'rising'; // Question
    } else if (pitch < 150) {
      speechAnalysis.prosody.intonation = 'falling'; // Statement
    }
    
    return speechAnalysis;
  }
  
  detectEmotion(features, classification) {
    // Detect emotion from audio features
    const emotion = {
      valence: 0, // -1 (negative) to 1 (positive)
      arousal: 0, // -1 (calm) to 1 (excited)
      dominance: 0, // -1 (submissive) to 1 (dominant)
      label: 'neutral',
      intensity: 0
    };
    
    // Use audio features to estimate emotion
    const volume = features.basic.volume;
    const pitch = features.basic.pitch;
    const brightness = features.basic.frequencies.reduce((sum, f) => 
      f.frequency > 2000 ? sum + f.magnitude : sum, 0) / features.basic.frequencies.length;
    
    // Arousal correlates with volume and pitch
    emotion.arousal = (volume - 0.5) * 2;
    
    // Valence correlates with brightness and harmonic content
    emotion.valence = (brightness - 0.5) * 2;
    
    // Dominance correlates with low frequencies
    const lowFreqPower = features.basic.frequencies.reduce((sum, f) => 
      f.frequency < 500 ? sum + f.magnitude : sum, 0) / features.basic.frequencies.length;
    emotion.dominance = (lowFreqPower - 0.5) * 2;
    
    // Calculate intensity
    emotion.intensity = Math.sqrt(
      emotion.valence * emotion.valence + 
      emotion.arousal * emotion.arousal
    ) / Math.sqrt(2);
    
    // Determine emotion label
    if (emotion.valence > 0.3 && emotion.arousal > 0.3) {
      emotion.label = 'happy';
    } else if (emotion.valence > 0.3 && emotion.arousal < -0.3) {
      emotion.label = 'content';
    } else if (emotion.valence < -0.3 && emotion.arousal > 0.3) {
      emotion.label = 'angry';
    } else if (emotion.valence < -0.3 && emotion.arousal < -0.3) {
      emotion.label = 'sad';
    } else if (emotion.arousal > 0.5) {
      emotion.label = 'excited';
    } else if (emotion.arousal < -0.5) {
      emotion.label = 'calm';
    }
    
    return emotion;
  }
  
  processMusic(features) {
    // Process musical features
    const musicAnalysis = {
      pitch: features.basic.pitch,
      tempo: 60 + Math.random() * 120,
      melody: [],
      key: null,
      mode: Math.random() > 0.5 ? 'major' : 'minor'
    };
    
    // Extract melody (simplified)
    const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const melodyLength = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < melodyLength; i++) {
      musicAnalysis.melody.push({
        note: noteNames[Math.floor(Math.random() * noteNames.length)],
        duration: 250 + Math.random() * 500,
        velocity: Math.random()
      });
    }
    
    // Estimate key
    musicAnalysis.key = noteNames[Math.floor(Math.random() * noteNames.length)];
    
    return musicAnalysis;
  }
  
  identifySounds(features) {
    // Identify specific sounds
    const sounds = [];
    
    // Check for specific sound signatures
    const soundTypes = [
      { type: 'voice', threshold: 0.6 },
      { type: 'clap', threshold: 0.7 },
      { type: 'whistle', threshold: 0.8 },
      { type: 'bell', threshold: 0.75 },
      { type: 'footsteps', threshold: 0.5 }
    ];
    
    soundTypes.forEach(soundType => {
      if (Math.random() > soundType.threshold) {
        sounds.push({
          type: soundType.type,
          confidence: Math.random() * 0.3 + 0.6,
          timestamp: Date.now(),
          location: Math.random() > 0.5 ? 'left' : 'right' // Stereo position
        });
        
        this.stats.soundsIdentified++;
        this.emit('sound_identified', sounds[sounds.length - 1]);
      }
    });
    
    return sounds;
  }
  
  updateAttention(classification, emotion) {
    // Update auditory attention
    const attentionTargets = [];
    
    // Speech gets high attention
    if (classification.type === 'speech') {
      attentionTargets.push({
        type: 'speech',
        priority: classification.confidence,
        detail: classification.subtype
      });
      
      this.attention.speechTracking = true;
    } else {
      this.attention.speechTracking = false;
    }
    
    // Emotional sounds get attention
    if (emotion.intensity > 0.5) {
      attentionTargets.push({
        type: 'emotion',
        priority: emotion.intensity,
        detail: emotion.label
      });
    }
    
    // Music gets moderate attention
    if (classification.type === 'music') {
      attentionTargets.push({
        type: 'music',
        priority: classification.confidence * 0.7,
        detail: classification.subtype
      });
    }
    
    // Select highest priority
    if (attentionTargets.length > 0) {
      attentionTargets.sort((a, b) => b.priority - a.priority);
      this.attention.focus = attentionTargets[0];
      this.attention.interestingSounds = attentionTargets.slice(0, 3);
    }
  }
  
  listenFor(targetSound) {
    // Set up listening for specific sound
    console.log(`👂 Listening for: ${targetSound}`);
    this.attention.focus = {
      type: 'targeted',
      target: targetSound,
      priority: 1.0
    };
  }
  
  startProcessingLoop() {
    // Main audio processing loop
    setInterval(() => {
      if (this.isActive) {
        // Simulate continuous audio processing
        // In production, this would process actual audio stream
        this.processSample({
          amplitude: Math.random(),
          timestamp: Date.now()
        });
      }
    }, 100); // 10Hz processing
  }
  
  setSensitivity(sensitivity) {
    this.config.sensitivity = sensitivity;
    this.config.volumeThreshold = (1 - sensitivity) * 0.3;
  }
  
  getAuditoryState() {
    return {
      layers: this.layers,
      soundCategories: this.soundCategories,
      attention: this.attention,
      stats: this.stats,
      config: this.config
    };
  }
  
  async shutdown() {
    this.isActive = false;
    await this.stopMicrophone();
    this.audioBuffer = [];
    this.removeAllListeners();
  }
}

export default AuditoryCortex;