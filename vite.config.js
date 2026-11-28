import { defineConfig } from "vite"; 
import react from "@vitejs/plugin-react";    //enables React integration

export default defineConfig({               //defines the Vite configuration
    plugins: [react()],                    //enables React integration
    server: {port: 5173,strictPort: true} //prevents Vite from switching to another port automatically
});