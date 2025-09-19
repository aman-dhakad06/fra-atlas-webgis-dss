import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
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

const IndiaMap = ({ onStateClick, selectedStates = [], focusState = null }) => {
  const [indiaGeoData, setIndiaGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapBounds, setMapBounds] = useState(null);
  const { error, retryCount, handleError, clearError } = useMapErrorHandler();

  // Target states data - to be populated from API
  const targetStates = [
    // State data will be loaded from backend API
    // Structure: { name, lat, lng, color, villages, claims, description }
  ];

  // Load India GeoJSON data
  useEffect(() => {
    setLoading(true);
    
    // Complete India GeoJSON data with all states and union territories
    const createCompleteIndiaGeoData = () => {
      const completeIndiaData = {
        type: "FeatureCollection",
        features: [
          // Andhra Pradesh
          {
            type: "Feature",
            properties: { ST_NM: "Andhra Pradesh", NAME_1: "Andhra Pradesh" },
            geometry: {
              type: "Polygon",
              coordinates: [[[77.5, 12.5], [84.75, 12.5], [84.75, 19.9], [77.5, 19.9], [77.5, 12.5]]]
            }
          },
          // Arunachal Pradesh
          {
            type: "Feature",
            properties: { ST_NM: "Arunachal Pradesh", NAME_1: "Arunachal Pradesh" },
            geometry: {
              type: "Polygon",
              coordinates: [[[91.5, 26.6], [97.4, 26.6], [97.4, 29.3], [91.5, 29.3], [91.5, 26.6]]]
            }
          },
          // Assam
          {
            type: "Feature",
            properties: { ST_NM: "Assam", NAME_1: "Assam" },
            geometry: {
              type: "Polygon",
              coordinates: [[[89.7, 24.1], [96.0, 24.1], [96.0, 28.2], [89.7, 28.2], [89.7, 24.1]]]
            }
          },
          // Bihar
          {
            type: "Feature",
            properties: { ST_NM: "Bihar", NAME_1: "Bihar" },
            geometry: {
              type: "Polygon",
              coordinates: [[[83.3, 24.3], [88.1, 24.3], [88.1, 27.5], [83.3, 27.5], [83.3, 24.3]]]
            }
          },
          // Chhattisgarh
          {
            type: "Feature",
            properties: { ST_NM: "Chhattisgarh", NAME_1: "Chhattisgarh" },
            geometry: {
              type: "Polygon",
              coordinates: [[[80.0, 17.8], [84.3, 17.8], [84.3, 24.1], [80.0, 24.1], [80.0, 17.8]]]
            }
          },
          // Goa
          {
            type: "Feature",
            properties: { ST_NM: "Goa", NAME_1: "Goa" },
            geometry: {
              type: "Polygon",
              coordinates: [[[73.7, 15.0], [74.3, 15.0], [74.3, 15.8], [73.7, 15.8], [73.7, 15.0]]]
            }
          },
          // Gujarat
          {
            type: "Feature",
            properties: { ST_NM: "Gujarat", NAME_1: "Gujarat" },
            geometry: {
              type: "Polygon",
              coordinates: [[[68.2, 20.1], [74.5, 20.1], [74.5, 24.7], [68.2, 24.7], [68.2, 20.1]]]
            }
          },
          // Haryana
          {
            type: "Feature",
            properties: { ST_NM: "Haryana", NAME_1: "Haryana" },
            geometry: {
              type: "Polygon",
              coordinates: [[[74.4, 27.4], [77.6, 27.4], [77.6, 30.9], [74.4, 30.9], [74.4, 27.4]]]
            }
          },
          // Himachal Pradesh
          {
            type: "Feature",
            properties: { ST_NM: "Himachal Pradesh", NAME_1: "Himachal Pradesh" },
            geometry: {
              type: "Polygon",
              coordinates: [[[75.5, 30.4], [79.0, 30.4], [79.0, 33.2], [75.5, 33.2], [75.5, 30.4]]]
            }
          },
          // Jharkhand
          {
            type: "Feature",
            properties: { ST_NM: "Jharkhand", NAME_1: "Jharkhand" },
            geometry: {
              type: "Polygon",
              coordinates: [[[83.3, 21.9], [87.6, 21.9], [87.6, 25.3], [83.3, 25.3], [83.3, 21.9]]]
            }
          },
          // Karnataka
          {
            type: "Feature",
            properties: { ST_NM: "Karnataka", NAME_1: "Karnataka" },
            geometry: {
              type: "Polygon",
              coordinates: [[[74.0, 11.6], [78.6, 11.6], [78.6, 18.4], [74.0, 18.4], [74.0, 11.6]]]
            }
          },
          // Kerala
          {
            type: "Feature",
            properties: { ST_NM: "Kerala", NAME_1: "Kerala" },
            geometry: {
              type: "Polygon",
              coordinates: [[[74.9, 8.2], [77.4, 8.2], [77.4, 12.8], [74.9, 12.8], [74.9, 8.2]]]
            }
          },
          // Madhya Pradesh (Target State)
          {
            type: "Feature",
            properties: { ST_NM: "Madhya Pradesh", NAME_1: "Madhya Pradesh" },
            geometry: {
              type: "Polygon",
              coordinates: [[[74.0, 21.1], [82.8, 21.1], [82.8, 26.9], [74.0, 26.9], [74.0, 21.1]]]
            }
          },
          // Maharashtra
          {
            type: "Feature",
            properties: { ST_NM: "Maharashtra", NAME_1: "Maharashtra" },
            geometry: {
              type: "Polygon",
              coordinates: [[[72.6, 15.6], [80.9, 15.6], [80.9, 22.0], [72.6, 22.0], [72.6, 15.6]]]
            }
          },
          // Manipur
          {
            type: "Feature",
            properties: { ST_NM: "Manipur", NAME_1: "Manipur" },
            geometry: {
              type: "Polygon",
              coordinates: [[[93.0, 23.8], [94.8, 23.8], [94.8, 25.7], [93.0, 25.7], [93.0, 23.8]]]
            }
          },
          // Meghalaya
          {
            type: "Feature",
            properties: { ST_NM: "Meghalaya", NAME_1: "Meghalaya" },
            geometry: {
              type: "Polygon",
              coordinates: [[[89.7, 25.0], [92.8, 25.0], [92.8, 26.1], [89.7, 26.1], [89.7, 25.0]]]
            }
          },
          // Mizoram
          {
            type: "Feature",
            properties: { ST_NM: "Mizoram", NAME_1: "Mizoram" },
            geometry: {
              type: "Polygon",
              coordinates: [[[92.2, 21.9], [93.4, 21.9], [93.4, 24.5], [92.2, 24.5], [92.2, 21.9]]]
            }
          },
          // Nagaland
          {
            type: "Feature",
            properties: { ST_NM: "Nagaland", NAME_1: "Nagaland" },
            geometry: {
              type: "Polygon",
              coordinates: [[[93.3, 25.2], [95.8, 25.2], [95.8, 27.0], [93.3, 27.0], [93.3, 25.2]]]
            }
          },
          // Odisha (Target State)
          {
            type: "Feature",
            properties: { ST_NM: "Odisha", NAME_1: "Odisha" },
            geometry: {
              type: "Polygon",
              coordinates: [[[81.4, 17.8], [87.5, 17.8], [87.5, 22.6], [81.4, 22.6], [81.4, 17.8]]]
            }
          },
          // Punjab
          {
            type: "Feature",
            properties: { ST_NM: "Punjab", NAME_1: "Punjab" },
            geometry: {
              type: "Polygon",
              coordinates: [[[73.9, 29.5], [76.9, 29.5], [76.9, 32.5], [73.9, 32.5], [73.9, 29.5]]]
            }
          },
          // Rajasthan
          {
            type: "Feature",
            properties: { ST_NM: "Rajasthan", NAME_1: "Rajasthan" },
            geometry: {
              type: "Polygon",
              coordinates: [[[69.5, 23.0], [78.3, 23.0], [78.3, 30.2], [69.5, 30.2], [69.5, 23.0]]]
            }
          },
          // Sikkim
          {
            type: "Feature",
            properties: { ST_NM: "Sikkim", NAME_1: "Sikkim" },
            geometry: {
              type: "Polygon",
              coordinates: [[[88.0, 27.0], [88.9, 27.0], [88.9, 28.1], [88.0, 28.1], [88.0, 27.0]]]
            }
          },
          // Tamil Nadu
          {
            type: "Feature",
            properties: { ST_NM: "Tamil Nadu", NAME_1: "Tamil Nadu" },
            geometry: {
              type: "Polygon",
              coordinates: [[[76.2, 8.1], [80.3, 8.1], [80.3, 13.5], [76.2, 13.5], [76.2, 8.1]]]
            }
          },
          // Telangana (Target State)
          {
            type: "Feature",
            properties: { ST_NM: "Telangana", NAME_1: "Telangana" },
            geometry: {
              type: "Polygon",
              coordinates: [[[77.3, 15.8], [81.1, 15.8], [81.1, 19.9], [77.3, 19.9], [77.3, 15.8]]]
            }
          },
          // Tripura (Target State)
          {
            type: "Feature",
            properties: { ST_NM: "Tripura", NAME_1: "Tripura" },
            geometry: {
              type: "Polygon",
              coordinates: [[[91.1, 22.9], [92.7, 22.9], [92.7, 24.5], [91.1, 24.5], [91.1, 22.9]]]
            }
          },
          // Uttar Pradesh
          {
            type: "Feature",
            properties: { ST_NM: "Uttar Pradesh", NAME_1: "Uttar Pradesh" },
            geometry: {
              type: "Polygon",
              coordinates: [[[77.1, 23.9], [84.6, 23.9], [84.6, 30.4], [77.1, 30.4], [77.1, 23.9]]]
            }
          },
          // Uttarakhand
          {
            type: "Feature",
            properties: { ST_NM: "Uttarakhand", NAME_1: "Uttarakhand" },
            geometry: {
              type: "Polygon",
              coordinates: [[[77.6, 28.9], [81.0, 28.9], [81.0, 31.4], [77.6, 31.4], [77.6, 28.9]]]
            }
          },
          // West Bengal
          {
            type: "Feature",
            properties: { ST_NM: "West Bengal", NAME_1: "West Bengal" },
            geometry: {
              type: "Polygon",
              coordinates: [[[85.8, 21.5], [89.9, 21.5], [89.9, 27.2], [85.8, 27.2], [85.8, 21.5]]]
            }
          },
          // Union Territories
          // Andaman and Nicobar Islands
          {
            type: "Feature",
            properties: { ST_NM: "Andaman and Nicobar Islands", NAME_1: "Andaman and Nicobar Islands" },
            geometry: {
              type: "Polygon",
              coordinates: [[[92.2, 6.7], [94.3, 6.7], [94.3, 13.7], [92.2, 13.7], [92.2, 6.7]]]
            }
          },
          // Chandigarh
          {
            type: "Feature",
            properties: { ST_NM: "Chandigarh", NAME_1: "Chandigarh" },
            geometry: {
              type: "Polygon",
              coordinates: [[[76.7, 30.7], [76.8, 30.7], [76.8, 30.8], [76.7, 30.8], [76.7, 30.7]]]
            }
          },
          // Dadra and Nagar Haveli and Daman and Diu
          {
            type: "Feature",
            properties: { ST_NM: "Dadra and Nagar Haveli and Daman and Diu", NAME_1: "Dadra and Nagar Haveli and Daman and Diu" },
            geometry: {
              type: "Polygon",
              coordinates: [[[72.8, 20.0], [73.2, 20.0], [73.2, 20.4], [72.8, 20.4], [72.8, 20.0]]]
            }
          },
          // Delhi
          {
            type: "Feature",
            properties: { ST_NM: "Delhi", NAME_1: "Delhi" },
            geometry: {
              type: "Polygon",
              coordinates: [[[76.8, 28.4], [77.3, 28.4], [77.3, 28.9], [76.8, 28.9], [76.8, 28.4]]]
            }
          },
          // Jammu and Kashmir
          {
            type: "Feature",
            properties: { ST_NM: "Jammu and Kashmir", NAME_1: "Jammu and Kashmir" },
            geometry: {
              type: "Polygon",
              coordinates: [[[73.0, 32.3], [80.3, 32.3], [80.3, 37.1], [73.0, 37.1], [73.0, 32.3]]]
            }
          },
          // Ladakh
          {
            type: "Feature",
            properties: { ST_NM: "Ladakh", NAME_1: "Ladakh" },
            geometry: {
              type: "Polygon",
              coordinates: [[[75.9, 32.2], [79.9, 32.2], [79.9, 36.0], [75.9, 36.0], [75.9, 32.2]]]
            }
          },
          // Lakshadweep
          {
            type: "Feature",
            properties: { ST_NM: "Lakshadweep", NAME_1: "Lakshadweep" },
            geometry: {
              type: "Polygon",
              coordinates: [[[71.6, 8.0], [74.4, 8.0], [74.4, 12.3], [71.6, 12.3], [71.6, 8.0]]]
            }
          },
          // Puducherry
          {
            type: "Feature",
            properties: { ST_NM: "Puducherry", NAME_1: "Puducherry" },
            geometry: {
              type: "Polygon",
              coordinates: [[[79.7, 11.8], [79.9, 11.8], [79.9, 12.0], [79.7, 12.0], [79.7, 11.8]]]
            }
          }
        ]
      };
      
      setIndiaGeoData(completeIndiaData);
      setMapBounds([[6.4627, 68.1097], [37.6, 97.4]]);
      clearError();
      setLoading(false);
    };
    
    // Use the complete offline data immediately
    createCompleteIndiaGeoData();
  }, []);

  // Handle state polygon click
  const onEachFeature = (feature, layer) => {
    const stateName = feature.properties.ST_NM || feature.properties.NAME_1;
    const isTargetState = targetStates.some(state => 
      stateName.toLowerCase().includes(state.name.toLowerCase()) ||
      state.name.toLowerCase().includes(stateName.toLowerCase())
    );

    layer.on({
      click: () => {
        if (onStateClick && isTargetState) {
          const stateData = targetStates.find(state => 
            stateName.toLowerCase().includes(state.name.toLowerCase()) ||
            state.name.toLowerCase().includes(stateName.toLowerCase())
          );
          onStateClick(stateData);
        }
      },
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: isTargetState ? '#ff6b6b' : '#666',
          fillOpacity: 0.7
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 1,
          color: isTargetState ? '#333' : '#666',
          fillOpacity: isTargetState ? 0.5 : 0.2
        });
      }
    });

    // Bind popup
    layer.bindPopup(`
      <div style="font-family: Arial, sans-serif;">
        <h3 style="margin: 0 0 8px 0; color: #333;">${stateName}</h3>
        ${isTargetState ? 
          `<p style="margin: 0; color: #666; font-size: 12px;">
            🎯 Target State for FRA Implementation<br/>
            Click for more details
          </p>` : 
          `<p style="margin: 0; color: #666; font-size: 12px;">
            Not a target state for this project
          </p>`
        }
      </div>
    `);
  };

  // Style function for states
  const stateStyle = (feature) => {
    const stateName = feature.properties.ST_NM || feature.properties.NAME_1;
    const isTargetState = targetStates.some(state => 
      stateName.toLowerCase().includes(state.name.toLowerCase()) ||
      state.name.toLowerCase().includes(stateName.toLowerCase())
    );

    return {
      fillColor: isTargetState ? '#4CAF50' : '#e0e0e0',
      weight: 1,
      opacity: 1,
      color: isTargetState ? '#333' : '#666',
      fillOpacity: isTargetState ? 0.5 : 0.2,
      className: isTargetState ? 'target-state' : 'other-state'
    };
  };

  // Calculate center of India
  const indiaCenter = [23.5937, 78.9629];
  const mapCenter = focusState ? [focusState.lat, focusState.lng] : indiaCenter;

  if (loading) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`${theme.textMuted}`}>Loading India Map...</p>
          {error && (
            <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-2">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {error && (
        <div className="absolute top-2 left-2 right-2 z-10 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3">
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
      
      <MapContainer
        center={mapCenter}
        zoom={focusState ? 8 : 5}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg overflow-hidden"
        whenCreated={(map) => {
          // Additional map setup if needed
          console.log('Map instance created');
          
          // Add keyboard accessibility
          map.getContainer().setAttribute('tabindex', '0');
          map.getContainer().setAttribute('role', 'application');
          map.getContainer().setAttribute('aria-label', 'Interactive map of India showing FRA target states');
        }}
      >
        {/* Base tile layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Alternative satellite view */}
        {/* <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
        /> */}

        {/* India states GeoJSON */}
        {indiaGeoData && (
          <GeoJSON
            data={indiaGeoData}
            style={stateStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {/* Target state markers */}
        {targetStates.map((state, index) => (
          <Marker
            key={index}
            position={[state.lat, state.lng]}
            icon={createColoredIcon(state.color)}
            eventHandlers={{
              click: () => onStateClick && onStateClick(state)
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'Arial, sans-serif', minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: state.color, fontWeight: 'bold' }}>
                  {state.name}
                </h3>
                <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>
                  {state.description}
                </p>
                <div style={{ marginTop: '8px', fontSize: '11px' }}>
                  <div>📍 Villages Mapped: <strong>{state.villages.toLocaleString()}</strong></div>
                  <div>📋 FRA Claims: <strong>{state.claims.toLocaleString()}</strong></div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Map controller for bounds and center */}
        <MapController bounds={mapBounds} center={focusState ? [focusState.lat, focusState.lng] : null} />
      </MapContainer>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg text-sm">
        <h4 className={`font-bold mb-2 ${theme.text}`}>Target States</h4>
        {targetStates.map((state, idx) => (
          <div key={idx} className="flex items-center mb-1">
            <div 
              className="w-3 h-3 rounded-full mr-2 border border-gray-300" 
              style={{ backgroundColor: state.color }}
            ></div>
            <span className={`text-xs ${theme.textMuted}`}>{state.name}</span>
          </div>
        ))}
      </div>

      {/* Controls info */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg text-sm">
        <p className={`font-bold ${theme.text} mb-1`}>Map Controls:</p>
        <p className={`text-xs ${theme.textMuted}`}>• Click states/markers for details</p>
        <p className={`text-xs ${theme.textMuted}`}>• Zoom with mouse wheel</p>
        <p className={`text-xs ${theme.textMuted}`}>• Drag to pan around</p>
      </div>
    </div>
  );
};

export default IndiaMap;