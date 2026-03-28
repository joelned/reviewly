import animate from 'tailwindcss-animate';
var config = {
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        container: {
            center: true,
            padding: '24px',
            screens: {
                '2xl': '1200px',
            },
        },
        extend: {
            colors: {
                background: '#0a0a0a',
                foreground: '#f5f5f5',
                surface: '#111111',
                mutedSurface: '#161616',
                card: '#111111',
                border: '#262626',
                input: '#1f1f1f',
                ring: '#3b82f6',
                primary: {
                    DEFAULT: '#3b82f6',
                    foreground: '#eff6ff',
                },
                success: '#22c55e',
                warning: '#f59e0b',
                destructive: '#ef4444',
                author: '#3b82f6',
                reviewer: '#8b5cf6',
                admin: '#f59e0b',
            },
            borderRadius: {
                lg: '16px',
                md: '12px',
                sm: '10px',
            },
            boxShadow: {
                glow: '0 0 0 1px rgba(59,130,246,0.18), 0 18px 50px rgba(8,15,36,0.45)',
                card: '0 16px 40px rgba(0, 0, 0, 0.28)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            keyframes: {
                'fade-up': {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                shimmer: {
                    from: { backgroundPosition: '200% 0' },
                    to: { backgroundPosition: '-200% 0' },
                },
            },
            animation: {
                'fade-up': 'fade-up 0.3s ease-out',
                shimmer: 'shimmer 2s linear infinite',
            },
            backgroundImage: {
                grid: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            },
            backgroundSize: {
                grid: '40px 40px',
            },
        },
    },
    plugins: [animate],
};
export default config;
