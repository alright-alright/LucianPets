import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stage, Float, MeshReflectorMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { 
  Sparkles, Palette, Shirt, Crown, Glasses, Heart, 
  ChevronLeft, ChevronRight, Save, Share, Shuffle,
  Cat, Dog, Bird, Fish, Bug, Ghost, Zap, Dna
} from 'lucide-react';

// Pet part types
interface PetPart {
  id: string;
  name: string;
  category: 'head' | 'body' | 'arms' | 'legs' | 'tail' | 'wings' | 'extras';
  species?: string[];
  color?: string;
  material?: 'fur' | 'scales' | 'feathers' | 'ethereal' | 'metal' | 'crystal';
}

interface PetConfiguration {
  head: PetPart;
  body: PetPart;
  arms?: PetPart;
  legs?: PetPart;
  tail?: PetPart;
  wings?: PetPart;
  extras?: PetPart[];
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  material: string;
  outfit?: string;
  accessories?: string[];
}

// 3D Pet Model Component
const PetModel: React.FC<{ config: PetConfiguration; autoRotate: boolean }> = ({ config, autoRotate }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  // Procedural pet generation based on config
  const generatePetGeometry = () => {
    const group = new THREE.Group();
    
    // Head
    const headGeometry = getGeometryForPart(config.head);
    const headMaterial = new THREE.MeshStandardMaterial({ 
      color: config.primaryColor,
      metalness: config.material === 'metal' ? 0.8 : 0.1,
      roughness: config.material === 'crystal' ? 0.1 : 0.7,
    });
    const headMesh = new THREE.Mesh(headGeometry, headMaterial);
    headMesh.position.y = 1.5;
    group.add(headMesh);
    
    // Body
    const bodyGeometry = getGeometryForPart(config.body);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: config.primaryColor,
      metalness: config.material === 'metal' ? 0.8 : 0.1,
      roughness: config.material === 'crystal' ? 0.1 : 0.7,
    });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(bodyMesh);
    
    return group;
  };

  const getGeometryForPart = (part: PetPart): THREE.BufferGeometry => {
    // Simplified geometry generation - in real app would load models
    switch (part.category) {
      case 'head':
        if (part.id.includes('cat')) return new THREE.ConeGeometry(0.5, 0.8, 8);
        if (part.id.includes('dog')) return new THREE.BoxGeometry(0.8, 0.8, 0.8);
        if (part.id.includes('dragon')) return new THREE.DodecahedronGeometry(0.6);
        return new THREE.SphereGeometry(0.6, 32, 32);
      case 'body':
        if (part.id.includes('snake')) return new THREE.CylinderGeometry(0.3, 0.3, 2, 8);
        if (part.id.includes('bird')) return new THREE.ConeGeometry(0.6, 1.2, 8);
        return new THREE.BoxGeometry(1, 1.5, 0.8);
      default:
        return new THREE.BoxGeometry(0.5, 0.5, 0.5);
    }
  };

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={meshRef}>
        <primitive object={generatePetGeometry()} />
        {/* Add sparkles for magical creatures */}
        {config.material === 'ethereal' && (
          <Sparkles count={100} scale={3} size={2} speed={0.4} />
        )}
      </group>
    </Float>
  );
};

// Part selection data
const PET_PARTS = {
  heads: [
    { id: 'cat_head', name: 'Cat Head', category: 'head' as const, species: ['cat'], material: 'fur' },
    { id: 'dog_head', name: 'Dog Head', category: 'head' as const, species: ['dog'], material: 'fur' },
    { id: 'dragon_head', name: 'Dragon Head', category: 'head' as const, species: ['dragon'], material: 'scales' },
    { id: 'ghost_head', name: 'Ghost Head', category: 'head' as const, species: ['ghost'], material: 'ethereal' },
    { id: 'robot_head', name: 'Robot Head', category: 'head' as const, species: ['robot'], material: 'metal' },
    { id: 'crystal_head', name: 'Crystal Head', category: 'head' as const, species: ['elemental'], material: 'crystal' },
  ],
  bodies: [
    { id: 'cat_body', name: 'Cat Body', category: 'body' as const, species: ['cat'], material: 'fur' },
    { id: 'dog_body', name: 'Dog Body', category: 'body' as const, species: ['dog'], material: 'fur' },
    { id: 'dragon_body', name: 'Dragon Body', category: 'body' as const, species: ['dragon'], material: 'scales' },
    { id: 'snake_body', name: 'Snake Body', category: 'body' as const, species: ['snake'], material: 'scales' },
    { id: 'bird_body', name: 'Bird Body', category: 'body' as const, species: ['bird'], material: 'feathers' },
    { id: 'cloud_body', name: 'Cloud Body', category: 'body' as const, species: ['elemental'], material: 'ethereal' },
  ],
  // Add more parts...
};

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
];

const OUTFITS = [
  { id: 'wizard', name: 'Wizard Robe', icon: '🧙‍♂️' },
  { id: 'knight', name: 'Knight Armor', icon: '⚔️' },
  { id: 'pirate', name: 'Pirate Outfit', icon: '🏴‍☠️' },
  { id: 'astronaut', name: 'Space Suit', icon: '🚀' },
  { id: 'ninja', name: 'Ninja Suit', icon: '🥷' },
  { id: 'royal', name: 'Royal Garb', icon: '👑' },
];

