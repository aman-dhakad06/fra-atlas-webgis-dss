import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, LayersControl, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from './ThemeProvider.jsx';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const { BaseLayer, OverlayLayer } = LayersControl || {};

// Sample data for different layers
const villageBoundariesData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: 1,
        name: "Sample Village A",
        district: "Indore",
        state: "Madhya Pradesh",
        population: 1250,
        forestArea: "250 acres"
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
        name: "Sample Village B",
        district: "Bhopal",
        state: "Madhya Pradesh",
        population: 1890,
        forestArea: "420 acres"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[77.2, 23.1], [77.3, 23.1], [77.3, 23.2], [77.2, 23.2], [77.2, 23.1]]]
      }
    }
  ]
};

const ifrClaimsData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "IFR-001",
        holder: "Ramesh Kumar",
        village: "Sample Village A",
        area: "5.2 acres",
        status: "Granted",
        grantDate: "2020-05-15"
      },
      geometry: {
        type: "Point",
        coordinates: [75.85, 22.75]
      }
    }
  ]
};

const cfrClaimsData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "CFR-001",
        community: "Tribal Community A",
        village: "Sample Village B",
        area: "150 acres",
        status: "Under Review",
        applicationDate: "2023-11-20"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[77.25, 23.15], [77.28, 23.15], [77.28, 23.18], [77.25, 23.18], [77.25, 23.15]]]
      }
    }
  ]
};

const landUseData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: 1,
        name: "Agricultural Land",
        type: "agriculture",
        area: "1200 acres"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[75.7, 22.6], [75.8, 22.6], [75.8, 22.7], [75.7, 22.7], [75.7, 22.6]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: 2,
        name: "Forest Area",
        type: "forest",
        area: "800 acres"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[75.9, 22.8], [76.0, 22.8], [76.0, 22.9], [75.9, 22.9], [75.9, 22.8]]]
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
        name: "Main River",
        type: "river"
      },
      geometry: {
        type: "LineString",
        coordinates: [[75.75, 22.65], [75.85, 22.75], [75.95, 22.85]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: 2,
        name: "Lake View",
        type: "lake"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[77.1, 23.0], [77.2, 23.0], [77.2, 23.1], [77.1, 23.1], [77.1, 23.0]]]
      }
    }
  ]
};

const fieldReportsData = [
  {
    id: 1,
    coordinates: [22.72, 75.82],
    title: "Forest Boundary Dispute",
    description: "Community reported unclear forest boundaries near village X",
    date: "2025-01-15",
    reporter: "Field Officer A",
    status: "Pending Review"
  },
  {
    id: 2,
    coordinates: [23.12, 77.22],
    title: "Illegal Logging Activity",
    description: "Evidence of illegal logging in CFR area",
    date: "2025-01-20",
    reporter: "Forest Guard B",
    status: "Under Investigation"
  }
];

const potentialClaimsData = [
  {
    id: 1,
    coordinates: [22.73, 75.83],
    title: "Potential CFR Claim",
    description: "Community eligible for CFR claim based on traditional use",
    confidence: "High",
    area: "150 acres"
  },
  {
    id: 2,
    coordinates: [23.13, 77.23],
    title: "Potential IFR Claim",
    description: "Individual eligible for IFR claim based on documentation",
    confidence: "Medium",
    area: "5 acres"
  }
];

const changeDetectionData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: 1,
        name: "Deforested Area",
        type: "deforestation",
        changeDate: "2024-12-01",
        area: "50 acres"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[75.77, 22.67], [75.79, 22.67], [75.79, 22.69], [75.77, 22.69], [75.77, 22.67]]]
      }
    }
  ]
};

const GeoPortalMap = ({ selectedState = 'Madhya Pradesh', theme }) => {
  const [mapLayers, setMapLayers] = useState({
    villageBoundaries: true,
    ifrClaims: true,
    cfrClaims: true,
    landUse: false,
    waterBodies: false,
    fieldReports: false,
    potentialClaims: false,
    changeDetection: false
  });

  // Styling functions for different layers
  const villageBoundariesStyle = (feature) => ({
    fillColor: '#FFF59D',
    weight: 2,
    opacity: 1,
    color: '#FDD835',
    fillOpacity: 0.4
  });

  const ifrClaimsStyle = (feature) => ({
    fillColor: '#10B981',
    weight: 1,
    opacity: 1,
    color: '#047857',
    fillOpacity: 0.7
  });

  const cfrClaimsStyle = (feature) => ({
    fillColor: '#059669',
    weight: 2,
    opacity: 1,
    color: '#047857',
    fillOpacity: 0.5,
    dashArray: '5, 5'
  });

  const landUseStyle = (feature) => {
    const type = feature.properties.type;
    const colors = {
      agriculture: '#8BC34A',
      forest: '#4CAF50',
      residential: '#FFC107',
      industrial: '#795548',
      water: '#2196F3'
    };
    
    return {
      fillColor: colors[type] || '#9E9E9E',
      weight: 2,
      opacity: 1,
      color: colors[type] || '#616161',
      fillOpacity: 0.6
    };
  };

  const waterBodiesStyle = (feature) => {
    const type = feature.properties.type;
    const colors = {
      river: '#2196F3',
      lake: '#03A9F4',
      pond: '#00BCD4',
      stream: '#4FC3F7'
    };
    
    if (feature.geometry.type === "LineString") {
      return {
        color: colors[type] || '#2196F3',
        weight: 3,
        opacity: 0.8
      };
    } else {
      return {
        fillColor: colors[type] || '#2196F3',
        weight: 2,
        opacity: 1,
        color: colors[type] || '#2196F3',
        fillOpacity: 0.7
      };
    }
  };

  const changeDetectionStyle = (feature) => {
    const type = feature.properties.type;
    const colors = {
      deforestation: '#F44336',
      reforestation: '#4CAF50',
      landUseChange: '#FF9800',
      construction: '#9C27B0'
    };
    
    return {
      fillColor: colors[type] || '#FF5722',
      weight: 2,
      opacity: 1,
      color: colors[type] || '#E64A19',
      fillOpacity: 0.7,
      dashArray: '5, 5'
    };
  };

  // Popup content functions
  const villageBoundariesPopup = (feature) => `
    <div style="font-family: Arial, sans-serif; min-width: 200px;">
      <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 16px;">${feature.properties.name}</h3>
      <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
        <strong>District:</strong> ${feature.properties.district}
      </p>
      <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
        <strong>State:</strong> ${feature.properties.state}
      </p>
      <div style="margin: 8px 0; font-size: 11px; color: #6B7280;">
        <div>👥 Population: <strong>${feature.properties.population}</strong></div>
        <div>🌲 Forest Area: <strong>${feature.properties.forestArea}</strong></div>
      </div>
    </div>
  `;

  const ifrClaimsPopup = (feature) => `
    <div style="font-family: Arial, sans-serif; min-width: 200px;">
      <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 16px;">IFR Claim: ${feature.properties.id}</h3>
      <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
        <strong>Holder:</strong> ${feature.properties.holder}
      </p>
      <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
        <strong>Village:</strong> ${feature.properties.village}
      </p>
      <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
        <strong>Area:</strong> ${feature.properties.area}
      </p>
      <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
        <strong>Status:</strong> <span style="color: #10B981; font-weight: bold;">${feature.properties.status}</span>
      </p>
      <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
        <strong>Grant Date:</strong> ${feature.properties.grantDate}
      </p>
    </div>
  `;

  const cfrClaimsPopup = (feature) => `
    <div style="font-family: Arial, sans-serif; min-width: 200px;">
      <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 16px;">CFR Claim: ${feature.properties.id}</h3>
      <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
        <strong>Community:</strong> ${feature.properties.community}
      </p>
      <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
        <strong>Village:</strong> ${feature.properties.village}
      </p>
      <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
        <strong>Area:</strong> ${feature.properties.area}
      </p>
      <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
        <strong>Status:</strong> <span style="color: #F59E0B; font-weight: bold;">${feature.properties.status}</span>
      </p>
      <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
        <strong>Application Date:</strong> ${feature.properties.applicationDate}
      </p>
    </div>
  `;

  const landUsePopup = (feature) => `
    <div style="font-family: Arial, sans-serif; min-width: 200px;">
      <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 16px;">${feature.properties.name}</h3>
      <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
        <strong>Type:</strong> ${feature.properties.type}
      </p>
      <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
        <strong>Area:</strong> ${feature.properties.area}
      </p>
    </div>
  `;

  const waterBodiesPopup = (feature) => `
    <div style="font-family: Arial, sans-serif; min-width: 200px;">
      <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 16px;">${feature.properties.name}</h3>
      <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
        <strong>Type:</strong> ${feature.properties.type}
      </p>
    </div>
  `;

  const changeDetectionPopup = (feature) => `
    <div style="font-family: Arial, sans-serif; min-width: 200px;">
      <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 16px;">${feature.properties.name}</h3>
      <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
        <strong>Type:</strong> ${feature.properties.type}
      </p>
      <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
        <strong>Change Date:</strong> ${feature.properties.changeDate}
      </p>
      <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
        <strong>Area:</strong> ${feature.properties.area}
      </p>
    </div>
  `;

  // Handle layer toggle
  const handleLayerToggle = (layerName) => {
    setMapLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[23.5, 78.5]}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg overflow-hidden"
      >
        {/* Base Layers */}
        <LayersControl position="topright">
          <BaseLayer checked name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            />
          </BaseLayer>
          <BaseLayer name="Street">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </BaseLayer>
          
          {/* Overlay Layers */}
          {OverlayLayer && (
            <>
              <OverlayLayer checked={mapLayers.villageBoundaries} name="Village Boundaries">
                <GeoJSON
                  data={villageBoundariesData}
                  style={villageBoundariesStyle}
                  onEachFeature={(feature, layer) => {
                    layer.bindPopup(villageBoundariesPopup(feature));
                  }}
                />
              </OverlayLayer>
              
              <OverlayLayer checked={mapLayers.ifrClaims} name="IFR Claims">
                <GeoJSON
                  data={ifrClaimsData}
                  pointToLayer={(feature, latlng) => {
                    return L.circleMarker(latlng, ifrClaimsStyle(feature));
                  }}
                  onEachFeature={(feature, layer) => {
                    layer.bindPopup(ifrClaimsPopup(feature));
                  }}
                />
              </OverlayLayer>
              
              <OverlayLayer checked={mapLayers.cfrClaims} name="CFR Claims">
                <GeoJSON
                  data={cfrClaimsData}
                  style={cfrClaimsStyle}
                  onEachFeature={(feature, layer) => {
                    layer.bindPopup(cfrClaimsPopup(feature));
                  }}
                />
              </OverlayLayer>
              
              <OverlayLayer checked={mapLayers.landUse} name="Land Use Classification">
                <GeoJSON
                  data={landUseData}
                  style={landUseStyle}
                  onEachFeature={(feature, layer) => {
                    layer.bindPopup(landUsePopup(feature));
                  }}
                />
              </OverlayLayer>
              
              <OverlayLayer checked={mapLayers.waterBodies} name="Water Bodies">
                <GeoJSON
                  data={waterBodiesData}
                  style={waterBodiesStyle}
                  onEachFeature={(feature, layer) => {
                    layer.bindPopup(waterBodiesPopup(feature));
                  }}
                />
              </OverlayLayer>
              
              <OverlayLayer checked={mapLayers.changeDetection} name="Change Detection">
                <GeoJSON
                  data={changeDetectionData}
                  style={changeDetectionStyle}
                  onEachFeature={(feature, layer) => {
                    layer.bindPopup(changeDetectionPopup(feature));
                  }}
                />
              </OverlayLayer>
            </>
          )}
        </LayersControl>
        
        {/* Field Reports markers */}
        {mapLayers.fieldReports && fieldReportsData.map((report, index) => (
          <Marker
            key={`field-report-${index}`}
            position={report.coordinates}
            icon={L.divIcon({
              className: 'custom-field-report-marker',
              html: `<div style="
                background-color: #9C27B0;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 12px;
              ">!</div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          >
            <Popup>
              <div style={{ fontFamily: 'Arial, sans-serif', minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: '14px' }}>
                  {report.title}
                </h3>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>
                  <div><strong>Reporter:</strong> {report.reporter}</div>
                  <div><strong>Date:</strong> {report.date}</div>
                  <div><strong>Status:</strong> {report.status}</div>
                  <div style={{ marginTop: '8px' }}>{report.description}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Potential Claims markers */}
        {mapLayers.potentialClaims && potentialClaimsData.map((claim, index) => (
          <Marker
            key={`potential-claim-${index}`}
            position={claim.coordinates}
            icon={L.divIcon({
              className: 'custom-potential-claim-marker',
              html: `<div style="
                background-color: #FF9800;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 14px;
              ">AI</div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })}
          >
            <Popup>
              <div style={{ fontFamily: 'Arial, sans-serif', minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: '14px' }}>
                  {claim.title}
                </h3>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>
                  <div><strong>Confidence:</strong> {claim.confidence}</div>
                  <div><strong>Area:</strong> {claim.area}</div>
                  <div style={{ marginTop: '8px' }}>{claim.description}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Layer Control Panel */}
      <div className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <h3 className={`font-bold ${theme?.text || 'text-gray-900'} mb-3`}>Map Layers</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={mapLayers.villageBoundaries}
              onChange={() => handleLayerToggle('villageBoundaries')}
              className="mr-2"
            />
            <span className={`text-sm ${theme?.textMuted || 'text-gray-600'}`}>Village Boundaries</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={mapLayers.ifrClaims}
              onChange={() => handleLayerToggle('ifrClaims')}
              className="mr-2"
            />
            <span className={`text-sm ${theme?.textMuted || 'text-gray-600'}`}>IFR Claims</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={mapLayers.cfrClaims}
              onChange={() => handleLayerToggle('cfrClaims')}
              className="mr-2"
            />
            <span className={`text-sm ${theme?.textMuted || 'text-gray-600'}`}>CFR Claims</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={mapLayers.landUse}
              onChange={() => handleLayerToggle('landUse')}
              className="mr-2"
            />
            <span className={`text-sm ${theme?.textMuted || 'text-gray-600'}`}>Land Use Classification</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={mapLayers.waterBodies}
              onChange={() => handleLayerToggle('waterBodies')}
              className="mr-2"
            />
            <span className={`text-sm ${theme?.textMuted || 'text-gray-600'}`}>Water Bodies</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={mapLayers.fieldReports}
              onChange={() => handleLayerToggle('fieldReports')}
              className="mr-2"
            />
            <span className={`text-sm ${theme?.textMuted || 'text-gray-600'}`}>Field Reports (Mobile)</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={mapLayers.potentialClaims}
              onChange={() => handleLayerToggle('potentialClaims')}
              className="mr-2"
            />
            <span className={`text-sm ${theme?.textMuted || 'text-gray-600'}`}>Potential CFR Claims</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={mapLayers.changeDetection}
              onChange={() => handleLayerToggle('changeDetection')}
              className="mr-2"
            />
            <span className={`text-sm ${theme?.textMuted || 'text-gray-600'}`}>Change Detection</span>
          </label>
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <h3 className={`font-bold ${theme?.text || 'text-gray-900'} mb-3`}>Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-300 border border-yellow-500 rounded mr-2"></div>
            <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>Village Boundary</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>IFR Claim</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
            <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>CFR Claim</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
            <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>Land Use</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>Water Bodies</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
            <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>Field Report</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
            <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>Potential Claim</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>Change Detection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoPortalMap;