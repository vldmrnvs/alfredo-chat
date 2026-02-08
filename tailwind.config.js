/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                "shiny-text": "shiny-text 8s infinite",
            },
            keyframes: {
                "shiny-text": {
                    "0%, 100%": {
                        "background-size": "200% 200%",
                        "background-position": "left center",
                    },
                    "50%": {
                        "background-size": "200% 200%",
                        "background-position": "right center",
                    },
                },
            },
        },
        fontFamily: {
            display: ['Geist Sans', 'sans-serif'],
            body: ['Geist Sans', 'sans-serif'],
        },
    },
    plugins: [],
}
