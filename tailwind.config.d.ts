declare const config: {
    darkMode: ["class"];
    content: string[];
    theme: {
        container: {
            center: true;
            padding: string;
            screens: {
                '2xl': string;
            };
        };
        extend: {
            colors: {
                background: string;
                foreground: string;
                surface: string;
                mutedSurface: string;
                card: string;
                border: string;
                input: string;
                ring: string;
                primary: {
                    DEFAULT: string;
                    foreground: string;
                };
                success: string;
                warning: string;
                destructive: string;
                author: string;
                reviewer: string;
                admin: string;
            };
            borderRadius: {
                lg: string;
                md: string;
                sm: string;
            };
            boxShadow: {
                glow: string;
                card: string;
            };
            fontFamily: {
                sans: [string, string];
                mono: [string, string];
            };
            keyframes: {
                'fade-up': {
                    from: {
                        opacity: string;
                        transform: string;
                    };
                    to: {
                        opacity: string;
                        transform: string;
                    };
                };
                shimmer: {
                    from: {
                        backgroundPosition: string;
                    };
                    to: {
                        backgroundPosition: string;
                    };
                };
            };
            animation: {
                'fade-up': string;
                shimmer: string;
            };
            backgroundImage: {
                grid: string;
            };
            backgroundSize: {
                grid: string;
            };
        };
    };
    plugins: {
        handler: () => void;
    }[];
};
export default config;
