/**
 * Brain synchronization WebSocket handler
 * Real-time brain activity monitoring and parameter updates
 */
const brainSync = (socket, lucianSystem, clients) => {
  
  // Subscribe to brain activity
  socket.on('brain:subscribe', () => {
    socket.join('brain_activity');
    
    // Send current state
    socket.emit('brain:state', {
      cognitiveState: lucianSystem.cognitiveState,
      metrics: lucianSystem.getMetrics(),
      timestamp: Date.now()
    });
  });
  
  // Update brain parameters
  socket.on('brain:update', async (data) => {
    const { parameter, value } = data;
    
    if (!parameter || value === undefined) {
      socket.emit('brain:error', {
        error: 'Parameter and value required'
      });
      return;
    }
    
    try {
      // Update the parameter
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
          }
      }
      
      // Notify all clients about the change
      socket.to('brain_activity').emit('brain:parameter_changed', {
        parameter,
        value,
        updatedBy: socket.id,
        timestamp: Date.now()
      });
      
      socket.emit('brain:update_success', {
        parameter,
        value,
        state: lucianSystem.cognitiveState
      });
      
    } catch (error) {
      socket.emit('brain:error', {
        error: 'Failed to update parameter',
        message: error.message
      });
    }
  });
  
  // Get specific component states
  socket.on('brain:get_component', (component) => {
    let data = null;
    
    switch(component) {
      case 'ssp':
        data = {
          active: lucianSystem.ssp.isActive,
          symbols: lucianSystem.ssp.getSymbolCount(),
          bindings: lucianSystem.ssp.getBindingCount(),
          recentActivity: lucianSystem.ssp.getRecentActivity()
        };
        break;
      case 'mpu':
        data = {
          active: lucianSystem.mpu.isActive,
          memories: lucianSystem.mpu.getMemoryCount(),
          retention: lucianSystem.mpu.getRetentionRate(),
          recent: lucianSystem.mpu.getRecentMemories(5)
        };
        break;
      case 'hasr':
        data = {
          active: lucianSystem.hasr.isActive,
          patterns: lucianSystem.hasr.getPatternCount(),
          learningRate: lucianSystem.hasr.getLearningRate()
        };
        break;
      case 'wonder':
        data = {
          active: lucianSystem.wonder.isActive,
          curiosity: lucianSystem.wonder.getCuriosityLevel(),
          discoveries: lucianSystem.wonder.getDiscoveries().length,
          explorations: lucianSystem.wonder.getExplorationCount()
        };
        break;
      case 'ghost_loops':
        data = {
          active: lucianSystem.ghostLoops.isActive,
          crystallized: lucianSystem.ghostLoops.getCrystallizedCount(),
          activeLoops: lucianSystem.ghostLoops.getActiveLoops()
        };
        break;
      case 'aetheron':
        data = {
          active: lucianSystem.aetheron.isActive,
          coherence: lucianSystem.aetheron.getCoherence(),
          identity: lucianSystem.aetheron.getIdentityStrength(),
          description: lucianSystem.aetheron.getSelfDescription()
        };
        break;
    }
    
    socket.emit('brain:component_data', {
      component,
      data,
      timestamp: Date.now()
    });
  });
  
  // Trigger specific cognitive actions
  socket.on('brain:action', async (action) => {
    try {
      let result = null;
      
      switch(action.type) {
        case 'reflect':
          lucianSystem.aetheron.reflect();
          result = {
            insights: lucianSystem.aetheron.generateInsights(),
            coherence: lucianSystem.aetheron.getCoherence()
          };
          break;
        case 'consolidate':
          await lucianSystem.mpu.consolidateMemories();
          result = {
            consolidated: true,
            memoryCount: lucianSystem.mpu.getMemoryCount()
          };
          break;
        case 'explore':
          const exploration = lucianSystem.wonder.explore(action.symbols || []);
          result = { exploration };
          break;
      }
      
      socket.emit('brain:action_result', {
        action: action.type,
        result,
        timestamp: Date.now()
      });
      
    } catch (error) {
      socket.emit('brain:error', {
        error: 'Action failed',
        action: action.type,
        message: error.message
      });
    }
  });
  
  // Real-time brain monitoring
  socket.on('brain:monitor:start', () => {
    const client = clients.get(socket.id);
    if (client) {
      client.monitoring = true;
      
      // Start sending regular updates
      const monitorInterval = setInterval(() => {
        if (!client.monitoring || !clients.has(socket.id)) {
          clearInterval(monitorInterval);
          return;
        }
        
        socket.emit('brain:monitor:update', {
          state: lucianSystem.cognitiveState,
          metrics: lucianSystem.getMetrics(),
          timestamp: Date.now()
        });
      }, 100); // 10Hz updates
    }
  });
  
  socket.on('brain:monitor:stop', () => {
    const client = clients.get(socket.id);
    if (client) {
      client.monitoring = false;
    }
  });
};

export default brainSync;