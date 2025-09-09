import express from 'express';
import petsRouter from './pets.js';
import cognitionRouter from './cognition.js';
import sensoryRouter from './sensory.js';
import healthRouter from './health.js';
import aiRouter from './ai.js';

/**
 * Setup all API routes
 * @param {Express} app - Express application
 * @param {Object} systems - Cognitive and sensory systems
 */
export const setupRoutes = (app, systems) => {
  const { lucianSystem, odinSystem } = systems;
  
  // API version prefix
  const apiPrefix = '/api/v1';
  
  // Health check
  app.use(`${apiPrefix}/health`, healthRouter);
  
  // Pet management routes
  app.use(`${apiPrefix}/pets`, petsRouter(lucianSystem));
  
  // Cognition routes
  app.use(`${apiPrefix}/cognition`, cognitionRouter(lucianSystem));
  
  // Sensory routes
  app.use(`${apiPrefix}/sensory`, sensoryRouter(odinSystem));
  
  // AI provider routes
  app.use(`${apiPrefix}/ai`, aiRouter);
  
  // Root API endpoint
  app.get('/api', (req, res) => {
    res.json({
      name: 'LucianPets API',
      version: '1.0.0',
      status: 'active',
      endpoints: {
        health: `${apiPrefix}/health`,
        pets: `${apiPrefix}/pets`,
        cognition: `${apiPrefix}/cognition`,
        sensory: `${apiPrefix}/sensory`,
        ai: `${apiPrefix}/ai`
      },
      systems: {
        lucian: lucianSystem.isActive ? 'active' : 'inactive',
        odin: odinSystem.isActive ? 'active' : 'inactive'
      },
      documentation: '/api/docs'
    });
  });
  
  // 404 handler for API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `API endpoint ${req.originalUrl} does not exist`,
      availableEndpoints: [
        '/api',
        `${apiPrefix}/health`,
        `${apiPrefix}/pets`,
        `${apiPrefix}/cognition`,
        `${apiPrefix}/sensory`
      ]
    });
  });
  
  console.log('📡 API routes configured');
};

export default setupRoutes;