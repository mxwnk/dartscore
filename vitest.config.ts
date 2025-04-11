import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'url';


export default defineConfig({
    resolve: {
        alias: {
          '@': fileURLToPath(new URL('./', import.meta.url)),
        },
      },
  })