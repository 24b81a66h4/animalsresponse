/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,jsx}',
    ],
    theme: {
        extend: {
            keyframes: {
                blob: {
                    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                },
            },
            animation: {
                blob: 'blob 7s infinite',
            },
        },
    },
    safelist: [
        'animate-fade-up',
        'animate-fade-up-delay-1',
        'animate-fade-up-delay-2',
        'animate-fade-up-delay-3',
        'animate-fade-in',
        'animate-fade-in-delay-1',
        'animate-fade-in-delay-2',
        'animate-fade-in-delay-3',
        'animate-scale-in',
        'animate-slide-left',
        'animate-slide-right',
        'animate-blob',
        'animation-delay-2000',
        'animation-delay-4000',
        'stagger-children',
    ],
    plugins: [],
};