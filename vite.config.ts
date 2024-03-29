import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

type viteConfigInput = {
  mode: string;
  command: string;
};

// https://vitejs.dev/config/
export default ({ mode }: viteConfigInput) => {
  const generateScopedName = mode === 'production' ? '[hash:base64:5]' : '[local]__[hash:base64:5]';

  return defineConfig({
    server: {
      port: 8080,
    },
    css: {
      modules: {
        generateScopedName,
        localsConvention: 'camelCase' || 'dashes',
      },
    },
    plugins: [
      react(),
      checker({
        typescript: true,
      }),
      tsconfigPaths(),
    ],
  });
};
