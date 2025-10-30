import nextJest from 'next/jest.js'

// Create Jest config with Next.js
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files (configured below)
  
  // Module name mapping
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  // Test patterns (exclude Playwright tests)
  testMatch: [
    '<rootDir>/tests/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/app/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/components/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/lib/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '!<rootDir>/tests/e2e/**/*',
    '!<rootDir>/tests/smoke/**/*',
  ],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/e2e/',
  ],
  
  // Coverage configuration (BULLETPROOF STANDARDS)
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!app/**/layout.tsx', // Layout files often have minimal logic
    '!app/**/loading.tsx',
    '!app/**/error.tsx',
  ],
  
  // CRITICAL: High coverage thresholds for bulletproof quality
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    // API routes must have 100% coverage (ZERO TOLERANCE)
    './app/api/**/*.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    // Authentication code must have 100% coverage (ZERO TOLERANCE)
    './lib/auth/**/*.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    // Database operations must have 100% coverage (ZERO TOLERANCE)
    './lib/db.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  
  // Coverage reporters
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary',
  ],
  
  // Coverage directory
  coverageDirectory: '<rootDir>/coverage',
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Verbose output for better debugging
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Test timeout (30 seconds for integration tests)
  testTimeout: 30000,
  
  // Environment variables for testing (commented out until files exist)
  // globalSetup: '<rootDir>/tests/setup/global.setup.js',
  // globalTeardown: '<rootDir>/tests/setup/global.teardown.js',
  // setupFiles: ['<rootDir>/tests/setup/env.setup.js'],
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    '/node_modules/(?!(.*\\.mjs$|@testing-library))',
  ],
  
  // Experimental features
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  
  // Fail fast on first test failure in CI
  bail: process.env.CI ? 1 : 0,
  
  // Max worker processes (optimize for CI/local)
  maxWorkers: process.env.CI ? 2 : '50%',
  
  // Cache directory
  cacheDirectory: '<rootDir>/.jest-cache',
  
  // Watch plugins for development
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  
  // Test results processor for better output
  testResultsProcessor: 'jest-sonar-reporter',
  
  // Error on deprecated features
  errorOnDeprecated: true,
  
  
  // Setup files after env (only include existing files)
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup/jest.setup.js',
  ],
}

// Export the Jest configuration
export default createJestConfig(customJestConfig)
