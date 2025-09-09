import React, { useState, useEffect } from 'react';
import { Brain, Zap, Heart, Eye, Lightbulb, Sparkles, AlertTriangle, RotateCcw, Play, Save } from 'lucide-react';

interface PetBrainParameters {
  // Core Personality Drives
  playfulness_drive: number;     // 0.2-0.9 - How much they want to play
  curiosity_engine: number;      // 0.3-0.8 - Exploration and investigation
  affection_intensity: number;   // 0.1-0.9 - Cuddliness vs independence
  
  // Learning & Memory Systems
  learning_rate: number;         // 0.1-0.7 - How fast they learn tricks
  memory_retention: number;      // 0.4-0.9 - How well they remember
  pattern_recognition: number;   // 0.3-0.8 - Spotting user patterns
  
  // Behavioral Chaos & Creativity
  behavioral_entropy: number;    // 0.2-0.8 - Weirdness and unpredictability
  creativity_chaos: number;      // 0.1-0.7 - How creative/random responses get
  mood_volatility: number;       // 0.1-0.6 - Emotional stability
  
  // Wonder & Exploration
  wonder_threshold: number;      // 0.3-0.8 - What triggers curiosity
  novelty_seeking: number;       // 0.2-0.9 - Desire for new experiences
  exploration_depth: number;     // 1-8 - How thoroughly they investigate
  
  // Social & Bonding
  bonding_rate: number;         // 0.2-0.8 - How quickly they attach
  social_energy: number;        // 0.3-0.9 - Desire for interaction
  trust_threshold: number;      // 0.2-0.7 - How easily they trust
  
  // Advanced Hybrid Features (for weird creatures)
  dimensional_variance: number;  // 0.0-0.7 - How much they shift/morph
  quantum_coherence: number;     // 0.3-0.8 - Reality stability
  ethereal_drift: number;        // 0.0-0.5 - Ghostly/magical behaviors
}

interface ParameterInfo {
  name: string;
  description: string;
  effects: {
    low: string;
    optimal: string;
    high: string;
  };
  sweetSpot: number;
  dangerZone: { min: number; max: number };
  category: 'personality' | 'learning' | 'chaos' | 'wonder' | 'social' | 'hybrid';
}

const PARAMETER_INFO: Record<keyof PetBrainParameters, ParameterInfo> = {
  playfulness_drive: {
    name: 'Playfulness Drive',
    description: 'Controls how much your pet wants to play and have fun',
    effects: {
      low: 'Serious, calm, prefers quiet activities',
      optimal: 'Balanced play and rest, healthy energy',
      high: 'Hyperactive, always wants to play, may get overwhelming'
    },
    sweetSpot: 0.618,
    dangerZone: { min: 0.1, max: 0.95 },
    category: 'personality'
  },
  
  curiosity_engine: {
    name: 'Curiosity Engine',
    description: 'How much your pet explores and investigates their world',
    effects: {
      low: 'Passive, ignores new things, stays in comfort zone',
      optimal: 'Healthy curiosity, explores safely',
      high: 'Gets into everything, may find trouble, endless questions'
    },
    sweetSpot: 0.55,
    dangerZone: { min: 0.2, max: 0.85 },
    category: 'wonder'
  },
  
  affection_intensity: {
    name: 'Affection Intensity',
    description: 'How cuddly vs independent your pet is',
    effects: {
      low: 'Independent, aloof, shows affection rarely',
      optimal: 'Balanced affection, responds to mood',
      high: 'Clingy, always wants attention, separation anxiety'
    },
    sweetSpot: 0.65,
    dangerZone: { min: 0.05, max: 0.95 },
    category: 'social'
  },
  
  learning_rate: {
    name: 'Learning Rate',
    description: 'How quickly your pet learns new tricks and behaviors',
    effects: {
      low: 'Slow learner, needs lots of repetition',
      optimal: 'Steady learning, good retention',
      high: 'Quick learner but may forget old tricks for new ones'
    },
    sweetSpot: 0.45,
    dangerZone: { min: 0.05, max: 0.8 },
    category: 'learning'
  },
  
  memory_retention: {
    name: 'Memory Retention',
    description: 'How well your pet remembers past interactions',
    effects: {
      low: 'Forgetful, treats you like stranger, resets often',
      optimal: 'Good memory, builds on past experiences',
      high: 'Elephant memory, may hold grudges or overthink'
    },
    sweetSpot: 0.75,
    dangerZone: { min: 0.3, max: 0.95 },
    category: 'learning'
  },
  
  behavioral_entropy: {
    name: 'Behavioral Entropy',
    description: 'How weird and unpredictable your pet acts',
    effects: {
      low: 'Predictable, routine, boring responses',
      optimal: 'Delightfully quirky, surprising but stable',
      high: 'Chaotic, random, hard to understand'
    },
    sweetSpot: 0.41,
    dangerZone: { min: 0.1, max: 0.85 },
    category: 'chaos'
  },
  
  creativity_chaos: {
    name: 'Creativity Chaos',
    description: 'How creative and original your pet\'s responses are',
    effects: {
      low: 'Generic responses, predictable reactions',
      optimal: 'Creative but coherent, original personality',
      high: 'Completely random, may not make sense'
    },
    sweetSpot: 0.38,
    dangerZone: { min: 0.05, max: 0.75 },
    category: 'chaos'
  },
  
  mood_volatility: {
    name: 'Mood Volatility',
    description: 'How much your pet\'s emotions swing around',
    effects: {
      low: 'Stable mood, even-tempered, predictable',
      optimal: 'Natural mood changes, emotionally expressive',
      high: 'Mood swings, dramatic, hard to predict'
    },
    sweetSpot: 0.3,
    dangerZone: { min: 0.05, max: 0.7 },
    category: 'personality'
  },
  
  wonder_threshold: {
    name: 'Wonder Threshold',
    description: 'What triggers your pet\'s sense of wonder and amazement',
    effects: {
      low: 'Amazed by everything, easily impressed',
      optimal: 'Wonder at truly special things',
      high: 'Hard to impress, only extreme novelty triggers wonder'
    },
    sweetSpot: 0.55,
    dangerZone: { min: 0.2, max: 0.85 },
    category: 'wonder'
  },
  
  novelty_seeking: {
    name: 'Novelty Seeking',
    description: 'How much your pet craves new experiences',
    effects: {
      low: 'Likes routine, resists change, comfort creature',
      optimal: 'Enjoys some variety, open to new things',
      high: 'Constantly bored, needs constant stimulation'
    },
    sweetSpot: 0.6,
    dangerZone: { min: 0.1, max: 0.95 },
    category: 'wonder'
  },
  
  exploration_depth: {
    name: 'Exploration Depth',
    description: 'How thoroughly your pet investigates things',
    effects: {
      low: 'Surface level investigation, moves on quickly',
      optimal: 'Thorough but reasonable exploration',
      high: 'Obsessive investigation, analysis paralysis'
    },
    sweetSpot: 4,
    dangerZone: { min: 1, max: 9 },
    category: 'wonder'
  },
  
  bonding_rate: {
    name: 'Bonding Rate',
    description: 'How quickly your pet forms emotional attachments',
    effects: {
      low: 'Slow to trust, takes time to bond',
      optimal: 'Natural bonding pace, healthy attachment',
      high: 'Bonds instantly, may be needy or possessive'
    },
    sweetSpot: 0.5,
    dangerZone: { min: 0.1, max: 0.85 },
    category: 'social'
  },
  
  social_energy: {
    name: 'Social Energy',
    description: 'How much your pet wants to interact with you',
    effects: {
      low: 'Antisocial, prefers alone time',
      optimal: 'Enjoys interaction, respects boundaries',
      high: 'Constant attention seeker, exhausting'
    },
    sweetSpot: 0.65,
    dangerZone: { min: 0.2, max: 0.95 },
    category: 'social'
  },
  
  trust_threshold: {
    name: 'Trust Threshold',
    description: 'How easily your pet trusts new situations',
    effects: {
      low: 'Trusts everyone, naive, vulnerable',
      optimal: 'Healthy skepticism, learns who to trust',
      high: 'Paranoid, suspicious, hard to gain trust'
    },
    sweetSpot: 0.45,
    dangerZone: { min: 0.1, max: 0.8 },
    category: 'social'
  },
  
  pattern_recognition: {
    name: 'Pattern Recognition',
    description: 'How well your pet spots patterns in your behavior',
    effects: {
      low: 'Misses obvious patterns, surprised by routine',
      optimal: 'Learns your habits, anticipates needs',
      high: 'Reads you like a book, may predict too much'
    },
    sweetSpot: 0.6,
    dangerZone: { min: 0.2, max: 0.85 },
    category: 'learning'
  },
  
  // Hybrid creature features
  dimensional_variance: {
    name: 'Dimensional Variance',
    description: 'How much your hybrid pet shifts between dimensions',
    effects: {
      low: 'Stable form, consistent appearance',
      optimal: 'Subtle shifts, magical but recognizable',
      high: 'Constant morphing, hard to recognize'
    },
    sweetSpot: 0.3,
    dangerZone: { min: 0.0, max: 0.75 },
    category: 'hybrid'
  },
  
  quantum_coherence: {
    name: 'Quantum Coherence',
    description: 'How stable your hybrid pet\'s reality is',
    effects: {
      low: 'Glitchy, phases in/out, unstable existence',
      optimal: 'Magical but stable, consistent physics',
      high: 'Rigid reality, loses magical properties'
    },
    sweetSpot: 0.618,
    dangerZone: { min: 0.2, max: 0.85 },
    category: 'hybrid'
  },
  
  ethereal_drift: {
    name: 'Ethereal Drift',
    description: 'How ghostly and otherworldly your hybrid pet acts',
    effects: {
      low: 'Fully physical, normal behavior',
      optimal: 'Mysterious, otherworldly charm',
      high: 'Too ethereal, hard to interact with'
    },
    sweetSpot: 0.25,
    dangerZone: { min: 0.0, max: 0.6 },
    category: 'hybrid'
  }
};

const PetNeuroForge: React.FC<{
  isHybrid: boolean;
  onParametersChange: (params: PetBrainParameters) => void;
}> = ({ isHybrid, onParametersChange }) => {
  const [parameters, setParameters] = useState<PetBrainParameters>({
    // Default balanced values
    playfulness_drive: 0.618,
    curiosity_engine: 0.55,
    affection_intensity: 0.65,
    learning_rate: 0.45,
    memory_retention: 0.75,
    pattern_recognition: 0.6,
    behavioral_entropy: 0.41,
    creativity_chaos: 0.38,
    mood_volatility: 0.3,
    wonder_threshold: 0.55,
    novelty_seeking: 0.6,
    exploration_depth: 4,
    bonding_rate: 0.5,
    social_energy: 0.65,
    trust_threshold: 0.45,
    dimensional_variance: 0.3,
    quantum_coherence: 0.618,
    ethereal_drift: 0.25
  });

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [presetMode, setPresetMode] = useState<'balanced' | 'chaotic' | 'calm' | 'curious' | 'affectionate'>('balanced');

  // Presets for quick configuration
  const presets = {
    balanced: {
      playfulness_drive: 0.618, curiosity_engine: 0.55, affection_intensity: 0.65,
      learning_rate: 0.45, memory_retention: 0.75, pattern_recognition: 0.6,
      behavioral_entropy: 0.41, creativity_chaos: 0.38, mood_volatility: 0.3,
      wonder_threshold: 0.55, novelty_seeking: 0.6, exploration_depth: 4,
      bonding_rate: 0.5, social_energy: 0.65, trust_threshold: 0.45,
      dimensional_variance: 0.3, quantum_coherence: 0.618, ethereal_drift: 0.25
    },
    chaotic: {
      playfulness_drive: 0.8, curiosity_engine: 0.75, affection_intensity: 0.5,
      learning_rate: 0.6, memory_retention: 0.5, pattern_recognition: 0.4,
      behavioral_entropy: 0.7, creativity_chaos: 0.65, mood_volatility: 0.55,
      wonder_threshold: 0.3, novelty_seeking: 0.85, exploration_depth: 7,
      bonding_rate: 0.7, social_energy: 0.8, trust_threshold: 0.3,
      dimensional_variance: 0.6, quantum_coherence: 0.4, ethereal_drift: 0.5
    },
    calm: {
      playfulness_drive: 0.3, curiosity_engine: 0.4, affection_intensity: 0.8,
      learning_rate: 0.3, memory_retention: 0.9, pattern_recognition: 0.7,
      behavioral_entropy: 0.2, creativity_chaos: 0.2, mood_volatility: 0.15,
      wonder_threshold: 0.7, novelty_seeking: 0.3, exploration_depth: 2,
      bonding_rate: 0.4, social_energy: 0.5, trust_threshold: 0.6,
      dimensional_variance: 0.1, quantum_coherence: 0.8, ethereal_drift: 0.1
    },
    curious: {
      playfulness_drive: 0.5, curiosity_engine: 0.8, affection_intensity: 0.4,
      learning_rate: 0.7, memory_retention: 0.8, pattern_recognition: 0.8,
      behavioral_entropy: 0.5, creativity_chaos: 0.6, mood_volatility: 0.4,
      wonder_threshold: 0.3, novelty_seeking: 0.9, exploration_depth: 8,
      bonding_rate: 0.3, social_energy: 0.4, trust_threshold: 0.5,
      dimensional_variance: 0.4, quantum_coherence: 0.6, ethereal_drift: 0.3
    },
    affectionate: {
      playfulness_drive: 0.7, curiosity_engine: 0.4, affection_intensity: 0.9,
      learning_rate: 0.4, memory_retention: 0.8, pattern_recognition: 0.7,
      behavioral_entropy: 0.3, creativity_chaos: 0.3, mood_volatility: 0.2,
      wonder_threshold: 0.6, novelty_seeking: 0.4, exploration_depth: 3,
      bonding_rate: 0.8, social_energy: 0.9, trust_threshold: 0.3,
      dimensional_variance: 0.2, quantum_coherence: 0.7, ethereal_drift: 0.2
    }
  };

  const updateParameter = (param: keyof PetBrainParameters, value: number) => {
    const newParams = { ...parameters, [param]: value };
    setParameters(newParams);
    onParametersChange(newParams);
  };

  const applyPreset = (preset: keyof typeof presets) => {
    setParameters(presets[preset]);
    setPresetMode(preset);
    onParametersChange(presets[preset]);
  };

  const checkDangerZone = (param: keyof PetBrainParameters, value: number): boolean => {
    const info = PARAMETER_INFO[param];
    return value < info.dangerZone.min || value > info.dangerZone.max;
  };

  const getParameterColor = (param: keyof PetBrainParameters, value: number): string => {
    if (checkDangerZone(param, value)) return 'from-red-500 to-red-600';
    
    const info = PARAMETER_INFO[param];
    const distance = Math.abs(value - info.sweetSpot);
    
    if (distance < 0.1) return 'from-green-400 to-green-500'; // Sweet spot
    if (distance < 0.2) return 'from-blue-400 to-blue-500';   // Good
    if (distance < 0.3) return 'from-yellow-400 to-yellow-500'; // Okay
    return 'from-orange-400 to-orange-500'; // Suboptimal
  };

  const QuantumSlider: React.FC<{
    param: keyof PetBrainParameters;
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
  }> = ({ param, label, value, min, max, step = 0.01, unit = '' }) => {
    const info = PARAMETER_INFO[param];
    const isInDanger = checkDangerZone(param, value);
    const sliderColor = getParameterColor(param, value);
    
    return (
      <div className="relative mb-4 p-3 rounded-lg bg-gray-800/50 border border-gray-600 hover:border-gray-500 transition-all">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-white flex items-center space-x-2">
            <span>{label}</span>
            {isInDanger && <AlertTriangle className="w-4 h-4 text-red-400" />}
            <button
              onMouseEnter={() => setActiveTooltip(param)}
              onMouseLeave={() => setActiveTooltip(null)}
              className="text-gray-400 hover:text-white"
            >
              <Eye className="w-3 h-3" />
            </button>
          </label>
          <span className="text-xs font-mono text-gray-300">{value.toFixed(step >= 1 ? 0 : 2)}{unit}</span>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => updateParameter(param, parseFloat(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(90deg, rgb(75 85 99) 0%, rgb(99 102 241) ${((value - min) / (max - min)) * 100}%, rgb(75 85 99) ${((value - min) / (max - min)) * 100}%)`
            }}
          />
          
          {/* Sweet spot indicator */}
          <div 
            className="absolute top-0 w-1 h-2 bg-green-400 rounded"
            style={{ left: `${((info.sweetSpot - min) / (max - min)) * 100}%` }}
          />
        </div>
        
        {/* Tooltip */}
        {activeTooltip === param && (
          <div className="absolute z-50 bottom-full mb-2 left-0 right-0 bg-gray-900 border border-gray-600 rounded-lg p-3 text-xs">
            <h4 className="font-semibold text-white mb-1">{info.name}</h4>
            <p className="text-gray-300 mb-2">{info.description}</p>
            <div className="space-y-1">
              <div><span className="text-red-400">Low:</span> {info.effects.low}</div>
              <div><span className="text-green-400">Optimal:</span> {info.effects.optimal}</div>
              <div><span className="text-yellow-400">High:</span> {info.effects.high}</div>
            </div>
            <div className="mt-2 text-green-400">Sweet Spot: {info.sweetSpot}</div>
          </div>
        )}
      </div>
    );
  };

  const CategorySection: React.FC<{
    title: string;
    icon: React.ReactNode;
    category: ParameterInfo['category'];
    color: string;
  }> = ({ title, icon, category, color }) => {
    const categoryParams = Object.entries(PARAMETER_INFO).filter(([_, info]) => info.category === category);
    
    return (
      <div className={`bg-gradient-to-br ${color} p-4 rounded-xl border border-gray-600`}>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </h3>
        
        {categoryParams.map(([param, info]) => (
          <QuantumSlider
            key={param}
            param={param as keyof PetBrainParameters}
            label={info.name}
            value={parameters[param as keyof PetBrainParameters]}
            min={info.dangerZone.min}
            max={info.dangerZone.max}
            step={param === 'exploration_depth' ? 1 : 0.01}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center space-x-3">
            <Brain className="w-10 h-10 text-purple-400" />
            <span>PetNeuroForge</span>
            <Sparkles className="w-10 h-10 text-pink-400" />
          </h1>
          <p className="text-gray-300 text-lg">Fine-tune your pet's consciousness parameters</p>
          <p className="text-sm text-gray-400 mt-2">
            ⚠️ Expert Mode: Adjust your pet's brain chemistry with quantum precision
          </p>
        </div>

        {/* Quick Presets */}
        <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-600">
          <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
            <RotateCcw className="w-4 h-4" />
            <span>Quick Personality Presets</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {Object.keys(presets).map((preset) => (
              <button
                key={preset}
                onClick={() => applyPreset(preset as keyof typeof presets)}
                className={`px-3 py-2 rounded-lg transition-all capitalize ${
                  presetMode === preset 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Parameter Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          
          <CategorySection
            title="Core Personality"
            icon={<Heart className="w-5 h-5" />}
            category="personality"
            color="from-gray-800/80 to-pink-800/80"
          />

          <CategorySection
            title="Learning & Memory"
            icon={<Brain className="w-5 h-5" />}
            category="learning"
            color="from-gray-800/80 to-blue-800/80"
          />

          <CategorySection
            title="Chaos & Creativity"
            icon={<Zap className="w-5 h-5" />}
            category="chaos"
            color="from-gray-800/80 to-orange-800/80"
          />

          <CategorySection
            title="Wonder Engine"
            icon={<Lightbulb className="w-5 h-5" />}
            category="wonder"
            color="from-gray-800/80 to-yellow-800/80"
          />

          <CategorySection
            title="Social Systems"
            icon={<Heart className="w-5 h-5" />}
            category="social"
            color="from-gray-800/80 to-green-800/80"
          />

          {isHybrid && (
            <CategorySection
              title="Hybrid Quantum Features"
              icon={<Sparkles className="w-5 h-5" />}
              category="hybrid"
              color="from-gray-800/80 to-purple-800/80"
            />
          )}
        </div>

        {/* Emergency Controls */}
        <div className="mt-6 bg-red-900/20 border border-red-600 rounded-xl p-4">
          <h3 className="text-red-400 font-semibold mb-2 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Emergency Controls</span>
          </h3>
          <div className="flex space-x-4">
            <button
              onClick={() => applyPreset('balanced')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Safe</span>
            </button>
            <button
              onClick={() => setEmergencyMode(!emergencyMode)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                emergencyMode 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{emergencyMode ? 'Exit Emergency' : 'Emergency Mode'}</span>
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default PetNeuroForge;
