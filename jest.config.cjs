const { createCjsPreset } = require('jest-preset-angular/presets');

module.exports = {
  ...createCjsPreset({ tsconfig: '<rootDir>/tsconfig.jest.json' }),
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['<rootDir>/src/**/*.jest.test.ts'],
};
