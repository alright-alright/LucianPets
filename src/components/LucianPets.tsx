import React, { useState, useEffect } from 'react';
import { Brain, Wifi, WifiOff, Activity, Heart, Zap, Eye, Settings, PlusCircle, Cpu, Sparkles, Camera, Mic, Dna } from 'lucide-react';
import PetNeuroForge from './PetNeuroForge';
import BrainActivityMonitor from './BrainActivityMonitor';
import OdinSensoryInterface from './OdinSensoryInterface';
import PetBuilderSimple from './PetBuilderSimple';

// Lucian Status Types
interface LucianMetrics {
  ssp: { active: boolean; symbols: number; bindings: number };
  mpu: { active: boolean; memories: number; retention: number };
  hasr: { active: boolean; patterns: number; learningRate: number };
  odin: { active: boolean; visual: boolean; audio: boolean; fusion: boolean };
  aiConnection: { provider: 'openai' | 'claude' | 'offline'; status: 'connected' | 'disconnected'; latency?: number };
}

interface PetStats {
  happiness: number;
  energy: number;
  intelligence: number;
  bonding: number;
}

interface CreatureConfig {
  species: 'cat' | 'dog' | 'hybrid';
  primaryColor: string;
  secondaryColor: string;
  size: 'small' | 'medium' | 'large';
  personality: {
    playfulness: number;
    curiosity: number;
    affection: number;
    independence: number;
  };
  hybridTraits?: {
    wings?: boolean;
    horns?: boolean;
    extraTails?: number;
    glowing?: boolean;
    patterns?: 'stripes' | 'spots' | 'galaxy' | 'rainbow';
  };
}

