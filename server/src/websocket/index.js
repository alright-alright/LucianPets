import brainSync from './brainSync.js';
import odinStream from './odinStream.js';
import petInteraction from './petInteraction.js';

/**
 * Setup WebSocket handlers
 * @param {SocketIO.Server} io - Socket.io server
 * @param {Object} systems - Cognitive and sensory systems
 */
export const setupWebSocket = (io, systems) => {
  const { lucianSystem, odinSystem } = systems;
  
  // Track connected clients
  const clients = new Map();
  
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    
    // Track client
    clients.set(socket.id, {
      connectedAt: Date.now(),
      activePet: null,
      subscriptions: new Set()
    });
    
    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to LucianPets',
      socketId: socket.id,
      systems: {
        lucian: lucianSystem.isActive,
        odin: odinSystem.isActive
      }
    });
    
    // Setup brain synchronization
    brainSync(socket, lucianSystem, clients);
    
    // Setup ODIN streaming
    odinStream(socket, odinSystem, clients);
    
    // Setup pet interactions
    petInteraction(socket, lucianSystem, odinSystem, clients);
    
    // Handle subscriptions
    socket.on('subscribe', (channel) => {
      const client = clients.get(socket.id);
      if (client) {
        client.subscriptions.add(channel);
        socket.join(channel);
        console.log(`Client ${socket.id} subscribed to ${channel}`);
      }
    });
    
    socket.on('unsubscribe', (channel) => {
      const client = clients.get(socket.id);
      if (client) {
        client.subscriptions.delete(channel);
        socket.leave(channel);
        console.log(`Client ${socket.id} unsubscribed from ${channel}`);
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
      
      // Clean up client data
      const client = clients.get(socket.id);
      if (client) {
        // Leave all rooms
        client.subscriptions.forEach(channel => {
          socket.leave(channel);
        });
        
        clients.delete(socket.id);
      }
    });
    
    // Error handling
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });
  
  // Broadcast system events to clients
  
  // Lucian cognitive events
  lucianSystem.on('cognition', (data) => {
    io.to('brain_activity').emit('brain_activity', data);
  });
  
  lucianSystem.on('pattern_learned', (pattern) => {
    io.to('learning').emit('pattern_learned', pattern);
  });
  
  lucianSystem.on('memory_stored', (memory) => {
    io.to('memory').emit('memory_stored', memory);
  });
  
  lucianSystem.wonder.on('curiosity_triggered', (exploration) => {
    io.to('wonder').emit('curiosity_triggered', exploration);
  });
  
  lucianSystem.wonder.on('new_discovery', (discovery) => {
    io.to('wonder').emit('new_discovery', discovery);
  });
  
  lucianSystem.aetheron.on('identity_update', (identity) => {
    io.to('identity').emit('identity_update', identity);
  });
  
  // ODIN sensory events
  odinSystem.on('perception', (perception) => {
    io.to('perception').emit('perception', perception);
  });
  
  odinSystem.on('object_detected', (object) => {
    io.to('visual').emit('object_detected', object);
  });
  
  odinSystem.on('motion_detected', (motion) => {
    io.to('visual').emit('motion_detected', motion);
  });
  
  odinSystem.on('sound_identified', (sound) => {
    io.to('audio').emit('sound_identified', sound);
  });
  
  odinSystem.on('speech_detected', (speech) => {
    io.to('audio').emit('speech_detected', speech);
  });
  
  odinSystem.on('emotion_detected', (emotion) => {
    io.to('audio').emit('emotion_detected', emotion);
  });
  
  odinSystem.on('attention_shift', (focus) => {
    io.to('attention').emit('attention_shift', focus);
  });
  
  // System status broadcasting
  setInterval(() => {
    const status = {
      timestamp: Date.now(),
      clients: clients.size,
      lucian: {
        active: lucianSystem.isActive,
        metrics: lucianSystem.getMetrics()
      },
      odin: {
        active: odinSystem.isActive,
        state: odinSystem.getPerceptionState()
      }
    };
    
    io.to('status').emit('system_status', status);
  }, 5000); // Every 5 seconds
  
  console.log('🔌 WebSocket handlers configured');
};

export default setupWebSocket;