/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: '#0F172A',
        'slate-dark': '#1E293B',
        emerald: '#10B981',
        profit: '#22C55E',
        loss: '#EF4444',
        'off-white': '#F8FAFC',
      },
      borderRadius: {
        card: '24px',
      },
    },
  },
  plugins: [],
}

