export default {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^leaflet$': '<rootDir>/node_modules/leaflet/dist/leaflet.js'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js'
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx}'
  ],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\](?!react-leaflet|@react-leaflet|d3|d3-array|d3-color|d3-format|d3-interpolate|d3-path|d3-scale|d3-shape|d3-time|d3-time-format|internmap|leaflet).+\\.(js|jsx|mjs|cjs|ts|tsx)$'
  ]
};