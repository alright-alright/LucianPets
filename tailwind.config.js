/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AerwareAI Brand Colors
        'aerware': {
          'primary': '#8B5CF6',
          'secondary': '#06B6D4',
          'accent': '#F59E0B',
        },
        
        // Lucian Component Colors
        'lucian': {
          'blue': '#3B82F6',
          'purple': '#8B5CF6',
          'cyan': '#06B6D4',
          'emerald': '#10B981',
        },
        
        // Pet Emotional States
        'pet': {
          'happy': '#22C55E',
          'excited': '#F59E0B',
          'calm': '#6366F1',
          'sleepy': '#64748B',
          'hungry': '#EF4444',
          'playful': '#EC4899',
          'curious': '#8B5CF6',
          'content': '#10B981'
        },
        
        // ODIN Sensory Colors
        'odin': {
          'visual': '#3B82F6',
          'audio': '#10B981',
          'fusion': '#8B5CF6'
        },
        
        // NeuroForge Colors
        'neuroforge': {
          'safe': '#10B981',
          'optimal': '#3B82F6',
          'warning': '#F59E0B',
          'danger': '#EF4444'
        }
      },
      animation: {
        'pet-bounce': 'bounce 1s infinite',
        'pet-wiggle': 'wiggle 0.5s ease-in-out infinite alternate',
        'lucian-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'neuroforge-shimmer': 'shimmer 2s linear infinite',
        'memory-flow': 'flow 3s ease-in-out infinite',
        'odin-scan': 'scan 1.5s ease-in-out infinite',
        'brain-fire': 'brain-fire 0.8s ease-in-out infinite',
        'cognitive-wave': 'cognitive-wave 4s ease-in-out infinite'
      },
      keyframes: {
        wiggle: {
          '0%': { transform: 'rotate(-3deg)' },
          '100%': { transform: 'rotate(3deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        flow: {
          '0%, 100%': { opacity: 0.4, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1.1)' },
        },
        scan: {
          '0%, 100%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' }
        },
        'brain-fire': {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.3) saturate(1.2)' }
        },
        'cognitive-wave': {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.05) rotate(1deg)' },
          '50%': { transform: 'scale(1.1) rotate(0deg)' },
          '75%': { transform: 'scale(1.05) rotate(-1deg)' }
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'lucian': '0 0 20px rgba(139, 92, 246, 0.3)',
        'odin': '0 0 20px rgba(59, 130, 246, 0.3)',
        'neuroforge': '0 0 25px rgba(245, 158, 11, 0.4)',
        'pet-glow': '0 0 30px rgba(34, 197, 94, 0.5)'
      }
    },
  },
  plugins: [],
}
