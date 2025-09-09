import express from 'express';
import os from 'os';

const router = express.Router();

// GET /api/v1/health - Basic health check
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'LucianPets API'
  });
});

// GET /api/v1/health/detailed - Detailed health check
router.get('/detailed', (req, res) => {
  const memoryUsage = process.memoryUsage();
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: {
      process: process.uptime(),
      system: os.uptime()
    },
    memory: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
      external: Math.round(memoryUsage.external / 1024 / 1024) + ' MB',
      systemTotal: Math.round(os.totalmem() / 1024 / 1024) + ' MB',
      systemFree: Math.round(os.freemem() / 1024 / 1024) + ' MB'
    },
    cpu: {
      cores: os.cpus().length,
      model: os.cpus()[0].model,
      loadAverage: os.loadavg()
    },
    system: {
      platform: os.platform(),
      arch: os.arch(),
      version: os.release(),
      hostname: os.hostname()
    },
    node: {
      version: process.version,
      env: process.env.NODE_ENV || 'development'
    }
  });
});

export default router;