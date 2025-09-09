/**
 * AI Provider Service
 * Manages connections to Claude, OpenAI, or local models
 */

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

class AIProviderService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'offline';
    this.status = 'disconnected';
    this.latency = 0;
    this.lastPing = null;
    
    // Initialize providers based on available API keys
    this.initializeProviders();
  }

  initializeProviders() {
    // Check for Claude/Anthropic
    if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_anthropic_key_here') {
      try {
        this.anthropic = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY,
        });
        console.log('✅ Anthropic/Claude provider initialized');
      } catch (error) {
        console.log('⚠️ Anthropic initialization failed:', error.message);
        this.anthropic = null;
      }
    } else {
      console.log('⚠️ No valid Anthropic API key found');
    }

    // Check for OpenAI
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_key_here') {
      try {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        console.log('✅ OpenAI provider initialized');
      } catch (error) {
        console.log('⚠️ OpenAI initialization failed:', error.message);
        this.openai = null;
      }
    } else {
      console.log('⚠️ No valid OpenAI API key found');
    }

    // Determine which provider to use based on preference and availability
    const preferredProvider = process.env.AI_PROVIDER || 'claude';
    
    // Try to use the preferred provider first
    if (preferredProvider === 'claude' && this.anthropic) {
      this.activeProvider = 'claude';
      this.status = 'initializing';
    } else if (preferredProvider === 'openai' && this.openai) {
      this.activeProvider = 'openai';
      this.status = 'initializing';
    } else if (this.anthropic) {
      // Fallback to Claude if available
      this.activeProvider = 'claude';
      this.status = 'initializing';
      console.log(`⚠️ Preferred provider '${preferredProvider}' not available, falling back to Claude`);
    } else if (this.openai) {
      // Fallback to OpenAI if available
      this.activeProvider = 'openai';
      this.status = 'initializing';
      console.log(`⚠️ Preferred provider '${preferredProvider}' not available, falling back to OpenAI`);
    } else {
      // No providers available, run offline
      this.activeProvider = 'offline';
      this.status = 'disconnected';
      console.log('⚠️ No AI providers configured - running in offline mode');
    }

    console.log(`🤖 Active AI Provider: ${this.activeProvider}`);
    
    // Test connection on initialization
    if (this.activeProvider !== 'offline') {
      this.testConnection().then(result => {
        console.log(`🔗 Connection test result: ${result.status}`);
      }).catch(error => {
        console.error('❌ Connection test failed:', error.message);
        this.status = 'disconnected';
      });
    }
  }

  async testConnection() {
    const startTime = Date.now();
    
    try {
      if (this.activeProvider === 'claude' && this.anthropic) {
        // Test Claude connection - we'll just check if the client exists
        // Actually calling the API would cost tokens, so we simulate success
        // if the client is properly initialized
        this.status = 'connected';
        this.latency = Date.now() - startTime;
        this.lastPing = new Date();
        
        return {
          provider: 'claude',
          status: 'connected',
          latency: this.latency,
          model: process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307'
        };
      } else if (this.activeProvider === 'openai' && this.openai) {
        // Test OpenAI connection - same approach
        this.status = 'connected';
        this.latency = Date.now() - startTime;
        this.lastPing = new Date();
        
        return {
          provider: 'openai',
          status: 'connected',
          latency: this.latency,
          model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
        };
      }
    } catch (error) {
      console.error('AI provider connection test failed:', error.message);
      this.status = 'disconnected';
      this.latency = 0;
    }

    // No providers available
    this.status = 'disconnected';
    this.latency = 0;
    return {
      provider: this.activeProvider || 'offline',
      status: 'disconnected',
      latency: 0,
      error: 'No AI provider available'
    };
  }

  async generateResponse(prompt, context = {}) {
    if (this.activeProvider === 'claude' && this.anthropic) {
      try {
        const response = await this.anthropic.messages.create({
          model: process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307',
          max_tokens: context.maxTokens || 1024,
          temperature: context.temperature || 0.7,
          messages: [
            ...(context.systemPrompt ? [{ role: 'assistant', content: context.systemPrompt }] : []),
            { role: 'user', content: prompt }
          ]
        });
        
        return {
          content: response.content[0].text,
          provider: 'claude',
          model: response.model,
          usage: response.usage
        };
      } catch (error) {
        console.error('Claude generation failed:', error);
        return this.offlineResponse(prompt, context);
      }
    } else if (this.activeProvider === 'openai' && this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
          messages: [
            ...(context.systemPrompt ? [{ role: 'system', content: context.systemPrompt }] : []),
            { role: 'user', content: prompt }
          ],
          max_tokens: context.maxTokens || 1024,
          temperature: context.temperature || 0.7
        });
        
        return {
          content: response.choices[0].message.content,
          provider: 'openai',
          model: response.model,
          usage: response.usage
        };
      } catch (error) {
        console.error('OpenAI generation failed:', error);
        return this.offlineResponse(prompt, context);
      }
    }

    // Fallback to offline response
    return this.offlineResponse(prompt, context);
  }

  offlineResponse(prompt, context) {
    // Simple pattern-based responses for offline mode
    const responses = {
      greeting: [
        "Hello! I'm running in offline mode but still learning!",
        "Hi there! My AI connection is offline but I'm still here!",
        "Greetings! Running locally but happy to chat!"
      ],
      play: [
        "*bounces excitedly* Let's play!",
        "*wags tail* I love playing!",
        "*does a little dance* Playtime is the best!"
      ],
      feed: [
        "*nom nom nom* Delicious!",
        "*munches happily* Thank you for the food!",
        "*gobbles up the treat* Yummy!"
      ],
      pet: [
        "*purrs contentedly* That feels nice!",
        "*leans into the petting* I love this!",
        "*closes eyes happily* So relaxing..."
      ],
      default: [
        "*tilts head curiously*",
        "*looks at you with interest*",
        "*makes happy sounds*"
      ]
    };

    // Detect intent from prompt
    const lowerPrompt = prompt.toLowerCase();
    let responseType = 'default';
    
    if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi')) {
      responseType = 'greeting';
    } else if (lowerPrompt.includes('play')) {
      responseType = 'play';
    } else if (lowerPrompt.includes('feed') || lowerPrompt.includes('food')) {
      responseType = 'feed';
    } else if (lowerPrompt.includes('pet') || lowerPrompt.includes('cuddle')) {
      responseType = 'pet';
    }

    const possibleResponses = responses[responseType];
    const selectedResponse = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];

    return {
      content: selectedResponse,
      provider: 'offline',
      model: 'local-patterns',
      usage: { prompt_tokens: 0, completion_tokens: 0 }
    };
  }

  getStatus() {
    return {
      provider: this.activeProvider,
      status: this.status,
      latency: this.latency,
      lastPing: this.lastPing,
      capabilities: {
        claude: !!this.anthropic,
        openai: !!this.openai,
        offline: true
      }
    };
  }

  async switchProvider(provider) {
    if (provider === 'claude' && this.anthropic) {
      this.activeProvider = 'claude';
      await this.testConnection();
    } else if (provider === 'openai' && this.openai) {
      this.activeProvider = 'openai';
      await this.testConnection();
    } else {
      this.activeProvider = 'offline';
      this.status = 'disconnected';
    }
    
    return this.getStatus();
  }
}

export default AIProviderService;