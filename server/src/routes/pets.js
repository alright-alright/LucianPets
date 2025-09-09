import express from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Pet management routes
 * @param {LucianCognitiveSystem} lucianSystem - The cognitive system
 */
const petsRouter = (lucianSystem) => {
  const router = express.Router();
  
  // In-memory pet storage (in production, use database)
  const pets = new Map();
  
  // Default pet
  const defaultPet = {
    id: 'default_pet',
    name: 'Zara',
    species: 'cat',
    created: new Date().toISOString(),
    personality: {
      playfulness: 0.7,
      curiosity: 0.8,
      affection: 0.6,
      independence: 0.5
    },
    stats: {
      happiness: 85,
      energy: 72,
      intelligence: 68,
      bonding: 91
    },
    memories: [],
    lastInteraction: new Date().toISOString()
  };
  
  pets.set(defaultPet.id, defaultPet);
  
  // GET /api/v1/pets - List all pets
  router.get('/', (req, res) => {
    const petList = Array.from(pets.values());
    res.json({
      count: petList.length,
      pets: petList
    });
  });
  
  // GET /api/v1/pets/:id - Get specific pet
  router.get('/:id', (req, res) => {
    const pet = pets.get(req.params.id);
    
    if (!pet) {
      return res.status(404).json({
        error: 'Pet not found',
        id: req.params.id
      });
    }
    
    // Get pet's memories from cognitive system
    const memories = lucianSystem.mpu.getPetMemories(pet.id);
    pet.memories = memories.slice(-10); // Last 10 memories
    
    res.json(pet);
  });
  
  // POST /api/v1/pets - Create new pet
  router.post('/', (req, res) => {
    const { name, species, personality, hybridTraits } = req.body;
    
    if (!name) {
      return res.status(400).json({
        error: 'Pet name is required'
      });
    }
    
    const newPet = {
      id: uuidv4(),
      name,
      species: species || 'hybrid',
      created: new Date().toISOString(),
      personality: personality || {
        playfulness: 0.5,
        curiosity: 0.5,
        affection: 0.5,
        independence: 0.5
      },
      hybridTraits: hybridTraits || {},
      stats: {
        happiness: 50,
        energy: 100,
        intelligence: 50,
        bonding: 0
      },
      memories: [],
      lastInteraction: new Date().toISOString()
    };
    
    pets.set(newPet.id, newPet);
    
    // Initialize pet in cognitive system
    lucianSystem.aetheron.setName(name);
    lucianSystem.hasr.initializePetProfile(newPet.id);
    
    res.status(201).json({
      message: 'Pet created successfully',
      pet: newPet
    });
  });
  
  // PUT /api/v1/pets/:id - Update pet
  router.put('/:id', (req, res) => {
    const pet = pets.get(req.params.id);
    
    if (!pet) {
      return res.status(404).json({
        error: 'Pet not found',
        id: req.params.id
      });
    }
    
    // Update allowed fields
    const { name, personality, stats } = req.body;
    
    if (name) pet.name = name;
    if (personality) pet.personality = { ...pet.personality, ...personality };
    if (stats) pet.stats = { ...pet.stats, ...stats };
    
    pet.lastInteraction = new Date().toISOString();
    
    pets.set(pet.id, pet);
    
    res.json({
      message: 'Pet updated successfully',
      pet
    });
  });
  
  // DELETE /api/v1/pets/:id - Remove pet
  router.delete('/:id', (req, res) => {
    if (!pets.has(req.params.id)) {
      return res.status(404).json({
        error: 'Pet not found',
        id: req.params.id
      });
    }
    
    // Don't allow deleting the default pet
    if (req.params.id === 'default_pet') {
      return res.status(400).json({
        error: 'Cannot delete the default pet'
      });
    }
    
    pets.delete(req.params.id);
    
    res.json({
      message: 'Pet deleted successfully',
      id: req.params.id
    });
  });
  
  // POST /api/v1/pets/:id/interact - Interact with pet
  router.post('/:id/interact', async (req, res) => {
    const pet = pets.get(req.params.id);
    
    if (!pet) {
      return res.status(404).json({
        error: 'Pet not found',
        id: req.params.id
      });
    }
    
    const { action, data } = req.body;
    
    if (!action) {
      return res.status(400).json({
        error: 'Action is required'
      });
    }
    
    try {
      // Process interaction through cognitive system
      const response = await lucianSystem.processPetInteraction(action, pet.id);
      
      // Update pet stats based on interaction
      switch(action) {
        case 'feed':
          pet.stats.happiness = Math.min(100, pet.stats.happiness + 10);
          pet.stats.energy = Math.min(100, pet.stats.energy + 20);
          break;
        case 'play':
          pet.stats.happiness = Math.min(100, pet.stats.happiness + 15);
          pet.stats.energy = Math.max(0, pet.stats.energy - 10);
          pet.stats.bonding = Math.min(100, pet.stats.bonding + 5);
          break;
        case 'pet':
          pet.stats.happiness = Math.min(100, pet.stats.happiness + 5);
          pet.stats.bonding = Math.min(100, pet.stats.bonding + 10);
          break;
        case 'teach':
          pet.stats.intelligence = Math.min(100, pet.stats.intelligence + 3);
          pet.stats.energy = Math.max(0, pet.stats.energy - 5);
          break;
      }
      
      pet.lastInteraction = new Date().toISOString();
      pets.set(pet.id, pet);
      
      // Store memory of interaction
      await lucianSystem.mpu.storePetMemory(pet.id, {
        type: 'interaction',
        action,
        data,
        response,
        timestamp: Date.now()
      });
      
      res.json({
        success: true,
        action,
        response,
        updatedStats: pet.stats
      });
      
    } catch (error) {
      console.error('Interaction error:', error);
      res.status(500).json({
        error: 'Failed to process interaction',
        message: error.message
      });
    }
  });
  
  // GET /api/v1/pets/:id/memories - Get pet memories
  router.get('/:id/memories', (req, res) => {
    const pet = pets.get(req.params.id);
    
    if (!pet) {
      return res.status(404).json({
        error: 'Pet not found',
        id: req.params.id
      });
    }
    
    const limit = parseInt(req.query.limit) || 50;
    const memories = lucianSystem.mpu.getPetMemories(pet.id);
    
    res.json({
      petId: pet.id,
      count: memories.length,
      memories: memories.slice(-limit).reverse() // Most recent first
    });
  });
  
  // POST /api/v1/pets/:id/train - Train pet behavior
  router.post('/:id/train', async (req, res) => {
    const pet = pets.get(req.params.id);
    
    if (!pet) {
      return res.status(404).json({
        error: 'Pet not found',
        id: req.params.id
      });
    }
    
    const { behavior, reward } = req.body;
    
    if (!behavior) {
      return res.status(400).json({
        error: 'Behavior to train is required'
      });
    }
    
    try {
      // Train through HASR learning system
      const result = lucianSystem.hasr.learnPetBehavior(pet.id, {
        behavior,
        reward: reward || 'positive',
        timestamp: Date.now()
      });
      
      // Update intelligence based on learning
      if (result.learned) {
        pet.stats.intelligence = Math.min(100, pet.stats.intelligence + 1);
      }
      
      pets.set(pet.id, pet);
      
      res.json({
        success: true,
        learned: result.learned,
        resonance: result.resonance,
        message: `Pet ${result.learned ? 'learned' : 'is learning'} the behavior`
      });
      
    } catch (error) {
      console.error('Training error:', error);
      res.status(500).json({
        error: 'Failed to train pet',
        message: error.message
      });
    }
  });
  
  return router;
};

export default petsRouter;