const LucianPets: React.FC = () => {
  const [lucianMetrics, setLucianMetrics] = useState<LucianMetrics>({
    ssp: { active: true, symbols: 1247, bindings: 892 },
    mpu: { active: true, memories: 3456, retention: 0.82 },
    hasr: { active: true, patterns: 127, learningRate: 0.15 },
    odin: { active: true, visual: true, audio: true, fusion: true },
    aiConnection: { provider: 'offline', status: 'disconnected', latency: 0 }
  });

  const [petStats, setPetStats] = useState<PetStats>({
    happiness: 85,
    energy: 72,
    intelligence: 68,
    bonding: 91
  });

  const [creatureConfig, setCreatureConfig] = useState<CreatureConfig>({
    species: 'cat',
    primaryColor: '#FF6B6B',
    secondaryColor: '#4ECDC4',
    size: 'medium',
    personality: {
      playfulness: 0.8,
      curiosity: 0.9,
      affection: 0.7,
      independence: 0.4
    },
    hybridTraits: {
      wings: false,
      horns: false,
      extraTails: 0,
      glowing: false,
      patterns: 'stripes'
    }
  });

  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showNeuroForge, setShowNeuroForge] = useState(false);
  const [showOdinInterface, setShowOdinInterface] = useState(false);
  const [showCreatureBuilder, setShowCreatureBuilder] = useState(false);
  const [brainParameters, setBrainParameters] = useState({
    playfulness_drive: 0.618,
    curiosity_engine: 0.55,
    affection_intensity: 0.65,
    learning_rate: 0.45,
    memory_retention: 0.75,
    behavioral_entropy: 0.41,
    creativity_chaos: 0.38,
    mood_volatility: 0.3
  });

  const [petName, setPetName] = useState('Zara');

  // Fetch real AI status and simulate other updates
  useEffect(() => {
    // Fetch AI status immediately
    const fetchAIStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/ai/status');
        if (response.ok) {
          const data = await response.json();
          setLucianMetrics(prev => ({
            ...prev,
            aiConnection: {
              provider: data.provider as 'openai' | 'claude' | 'offline',
              status: data.status as 'connected' | 'disconnected',
              latency: data.latency || 0
            }
          }));
        }
      } catch (error) {
        console.error('Failed to fetch AI status:', error);
        setLucianMetrics(prev => ({
          ...prev,
          aiConnection: {
            provider: 'offline',
            status: 'disconnected',
            latency: 0
          }
        }));
      }
    };

    // Fetch immediately
    fetchAIStatus();

    // Then set up interval for periodic updates
    const interval = setInterval(() => {
      // Update other metrics
      setLucianMetrics(prev => ({
        ...prev,
        ssp: { ...prev.ssp, symbols: prev.ssp.symbols + Math.floor(Math.random() * 3) },
        mpu: { ...prev.mpu, memories: prev.mpu.memories + Math.floor(Math.random() * 2) }
      }));
      
      // Also fetch AI status
      fetchAIStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const StatusIndicator = ({ active, value, label, unit = '' }: { active: boolean; value: number | string; label: string; unit?: string }) => (
    <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-gray-800/50 border border-gray-600">
      <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
      <span className="text-xs text-gray-300">{label}:</span>
      <span className="text-xs font-mono text-white">{value}{unit}</span>
    </div>
  );

  const PetVisualization = () => {
    const { species, primaryColor, secondaryColor, size, hybridTraits } = creatureConfig;
    
    return (
      <div className="relative w-64 h-64 mx-auto mb-6">
        <div 
          className={`absolute inset-0 rounded-full transition-all duration-500 ${
            size === 'small' ? 'scale-75' : size === 'large' ? 'scale-110' : 'scale-100'
          } ${hybridTraits?.glowing ? 'animate-pulse shadow-lg shadow-blue-400/50' : ''}`}
          style={{ backgroundColor: primaryColor }}
        >
          {/* Eyes */}
          <div className="absolute top-16 left-16 w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          </div>
          <div className="absolute top-16 right-16 w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          </div>
          
          {/* Nose */}
          <div className="absolute top-28 left-1/2 transform -translate-x-1/2 w-4 h-3 rounded-full" 
               style={{ backgroundColor: secondaryColor }} />
          
          {/* Species-specific features */}
          {species === 'cat' && (
            <>
              {/* Cat ears */}
              <div className="absolute -top-4 left-12 w-0 h-0 border-l-8 border-r-8 border-b-12 border-transparent" 
                   style={{ borderBottomColor: primaryColor }} />
              <div className="absolute -top-4 right-12 w-0 h-0 border-l-8 border-r-8 border-b-12 border-transparent" 
                   style={{ borderBottomColor: primaryColor }} />
            </>
          )}
          
          {species === 'dog' && (
            <>
              {/* Dog ears */}
              <div className="absolute top-8 -left-4 w-12 h-16 rounded-full" 
                   style={{ backgroundColor: secondaryColor }} />
              <div className="absolute top-8 -right-4 w-12 h-16 rounded-full" 
                   style={{ backgroundColor: secondaryColor }} />
            </>
          )}
          
          {/* Hybrid features */}
          {hybridTraits?.wings && (
            <>
              <div className="absolute top-20 -left-8 w-16 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-70 animate-bounce" />
              <div className="absolute top-20 -right-8 w-16 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-70 animate-bounce" />
            </>
          )}
          
          {hybridTraits?.horns && (
            <>
              <div className="absolute -top-6 left-20 w-2 h-8 bg-yellow-400 rounded-full" />
              <div className="absolute -top-6 right-20 w-2 h-8 bg-yellow-400 rounded-full" />
            </>
          )}
          
          {/* Patterns */}
          {hybridTraits?.patterns === 'spots' && (
            <div className="absolute inset-4 rounded-full opacity-60" 
                 style={{ 
                   backgroundColor: secondaryColor,
                   maskImage: 'radial-gradient(circle at 20% 30%, transparent 8px, black 12px), radial-gradient(circle at 70% 40%, transparent 6px, black 10px), radial-gradient(circle at 50% 70%, transparent 10px, black 14px)'
                 }} />
          )}
          
          {hybridTraits?.patterns === 'galaxy' && (
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 opacity-40 animate-pulse" />
          )}
        </div>
        
        {/* Extra tails */}
        {hybridTraits?.extraTails && Array.from({ length: hybridTraits.extraTails }).map((_, i) => (
          <div 
            key={i}
            className="absolute bottom-4 w-4 h-16 rounded-full transform origin-bottom animate-wiggle"
            style={{ 
              backgroundColor: secondaryColor,
              left: `${45 + i * 10}%`,
              transform: `rotate(${-20 + i * 15}deg)`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Navbar with Lucian Metrics */}
      <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-blue-400" />
            <h1 className="text-xl font-bold text-white">LucianPets</h1>
          </div>
          
          {/* Lucian Metrics */}
          <div className="flex items-center space-x-4">
            <StatusIndicator 
              active={lucianMetrics.ssp.active} 
              value={lucianMetrics.ssp.symbols} 
              label="SSP Symbols" 
            />
            <StatusIndicator 
              active={lucianMetrics.mpu.active} 
              value={lucianMetrics.mpu.memories} 
              label="Memories" 
            />
            <StatusIndicator 
              active={lucianMetrics.hasr.active} 
              value={lucianMetrics.hasr.patterns} 
              label="Patterns" 
            />
            
            {/* ODIN Status */}
            <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-gray-800/50 border border-gray-600">
              <Eye className={`w-4 h-4 ${lucianMetrics.odin.visual ? 'text-blue-400' : 'text-gray-500'}`} />
              <Mic className={`w-4 h-4 ${lucianMetrics.odin.audio ? 'text-green-400' : 'text-gray-500'}`} />
              <span className="text-xs text-gray-300">ODIN</span>
            </div>
            
            {/* AI Connection */}
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg border ${
              lucianMetrics.aiConnection.status === 'connected' 
                ? 'bg-green-900/30 border-green-600' 
                : 'bg-red-900/30 border-red-600'
            }`}>
              {lucianMetrics.aiConnection.status === 'connected' ? (
                <Wifi className="w-4 h-4 text-green-400 animate-pulse" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-xs font-semibold ${
                lucianMetrics.aiConnection.status === 'connected' ? 'text-green-300' : 'text-red-300'
              }`}>
                {lucianMetrics.aiConnection.provider.toUpperCase()}
              </span>
              {lucianMetrics.aiConnection.status === 'connected' && lucianMetrics.aiConnection.latency > 0 && (
                <span className="text-xs font-mono text-white">{lucianMetrics.aiConnection.latency}ms</span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Pet Display */}
          <div className="lg:col-span-2 bg-gray-800/50 rounded-xl p-6 border border-gray-600">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Meet {petName}</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowCreatureBuilder(!showCreatureBuilder)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-2 rounded-lg transition-all transform hover:scale-105"
                >
                  <Dna className="w-4 h-4" />
                  <span className="text-white font-bold">Franken-Builder</span>
                </button>
                <button 
                  onClick={() => setShowOdinInterface(!showOdinInterface)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-white">ODIN Eyes/Ears</span>
                </button>
                <button 
                  onClick={() => setShowNeuroForge(!showNeuroForge)}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <Brain className="w-4 h-4" />
                  <span className="text-white">Brain Tweaker</span>
                </button>
                <button 
                  onClick={() => setShowCustomizer(!showCustomizer)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-white">Customize</span>
                </button>
              </div>
            </div>
            
            <PetVisualization />
            
            {/* Pet Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <div className="text-sm text-gray-300">Happiness</div>
                <div className="text-lg font-bold text-white">{petStats.happiness}%</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-sm text-gray-300">Energy</div>
                <div className="text-lg font-bold text-white">{petStats.energy}%</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                <Brain className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-sm text-gray-300">Intelligence</div>
                <div className="text-lg font-bold text-white">{petStats.intelligence}%</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                <Activity className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-sm text-gray-300">Bonding</div>
                <div className="text-lg font-bold text-white">{petStats.bonding}%</div>
              </div>
            </div>
            
            {/* Interaction Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                🍖 Feed
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                🎾 Play
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                🎓 Teach
              </button>
              <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors">
                💝 Pet
              </button>
            </div>
          </div>
          
          {/* Brain Activity Monitor */}
          <div>
            <BrainActivityMonitor 
              brainParameters={brainParameters}
              isActive={true}
            />
          </div>
        </div>
      </div>

      {/* ODIN Sensory Interface Modal */}
      {showOdinInterface && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-600 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-600 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Eye className="w-6 h-6 text-blue-400" />
                <span>{petName}'s ODIN Sensory System</span>
                <Sparkles className="w-5 h-5 text-green-400" />
              </h2>
              <button
                onClick={() => setShowOdinInterface(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <OdinSensoryInterface />
            </div>
          </div>
        </div>
      )}

      {/* NeuroForge Brain Tweaker Modal */}
      {showNeuroForge && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-600 max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-600 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Brain className="w-6 h-6 text-purple-400" />
                <span>{petName}'s Brain Control Center</span>
                <Sparkles className="w-5 h-5 text-pink-400" />
              </h2>
              <button
                onClick={() => setShowNeuroForge(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <PetNeuroForge 
                isHybrid={creatureConfig.species === 'hybrid'}
                onParametersChange={(params) => {
                  setBrainParameters(params);
                  console.log('Brain parameters updated:', params);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Creature Builder Modal */}
      {showCreatureBuilder && (
        <div className="fixed inset-0 z-50">
          <PetBuilderSimple />
          <button
            onClick={() => setShowCreatureBuilder(false)}
            className="fixed top-4 right-4 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
          >
            <span className="text-white text-2xl">✕</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LucianPets;
