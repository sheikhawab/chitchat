import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // server: {
  //     host:  "https://27e28f80b6ee.ngrok-free.app/" ,  // Allow access from any IP, including ngrok
  //     // host:  "726c2b012304.ngrok-free.app" ,  // Allow access from any IP, including ngrok
  //   port: 5173,        // Port your Vite server is running on
  //   strictPort: true,  // Ensures the server always runs on the specified port
  //   cors: true,        // Enable CORS for cross-origin requests
  // },
})
