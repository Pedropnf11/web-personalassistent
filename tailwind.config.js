/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Premium Void Theme - Black + Purple Gradients
                void: {
                    obsidian: '#000000',    // Pure Black
                    dark: '#09090b',        // Zinc 950
                    card: '#121217',        // Slightly lighter for cards
                    border: '#27272a',      // Zinc 800
                },
                primary: {
                    DEFAULT: '#a855f7',     // Purple 500
                    glow: '#d946ef',        // Fuchsia 500
                    dark: '#7e22ce',        // Purple 700
                },
                accent: {
                    cyan: '#06b6d4',        // Cyan 500 (secondary accent)
                    rose: '#f43f5e',        // Rose 500 (danger)
                    amber: '#f59e0b',       // Amber 500 (warning)
                }
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'], // Outfit is more premium/modern
            },
            backgroundImage: {
                'gradient-premium': 'linear-gradient(135deg, #a855f7 0%, #d946ef 100%)',
                'gradient-dark': 'linear-gradient(to bottom, #000000 0%, #121217 100%)',
                'gradient-card': 'linear-gradient(145deg, #1a1a20 0%, #121217 100%)',
            },
            boxShadow: {
                'glow-purple': '0 0 20px rgba(168, 85, 247, 0.25)',
                'glow-strong': '0 0 30px rgba(217, 70, 239, 0.4)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
