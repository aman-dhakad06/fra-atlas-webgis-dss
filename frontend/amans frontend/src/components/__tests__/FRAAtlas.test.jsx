import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FRAAtlas from '../FRAAtlas.jsx';

// Mock react-leaflet since it requires a DOM environment
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  GeoJSON: () => <div data-testid="geojson-layer" />,
  Marker: () => <div data-testid="marker" />,
  Popup: () => <div data-testid="popup" />,
  Rectangle: () => <div data-testid="rectangle" />,
  useMap: () => ({}),
}));

jest.mock('leaflet', () => ({
  Icon: {
    Default: {
      prototype: {},
      mergeOptions: jest.fn(),
    },
  },
  divIcon: () => ({}),
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

// Mock ClaimDetailModal
jest.mock('../ClaimDetailModal.jsx', () => {
  return function MockClaimDetailModal() {
    return <div data-testid="claim-detail-modal" />;
  };
});

// Mock the stateVillageData to provide test data
const mockStateVillageData = {
  'Madhya Pradesh': {
    villages: [
      {
        id: 1,
        name: 'Test Village',
        district: 'Test District',
        population: 1000,
        tribalPopulation: 800,
        forestArea: '500 acres',
        center: [23.5, 78.5],
        boundary: [[78.0, 23.0], [78.5, 23.0], [78.5, 23.5], [78.0, 23.5], [78.0, 23.0]]
      }
    ],
    claims: [
      {
        id: 'IFR-001',
        type: 'IFR',
        holder: 'Test Holder',
        village: 'Test Village',
        area: '5 acres',
        status: 'Granted',
        coordinates: [23.5, 78.5],
        claimBoundary: [[78.0, 23.0], [78.5, 23.0], [78.5, 23.5], [78.0, 23.5], [78.0, 23.0]]
      }
    ]
  }
};

describe('FRAAtlas', () => {
  const defaultProps = {
    selectedState: 'Madhya Pradesh',
    selectedDistrict: 'All',
    mapLayers: {
      villageBoundaries: true,
      ifrClaims: true,
      cfrClaims: true,
      landUse: true,
      waterBodies: true,
      fieldReports: true,
      potentialClaims: true,
      changeDetection: true
    },
    theme: {
      text: 'text-gray-900',
      textMuted: 'text-gray-600',
      cardBg: 'bg-white',
      border: 'border-gray-200',
      inputBg: 'bg-white',
      isDark: false,
    }
  };

  test('renders without crashing', () => {
    render(<FRAAtlas {...defaultProps} />);
    
    // Check if the main container is rendered
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    
    // Check if tile layer is rendered
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
  });

  test('renders map layers when enabled', () => {
    render(<FRAAtlas {...defaultProps} />);
    
    // Check if GeoJSON layers are rendered
    expect(screen.getAllByTestId('geojson-layer')).toHaveLength(4);
    
    // Check if markers are rendered
    expect(screen.getAllByTestId('marker')).toHaveLength(6);
    
    // Check if rectangles are rendered
    expect(screen.getAllByTestId('rectangle')).toHaveLength(2);
  });

  test('renders legend with all layer types', () => {
    render(<FRAAtlas {...defaultProps} />);
    
    // Check if legend exists
    const legend = screen.getByText('Legend');
    expect(legend).toBeInTheDocument();
    
    // Check if legend items exist
    expect(screen.getByText('Village Boundary')).toBeInTheDocument();
    expect(screen.getByText('IFR Claim')).toBeInTheDocument();
    expect(screen.getByText('CFR Claim')).toBeInTheDocument();
    expect(screen.getByText('Land Use')).toBeInTheDocument();
    expect(screen.getByText('Water Bodies')).toBeInTheDocument();
    expect(screen.getByText('Change Detection')).toBeInTheDocument();
  });

  test('renders claim detail modal', () => {
    render(<FRAAtlas {...defaultProps} />);
    
    // Check if claim detail modal is rendered
    expect(screen.getByTestId('claim-detail-modal')).toBeInTheDocument();
  });
});