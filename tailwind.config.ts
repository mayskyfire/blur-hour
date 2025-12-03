import type { Config } from 'tailwindcss'

export default {
  content: ['./components/**/*.{js,vue,ts}', './layouts/**/*.vue', './pages/**/*.vue', './plugins/**/*.{js,ts}', './app.vue'],
  theme: {
    extend: {
      colors: {
        night: { DEFAULT: '#0E0E33', light: '#1A0033', lighter: '#2A1A4A' },
        neonPink: { DEFAULT: '#FF0066', light: '#FF3385', dark: '#CC0052' },
        neonCyan: { DEFAULT: '#00FFFF', light: '#66FFFF', dark: '#00CCCC' },
        neonGold: { DEFAULT: '#FFC000', light: '#FFD666', dark: '#CC9900' }
      },
      boxShadow: {
        'neon-pink': '0 0 15px rgba(255, 0, 102, 0.3)',
        'neon-cyan': '0 0 15px rgba(0, 255, 255, 0.3)',
        'neon-gold': '0 0 10px rgba(255, 192, 0, 0.25)',
        'card': '0 20px 45px rgba(14, 14, 51, 0.9)'
      },
      borderRadius: { 'card': '1.5rem' }
    }
  },
  plugins: []
} satisfies Config
