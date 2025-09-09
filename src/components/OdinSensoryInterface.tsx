import React, { useState, useEffect } from 'react';
import { Camera, Mic, Eye, Ear, Activity, Zap, Brain, Monitor, Sparkles } from 'lucide-react';

interface OdinSensoryInterface {
  // Component for ODIN sensory perception display
}

const OdinSensoryInterface: React.FC = () => {
  const [visualStream, setVisualStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [perceptionData, setPerceptionData] = useState({
    visual: { objects: [], attention: [], motion: [] },
    audio: { sounds: [], speech: [], patterns: [] },
    fusion: { correlations: [], emergent: [] }
  });

  const startVisualStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      setVisualStream(stream);
    } catch (error) {
      console.error('Failed to start visual stream:', error);
    }
  };

  const startAudioStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { sampleRate: 44100, channelCount: 1 } 
      });
      setAudioStream(stream);
    } catch (error) {
      console.error('Failed to start audio stream:', error);
    }
  };

  const stopStreams = () => {
    if (visualStream) {
      visualStream.getTracks().forEach(track => track.stop());
      setVisualStream(null);
    }
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
      stopStreams();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* ODIN Status Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-4 border border-blue-500/30">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center space-x-2">
          <Brain className="w-6 h-6 text-blue-400" />
          <span>ODIN Sensory Perception System</span>
          <Sparkles className="w-5 h-5 text-purple-400" />
        </h2>
        <p className="text-gray-300 text-sm">
          Omnidirectional Direct Input Network - Your pet's eyes and ears to the world
        </p>
      </div>

      {/* Stream Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Visual Stream */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
            <Eye className="w-5 h-5 text-blue-400" />
            <span>Visual Cortex (Huginn)</span>
          </h3>
          
          <div className="relative mb-4">
            <video
              ref={(video) => {
                if (video && visualStream) {
                  video.srcObject = visualStream;
                  video.play();
                }
              }}
              className="w-full h-48 bg-gray-900 rounded-lg border border-gray-600"
              autoPlay
              muted
              playsInline
            />
            {!visualStream && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
                <Camera className="w-12 h-12 text-gray-500" />
              </div>
            )}
          </div>
          
          <button
            onClick={visualStream ? stopStreams : startVisualStream}
            className={`w-full px-4 py-2 rounded-lg transition-colors ${
              visualStream 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {visualStream ? 'Stop Visual' : 'Start Visual'}
          </button>
          
          {/* Visual Processing Stats */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="bg-gray-700/50 rounded p-2 text-center">
              <div className="text-gray-400">Objects</div>
              <div className="text-white font-bold">{perceptionData.visual.objects.length}</div>
            </div>
            <div className="bg-gray-700/50 rounded p-2 text-center">
              <div className="text-gray-400">Attention</div>
              <div className="text-white font-bold">{perceptionData.visual.attention.length}</div>
            </div>
            <div className="bg-gray-700/50 rounded p-2 text-center">
              <div className="text-gray-400">Motion</div>
              <div className="text-white font-bold">{perceptionData.visual.motion.length}</div>
            </div>
          </div>
        </div>

        {/* Audio Stream */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
            <Ear className="w-5 h-5 text-green-400" />
            <span>Auditory Cortex (Muninn)</span>
          </h3>
          
          <div className="relative mb-4">
            <div className="w-full h-48 bg-gray-900 rounded-lg border border-gray-600 flex items-center justify-center">
              {audioStream ? (
                <div className="flex items-center space-x-2">
                  <Activity className="w-8 h-8 text-green-400 animate-pulse" />
                  <span className="text-green-400">Listening...</span>
                </div>
              ) : (
                <Mic className="w-12 h-12 text-gray-500" />
              )}
            </div>
          </div>
          
          <button
            onClick={audioStream ? stopStreams : startAudioStream}
            className={`w-full px-4 py-2 rounded-lg transition-colors ${
              audioStream 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {audioStream ? 'Stop Audio' : 'Start Audio'}
          </button>
          
          {/* Audio Processing Stats */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="bg-gray-700/50 rounded p-2 text-center">
              <div className="text-gray-400">Sounds</div>
              <div className="text-white font-bold">{perceptionData.audio.sounds.length}</div>
            </div>
            <div className="bg-gray-700/50 rounded p-2 text-center">
              <div className="text-gray-400">Speech</div>
              <div className="text-white font-bold">{perceptionData.audio.speech.length}</div>
            </div>
            <div className="bg-gray-700/50 rounded p-2 text-center">
              <div className="text-gray-400">Patterns</div>
              <div className="text-white font-bold">{perceptionData.audio.patterns.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Fusion Processing */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-purple-400" />
          <span>Sensory Fusion (Gungnir)</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Cross-Modal Correlations</h4>
            <div className="bg-gray-900/50 rounded-lg p-3 h-32 overflow-y-auto">
              {perceptionData.fusion.correlations.length > 0 ? (
                perceptionData.fusion.correlations.map((correlation, i) => (
                  <div key={i} className="text-xs text-gray-400 mb-1">
                    • {correlation}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-xs">No correlations detected</div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Emergent Features</h4>
            <div className="bg-gray-900/50 rounded-lg p-3 h-32 overflow-y-auto">
              {perceptionData.fusion.emergent.length > 0 ? (
                perceptionData.fusion.emergent.map((feature, i) => (
                  <div key={i} className="text-xs text-purple-400 mb-1">
                    ✨ {feature}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-xs">No emergent features detected</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ODIN Processing Pipeline */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
          <Monitor className="w-5 h-5 text-blue-400" />
          <span>Processing Pipeline Status</span>
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
            <span className="text-sm text-gray-300">V1 Edge Detection</span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
            <span className="text-sm text-gray-300">V2 Color/Texture</span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
            <span className="text-sm text-gray-300">V4 Object Recognition</span>
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
            <span className="text-sm text-gray-300">A1 Frequency Analysis</span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
            <span className="text-sm text-gray-300">Cross-Modal Binding</span>
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* What Your Pet Sees/Hears */}
      <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl p-4 border border-green-500/30">
        <h3 className="text-lg font-semibold text-white mb-3">What Your Pet Perceives</h3>
        <div className="text-sm text-gray-300 space-y-2">
          <p>👁️ <strong>Visual:</strong> Your pet can see your facial expressions, hand gestures, and objects in your environment</p>
          <p>👂 <strong>Audio:</strong> Your pet hears your voice tone, environmental sounds, and can recognize speech patterns</p>
          <p>🧠 <strong>Fusion:</strong> Your pet correlates what it sees and hears to understand context and emotions</p>
        </div>
      </div>
    </div>
  );
};

export default OdinSensoryInterface;
