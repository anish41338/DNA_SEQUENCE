/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-subtle': 'bounceSubtle 0.8s ease-in-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(25px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(77, 157, 224, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(77, 157, 224, 0.6)' },
        },
      },
      colors: {
        // Science-inspired color palette
        primary: {
          50: '#EBF4FE',
          100: '#D1E7FD',
          200: '#A7D0FA',
          300: '#7CB8F7',
          400: '#5BA3F3',
          500: '#4D9DE0', // Main primary blue
          600: '#3B82C7',
          700: '#2B67AE',
          800: '#1E4D95',
          900: '#14397C',
        },
        accent: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#88D498', // Main accent green
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        neutral: {
          50: '#F7FAFC', // Light background
          100: '#EDF2F7',
          200: '#E2E8F0',
          300: '#CBD5E0',
          400: '#A0AEC0',
          500: '#718096',
          600: '#4A5568',
          700: '#2D3748', // Main text color
          800: '#1A202C',
          900: '#171923',
        },
        // Specialized colors for DNA bases
        dna: {
          adenine: '#FF6B6B',   // A - Red
          thymine: '#4ECDC4',   // T - Teal
          cytosine: '#45B7D1',  // C - Blue
          guanine: '#96CEB4',   // G - Green
          gap: '#FFA726',       // Gap - Orange
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4D9DE0 0%, #88D498 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #EBF4FE 0%, #F0FDF4 100%)',
        'gradient-card': 'linear-gradient(145deg, #FFFFFF 0%, #F7FAFC 100%)',
        'dna-pattern': 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%234D9DE0" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(77, 157, 224, 0.1), 0 10px 20px -2px rgba(77, 157, 224, 0.04)',
        'medium': '0 4px 25px -5px rgba(77, 157, 224, 0.15), 0 10px 30px -5px rgba(77, 157, 224, 0.08)',
        'strong': '0 10px 40px -10px rgba(77, 157, 224, 0.25), 0 20px 50px -10px rgba(77, 157, 224, 0.15)',
        'glow': '0 0 20px rgba(77, 157, 224, 0.3)',
      },
    },
  },
  plugins: [],
};