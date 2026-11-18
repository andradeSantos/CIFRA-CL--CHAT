import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  target: 'node20',
  platform: 'node',
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['@prisma/client'],
  noExternal: ['@cifra/ccg-core'],
});