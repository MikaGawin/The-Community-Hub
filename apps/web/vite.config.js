import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from "dotenv";
const ENV = process.env.NODE_ENV || "development";
dotenv.config();({
  path: `${__dirname}/../../../.env.${ENV}`,
});


export default defineConfig({
  root: './apps/web',
  plugins: [react()],
  server: {
    port: 5173,
  },
  define: {
    "process.env.VITE_GOOGLE_API_KEY": JSON.stringify(process.env.VITE_GOOGLE_API_KEY),
    "process.env.VITE_GOOGLE_CLIENT_ID": JSON.stringify(process.env.VITE_GOOGLE_CLIENT_ID),
  },
})