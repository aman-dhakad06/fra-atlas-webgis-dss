import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GeoPortalMap from '../GeoPortalMap.jsx';

// Mock react-leaflet since it requires a DOM environment
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  GeoJSON: () => <div data-testid="geojson-layer" />,
  Marker: () => <div data-testid="marker" />,
  Popup: () => <div data-testid="popup" />,
  LayersControl: Object.assign(
    ({ children }) => <div data-testid="layers-control">{children}</div>,
    {
      BaseLayer: ({ children }) => <div data-testid="base-layer">{children}</div>,
      OverlayLayer: ({ children }) => <div data-testid="overlay-layer">{children}</div>,
    }
  ),
}));

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

// Mock the ThemeProvider
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

describe('GeoPortalMap', () => {
  test('renders without crashing', () => {
    render(<GeoPortalMap selectedState="Madhya Pradesh" />);
    
    // Check if the main container is rendered
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    
    // Check if layers control is rendered
    expect(screen.getByTestId('layers-control')).toBeInTheDocument();
    
    // Check if base layers are rendered
    expect(screen.getAllByTestId('base-layer')).toHaveLength(2);
  });

  test('renders layer control panel', () => {
    render(<GeoPortalMap selectedState="Madhya Pradesh" />);
    
    // Check if layer control panel exists
    const layerControls = screen.getAllByRole('checkbox');
    expect(layerControls.length).toBeGreaterThan(0);
  });

  test('renders legend', () => {
    render(<GeoPortalMap selectedState="Madhya Pradesh" />);
    
    // Check if legend exists by looking for legend items
    const legendItems = screen.getAllByText(/Village Boundary|IFR Claim|CFR Claim/);
    expect(legendItems.length).toBeGreaterThan(0);
  });
});