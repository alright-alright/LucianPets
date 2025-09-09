import express from 'express';
import AIProviderService from '../lib/aiProvider.js';

const router = express.Router();
const aiProvider = new AIProviderService();

// GET /api/v1/ai/status - Get AI provider status
router.get('/status', async (req, res) => {
  try {
    const status = aiProvider.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get AI status',
      message: error.message 
    });
  }
});

// POST /api/v1/ai/test - Test AI connection
router.post('/test', async (req, res) => {
  try {
    const result = await aiProvider.testConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: 'AI connection test failed',
      message: error.message 
    });
  }
});

// POST /api/v1/ai/switch - Switch AI provider
router.post('/switch', async (req, res) => {
  try {
    const { provider } = req.body;
    if (!['claude', 'openai', 'offline'].includes(provider)) {
      return res.status(400).json({ error: 'Invalid provider' });
    }
    
    const status = await aiProvider.switchProvider(provider);
    res.json(status);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to switch provider',
      message: error.message 
    });
  }
});

// POST /api/v1/ai/generate - Generate AI response
router.post('/generate', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt required' });
    }
    
    const response = await aiProvider.generateResponse(prompt, context);
    res.json(response);
  } catch (error) {
    res.status(500).json({ 
      error: 'Generation failed',
      message: error.message 
    });
  }
});

export { aiProvider };
export default router;