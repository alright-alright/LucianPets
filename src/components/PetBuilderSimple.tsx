import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Palette, Shirt, Crown, Heart, 
  Save, Shuffle, Cat, Dog, Bird, Fish, Bug, 
  Ghost, Zap, Dna, RotateCcw, X
} from 'lucide-react';

interface CreatureConfig {
  head: string;
  body: string;
  headColor: string;
  bodyColor: string;
  material: string;
  accessories: string[];
  personality: {
    playfulness: number;
    curiosity: number;
    affection: number;
    chaos: number;
  };
}

const CREATURE_PARTS = {
  heads: [
    { id: 'cat', name: 'Cat', emoji: '🐱' },
    { id: 'dog', name: 'Dog', emoji: '🐶' },
    { id: 'dragon', name: 'Dragon', emoji: '🐲' },
    { id: 'robot', name: 'Robot', emoji: '🤖' },
    { id: 'ghost', name: 'Ghost', emoji: '👻' },
    { id: 'alien', name: 'Alien', emoji: '👽' },
    { id: 'demon', name: 'Demon', emoji: '😈' },
    { id: 'angel', name: 'Angel', emoji: '😇' },
  ],
  bodies: [
    { id: 'cat', name: 'Cat', emoji: '🐈' },
    { id: 'dog', name: 'Dog', emoji: '🦮' },
    { id: 'dragon', name: 'Dragon', emoji: '🦖' },
    { id: 'snake', name: 'Snake', emoji: '🐍' },
    { id: 'bird', name: 'Bird', emoji: '🦅' },
    { id: 'fish', name: 'Fish', emoji: '🐠' },
    { id: 'spider', name: 'Spider', emoji: '🕷️' },
    { id: 'octopus', name: 'Octopus', emoji: '🐙' },
  ],
  materials: [
    { id: 'fur', name: 'Fur', gradient: 'from-amber-400 to-amber-600' },
    { id: 'scales', name: 'Scales', gradient: 'from-green-400 to-emerald-600' },
    { id: 'metal', name: 'Metal', gradient: 'from-gray-400 to-gray-600' },
    { id: 'ethereal', name: 'Ethereal', gradient: 'from-purple-400 to-pink-400' },
    { id: 'crystal', name: 'Crystal', gradient: 'from-blue-300 to-cyan-400' },
    { id: 'shadow', name: 'Shadow', gradient: 'from-gray-800 to-black' },
  ],
  accessories: [
    { id: 'crown', name: 'Crown', emoji: '👑' },
    { id: 'glasses', name: 'Glasses', emoji: '🕶️' },
    { id: 'bowtie', name: 'Bow Tie', emoji: '🎀' },
    { id: 'wings', name: 'Wings', emoji: '🦋' },
    { id: 'halo', name: 'Halo', emoji: '⭕' },
    { id: 'horns', name: 'Horns', emoji: '😈' },
  ]
};

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
  '#E74C3C', '#3498DB', '#9B59B6', '#1ABC9C', '#F39C12', '#34495E'
];

