module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js', // Include all your source files
    '!src/config/**', // Exclude config if needed
    '!src/app.js'    // Exclude main app if desired
  ],
};
