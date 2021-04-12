module.exports = {
  verbose: true,
  clearMocks: true,
  coverageDirectory: 'coverage/jest',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
  ],
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  coverageReporters: [
    'text', 'html',
  ],
  setupFilesAfterEnv: [
    './src/utils/testSetup.js',
  ],
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
};
