# Testing Guide for FRA Atlas GeoPortal Components

## Overview
This guide explains how to properly test the GeoPortal components implemented for the FRA Atlas application.

## Current Testing Challenges
The components use modern ES module syntax and dependencies that require special configuration for testing:

1. ES module imports/exports
2. React-Leaflet library dependencies
3. CSS imports
4. Complex component interactions with maps

## Required Testing Configuration

### 1. Jest Configuration
Create a `jest.config.js` file with the following configuration:

```javascript
export default {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
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
    'node_modules/(?!leaflet|react-leaflet)/'
  ]
};
```

### 2. Babel Configuration
Create a `babel.config.js` file:

```javascript
export default {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ]
};
```

### 3. Required Dependencies
Install the necessary testing dependencies:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom babel-jest @babel/preset-env @babel/preset-react identity-obj-proxy
```

## Component Testing Approaches

### 1. GeoPortalMap Component
Test the following aspects:
- Component renders without crashing
- Layer control panel is displayed
- Legend is rendered with correct items
- Map layers can be toggled

### 2. FRAAtlas Component
Test the following aspects:
- Component renders with mock data
- Map layers are displayed when enabled
- Legend shows all layer types
- Claim detail modal is rendered

### 3. IndiaMap Component
Test the following aspects:
- Component renders the India map
- Target states are highlighted
- Markers are displayed for target states
- Click events are handled correctly

## Mocking Strategy

### 1. React-Leaflet Mocks
```javascript
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  GeoJSON: () => <div data-testid="geojson-layer" />,
  Marker: () => <div data-testid="marker" />,
  Popup: () => <div data-testid="popup" />,
  LayersControl: ({ children }) => <div data-testid="layers-control">{children}</div>,
}));
```

### 2. Leaflet Mocks
```javascript
jest.mock('leaflet', () => ({
  Icon: {
    Default: {
      prototype: {},
      mergeOptions: jest.fn(),
    },
  },
  divIcon: () => ({}),
  circleMarker: () => ({}),
}));
```

### 3. Theme Provider Mock
```javascript
jest.mock('../ThemeProvider.jsx', () => ({
  useTheme: () => ({
    text: 'text-gray-900',
    textMuted: 'text-gray-600',
    cardBg: 'bg-white',
    border: 'border-gray-200',
    inputBg: 'bg-white',
    isDark: false,
  }),
}));
```

## Running Tests

### 1. Run All Tests
```bash
npm test
```

### 2. Run Specific Test File
```bash
npm test src/components/__tests__/GeoPortalMap.test.jsx
```

### 3. Run Tests in Watch Mode
```bash
npm test -- --watch
```

## Troubleshooting Common Issues

### 1. ES Module Errors
Ensure your package.json has `"type": "module"` and all config files use `.js` extension with ES module syntax.

### 2. Transform Ignore Patterns
Add specific libraries that need transformation to the `transformIgnorePatterns` array.

### 3. CSS Import Errors
Use `identity-obj-proxy` to mock CSS imports.

### 4. Async Component Loading
Use `await waitFor` for components that load data asynchronously.

## Best Practices

1. **Test Component Rendering**: Ensure components render without crashing
2. **Test User Interactions**: Verify that user actions trigger expected behavior
3. **Test State Changes**: Check that component state updates correctly
4. **Test Edge Cases**: Handle empty data, loading states, and error conditions
5. **Use Descriptive Test Names**: Make test names clear and specific
6. **Mock External Dependencies**: Isolate component logic from external services
7. **Test Accessibility**: Ensure components are accessible to all users

## Continuous Integration
Configure your CI pipeline to run tests automatically on code changes to ensure component functionality is maintained.