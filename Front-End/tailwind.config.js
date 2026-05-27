/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      // backgroundImage: {
        colors:{
    
          "TextWhite" : "#DDF4E7",
          "LightGreen" : "#67C090",
          "Blue" : "#26667F",
          "DarkBlue" : "#124170",
        },
        boxShadow:{
          "darker-shadow": "2px 2px 8px black",
          "darker-shadow-": "box-shadow: -2px -2px 8px black;"
        },
      //   'mainBG': "url('./assets/images/wp.png')",
      // }

    },
    // colors:{
    //   "Dark" :  "#2C3531",
    //   "Green" :  "#116466",
    //   "DarkSkin" :  "#D9B08C",
    //   "Skin" :  "#FFCB9A",
    //   "LightGreen" :  "#D1E8E2",
    //   "BlueGreen" :  "#2cc9a7",
    // },
  },
  plugins: [
    flowbite.plugin(),
  ],
}