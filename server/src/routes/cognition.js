import express from 'express';

/**
 * Cognition routes - Access to Lucian cognitive systems
 * @param {LucianCognitiveSystem} lucianSystem - The cognitive system
 */
const cognitionRouter = (lucianSystem) => {
  const router = express.Router();
  
  // GET /api/v1/cognition/state - Get current cognitive state
  router.get('/state', (req, res) => {
    const state = {
      active: lucianSystem.isActive,
      cognitiveState: lucianSystem.cognitiveState,
      metrics: lucianSystem.getMetrics(),
      timestamp: Date.now()
    };
    
    res.json(state);
  });
  
  // POST /api/v1/cognition/process - Process input through cognitive system
  router.post('/process', async (req, res) => {
    const { input, context, petId } = req.body;
    
    if (!input) {
      return res.status(400).json({
        error: 'Input is required for processing'
      });
    }
    
    try {
      // Process through SSP
      const symbols = lucianSystem.ssp.process(input);
      
      // Store in memory
      const memory = await lucianSystem.mpu.storeMemory({
        type: 'input',
        content: symbols,
        context,
        petId
      });
      
      // Learn patterns
      const learning = lucianSystem.hasr.processPattern(symbols);
      
      // Update identity
      lucianSystem.aetheron.integrate({
        symbols,
        learning: learning.learned,
        context
      });
      
      res.json({
        success: true,
        symbols: symbols.length,
        memoryId: memory.id,
        learned: learning.learned,
        resonance: learning.resonance
      });
      
    } catch (error) {
      console.error('Cognition processing error:', error);
      res.status(500).json({
        error: 'Failed to process input',
        message: error.message
      });
    }
  });
  
  // GET /api/v1/cognition/memories - Retrieve memories
  router.get('/memories', (req, res) => {
    const { query, limit = 10, type } = req.query;
    
    let memories;
    
    if (query) {
      memories = lucianSystem.mpu.retrieveMemory(query);
    } else {
      memories = lucianSystem.mpu.getRecentMemories(parseInt(limit));
    }
    
    res.json({
      count: memories.length,
      memories
    });
  });
  
  // GET /api/v1/cognition/personality - Get personality profile
  router.get('/personality', (req, res) => {
    const personality = lucianSystem.aetheron.getSelfDescription();
    
    res.json(personality);
  });
  
  // PUT /api/v1/cognition/parameters - Update brain parameters
  router.put('/parameters', (req, res) => {
    const { parameter, value } = req.body;
    
    if (!parameter || value === undefined) {
      return res.status(400).json({
        error: 'Parameter and value are required'
      });
    }
    
    try {
      // Update specific parameter
      switch(parameter) {
        case 'learning_rate':
          lucianSystem.hasr.setLearningRate(value);
          lucianSystem.cognitiveState.learning_rate = value;
          break;
        case 'curiosity':
          lucianSystem.wonder.setCuriosityLevel(value);
          lucianSystem.cognitiveState.curiosity = value;
          break;
        case 'memory_consolidation':
          lucianSystem.cognitiveState.memory_consolidation = value;
          break;
        default:
          if (parameter in lucianSystem.cognitiveState) {
            lucianSystem.cognitiveState[parameter] = value;
          } else {
            return res.status(400).json({
              error: 'Unknown parameter',
              parameter,
              availableParameters: Object.keys(lucianSystem.cognitiveState)
            });
          }
      }
      
      res.json({
        success: true,
        parameter,
        value,
        updatedState: lucianSystem.cognitiveState
      });
      
    } catch (error) {
      console.error('Parameter update error:', error);
      res.status(500).json({
        error: 'Failed to update parameter',
        message: error.message
      });
    }
  });
  
  // GET /api/v1/cognition/wonder - Get curiosity state
  router.get('/wonder', (req, res) => {
    const wonderState = {
      curiosityLevel: lucianSystem.wonder.getCuriosityLevel(),
      discoveries: lucianSystem.wonder.getDiscoveries(),
      explorationCount: lucianSystem.wonder.getExplorationCount(),
      topInterests: lucianSystem.wonder.getTopInterests(),
      suggestion: lucianSystem.wonder.suggestExploration()
    };
    
    res.json(wonderState);
  });
  
  // POST /api/v1/cognition/wonder/explore - Trigger exploration
  router.post('/wonder/explore', (req, res) => {
    const { symbols } = req.body;
    
    if (!symbols) {
      return res.status(400).json({
        error: 'Symbols are required for exploration'
      });
    }
    
    const exploration = lucianSystem.wonder.explore(symbols);
    
    res.json({
      success: true,
      exploration
    });
  });
  
  // GET /api/v1/cognition/patterns - Get learned patterns
  router.get('/patterns', (req, res) => {
    const patterns = {
      patternCount: lucianSystem.hasr.getPatternCount(),
      crystallizedCount: lucianSystem.ghostLoops.getCrystallizedCount(),
      activeLoops: lucianSystem.ghostLoops.getActiveLoops()
    };
    
    res.json(patterns);
  });
  
  // POST /api/v1/cognition/reflect - Trigger self-reflection
  router.post('/reflect', (req, res) => {
    lucianSystem.aetheron.reflect();
    
    const insights = lucianSystem.aetheron.generateInsights();
    const selfDescription = lucianSystem.aetheron.getSelfDescription();
    
    res.json({
      success: true,
      insights,
      selfDescription,
      coherence: lucianSystem.aetheron.getCoherence(),
      identityStrength: lucianSystem.aetheron.getIdentityStrength()
    });
  });
  
  return router;
};

export default cognitionRouter;