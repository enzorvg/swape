const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const tseslint = require('typescript-eslint');

module.exports = defineConfig([
  { ignores: ['.expo', 'dist', 'node_modules', 'eslint.config.js', 'expo-env.d.ts'] },
  expoConfig,
  tseslint.configs.strictTypeChecked,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: __dirname },
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
]);
