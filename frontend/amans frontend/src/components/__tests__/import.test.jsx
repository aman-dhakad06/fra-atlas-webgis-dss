import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Test that components can be imported without errors
test('GeoPortalMap can be imported', () => {
  const GeoPortalMap = require('../GeoPortalMap.jsx').default;
  expect(GeoPortalMap).toBeDefined();
});

test('FRAAtlas can be imported', () => {
  const FRAAtlas = require('../FRAAtlas.jsx').default;
  expect(FRAAtlas).toBeDefined();
});

test('IndiaMap can be imported', () => {
  const IndiaMap = require('../IndiaMap.jsx').default;
  expect(IndiaMap).toBeDefined();
});