import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap, LayersControl, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapErrorHandler } from '../hooks/useMapErrorHandler.js';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom colored markers for different states
const createColoredIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 8px;
        height: 8px;
        background-color: white;
        border-radius: 50%;
      "></div>
    </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Component to handle map bounds and center
const MapController = ({ bounds, center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (center) {
      map.setView(center, map.getZoom());
    }
  }, [bounds, center, map]);
  
  return null;
};

// Sample data for additional layers
const forestLayerData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: 1,
        name: "Madhya Pradesh Forest",
        type: "Reserved Forest",
        area: "77,462 km²"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[74.0, 21.1], [82.8, 21.1], [82.8, 26.9], [74.0, 26.9], [74.0, 21.1]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: 2,
        name: "Odisha Forest",
        type: "Protected Forest",
        area: "51,345 km²"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[81.3, 17.8], [87.5, 17.8], [87.5, 22.6], [81.3, 22.6], [81.3, 17.8]]]
      }
    }
  ]
};

const villageBoundariesData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: 1,
        name: "Sample Village 1",
        state: "Madhya Pradesh",
        district: "Indore",
        population: 1250
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[75.8, 22.7], [75.9, 22.7], [75.9, 22.8], [75.8, 22.8], [75.8, 22.7]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: 2,
        name: "Sample Village 2",
        state: "Odisha",
        district: "Cuttack",
        population: 890
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[85.8, 20.5], [85.9, 20.5], [85.9, 20.6], [85.8, 20.6], [85.8, 20.5]]]
      }
    }
  ]
};

const waterBodiesData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: 1,
        name: "Narmada River",
        type: "River"
      },
      geometry: {
        type: "LineString",
        coordinates: [[75.0, 22.0], [76.0, 22.5], [77.0, 23.0]]
      }
    }
  ]
};

