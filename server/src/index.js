import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import dotenv from 'dotenv';
import { findAvailablePort, getServerInfo } from './utils/portDetection.js';
import { setupRoutes } from './routes/index.js';
import { setupWebSocket } from './websocket/index.js';
import { LucianCognitiveSystem } from './lib/lucian/index.js';
import { OdinSensorySystem } from './lib/odin/index.js';

dotenv.config();

class LucianPetsServer {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketServer(this.server, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.FRONTEND_URL 
          : ["http://localhost:3000", "http://localhost:5173", "http://localhost:4173"],
        methods: ["GET", "POST"]
      }
    });
    
    // Initialize cognitive systems
    this.lucianSystem = new LucianCognitiveSystem();
    this.odinSystem = new OdinSensorySystem();
    
    this.port = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      // Smart port detection
      this.port = await findAvailablePort([8000, 8001, 8002, 8080, 3001, 5000]);
      
      // Setup middleware
      this.setupMiddleware();
      
      // Setup routes
      this.setupRoutes();
      
      // Setup WebSocket
      this.setupWebSocket();
      
      // Initialize cognitive systems
      await this.initializeCognitiveSystems();
      
      this.isInitialized = true;
      
      console.log('🧠 LucianPets Server initialized successfully');
      console.log(`📡 Server will start on port ${this.port}`);
      
    } catch (error) {
      console.error('❌ Failed to initialize server:', error);
      throw error;
    }
  }

  setupMiddleware() {
    // Security
    this.app.use(helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production'
    }));
    
    // CORS
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : true,
      credentials: true
    }));
    
    // Compression
    this.app.use(compression());
    
    // Logging
    this.app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
    
    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Static files for uploaded content
    this.app.use('/uploads', express.static('uploads'));
  }

  setupRoutes() {
    setupRoutes(this.app, {
      lucianSystem: this.lucianSystem,
      odinSystem: this.odinSystem
    });
  }

  setupWebSocket() {
    setupWebSocket(this.io, {
      lucianSystem: this.lucianSystem,
      odinSystem: this.odinSystem
    });
  }

  async initializeCognitiveSystems() {
    console.log('🧠 Initializing Lucian Cognitive System...');
    await this.lucianSystem.initialize();
    
    console.log('👁️ Initializing ODIN Sensory System...');
    await this.odinSystem.initialize();
    
    // Connect systems
    this.odinSystem.on('perception', (perceptionData) => {
      this.lucianSystem.processPerception(perceptionData);
    });
    
    this.lucianSystem.on('cognition', (cognitionData) => {
      this.io.emit('brain_activity', cognitionData);
    });
  }

  async start() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      this.server.listen(this.port, (error) => {
        if (error) {
          console.error('❌ Failed to start server:', error);
          reject(error);
          return;
        }

        const serverInfo = getServerInfo(this.port);
        
        console.log('🚀 LucianPets Server Started Successfully!');
        console.log('═══════════════════════════════════════');
        console.log(`🌐 Server URL: ${serverInfo.url}`);
        console.log(`📡 Port: ${this.port}`);
        console.log(`🔌 WebSocket: ws://localhost:${this.port}`);
        console.log(`🧠 Lucian System: ${this.lucianSystem.isActive ? 'Active' : 'Inactive'}`);
        console.log(`👁️ ODIN System: ${this.odinSystem.isActive ? 'Active' : 'Inactive'}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log('═══════════════════════════════════════');
        console.log('🐾 Ready for LucianPets connections!');
        
        resolve(serverInfo);
      });
    });
  }

  async stop() {
    console.log('🛑 Shutting down LucianPets Server...');
    
    // Cleanup cognitive systems
    await this.lucianSystem.shutdown();
    await this.odinSystem.shutdown();
    
    // Close server
    this.server.close();
    
    console.log('✅ Server shut down gracefully');
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📡 Received SIGTERM, shutting down gracefully...');
  if (global.lucianPetsServer) {
    await global.lucianPetsServer.stop();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📡 Received SIGINT, shutting down gracefully...');
  if (global.lucianPetsServer) {
    await global.lucianPetsServer.stop();
  }
  process.exit(0);
});

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new LucianPetsServer();
  global.lucianPetsServer = server;
  
  server.start().catch(error => {
    console.error('💥 Failed to start LucianPets Server:', error);
    process.exit(1);
  });
}

export { LucianPetsServer };
export default LucianPetsServer;
