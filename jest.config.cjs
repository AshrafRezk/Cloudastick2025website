module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'netlify/functions/**/*.js',
    '!netlify/functions/**/*.test.js',
    '!netlify/functions/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};