const IndiaMap = ({ onStateClick, selectedStates = [], focusState = null, mapLayers = {}, theme }) => {
  const [indiaGeoData, setIndiaGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapBounds, setMapBounds] = useState(null);
  const { error, retryCount, handleError, clearError } = useMapErrorHandler();

  // Target states data with raw data for 4 states
  const targetStates = [
    {
      id: 'mp',
      name: 'Madhya Pradesh',
      shortName: 'MP',
      lat: 22.9734,
      lng: 78.6569,
      color: '#FF6B6B',
      villages: 18542,
      claims: 12500,
      description: 'Central Indian state with significant forest cover',
      forestCover: '77,462 km²',
      districts: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar'],
      priority: 'High',
      status: 'Active'
    },
    {
      id: 'od',
      name: 'Odisha',
      shortName: 'OD',
      lat: 20.9517,
      lng: 85.0985,
      color: '#4ECDC4',
      villages: 9850,
      claims: 7200,
      description: 'Eastern state with rich biodiversity',
      forestCover: '51,345 km²',
      districts: ['Cuttack', 'Khordha', 'Ganjam', 'Mayurbhanj', 'Kalahandi', 'Sambalpur'],
      priority: 'High',
      status: 'Active'
    },
    {
      id: 'tr',
      name: 'Tripura',
      shortName: 'TR',
      lat: 23.9408,
      lng: 91.9882,
      color: '#FFD166',
      villages: 4200,
      claims: 3100,
      description: 'Northeastern state with dense tropical forests',
      forestCover: '10,237 km²',
      districts: ['Agartala', 'Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'South Tripura'],
      priority: 'Medium',
      status: 'Active'
    },
    {
      id: 'tg',
      name: 'Telangana',
      shortName: 'TG',
      lat: 18.1124,
      lng: 79.0193,
      color: '#6A0572',
      villages: 11320,
      claims: 8450,
      description: 'Southern state with diverse ecosystems',
      forestCover: '25,789 km²',
      districts: ['Hyderabad', 'Warangal', 'Karimnagar', 'Khammam', 'Nizamabad', 'Mahbubnagar'],
      priority: 'Medium',
      status: 'Active'
    }
  ];

  // Sample GeoJSON data for India states with more realistic coordinates
  const createCompleteIndiaGeoData = () => {
    const completeIndiaData = {
      type: "FeatureCollection",
      features: [
        // Madhya Pradesh (Target State)
        {
          type: "Feature",
          properties: { ST_NM: "Madhya Pradesh", NAME_1: "Madhya Pradesh" },
          geometry: {
            type: "Polygon",
            coordinates: [[[74.0, 21.1], [82.8, 21.1], [82.8, 26.9], [74.0, 26.9], [74.0, 21.1]]]
          }
        },
        // Odisha (Target State)
        {
          type: "Feature",
          properties: { ST_NM: "Odisha", NAME_1: "Odisha" },
          geometry: {
            type: "Polygon",
            coordinates: [[[81.3, 17.8], [87.5, 17.8], [87.5, 22.6], [81.3, 22.6], [81.3, 17.8]]]
          }
        },
        // Tripura (Target State)
        {
          type: "Feature",
          properties: { ST_NM: "Tripura", NAME_1: "Tripura" },
          geometry: {
            type: "Polygon",
            coordinates: [[[91.1, 22.9], [92.3, 22.9], [92.3, 24.5], [91.1, 24.5], [91.1, 22.9]]]
          }
        },
        // Telangana (Target State)
        {
          type: "Feature",
          properties: { ST_NM: "Telangana", NAME_1: "Telangana" },
          geometry: {
            type: "Polygon",
            coordinates: [[[77.2, 15.8], [81.4, 15.8], [81.4, 19.5], [77.2, 19.5], [77.2, 15.8]]]
          }
        },
        // Other Indian states (simplified)
        {
          type: "Feature",
          properties: { ST_NM: "Andhra Pradesh", NAME_1: "Andhra Pradesh" },
          geometry: {
            type: "Polygon",
            coordinates: [[[77.5, 12.5], [84.75, 12.5], [84.75, 19.9], [77.5, 19.9], [77.5, 12.5]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Arunachal Pradesh", NAME_1: "Arunachal Pradesh" },
          geometry: {
            type: "Polygon",
            coordinates: [[[91.5, 26.6], [97.4, 26.6], [97.4, 29.3], [91.5, 29.3], [91.5, 26.6]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Assam", NAME_1: "Assam" },
          geometry: {
            type: "Polygon",
            coordinates: [[[89.7, 24.1], [96.0, 24.1], [96.0, 28.2], [89.7, 28.2], [89.7, 24.1]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Bihar", NAME_1: "Bihar" },
          geometry: {
            type: "Polygon",
            coordinates: [[[83.3, 24.3], [88.1, 24.3], [88.1, 27.5], [83.3, 27.5], [83.3, 24.3]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Chhattisgarh", NAME_1: "Chhattisgarh" },
          geometry: {
            type: "Polygon",
            coordinates: [[[80.0, 17.8], [84.3, 17.8], [84.3, 24.1], [80.0, 24.1], [80.0, 17.8]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Goa", NAME_1: "Goa" },
          geometry: {
            type: "Polygon",
            coordinates: [[[73.7, 15.0], [74.3, 15.0], [74.3, 15.8], [73.7, 15.8], [73.7, 15.0]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Gujarat", NAME_1: "Gujarat" },
          geometry: {
            type: "Polygon",
            coordinates: [[[68.2, 20.1], [74.5, 20.1], [74.5, 24.7], [68.2, 24.7], [68.2, 20.1]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Haryana", NAME_1: "Haryana" },
          geometry: {
            type: "Polygon",
            coordinates: [[[74.4, 27.4], [77.6, 27.4], [77.6, 30.9], [74.4, 30.9], [74.4, 27.4]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Himachal Pradesh", NAME_1: "Himachal Pradesh" },
          geometry: {
            type: "Polygon",
            coordinates: [[[75.5, 30.4], [79.0, 30.4], [79.0, 33.2], [75.5, 33.2], [75.5, 30.4]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Jharkhand", NAME_1: "Jharkhand" },
          geometry: {
            type: "Polygon",
            coordinates: [[[83.3, 21.9], [87.6, 21.9], [87.6, 25.3], [83.3, 25.3], [83.3, 21.9]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Karnataka", NAME_1: "Karnataka" },
          geometry: {
            type: "Polygon",
            coordinates: [[[74.0, 11.6], [78.6, 11.6], [78.6, 18.4], [74.0, 18.4], [74.0, 11.6]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Kerala", NAME_1: "Kerala" },
          geometry: {
            type: "Polygon",
            coordinates: [[[74.9, 8.2], [77.4, 8.2], [77.4, 12.8], [74.9, 12.8], [74.9, 8.2]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Maharashtra", NAME_1: "Maharashtra" },
          geometry: {
            type: "Polygon",
            coordinates: [[[72.6, 15.6], [80.9, 15.6], [80.9, 22.0], [72.6, 22.0], [72.6, 15.6]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Manipur", NAME_1: "Manipur" },
          geometry: {
            type: "Polygon",
            coordinates: [[[92.9, 23.8], [94.8, 23.8], [94.8, 25.7], [92.9, 25.7], [92.9, 23.8]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Meghalaya", NAME_1: "Meghalaya" },
          geometry: {
            type: "Polygon",
            coordinates: [[[89.8, 25.0], [92.8, 25.0], [92.8, 26.1], [89.8, 26.1], [89.8, 25.0]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Mizoram", NAME_1: "Mizoram" },
          geometry: {
            type: "Polygon",
            coordinates: [[[92.2, 21.9], [93.4, 21.9], [93.4, 24.5], [92.2, 24.5], [92.2, 21.9]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Nagaland", NAME_1: "Nagaland" },
          geometry: {
            type: "Polygon",
            coordinates: [[[93.3, 25.2], [95.2, 25.2], [95.2, 27.0], [93.3, 27.0], [93.3, 25.2]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Punjab", NAME_1: "Punjab" },
          geometry: {
            type: "Polygon",
            coordinates: [[[73.8, 29.5], [76.9, 29.5], [76.9, 32.5], [73.8, 32.5], [73.8, 29.5]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Rajasthan", NAME_1: "Rajasthan" },
          geometry: {
            type: "Polygon",
            coordinates: [[[69.5, 23.1], [78.3, 23.1], [78.3, 30.2], [69.5, 30.2], [69.5, 23.1]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Sikkim", NAME_1: "Sikkim" },
          geometry: {
            type: "Polygon",
            coordinates: [[[88.0, 27.1], [88.9, 27.1], [88.9, 28.1], [88.0, 28.1], [88.0, 27.1]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Tamil Nadu", NAME_1: "Tamil Nadu" },
          geometry: {
            type: "Polygon",
            coordinates: [[[76.2, 8.1], [80.4, 8.1], [80.4, 13.6], [76.2, 13.6], [76.2, 8.1]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Uttar Pradesh", NAME_1: "Uttar Pradesh" },
          geometry: {
            type: "Polygon",
            coordinates: [[[77.1, 23.9], [84.6, 23.9], [84.6, 30.4], [77.1, 30.4], [77.1, 23.9]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "Uttarakhand", NAME_1: "Uttarakhand" },
          geometry: {
            type: "Polygon",
            coordinates: [[[77.6, 28.7], [81.0, 28.7], [81.0, 31.5], [77.6, 31.5], [77.6, 28.7]]]
          }
        },
        {
          type: "Feature",
          properties: { ST_NM: "West Bengal", NAME_1: "West Bengal" },
          geometry: {
            type: "Polygon",
            coordinates: [[[85.8, 21.5], [89.9, 21.5], [89.9, 27.2], [85.8, 27.2], [85.8, 21.5]]]
          }
        }
      ]
    };
    return completeIndiaData;
  };

  // Forest layer styling
  const forestLayerStyle = (feature) => {
    const type = feature.properties.type;
    const colors = {
      'Reserved Forest': '#2E7D32',
      'Protected Forest': '#4CAF50',
      'Unclassed Forest': '#81C784'
    };
    
    return {
      fillColor: colors[type] || '#4CAF50',
      weight: 2,
      opacity: 1,
      color: colors[type] || '#388E3C',
      fillOpacity: 0.6
    };
  };

  // Village boundaries styling
  const villageBoundariesStyle = (feature) => ({
    fillColor: '#FFF59D',
    weight: 1,
    opacity: 1,
    color: '#FDD835',
    fillOpacity: 0.4
  });

  // Water bodies styling
  const waterBodiesStyle = (feature) => {
    return {
      color: '#2196F3',
      weight: 3,
      opacity: 0.8
    };
  };

  // Handle forest layer feature events
  const onEachForestFeature = (feature, layer) => {
    layer.bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-lg">${feature.properties.name}</h3>
        <p class="text-sm"><strong>Type:</strong> ${feature.properties.type}</p>
        <p class="text-sm"><strong>Area:</strong> ${feature.properties.area}</p>
      </div>
    `);
  };

  // Handle village boundaries feature events
  const onEachVillageFeature = (feature, layer) => {
    layer.bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-lg">${feature.properties.name}</h3>
        <p class="text-sm"><strong>State:</strong> ${feature.properties.state}</p>
        <p class="text-sm"><strong>District:</strong> ${feature.properties.district}</p>
        <p class="text-sm"><strong>Population:</strong> ${feature.properties.population}</p>
      </div>
    `);
  };

  // Handle water bodies feature events
  const onEachWaterFeature = (feature, layer) => {
    layer.bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-lg">${feature.properties.name}</h3>
        <p class="text-sm"><strong>Type:</strong> ${feature.properties.type}</p>
      </div>
    `);
  };

  // Load India GeoJSON data
  useEffect(() => {
    setLoading(true);
    
    try {
      const data = createCompleteIndiaGeoData();
      setIndiaGeoData(data);
      setLoading(false);
    } catch (err) {
      handleError('Failed to load map data', err);
      setLoading(false);
    }
  }, [handleError]);

  // Handle GeoJSON feature click
  const onEachFeature = (feature, layer) => {
    const stateName = feature.properties.ST_NM || feature.properties.NAME_1;
    const isTargetState = targetStates.some(state => 
      state.name.toLowerCase() === stateName.toLowerCase()
    );
    
    // Highlight target states
    if (isTargetState) {
      layer.setStyle({
        fillColor: '#FF6B6B',
        color: '#FF6B6B',
        weight: 2,
        fillOpacity: 0.7
      });
      
      // Add state data to layer
      const stateData = targetStates.find(state => 
        state.name.toLowerCase() === stateName.toLowerCase()
      );
      
      if (stateData) {
        layer.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-lg">${stateData.name}</h3>
            <p class="text-sm">${stateData.description}</p>
            <div class="mt-2 grid grid-cols-2 gap-1 text-sm">
              <div><strong>Villages:</strong> ${stateData.villages.toLocaleString()}</div>
              <div><strong>Claims:</strong> ${stateData.claims.toLocaleString()}</div>
              <div><strong>Forest:</strong> ${stateData.forestCover}</div>
              <div><strong>Districts:</strong> ${stateData.districts.length}</div>
            </div>
          </div>
        `);
      }
    } else {
      layer.setStyle({
        fillColor: '#374151',
        color: '#6B7280',
        weight: 1,
        fillOpacity: 0.5
      });
    }

    // Add click event
    layer.on({
      click: () => {
        const isTargetState = targetStates.some(state => 
          state.name.toLowerCase() === stateName.toLowerCase()
        );
        
        if (isTargetState) {
          const stateData = targetStates.find(state => 
            state.name.toLowerCase() === stateName.toLowerCase()
          );
          if (stateData && onStateClick) {
            onStateClick(stateData);
          }
        }
      }
    });
  };

  // Set map bounds when focusing on a state
  useEffect(() => {
    if (focusState && indiaGeoData) {
      const stateFeature = indiaGeoData.features.find(
        feature => feature.properties.ST_NM === focusState.name
      );
      
      if (stateFeature) {
        const bounds = L.geoJSON(stateFeature).getBounds();
        setMapBounds(bounds);
      }
    } else {
      setMapBounds(null);
    }
  }, [focusState, indiaGeoData]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl">
        <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Map Loading Error</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error.message}</p>
          <button 
            onClick={clearError}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative rounded-2xl overflow-hidden">
      <MapContainer 
        center={[22.5, 78.5]} 
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
        className="rounded-2xl"
      >
        {/* Base tile layer - satellite view for better visualization */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
        />
        
        {/* Alternative street map layer */}
        {/* <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        /> */}

        {/* India GeoJSON layer */}
        {indiaGeoData && (
          <GeoJSON 
            data={indiaGeoData} 
            onEachFeature={onEachFeature}
            style={{
              fillColor: '#374151',
              color: '#6B7280',
              weight: 1,
              fillOpacity: 0.5
            }}
          />
        )}

        {/* Forest layer */}
        {mapLayers?.forestLayer && (
          <GeoJSON
            data={forestLayerData}
            style={forestLayerStyle}
            onEachFeature={onEachForestFeature}
          />
        )}

        {/* Village boundaries layer */}
        {mapLayers?.villageBoundaries && (
          <GeoJSON
            data={villageBoundariesData}
            style={villageBoundariesStyle}
            onEachFeature={onEachVillageFeature}
          />
        )}

        {/* Water bodies layer */}
        {mapLayers?.waterBodies && (
          <GeoJSON
            data={waterBodiesData}
            style={waterBodiesStyle}
            onEachFeature={onEachWaterFeature}
          />
        )}

        {/* Target state markers */}
        {targetStates.map((state, index) => (
          <Marker 
            key={state.id}
            position={[state.lat, state.lng]}
            icon={createColoredIcon(state.color)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{state.name}</h3>
                <p className="text-sm">{state.description}</p>
                <div className="mt-2 grid grid-cols-2 gap-1 text-sm">
                  <div><strong>Villages:</strong> {state.villages.toLocaleString()}</div>
                  <div><strong>Claims:</strong> {state.claims.toLocaleString()}</div>
                  <div><strong>Forest:</strong> {state.forestCover}</div>
                  <div><strong>Districts:</strong> {state.districts.length}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* State labels */}
        {targetStates.map((state, idx) => (
          <Marker 
            key={`centroid-${idx}`}
            position={[state.lat, state.lng]}
            icon={L.divIcon({
              className: 'custom-label',
              html: `<div style="
                background-color: ${state.color};
                color: white;
                padding: 2px 6px;
                border-radius: 12px;
                font-weight: bold;
                font-size: 12px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                white-space: nowrap;
              ">${state.shortName}</div>`,
              iconSize: [40, 20],
              iconAnchor: [20, 10],
            })}
          />
        ))}

        {/* Map controller for bounds */}
        <MapController bounds={mapBounds} />
      </MapContainer>

      {/* Layer control legend */}
      <div className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg text-sm">
        <h4 className={`font-bold mb-2 ${theme?.text || 'text-gray-900'}`}>Map Layers</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>Target States</span>
          </div>
          {mapLayers?.forestLayer && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
              <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>Forest Areas</span>
            </div>
          )}
          {mapLayers?.villageBoundaries && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
              <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>Village Boundaries</span>
            </div>
          )}
          {mapLayers?.waterBodies && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>Water Bodies</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndiaMap;