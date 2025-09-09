import express from 'express';

/**
 * Sensory routes - ODIN system control
 * @param {OdinSensorySystem} odinSystem - The sensory system
 */
const sensoryRouter = (odinSystem) => {
  const router = express.Router();
  
  // GET /api/v1/sensory/state - Get sensory system state
  router.get('/state', (req, res) => {
    const state = odinSystem.getPerceptionState();
    
    res.json(state);
  });
  
  // POST /api/v1/sensory/visual/start - Start camera
  router.post('/visual/start', async (req, res) => {
    const { deviceId } = req.body;
    
    try {
      await odinSystem.startCamera(deviceId);
      
      res.json({
        success: true,
        message: 'Camera started successfully',
        visual: odinSystem.perceptionState.visual
      });
      
    } catch (error) {
      console.error('Camera start error:', error);
      res.status(500).json({
        error: 'Failed to start camera',
        message: error.message
      });
    }
  });
  
  // POST /api/v1/sensory/visual/stop - Stop camera
  router.post('/visual/stop', async (req, res) => {
    try {
      await odinSystem.stopCamera();
      
      res.json({
        success: true,
        message: 'Camera stopped successfully'
      });
      
    } catch (error) {
      console.error('Camera stop error:', error);
      res.status(500).json({
        error: 'Failed to stop camera',
        message: error.message
      });
    }
  });
  
  // POST /api/v1/sensory/visual/frame - Process video frame
  router.post('/visual/frame', (req, res) => {
    const { frameData } = req.body;
    
    if (!frameData) {
      return res.status(400).json({
        error: 'Frame data is required'
      });
    }
    
    odinSystem.processVideoFrame(frameData);
    
    res.json({
      success: true,
      message: 'Frame processed',
      visual: odinSystem.perceptionState.visual
    });
  });
  
  // POST /api/v1/sensory/audio/start - Start microphone
  router.post('/audio/start', async (req, res) => {
    const { deviceId } = req.body;
    
    try {
      await odinSystem.startMicrophone(deviceId);
      
      res.json({
        success: true,
        message: 'Microphone started successfully',
        auditory: odinSystem.perceptionState.auditory
      });
      
    } catch (error) {
      console.error('Microphone start error:', error);
      res.status(500).json({
        error: 'Failed to start microphone',
        message: error.message
      });
    }
  });
  
  // POST /api/v1/sensory/audio/stop - Stop microphone
  router.post('/audio/stop', async (req, res) => {
    try {
      await odinSystem.stopMicrophone();
      
      res.json({
        success: true,
        message: 'Microphone stopped successfully'
      });
      
    } catch (error) {
      console.error('Microphone stop error:', error);
      res.status(500).json({
        error: 'Failed to stop microphone',
        message: error.message
      });
    }
  });
  
  // POST /api/v1/sensory/audio/sample - Process audio sample
  router.post('/audio/sample', (req, res) => {
    const { audioData } = req.body;
    
    if (!audioData) {
      return res.status(400).json({
        error: 'Audio data is required'
      });
    }
    
    odinSystem.processAudioSample(audioData);
    
    res.json({
      success: true,
      message: 'Audio sample processed',
      auditory: odinSystem.perceptionState.auditory
    });
  });
  
  // GET /api/v1/sensory/perception - Get current unified perception
  router.get('/perception', (req, res) => {
    const perception = {
      visual: odinSystem.perceptionState.visual,
      auditory: odinSystem.perceptionState.auditory,
      fusion: odinSystem.perceptionState.fusion,
      quality: odinSystem.calculatePerceptionQuality(),
      timestamp: Date.now()
    };
    
    res.json(perception);
  });
  
  // PUT /api/v1/sensory/config - Update sensory configuration
  router.put('/config', (req, res) => {
    const { 
      visualEnabled, 
      auditoryEnabled, 
      motionSensitivity, 
      audioSensitivity 
    } = req.body;
    
    if (visualEnabled !== undefined) {
      odinSystem.setVisualEnabled(visualEnabled);
    }
    
    if (auditoryEnabled !== undefined) {
      odinSystem.setAuditoryEnabled(auditoryEnabled);
    }
    
    if (motionSensitivity !== undefined) {
      odinSystem.setMotionSensitivity(motionSensitivity);
    }
    
    if (audioSensitivity !== undefined) {
      odinSystem.setAudioSensitivity(audioSensitivity);
    }
    
    res.json({
      success: true,
      config: odinSystem.config,
      message: 'Sensory configuration updated'
    });
  });
  
  // POST /api/v1/sensory/attention/focus - Direct attention
  router.post('/attention/focus', (req, res) => {
    const { target } = req.body;
    
    if (!target) {
      return res.status(400).json({
        error: 'Target is required for attention focus'
      });
    }
    
    odinSystem.lookAt(target);
    
    res.json({
      success: true,
      message: `Attention focused on ${target}`,
      attention: odinSystem.perceptionState.fusion.attentionFocus
    });
  });
  
  // POST /api/v1/sensory/listen - Listen for specific sound
  router.post('/listen', (req, res) => {
    const { sound } = req.body;
    
    if (!sound) {
      return res.status(400).json({
        error: 'Sound target is required'
      });
    }
    
    odinSystem.listenFor(sound);
    
    res.json({
      success: true,
      message: `Listening for ${sound}`
    });
  });
  
  // GET /api/v1/sensory/stats - Get sensory statistics
  router.get('/stats', (req, res) => {
    res.json(odinSystem.stats);
  });
  
  return router;
};

export default sensoryRouter;