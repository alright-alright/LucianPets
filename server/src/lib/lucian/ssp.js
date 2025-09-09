import EventEmitter from 'events';

/**
 * Symbolic Signal Processing (SSP)
 * Converts raw signals into symbolic representations without tokenization
 * Core of Lucian's understanding system
 */
export class SSPComponent extends EventEmitter {
  constructor() {
    super();
    
    this.isActive = false;
    this.symbolSpace = new Map();
    this.bindingStrength = new Map();
    this.recentActivity = 0;
    this.symbolCounter = 0;
    this.bindingCounter = 0;
    
    // Symbol generation parameters
    this.config = {
      dimensions: 512,
      sparsity: 0.05,
      bindingThreshold: 0.3,
      decayRate: 0.99,
      noiseLevel: 0.01
    };
    
    // Activity tracking
    this.activityBuffer = [];
    this.maxBufferSize = 100;
  }
  
  async initialize() {
    console.log('📡 Initializing SSP Component...');
    
    // Initialize symbol space with base symbols
    this.initializeBaseSymbols();
    
    this.isActive = true;
    
    // Start decay process
    this.startDecayProcess();
    
    console.log('✅ SSP Component initialized');
  }
  
  initializeBaseSymbols() {
    // Create fundamental symbolic concepts
    const baseSymbols = [
      'self', 'other', 'food', 'play', 'rest', 'danger',
      'comfort', 'curiosity', 'affection', 'movement',
      'sound', 'light', 'touch', 'warmth', 'cold'
    ];
    
    baseSymbols.forEach(symbol => {
      this.symbolSpace.set(symbol, this.generateSymbolVector());
      this.symbolCounter++;
    });
  }
  
  generateSymbolVector() {
    // Generate sparse distributed representation
    const vector = new Float32Array(this.config.dimensions);
    const activeIndices = Math.floor(this.config.dimensions * this.config.sparsity);
    
    for (let i = 0; i < activeIndices; i++) {
      const idx = Math.floor(Math.random() * this.config.dimensions);
      vector[idx] = Math.random() * 2 - 1; // Random values between -1 and 1
    }
    
    return vector;
  }
  
  process(input) {
    // Convert input to symbolic representation
    const inputType = typeof input;
    let symbols = [];
    
    if (inputType === 'string') {
      symbols = this.processText(input);
    } else if (inputType === 'object') {
      symbols = this.processStructured(input);
    } else {
      symbols = this.processRaw(input);
    }
    
    // Update activity
    this.updateActivity(symbols.length);
    
    // Emit generated symbols
    this.emit('symbols_generated', symbols);
    
    return symbols;
  }
  
  processText(text) {
    // Process text into symbols (not tokens!)
    const concepts = this.extractConcepts(text);
    const symbols = [];
    
    concepts.forEach(concept => {
      if (!this.symbolSpace.has(concept)) {
        // Create new symbol for unknown concept
        this.symbolSpace.set(concept, this.generateSymbolVector());
        this.symbolCounter++;
      }
      
      symbols.push({
        concept,
        vector: this.symbolSpace.get(concept),
        strength: 1.0
      });
    });
    
    // Create bindings between co-occurring symbols
    this.createBindings(symbols);
    
    return symbols;
  }
  
  processStructured(data) {
    // Process structured data (like pet interactions)
    const symbols = [];
    
    Object.entries(data).forEach(([key, value]) => {
      const symbolKey = `${key}_${value}`;
      
      if (!this.symbolSpace.has(symbolKey)) {
        this.symbolSpace.set(symbolKey, this.generateSymbolVector());
        this.symbolCounter++;
      }
      
      symbols.push({
        concept: symbolKey,
        vector: this.symbolSpace.get(symbolKey),
        strength: 1.0,
        metadata: { key, value }
      });
    });
    
    this.createBindings(symbols);
    
    return symbols;
  }
  
  processRaw(data) {
    // Process raw numeric data
    const vector = this.generateSymbolVector();
    const symbol = {
      concept: `raw_${Date.now()}`,
      vector,
      strength: 1.0,
      raw: data
    };
    
    this.symbolSpace.set(symbol.concept, vector);
    this.symbolCounter++;
    
    return [symbol];
  }
  
  processPerception(perceptionData) {
    // Process sensory perception into symbols
    const { visual, auditory, timestamp } = perceptionData;
    const symbols = [];
    
    // Process visual data
    if (visual) {
      const visualSymbols = this.processVisual(visual);
      symbols.push(...visualSymbols);
    }
    
    // Process auditory data
    if (auditory) {
      const auditorySymbols = this.processAuditory(auditory);
      symbols.push(...auditorySymbols);
    }
    
    // Create cross-modal bindings
    if (symbols.length > 1) {
      this.createCrossModalBindings(symbols);
    }
    
    return symbols;
  }
  
  processVisual(visualData) {
    // Convert visual features to symbols
    const symbols = [];
    
    if (visualData.objects) {
      visualData.objects.forEach(obj => {
        const symbolKey = `visual_${obj.type}`;
        
        if (!this.symbolSpace.has(symbolKey)) {
          this.symbolSpace.set(symbolKey, this.generateSymbolVector());
          this.symbolCounter++;
        }
        
        symbols.push({
          concept: symbolKey,
          vector: this.symbolSpace.get(symbolKey),
          strength: obj.confidence || 1.0,
          modality: 'visual',
          details: obj
        });
      });
    }
    
    return symbols;
  }
  
