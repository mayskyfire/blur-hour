import type { Config } from 'tailwindcss'

export default {
  content: ['./components/**/*.{js,vue,ts}', './layouts/**/*.vue', './pages/**/*.vue', './plugins/**/*.{js,ts}', './app.vue'],
  theme: {
    extend: {
      colors: {
        night: { DEFAULT: '#020617', light: '#0f172a', lighter: '#1e293b' },
        neonGreen: { DEFAULT: '#22c55e', light: '#4ade80', dark: '#16a34a' },
        neonPink: { DEFAULT: '#e11d48', light: '#f43f5e', dark: '#be123c' },
        neonCyan: { DEFAULT: '#0ea5e9', light: '#38bdf8', dark: '#0284c7' }
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(34, 197, 94, 0.5)',
        'neon-pink': '0 0 20px rgba(225, 29, 72, 0.5)',
        'neon-cyan': '0 0 20px rgba(14, 165, 233, 0.5)',
        'card': '0 20px 45px rgba(15, 23, 42, 0.9)'
      },
      borderRadius: { 'card': '1.5rem' }
    }
  },
  plugins: []
} satisfies Config
