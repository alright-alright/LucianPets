/**
 * Pet interaction WebSocket handler
 * Real-time pet interactions and responses
 */
const petInteraction = (socket, lucianSystem, odinSystem, clients) => {
  
  // Set active pet for client
  socket.on('pet:select', (petId) => {
    const client = clients.get(socket.id);
    if (client) {
      client.activePet = petId;
      socket.join(`pet_${petId}`);
      
      socket.emit('pet:selected', {
        petId,
        timestamp: Date.now()
      });
    }
  });
  
  // Real-time pet interaction
  socket.on('pet:interact', async (data) => {
    const { action, petId, details } = data;
    const client = clients.get(socket.id);
    
    if (!action || !petId) {
      socket.emit('pet:error', {
        error: 'Action and petId required'
      });
      return;
    }
    
    try {
      // Process interaction through cognitive system
      const response = await lucianSystem.processPetInteraction(action, petId);
      
      // If ODIN is active, process sensory response
      if (odinSystem.isActive) {
        // Trigger attention based on interaction
        if (action === 'play' || action === 'pet') {
          odinSystem.lookAt('user');
        }
      }
      
      // Store interaction memory
      await lucianSystem.mpu.storePetMemory(petId, {
        type: 'interaction',
        action,
        details,
        response,
        userId: socket.id,
        timestamp: Date.now()
      });
      
      // Send response to client
      socket.emit('pet:response', {
        action,
        response,
        animation: response.animation,
        vocalization: response.vocalization,
        emotion: response.emotion,
        timestamp: Date.now()
      });
      
      // Broadcast to others watching this pet
      socket.to(`pet_${petId}`).emit('pet:action_observed', {
        action,
        byUser: socket.id,
        response,
        timestamp: Date.now()
      });
      
    } catch (error) {
      socket.emit('pet:error', {
        error: 'Interaction failed',
        message: error.message
      });
    }
  });
  
  // Pet speaking/vocalizing
  socket.on('pet:speak', async (data) => {
    const { petId, message } = data;
    
    if (!petId) {
      socket.emit('pet:error', {
        error: 'PetId required'
      });
      return;
    }
    
    try {
      // Process speech through cognitive system
      const symbols = lucianSystem.ssp.process(message);
      
      // Generate appropriate response
      const response = await lucianSystem.generateResponse({
        type: 'speech',
        message,
        symbols,
        petId
      });
      
      // If ODIN is active, generate vocalization
      let vocalization = null;
      if (odinSystem.isActive && odinSystem.auditoryCortex) {
        vocalization = {
          type: response.vocalization || 'meow',
          emotion: response.emotion,
          pitch: Math.random() * 300 + 200,
          duration: 500 + Math.random() * 1000
        };
      }
      
      socket.emit('pet:vocalization', {
        petId,
        vocalization,
        emotion: response.emotion,
        timestamp: Date.now()
      });
      
      // Broadcast to room
      socket.to(`pet_${petId}`).emit('pet:vocalized', {
        petId,
        vocalization,
        byUser: socket.id,
        timestamp: Date.now()
      });
      
    } catch (error) {
      socket.emit('pet:error', {
        error: 'Speech processing failed',
        message: error.message
      });
    }
  });
  
  // Pet learning
  socket.on('pet:teach', async (data) => {
    const { petId, lesson, reinforcement } = data;
    
    if (!petId || !lesson) {
      socket.emit('pet:error', {
        error: 'PetId and lesson required'
      });
      return;
    }
    
    try {
      // Process learning through HASR
      const result = lucianSystem.hasr.learnPetBehavior(petId, {
        lesson,
        reinforcement: reinforcement || 'positive',
        timestamp: Date.now()
      });
      
      // Store learning memory
      await lucianSystem.mpu.storePetMemory(petId, {
        type: 'learning',
        lesson,
        learned: result.learned,
        resonance: result.resonance,
        timestamp: Date.now()
      });
      
      socket.emit('pet:learned', {
        petId,
        lesson,
        success: result.learned,
        resonance: result.resonance,
        message: result.learned ? 
          'Pet learned the lesson!' : 
          'Pet is still learning...',
        timestamp: Date.now()
      });
      
      // Notify others
      socket.to(`pet_${petId}`).emit('pet:learning_observed', {
        petId,
        lesson,
        byUser: socket.id,
        success: result.learned,
        timestamp: Date.now()
      });
      
    } catch (error) {
      socket.emit('pet:error', {
        error: 'Teaching failed',
        message: error.message
      });
    }
  });
  
  // Pet emotions
  socket.on('pet:emotion', (data) => {
    const { petId } = data;
    
    if (!petId) {
      socket.emit('pet:error', {
        error: 'PetId required'
      });
      return;
    }
    
    // Get current emotional state
    const emotionalState = {
      primary: lucianSystem.layers?.emotion || { label: 'content', intensity: 0.5 },
      personality: lucianSystem.aetheron.getSelfDescription().personality,
      mood: {
        happiness: Math.random() * 0.5 + 0.5,
        energy: Math.random() * 0.5 + 0.5,
        stress: Math.random() * 0.3
      },
      timestamp: Date.now()
    };
    
    socket.emit('pet:emotional_state', {
      petId,
      ...emotionalState
    });
  });
  
  // Pet memories
  socket.on('pet:remember', async (data) => {
    const { petId, query, limit = 10 } = data;
    
    if (!petId) {
      socket.emit('pet:error', {
        error: 'PetId required'
      });
      return;
    }
    
    try {
      let memories;
      
      if (query) {
        // Search for specific memories
        memories = lucianSystem.mpu.retrieveMemory({
          ...query,
          petId
        });
      } else {
        // Get recent memories
        memories = lucianSystem.mpu.getPetMemories(petId);
      }
      
      socket.emit('pet:memories', {
        petId,
        count: memories.length,
        memories: memories.slice(0, limit),
        timestamp: Date.now()
      });
      
    } catch (error) {
      socket.emit('pet:error', {
        error: 'Memory retrieval failed',
        message: error.message
      });
    }
  });
  
  // Pet personality update
  socket.on('pet:personality', async (data) => {
    const { petId, traits } = data;
    
    if (!petId || !traits) {
      socket.emit('pet:error', {
        error: 'PetId and traits required'
      });
      return;
    }
    
    try {
      // Update personality through Aetheron
      Object.entries(traits).forEach(([trait, value]) => {
        if (lucianSystem.aetheron.personalityDimensions[trait] !== undefined) {
          lucianSystem.aetheron.personalityDimensions[trait] = value;
        }
      });
      
      // Trigger self-reflection to integrate changes
      lucianSystem.aetheron.reflect();
      
      const updatedPersonality = lucianSystem.aetheron.getSelfDescription();
      
      socket.emit('pet:personality_updated', {
        petId,
        personality: updatedPersonality.personality,
        insights: lucianSystem.aetheron.generateInsights(),
        timestamp: Date.now()
      });
      
    } catch (error) {
      socket.emit('pet:error', {
        error: 'Personality update failed',
        message: error.message
      });
    }
  });
  
  // Real-time pet monitoring
  socket.on('pet:monitor:start', (petId) => {
    const client = clients.get(socket.id);
    if (client && petId) {
      client.monitoringPet = petId;
      
      // Start sending pet updates
      const monitorInterval = setInterval(() => {
        if (!client.monitoringPet || !clients.has(socket.id)) {
          clearInterval(monitorInterval);
          return;
        }
        
        // Compile pet state
        const petState = {
          cognitive: {
            awareness: lucianSystem.cognitiveState.awareness,
            curiosity: lucianSystem.cognitiveState.curiosity,
            learning: lucianSystem.cognitiveState.learning_rate
          },
          emotional: {
            mood: lucianSystem.layers?.emotion?.label || 'neutral',
            intensity: lucianSystem.layers?.emotion?.intensity || 0.5
          },
          sensory: odinSystem.isActive ? {
            seeing: odinSystem.perceptionState.visual.objects,
            hearing: odinSystem.perceptionState.auditory.sounds,
            attention: odinSystem.perceptionState.fusion.attentionFocus
          } : null,
          activity: {
            thinking: lucianSystem.stats.activeLoopCount > 0,
            exploring: lucianSystem.wonder.getCuriosityLevel() > 0.5,
            learning: lucianSystem.hasr.stats.patternsLearned
          },
          timestamp: Date.now()
        };
        
        socket.emit('pet:monitor:update', {
          petId,
          state: petState
        });
      }, 100); // 10Hz updates
    }
  });
  
  socket.on('pet:monitor:stop', () => {
    const client = clients.get(socket.id);
    if (client) {
      client.monitoringPet = null;
    }
  });
};

export default petInteraction;