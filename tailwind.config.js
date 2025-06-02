/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#0d141c' /* Dark text color */,
        secondary: '#4f7396' /* Muted secondary text color */,
        'box-background': '#e8edf2' /* Light background for boxes */,
        'table-column': '#e5e8eb' /* Light gray for table columns */,
        'soft-white': '#e5e8eb' /* Light gray for table columns */,

        /* Info Alert */
        'info-bg-light': '#eff6ff',
        'info-text-light': '#1e40af',
        'info-border-light': '#bfdbfe',
        'info-bg-dark': '#1e3a8a',
        'info-text-dark': '#93c5fd',
        'info-border-dark': '#1e40af',

        /* Danger Alert */
        'danger-bg-light': '#fee2e2',
        'danger-text-light': '#991b1b',
        'danger-border-light': '#fca5a5',
        'danger-bg-dark': '#7f1d1d',
        'danger-text-dark': '#f87171',
        'danger-border-dark': '#991b1b',

        /* Success Alert */
        'success-bg-light': '#d1fae5',
        'success-text-light': '#065f46',
        'success-border-light': '#6ee7b7',
        'success-bg-dark': '#064e3b',
        'success-text-dark': '#34d399',
        'success-border-dark': '#065f46',

        /* Warning Alert */
        'warning-bg-light': '#fef3c7',
        'warning-text-light': '#92400e',
        'warning-border-light': '#fcd34d',
        'warning-bg-dark': '#78350f',
        'warning-text-dark': '#fbbf24',
        'warning-border-dark': '#92400e',

        /* Dark Alert */
        'dark-bg-light': '#f3f4f6',
        'dark-text-light': '#1f2937',
        'dark-border-light': '#d1d5db',
        'dark-bg-dark': '#1f2937',
        'dark-text-dark': '#9ca3af',
        'dark-border-dark': '#374151',
      },
    },
  },
  plugins: [],
};
