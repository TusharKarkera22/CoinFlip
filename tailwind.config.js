/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx}"],
  theme: {
    extend: {
      fontFamily:{
        'lufga':['Lufga', 'sans-serif'],
        'gilroy':['Gilroy', 'sans-serif'],
        
      },
      keyframes: {
        shine: {
          '0%, 25%': { 'background-position': '-50rem 0' },
          '100%': { 'background-position': '30rem 0' },
        },
        
      },
      animation: {
        shine: 'shine 4s linear infinite alternate',
        
      },
      
    },
  },
  plugins: [],
}

