import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import { useMapErrorHandler } from '../hooks/useMapErrorHandler.js';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Globe component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🌍</div>
            <h3 className={`text-lg font-semibold ${theme.textSecondary} mb-2`}>
              Globe Failed to Load
            </h3>
            <p className={`text-sm ${theme.textMuted} mb-4`}>
              There was an issue loading the 3D globe component.
            </p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const InteractiveGlobe = ({ onStateClick, selectedStates = [] }) => {
  const globeEl = useRef();
  const [globeReady, setGlobeReady] = useState(false);
  const [countries, setCountries] = useState([]);
  const { error, handleError, clearError } = useMapErrorHandler();

  // India states data with coordinates
  const indiaStates = [
    { name: 'Madhya Pradesh', lat: 23.47, lng: 77.94, color: '#ff6b6b' },
    { name: 'Tripura', lat: 23.83, lng: 91.28, color: '#4ecdc4' },
    { name: 'Odisha', lat: 20.95, lng: 85.09, color: '#45b7d1' },
    { name: 'Telangana', lat: 18.11, lng: 79.01, color: '#96ceb4' }
  ];

  // Load world countries data
  useEffect(() => {
    const loadWorldData = async () => {
      const urls = [
        'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson',
        'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json',
        'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
      ];
      
      for (const url of urls) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            // Handle different data formats
            if (data.features) {
              setCountries(data.features);
            } else if (data.objects && data.objects.countries) {
              // Handle TopoJSON format
              setCountries([]);
            } else {
              setCountries([]);
            }
            return;
          }
        } catch (err) {
          console.warn(`Failed to load world data from ${url}:`, err);
          handleError(`Failed to load globe data from ${url}`, err);
        }
      }
      
      console.log('All world data URLs failed, using empty array');
      handleError('Could not load world boundary data. Globe will show India states only.');
      setCountries([]);
    };
    
    loadWorldData();
  }, []);

  useEffect(() => {
    if (globeEl.current && globeReady) {
      try {
        // Auto-rotate the globe
        globeEl.current.controls().autoRotate = true;
        globeEl.current.controls().autoRotateSpeed = 0.5;
        
        // Focus on India initially
        globeEl.current.pointOfView({ lat: 20, lng: 78, altitude: 2.5 }, 2000);
      } catch (err) {
        console.warn('Globe controls error:', err);
        handleError('Globe controls initialization failed');
      }
    }
  }, [globeReady, handleError]);

  const handleStateClick = (state) => {
    try {
      if (onStateClick) {
        onStateClick(state);
      }
      
      // Focus on clicked state
      if (globeEl.current) {
        globeEl.current.pointOfView({ lat: state.lat, lng: state.lng, altitude: 1.5 }, 1000);
      }
    } catch (err) {
      console.warn('State click error:', err);
      handleError('Failed to focus on selected state');
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Error Display */}
      {error && (
        <div className="absolute top-4 left-4 right-4 z-20 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm flex-1">
              ⚠️ {error}
            </p>
            <button
              onClick={() => {
                clearError();
                window.location.reload();
              }}
              className="ml-2 px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      {/* Error Boundary */}
      <ErrorBoundary>
        <Globe
          ref={globeEl}
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
          
          // Countries polygons
          polygonsData={countries}
          polygonAltitude={0.01}
          polygonCapColor={() => 'rgba(200, 200, 200, 0.1)'}
          polygonSideColor={() => 'rgba(200, 200, 200, 0.05)'}
          polygonStrokeColor={() => '#111'}
          polygonLabel={({ properties: d }) => `
            <div style="background: rgba(0,0,0,0.8); padding: 8px; border-radius: 4px; color: white;">
              <b>${d?.ADMIN || d?.NAME || 'Unknown'}</b>
            </div>
          `}
          
          // India states points
          pointsData={indiaStates}
          pointAltitude={0.02}
          pointRadius={0.8}
          pointColor={(d) => d.color}
          pointLabel={(d) => `
            <div style="background: rgba(0,0,0,0.8); padding: 8px; border-radius: 4px; color: white;">
              <b>${d.name}</b><br/>
              Target State for FRA Implementation
            </div>
          `}
          onPointClick={handleStateClick}
          pointsTransitionDuration={1000}
          
          // Arc data for connections (optional)
          arcsData={[]}
          
          // Globe material
          globeMaterial={{
            bumpScale: 10,
            color: '#3a6073',
            emissive: '#220038',
            emissiveIntensity: 0.1,
            shininess: 0.7,
          }}
          
          // Animation
          animateIn={true}
          waitForGlobeReady={true}
          onGlobeReady={() => setGlobeReady(true)}
          
          // Controls
          enablePointerInteraction={true}
          
          width={undefined}
          height={undefined}
        />
      </ErrorBoundary>
      
      {/* Loading indicator */}
      {!globeReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading Interactive Globe...</p>
          </div>
        </div>
      )}
      
      {/* Controls info */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white p-3 rounded-lg text-sm">
        <p><strong>Controls:</strong></p>
        <p>• Mouse drag to rotate</p>
        <p>• Scroll to zoom</p>
        <p>• Click states for details</p>
      </div>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-lg text-sm">
        <p><strong>Target States:</strong></p>
        {indiaStates.map((state, idx) => (
          <div key={idx} className="flex items-center mt-1">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: state.color }}
            ></div>
            <span className="text-xs">{state.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveGlobe;