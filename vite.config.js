import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { resolve } from 'path';

export default defineConfig({
  plugins: [viteSingleFile()],
  root: resolve(__dirname, 'src/'),
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/ui/index.html'),
      },
    },
    outDir: resolve(__dirname, 'gas/'),
  },
});