const PetBuilder3D: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'parts' | 'colors' | 'outfits'>('parts');
  const [autoRotate, setAutoRotate] = useState(true);
  const [petConfig, setPetConfig] = useState<PetConfiguration>({
    head: PET_PARTS.heads[0],
    body: PET_PARTS.bodies[0],
    primaryColor: '#4ECDC4',
    secondaryColor: '#45B7D1',
    accentColor: '#FFEAA7',
    material: 'fur',
  });

  const randomizePet = () => {
    setPetConfig({
      ...petConfig,
      head: PET_PARTS.heads[Math.floor(Math.random() * PET_PARTS.heads.length)],
      body: PET_PARTS.bodies[Math.floor(Math.random() * PET_PARTS.bodies.length)],
      primaryColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      secondaryColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      material: ['fur', 'scales', 'feathers', 'ethereal', 'metal', 'crystal'][Math.floor(Math.random() * 6)],
    });
  };

  const savePet = () => {
    const configJson = JSON.stringify(petConfig, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `franken-pet-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* 3D Preview Area */}
      <div className="flex-1 relative">
        <Canvas className="w-full h-full">
          <PerspectiveCamera makeDefault position={[0, 2, 5]} />
          <OrbitControls 
            enablePan={false} 
            maxPolarAngle={Math.PI / 2} 
            minPolarAngle={Math.PI / 4}
            autoRotate={autoRotate}
            autoRotateSpeed={1}
          />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          
          <Suspense fallback={null}>
            <PetModel config={petConfig} autoRotate={false} />
            <Environment preset="sunset" />
            <Stage environment={null} intensity={0.5}>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
                <planeGeometry args={[10, 10]} />
                <MeshReflectorMaterial
                  blur={[300, 100]}
                  resolution={2048}
                  mixBlur={1}
                  mixStrength={40}
                  roughness={1}
                  depthScale={1.2}
                  minDepthThreshold={0.4}
                  maxDepthThreshold={1.4}
                  color="#101010"
                  metalness={0.5}
                />
              </mesh>
            </Stage>
          </Suspense>
        </Canvas>

        {/* Preview Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="p-2 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-colors"
          >
            <RotateCcw className={`w-5 h-5 text-white ${autoRotate ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={randomizePet}
            className="p-2 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-colors"
          >
            <Shuffle className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={savePet}
            className="p-2 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-colors"
          >
            <Save className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Pet Name Display */}
        <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md rounded-lg p-4">
          <h2 className="text-2xl font-bold text-white mb-1">
            {petConfig.head.name.split(' ')[0]} - {petConfig.body.name.split(' ')[0]} Hybrid
          </h2>
          <p className="text-white/70">Material: {petConfig.material}</p>
        </div>
      </div>

      {/* Customization Panel */}
      <div className="w-full lg:w-96 bg-black/30 backdrop-blur-xl p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <Dna className="w-8 h-8" />
          Franken-Creature Builder
        </h1>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {['parts', 'colors', 'outfits'].map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab as any)}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                currentTab === tab
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {currentTab === 'parts' && (
            <motion.div
              key="parts"
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
                <div className="grid grid-cols-3 gap-2">
                  {PET_PARTS.heads.map((head) => (
                    <button
                      key={head.id}
                      onClick={() => setPetConfig({ ...petConfig, head })}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        petConfig.head.id === head.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {head.name}
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
                <div className="grid grid-cols-3 gap-2">
                  {PET_PARTS.bodies.map((body) => (
                    <button
                      key={body.id}
                      onClick={() => setPetConfig({ ...petConfig, body })}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        petConfig.body.id === body.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {body.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentTab === 'colors' && (
            <motion.div
              key="colors"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Primary Color */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Primary Color
                </h3>
                <div className="grid grid-cols-6 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setPetConfig({ ...petConfig, primaryColor: color })}
                      className={`w-full h-12 rounded-lg border-2 transition-all ${
                        petConfig.primaryColor === color
                          ? 'border-white scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Material Selection */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Material
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {['fur', 'scales', 'feathers', 'ethereal', 'metal', 'crystal'].map((material) => (
                    <button
                      key={material}
                      onClick={() => setPetConfig({ ...petConfig, material })}
                      className={`p-3 rounded-lg text-sm font-medium capitalize transition-all ${
                        petConfig.material === material
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentTab === 'outfits' && (
            <motion.div
              key="outfits"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Shirt className="w-5 h-5" />
                  Outfits
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {OUTFITS.map((outfit) => (
                    <button
                      key={outfit.id}
                      onClick={() => setPetConfig({ ...petConfig, outfit: outfit.id })}
                      className={`p-4 rounded-lg transition-all ${
                        petConfig.outfit === outfit.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <div className="text-2xl mb-1">{outfit.icon}</div>
                      <div className="text-sm font-medium">{outfit.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
            Create Franken-Pet
          </button>
          <button className="w-full py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors">
            Load From Gallery
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetBuilder3D;