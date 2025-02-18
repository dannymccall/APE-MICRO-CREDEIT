/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "selector", // Change from 'media' to 'class'

    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        screens: {
            tablet: "640px",
            phone: "375px",
            laptop: "1024px",

            desktop: "1280px",
        },
        extend: {},
    },
    plugins: [require("daisyui")],
};