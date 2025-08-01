const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  coverageProvider: 'v8',
  verbose: true,
  transform: {
    ...tsJestTransformCfg,
  },
};