const PetBuilderSimple: React.FC = () => {
  const [creatureConfig, setCreatureConfig] = useState<CreatureConfig>({
    head: 'cat',
    body: 'dog',
    headColor: '#4ECDC4',
    bodyColor: '#45B7D1',
    material: 'fur',
    accessories: [],
    personality: {
      playfulness: 0.7,
      curiosity: 0.6,
      affection: 0.8,
      chaos: 0.3
    }
  });

  const [isRotating, setIsRotating] = useState(true);
  const [activeTab, setActiveTab] = useState<'build' | 'personality'>('build');

  const selectedHead = CREATURE_PARTS.heads.find(h => h.id === creatureConfig.head);
  const selectedBody = CREATURE_PARTS.bodies.find(b => b.id === creatureConfig.body);
  const selectedMaterial = CREATURE_PARTS.materials.find(m => m.id === creatureConfig.material);

  const randomizeCreature = () => {
    setCreatureConfig({
      ...creatureConfig,
      head: CREATURE_PARTS.heads[Math.floor(Math.random() * CREATURE_PARTS.heads.length)].id,
      body: CREATURE_PARTS.bodies[Math.floor(Math.random() * CREATURE_PARTS.bodies.length)].id,
      headColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      bodyColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      material: CREATURE_PARTS.materials[Math.floor(Math.random() * CREATURE_PARTS.materials.length)].id,
      personality: {
        playfulness: Math.random(),
        curiosity: Math.random(),
        affection: Math.random(),
        chaos: Math.random()
      }
    });
  };

  const saveCreature = () => {
    const configJson = JSON.stringify(creatureConfig, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `franken-creature-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Preview Area */}
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Preview</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <RotateCcw className={`w-5 h-5 text-white ${isRotating ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={randomizeCreature}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Shuffle className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={saveCreature}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Save className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Creature Display */}
            <div className="relative h-96 flex items-center justify-center">
              <motion.div
                animate={isRotating ? { rotate: 360 } : {}}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                {/* Main Creature */}
                <div className="relative">
                  {/* Head */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-8xl mb-4"
                    style={{ 
                      filter: `hue-rotate(${creatureConfig.headColor ? 
                        (parseInt(creatureConfig.headColor.slice(1), 16) % 360) + 'deg' : '0deg'})`
                    }}
                  >
                    {selectedHead?.emoji}
                  </motion.div>
                  
                  {/* Body */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-8xl"
                    style={{ 
                      filter: `hue-rotate(${creatureConfig.bodyColor ? 
                        (parseInt(creatureConfig.bodyColor.slice(1), 16) % 360) + 'deg' : '0deg'})`
                    }}
                  >
                    {selectedBody?.emoji}
                  </motion.div>

                  {/* Accessories */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    {creatureConfig.accessories.map((acc, i) => {
                      const accessory = CREATURE_PARTS.accessories.find(a => a.id === acc);
                      return (
                        <motion.div
                          key={acc}
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="text-4xl"
                        >
                          {accessory?.emoji}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Material Effect */}
                {creatureConfig.material === 'ethereal' && (
                  <div className="absolute inset-0 animate-pulse">
                    <Sparkles className="w-full h-full text-purple-400 opacity-30" />
                  </div>
                )}
              </motion.div>
            </div>

            {/* Creature Name */}
            <div className="text-center mt-6">
              <h3 className="text-2xl font-bold text-white">
                {selectedHead?.name}-{selectedBody?.name} Hybrid
              </h3>
              <p className="text-white/70 mt-2">
                Material: <span className={`font-semibold bg-gradient-to-r ${selectedMaterial?.gradient} bg-clip-text text-transparent`}>
                  {selectedMaterial?.name}
                </span>
              </p>
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
              <Dna className="w-8 h-8" />
              Franken-Creature Builder
            </h1>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('build')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  activeTab === 'build'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Build
              </button>
              <button
                onClick={() => setActiveTab('personality')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  activeTab === 'personality'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Personality
              </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'build' ? (
                <motion.div
                  key="build"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Head Selection */}
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Cat className="w-5 h-5" />
                      Head Type
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {CREATURE_PARTS.heads.map((head) => (
                        <button
                          key={head.id}
                          onClick={() => setCreatureConfig({ ...creatureConfig, head: head.id })}
                          className={`p-3 rounded-lg transition-all ${
                            creatureConfig.head === head.id
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          <div className="text-2xl mb-1">{head.emoji}</div>
                          <div className="text-xs">{head.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Body Selection */}
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Dog className="w-5 h-5" />
                      Body Type
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {CREATURE_PARTS.bodies.map((body) => (
                        <button
                          key={body.id}
                          onClick={() => setCreatureConfig({ ...creatureConfig, body: body.id })}
                          className={`p-3 rounded-lg transition-all ${
                            creatureConfig.body === body.id
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          <div className="text-2xl mb-1">{body.emoji}</div>
                          <div className="text-xs">{body.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Material */}
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Material
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {CREATURE_PARTS.materials.map((material) => (
                        <button
                          key={material.id}
                          onClick={() => setCreatureConfig({ ...creatureConfig, material: material.id })}
                          className={`p-3 rounded-lg transition-all ${
                            creatureConfig.material === material.id
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          <div className={`text-xs font-semibold bg-gradient-to-r ${material.gradient} bg-clip-text text-transparent`}>
                            {material.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Colors
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-white/70">Head Color</label>
                        <div className="grid grid-cols-9 gap-1 mt-1">
                          {COLORS.map((color) => (
                            <button
                              key={`head-${color}`}
                              onClick={() => setCreatureConfig({ ...creatureConfig, headColor: color })}
                              className={`w-8 h-8 rounded border-2 transition-all ${
                                creatureConfig.headColor === color
                                  ? 'border-white scale-110'
                                  : 'border-transparent hover:scale-105'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-white/70">Body Color</label>
                        <div className="grid grid-cols-9 gap-1 mt-1">
                          {COLORS.map((color) => (
                            <button
                              key={`body-${color}`}
                              onClick={() => setCreatureConfig({ ...creatureConfig, bodyColor: color })}
                              className={`w-8 h-8 rounded border-2 transition-all ${
                                creatureConfig.bodyColor === color
                                  ? 'border-white scale-110'
                                  : 'border-transparent hover:scale-105'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="personality"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/70 text-sm mb-4">
                      Adjust your creature's personality traits. These will affect how it behaves and interacts!
                    </p>
                    
                    {Object.entries(creatureConfig.personality).map(([trait, value]) => (
                      <div key={trait} className="mb-4">
                        <div className="flex justify-between mb-2">
                          <label className="text-white capitalize">{trait}</label>
                          <span className="text-white/70">{Math.round(value * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={value * 100}
                          onChange={(e) => setCreatureConfig({
                            ...creatureConfig,
                            personality: {
                              ...creatureConfig.personality,
                              [trait]: parseInt(e.target.value) / 100
                            }
                          })}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #8b5cf6 0%, #ec4899 ${value * 100}%, rgba(255,255,255,0.2) ${value * 100}%, rgba(255,255,255,0.2) 100%)`
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      // This would connect to NeuroForge for advanced control
                      console.log('Opening NeuroForge with personality:', creatureConfig.personality);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    Advanced Brain Control (NeuroForge)
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Create Button */}
            <div className="mt-8">
              <button
                onClick={saveCreature}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Create This Franken-Creature!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetBuilderSimple;