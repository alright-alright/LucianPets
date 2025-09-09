import React, { useState, useEffect } from 'react';
import { Brain, Zap, Heart, Eye, Lightbulb, Activity, Cpu } from 'lucide-react';

interface BrainActivity {
  timestamp: number;
  thoughts: string[];
  emotions: {
    happiness: number;
    curiosity: number;
    excitement: number;
    contentment: number;
  };
  cognition: {
    ssp_symbols: number;
    mpu_memories: number;
    hasr_patterns: number;
    wonder_gaps: number;
  };
  entropy: number;
  coherence: number;
}

interface BrainRegion {
  id: string;
  name: string;
  activity: number;
  color: string;
  position: { x: number; y: number };
  function: string;
}

const BrainActivityMonitor: React.FC<{
  brainParameters: any;
  isActive: boolean;
}> = ({ brainParameters, isActive }) => {
  const [brainActivity, setBrainActivity] = useState<BrainActivity>({
    timestamp: Date.now(),
    thoughts: ['Investigating new toy...', 'Remembering yesterday\'s treat', 'Wondering about the door'],
    emotions: {
      happiness: 0.75,
      curiosity: 0.82,
      excitement: 0.65,
      contentment: 0.70
    },
    cognition: {
      ssp_symbols: 1247,
      mpu_memories: 3456,
      hasr_patterns: 127,
      wonder_gaps: 8
    },
    entropy: 0.41,
    coherence: 0.78
  });

  const [brainRegions, setBrainRegions] = useState<BrainRegion[]>([
    { id: 'ssp', name: 'Symbol Processing', activity: 0.65, color: '#3B82F6', position: { x: 20, y: 30 }, function: 'Language & meaning' },
    { id: 'mpu', name: 'Memory Core', activity: 0.80, color: '#10B981', position: { x: 50, y: 20 }, function: 'Storing experiences' },
    { id: 'hasr', name: 'Learning Center', activity: 0.55, color: '#F59E0B', position: { x: 80, y: 35 }, function: 'Pattern recognition' },
    { id: 'wonder', name: 'Wonder Engine', activity: 0.70, color: '#EC4899', position: { x: 35, y: 60 }, function: 'Curiosity & exploration' },
    { id: 'emotion', name: 'Emotion Core', activity: 0.75, color: '#EF4444', position: { x: 65, y: 70 }, function: 'Feelings & bonding' },
    { id: 'chaos', name: 'Creativity Chaos', activity: 0.42, color: '#8B5CF6', position: { x: 50, y: 50 }, function: 'Creative randomness' }
  ]);

  // Simulate real-time brain activity
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setBrainActivity(prev => ({
        ...prev,
        timestamp: Date.now(),
        thoughts: generateRandomThoughts(),
        emotions: {
          happiness: Math.max(0, Math.min(1, prev.emotions.happiness + (Math.random() - 0.5) * 0.1)),
          curiosity: Math.max(0, Math.min(1, prev.emotions.curiosity + (Math.random() - 0.5) * 0.05)),
          excitement: Math.max(0, Math.min(1, prev.emotions.excitement + (Math.random() - 0.5) * 0.15)),
          contentment: Math.max(0, Math.min(1, prev.emotions.contentment + (Math.random() - 0.5) * 0.08))
        },
        cognition: {
          ssp_symbols: prev.cognition.ssp_symbols + Math.floor(Math.random() * 3),
          mpu_memories: prev.cognition.mpu_memories + Math.floor(Math.random() * 2),
          hasr_patterns: prev.cognition.hasr_patterns + (Math.random() > 0.8 ? 1 : 0),
          wonder_gaps: Math.max(0, prev.cognition.wonder_gaps + (Math.random() > 0.7 ? 1 : -1))
        },
        entropy: Math.max(0, Math.min(1, brainParameters?.behavioral_entropy || 0.41 + (Math.random() - 0.5) * 0.1)),
        coherence: Math.max(0, Math.min(1, 0.78 + (Math.random() - 0.5) * 0.05))
      }));

      // Update brain region activity based on parameters
      setBrainRegions(prev => prev.map(region => ({
        ...region,
        activity: Math.max(0, Math.min(1, getRegionActivity(region.id) + (Math.random() - 0.5) * 0.2))
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, brainParameters]);

  const generateRandomThoughts = (): string[] => {
    const thoughtTemplates = [
      'Processing new sensory input...',
      'Remembering {memory}...',
      'Wondering about {object}...',
      'Feeling {emotion}...',
      'Learning pattern: {pattern}',
      'Exploring conceptual space...',
      'Bonding with human...',
      'Analyzing environmental changes...',
      'Generating creative response...',
      'Consolidating experience...'
    ];

    const memories = ['yesterday\'s play', 'first meeting', 'favorite toy', 'sunny afternoon', 'tasty treat'];
    const objects = ['the door', 'moving shadows', 'new sounds', 'interesting smells', 'human behavior'];
    const emotions = ['curious', 'happy', 'excited', 'content', 'playful'];
    const patterns = ['feeding time', 'play signals', 'mood changes', 'attention cycles'];

    const thoughts = [];
    for (let i = 0; i < 3; i++) {
      let thought = thoughtTemplates[Math.floor(Math.random() * thoughtTemplates.length)];
      thought = thought.replace('{memory}', memories[Math.floor(Math.random() * memories.length)]);
      thought = thought.replace('{object}', objects[Math.floor(Math.random() * objects.length)]);
      thought = thought.replace('{emotion}', emotions[Math.floor(Math.random() * emotions.length)]);
      thought = thought.replace('{pattern}', patterns[Math.floor(Math.random() * patterns.length)]);
      thoughts.push(thought);
    }
    
    return thoughts;
  };

  const getRegionActivity = (regionId: string): number => {
    if (!brainParameters) return 0.5;
    
    switch (regionId) {
      case 'ssp': return brainParameters.pattern_recognition || 0.6;
      case 'mpu': return brainParameters.memory_retention || 0.75;
      case 'hasr': return brainParameters.learning_rate || 0.45;
      case 'wonder': return brainParameters.curiosity_engine || 0.55;
      case 'emotion': return brainParameters.affection_intensity || 0.65;
      case 'chaos': return brainParameters.behavioral_entropy || 0.41;
      default: return 0.5;
    }
  };

  const MetricDisplay: React.FC<{
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    unit?: string;
  }> = ({ label, value, icon, color, unit = '' }) => (
    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600">
      <div className="flex items-center space-x-2 mb-2">
        <div className={`p-1 rounded ${color}`}>
          {icon}
        </div>
        <span className="text-sm text-gray-300">{label}</span>
      </div>
      <div className="text-lg font-bold text-white">
        {typeof value === 'number' ? (value < 10 ? value.toFixed(2) : Math.floor(value)) : value}{unit}
      </div>
      <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
        <div 
          className={`h-1 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${typeof value === 'number' ? (value < 1 ? value * 100 : Math.min(100, (value / 10) * 100)) : 50}%` }}
        />
      </div>
    </div>
  );

  const BrainVisualization: React.FC = () => (
    <div className="relative w-full h-64 bg-gray-900 rounded-lg border border-gray-600 overflow-hidden">
      {/* Brain outline */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 150">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        
        {/* Brain shape */}
        <path
          d="M50 40 Q80 20, 120 30 Q150 35, 160 60 Q155 80, 140 95 Q120 110, 90 105 Q60 100, 40 80 Q35 60, 50 40"
          fill="rgba(139, 92, 246, 0.1)"
          stroke="rgba(139, 92, 246, 0.3)"
          strokeWidth="1"
        />
        
        {/* Brain regions */}
        {brainRegions.map(region => (
          <g key={region.id}>
            <circle
              cx={region.position.x * 2}
              cy={region.position.y * 1.5}
              r={8 + region.activity * 8}
              fill={region.color}
              fillOpacity={region.activity}
              filter="url(#glow)"
              className="animate-pulse"
            />
            <text
              x={region.position.x * 2}
              y={region.position.y * 1.5 + 20}
              textAnchor="middle"
              className="text-xs fill-gray-300"
            >
              {region.name.split(' ')[0]}
            </text>
          </g>
        ))}
        
        {/* Neural connections */}
        {brainRegions.map((region, i) => 
          brainRegions.slice(i + 1).map((target, j) => (
            <line
              key={`${region.id}-${target.id}`}
              x1={region.position.x * 2}
              y1={region.position.y * 1.5}
              x2={target.position.x * 2}
              y2={target.position.y * 1.5}
              stroke={`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 255, ${Math.random() * 0.3 + 0.1})`}
              strokeWidth={Math.random() * 2 + 0.5}
              className="animate-pulse"
              style={{ animationDelay: `${Math.random() * 2}s` }}
            />
          ))
        )}
      </svg>
      
      {/* Activity overlay */}
      <div className="absolute top-2 right-2 bg-gray-800/80 rounded px-2 py-1 text-xs text-gray-300">
        Entropy: {brainActivity.entropy.toFixed(2)} | Coherence: {brainActivity.coherence.toFixed(2)}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
        <Brain className="w-6 h-6 text-purple-400" />
        <span>Live Brain Activity Monitor</span>
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
      </h3>
      
      {/* Brain Visualization */}
      <BrainVisualization />
      
      {/* Cognitive Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 mb-4">
        <MetricDisplay
          label="Symbols"
          value={brainActivity.cognition.ssp_symbols}
          icon={<Zap className="w-4 h-4" />}
          color="bg-blue-600"
        />
        <MetricDisplay
          label="Memories"
          value={brainActivity.cognition.mpu_memories}
          icon={<Brain className="w-4 h-4" />}
          color="bg-green-600"
        />
        <MetricDisplay
          label="Patterns"
          value={brainActivity.cognition.hasr_patterns}
          icon={<Activity className="w-4 h-4" />}
          color="bg-yellow-600"
        />
        <MetricDisplay
          label="Wonder"
          value={brainActivity.cognition.wonder_gaps}
          icon={<Lightbulb className="w-4 h-4" />}
          color="bg-pink-600"
        />
      </div>
      
      {/* Current Thoughts */}
      <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center space-x-2">
          <Eye className="w-4 h-4" />
          <span>Current Thoughts</span>
        </h4>
        <div className="space-y-1">
          {brainActivity.thoughts.map((thought, i) => (
            <div 
              key={i} 
              className="text-sm text-gray-400 animate-pulse"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              💭 {thought}
            </div>
          ))}
        </div>
      </div>
      
      {/* Emotional State */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Object.entries(brainActivity.emotions).map(([emotion, value]) => (
          <div key={emotion} className="text-center">
            <div className="text-xs text-gray-400 capitalize">{emotion}</div>
            <div className="text-sm font-bold text-white">{Math.round(value * 100)}%</div>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
              <div 
                className="h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-500"
                style={{ width: `${value * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrainActivityMonitor;
