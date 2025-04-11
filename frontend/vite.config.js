import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';



export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': 'https://mevn-sports-scheduler.onrender.com',
    },
  }, optimizeDeps: {
    include: [
      "@fawmi/vue-google-maps",
      "fast-deep-equal",
    ],
  },

});