  processAuditory(auditoryData) {
    // Convert auditory features to symbols
    const symbols = [];
    
    if (auditoryData.sounds) {
      auditoryData.sounds.forEach(sound => {
        const symbolKey = `audio_${sound.type}`;
        
        if (!this.symbolSpace.has(symbolKey)) {
          this.symbolSpace.set(symbolKey, this.generateSymbolVector());
          this.symbolCounter++;
        }
        
        symbols.push({
          concept: symbolKey,
          vector: this.symbolSpace.get(symbolKey),
          strength: sound.amplitude || 1.0,
          modality: 'auditory',
          details: sound
        });
      });
    }
    
    return symbols;
  }
  
  extractConcepts(text) {
    // Extract conceptual symbols from text (not word tokens!)
    const concepts = [];
    
    // Simple concept extraction - in production would be more sophisticated
    const lowerText = text.toLowerCase();
    
    // Check for known concepts
    const knownConcepts = ['play', 'food', 'sleep', 'happy', 'sad', 'love', 'pet', 'toy'];
    knownConcepts.forEach(concept => {
      if (lowerText.includes(concept)) {
        concepts.push(concept);
      }
    });
    
    // Extract emotional concepts
    if (lowerText.match(/[!?]+/)) {
      concepts.push('excitement');
    }
    
    // Extract action concepts
    const actions = ['feed', 'play', 'pet', 'teach'];
    actions.forEach(action => {
      if (lowerText.includes(action)) {
        concepts.push(`action_${action}`);
      }
    });
    
    // If no concepts found, create a unique one
    if (concepts.length === 0) {
      concepts.push(`unique_${Date.now()}`);
    }
    
    return concepts;
  }
  
  createBindings(symbols) {
    // Create associative bindings between co-occurring symbols
    for (let i = 0; i < symbols.length; i++) {
      for (let j = i + 1; j < symbols.length; j++) {
        const bindingKey = `${symbols[i].concept}_${symbols[j].concept}`;
        
        if (!this.bindingStrength.has(bindingKey)) {
          this.bindingStrength.set(bindingKey, 0);
          this.bindingCounter++;
        }
        
        // Strengthen binding
        const currentStrength = this.bindingStrength.get(bindingKey);
        this.bindingStrength.set(bindingKey, 
          Math.min(1, currentStrength + 0.1)
        );
      }
    }
  }
  
  createCrossModalBindings(symbols) {
    // Create special bindings between different sensory modalities
    const visualSymbols = symbols.filter(s => s.modality === 'visual');
    const auditorySymbols = symbols.filter(s => s.modality === 'auditory');
    
    visualSymbols.forEach(vSym => {
      auditorySymbols.forEach(aSym => {
        const bindingKey = `crossmodal_${vSym.concept}_${aSym.concept}`;
        
        if (!this.bindingStrength.has(bindingKey)) {
          this.bindingStrength.set(bindingKey, 0.5); // Start with moderate strength
          this.bindingCounter++;
        }
      });
    });
  }
  
  startDecayProcess() {
    // Gradually decay unused symbols and bindings
    setInterval(() => {
      // Decay binding strengths
      this.bindingStrength.forEach((strength, key) => {
        const newStrength = strength * this.config.decayRate;
        
        if (newStrength < 0.01) {
          // Remove very weak bindings
          this.bindingStrength.delete(key);
          this.bindingCounter--;
        } else {
          this.bindingStrength.set(key, newStrength);
        }
      });
      
      // Add noise for creativity
      this.addCreativeNoise();
      
    }, 1000); // Decay every second
  }
  
  addCreativeNoise() {
    // Add small random variations to promote creativity
    this.symbolSpace.forEach((vector, concept) => {
      for (let i = 0; i < vector.length; i++) {
        if (Math.random() < this.config.noiseLevel) {
          vector[i] += (Math.random() - 0.5) * 0.1;
          
          // Clamp values
          vector[i] = Math.max(-1, Math.min(1, vector[i]));
        }
      }
    });
  }
  
  updateActivity(symbolCount) {
    this.recentActivity = symbolCount;
    
    this.activityBuffer.push(symbolCount);
    if (this.activityBuffer.length > this.maxBufferSize) {
      this.activityBuffer.shift();
    }
  }
  
  getRecentActivity() {
    if (this.activityBuffer.length === 0) return 0;
    
    const sum = this.activityBuffer.reduce((a, b) => a + b, 0);
    return sum / this.activityBuffer.length / 10; // Normalize to 0-1
  }
  
  getSymbolCount() {
    return this.symbolCounter;
  }
  
  getBindingCount() {
    return this.bindingCounter;
  }
  
  findSimilarSymbols(targetSymbol, threshold = 0.7) {
    // Find symbols similar to target
    const similar = [];
    const targetVector = this.symbolSpace.get(targetSymbol);
    
    if (!targetVector) return similar;
    
    this.symbolSpace.forEach((vector, concept) => {
      if (concept !== targetSymbol) {
        const similarity = this.cosineSimilarity(targetVector, vector);
        
        if (similarity > threshold) {
          similar.push({ concept, similarity });
        }
      }
    });
    
    return similar.sort((a, b) => b.similarity - a.similarity);
  }
  
  cosineSimilarity(vec1, vec2) {
    // Calculate cosine similarity between vectors
    let dot = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dot += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }
    
    return dot / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }
  
  async shutdown() {
    this.isActive = false;
    this.removeAllListeners();
  }
}

export default SSPComponent;