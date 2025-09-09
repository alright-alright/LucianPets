/**
 * ODIN sensory streaming WebSocket handler
 * Real-time sensory data streaming from webcam/microphone
 */
const odinStream = (socket, odinSystem, clients) => {
  
  // Start ODIN sensory streaming
  socket.on('odin:start', async (config) => {
    const { video, audio, deviceIds } = config;
    
    try {
      if (video) {
        await odinSystem.startCamera(deviceIds?.video);
        socket.join('visual');
      }
      
      if (audio) {
        await odinSystem.startMicrophone(deviceIds?.audio);
        socket.join('audio');
      }
      
      socket.join('perception');
      
      socket.emit('odin:started', {
        video: video && odinSystem.perceptionState.visual.active,
        audio: audio && odinSystem.perceptionState.auditory.active,
        timestamp: Date.now()
      });
      
    } catch (error) {
      socket.emit('odin:error', {
        error: 'Failed to start ODIN',
        message: error.message
      });
    }
  });
  
  // Stop ODIN sensory streaming
  socket.on('odin:stop', async (config) => {
    const { video, audio } = config;
    
    try {
      if (video) {
        await odinSystem.stopCamera();
        socket.leave('visual');
      }
      
      if (audio) {
        await odinSystem.stopMicrophone();
        socket.leave('audio');
      }
      
      if (!video && !audio) {
        socket.leave('perception');
      }
      
      socket.emit('odin:stopped', {
        video: !video || !odinSystem.perceptionState.visual.active,
        audio: !audio || !odinSystem.perceptionState.auditory.active,
        timestamp: Date.now()
      });
      
    } catch (error) {
      socket.emit('odin:error', {
        error: 'Failed to stop ODIN',
        message: error.message
      });
    }
  });
  
  // Process video frame from client
  socket.on('odin:video:frame', (frameData) => {
    if (!frameData) return;
    
    // Process frame through visual cortex
    odinSystem.processVideoFrame(frameData);
    
    // Send back processed visual data
    socket.emit('odin:video:processed', {
      objects: odinSystem.perceptionState.visual.objects,
      motion: odinSystem.perceptionState.visual.motion,
      attention: odinSystem.perceptionState.visual.attention,
      timestamp: Date.now()
    });
  });
  
  // Process audio sample from client
  socket.on('odin:audio:sample', (audioData) => {
    if (!audioData) return;
    
    // Process audio through auditory cortex
    odinSystem.processAudioSample(audioData);
    
    // Send back processed audio data
    socket.emit('odin:audio:processed', {
      sounds: odinSystem.perceptionState.auditory.sounds,
      speech: odinSystem.perceptionState.auditory.speech,
      emotion: odinSystem.perceptionState.auditory.emotion,
      volume: odinSystem.perceptionState.auditory.volume,
      timestamp: Date.now()
    });
  });
  
  // Get current perception state
  socket.on('odin:get_state', () => {
    socket.emit('odin:state', odinSystem.getPerceptionState());
  });
  
  // Update ODIN configuration
  socket.on('odin:config', (config) => {
    const { 
      visualEnabled, 
      auditoryEnabled, 
      motionSensitivity, 
      audioSensitivity 
    } = config;
    
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
    
    socket.emit('odin:config_updated', {
      config: odinSystem.config,
      timestamp: Date.now()
    });
  });
  
  // Direct attention control
  socket.on('odin:attention:focus', (target) => {
    odinSystem.lookAt(target);
    
    socket.emit('odin:attention:focused', {
      target,
      attention: odinSystem.perceptionState.fusion.attentionFocus,
      timestamp: Date.now()
    });
  });
  
  // Listen for specific sounds
  socket.on('odin:listen', (sound) => {
    odinSystem.listenFor(sound);
    
    socket.emit('odin:listening', {
      target: sound,
      timestamp: Date.now()
    });
  });
  
  // Stream visual layer data
  socket.on('odin:visual:layers', () => {
    if (odinSystem.visualCortex) {
      socket.emit('odin:visual:layers_data', {
        layers: odinSystem.visualCortex.layers,
        attention: odinSystem.visualCortex.attention,
        stats: odinSystem.visualCortex.stats,
        timestamp: Date.now()
      });
    }
  });
  
  // Stream auditory layer data
  socket.on('odin:audio:layers', () => {
    if (odinSystem.auditoryCortex) {
      socket.emit('odin:audio:layers_data', {
        layers: odinSystem.auditoryCortex.layers,
        soundCategories: odinSystem.auditoryCortex.soundCategories,
        attention: odinSystem.auditoryCortex.attention,
        stats: odinSystem.auditoryCortex.stats,
        timestamp: Date.now()
      });
    }
  });
  
  // Stream fusion data
  socket.on('odin:fusion:state', () => {
    if (odinSystem.sensoryFusion) {
      socket.emit('odin:fusion:state_data', 
        odinSystem.sensoryFusion.getFusionState()
      );
    }
  });
  
  // Real-time perception streaming
  socket.on('odin:stream:start', () => {
    const client = clients.get(socket.id);
    if (client) {
      client.streamingPerception = true;
      
      // Start streaming perception data
      const streamInterval = setInterval(() => {
        if (!client.streamingPerception || !clients.has(socket.id)) {
          clearInterval(streamInterval);
          return;
        }
        
        const perception = {
          visual: odinSystem.perceptionState.visual,
          auditory: odinSystem.perceptionState.auditory,
          fusion: odinSystem.perceptionState.fusion,
          quality: odinSystem.calculatePerceptionQuality(),
          timestamp: Date.now()
        };
        
        socket.emit('odin:stream:data', perception);
      }, 100); // 10Hz streaming
    }
  });
  
  socket.on('odin:stream:stop', () => {
    const client = clients.get(socket.id);
    if (client) {
      client.streamingPerception = false;
    }
  });
};

export default odinStream;