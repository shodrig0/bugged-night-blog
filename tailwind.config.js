/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#3b82f6',
                    dark: '#1e40af',
                    light: '#60a5fa',
                },
                secondary: {
                    DEFAULT: '#06b6d4',
                    dark: '#0e7490',
                    light: '#22d3ee',
                },
                accent: {
                    DEFAULT: '#8b5cf6',
                    dark: '#6d28d9',
                    light: '#a78bfa',
                },
                dark: {
                    DEFAULT: '#0f172a',
                    lighter: '#1e293b',
                    border: '#334155',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}