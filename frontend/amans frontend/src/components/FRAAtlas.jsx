import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, Circle, Rectangle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from './ThemeProvider.jsx';
import ClaimDetailModal from './ClaimDetailModal.jsx';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons for different claim types
const createClaimIcon = (type, status) => {
  const colors = {
    IFR: {
      granted: '#10B981', // green
      pending: '#F59E0B', // yellow
      rejected: '#EF4444', // red
      'under_review': '#6366F1' // blue
    },
    CFR: {
      granted: '#059669', // dark green
      pending: '#D97706', // orange
      rejected: '#DC2626', // dark red
      'under_review': '#4F46E5' // indigo
    }
  };

  const color = colors[type]?.[status?.toLowerCase().replace(' ', '_')] || '#6B7280';
  const shape = type === 'CFR' ? 'square' : 'circle';

  return L.divIcon({
    className: 'custom-claim-marker',
    html: `<div style="
      background-color: ${color};
      width: 16px;
      height: 16px;
      border-radius: ${shape === 'circle' ? '50%' : '2px'};
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      position: relative;
    ">
      <div style="
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 8px;
        font-weight: bold;
        color: ${color};
        background: white;
        padding: 0 2px;
        border-radius: 2px;
        white-space: nowrap;
      ">${type}</div>
    </div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

// Data structure for village boundaries and claims - to be populated from API
const stateVillageData = {
  // Data will be loaded from backend API
  // Structure: { [stateName]: { villages: [], claims: [] } }
};

// District data for all target states
const stateDistrictData = {
  'Tripura': [
    'Dhalai', 'Gomati', 'Khowai', 'North Tripura', 
    'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura'
  ],
  'Madhya Pradesh': [
    'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 
    'Barwani', 'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 
    'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 
    'Guna', 'Gwalior', 'Harda', 'Hoshangabad', 'Indore', 'Jabalpur', 
    'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 
    'Morena', 'Narsinghpur', 'Neemuch', 'Niwari', 'Panna', 'Rajgarh', 
    'Raisen', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 
    'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 
    'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha'
  ],
  'Odisha': [
    'Angul', 'Balasore', 'Bargarh', 'Bhadrak', 'Bolangir', 'Boudh',
    'Cuttack', 'Debagarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 
    'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal',
    'Kendrapara', 'Keonjhar', 'Khordha', 'Koraput', 'Malkangiri',
    'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri',
    'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh'
  ],
  'Telangana': [
    'Adilabad', 'Bhadradri Kothagudem', 'Hanamkonda', 'Hyderabad',
    'Jagtial', 'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal',
    'Kamareddy', 'Karimnagar', 'Khammam', 'Komaram Bheem Asifabad',
    'Mahabubnagar', 'Mahbubnagar', 'Mancherial', 'Medak', 
    'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda',
    'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 
    'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Suryapet',
    'Vikarabad', 'Wanaparthy', 'Warangal Rural', 'Warangal Urban',
    'Yadadri Bhuvanagiri'
  ]
};

// Component to handle map bounds and center
const MapController = ({ bounds, center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [bounds, center, zoom, map]);
  
  return null;
};

const FRAAtlas = ({ 
  selectedState = 'Tripura', 
  selectedDistrict = 'All', 
  mapLayers = {},
  onClaimClick,
  theme
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [hoveredVillage, setHoveredVillage] = useState(null);
  const [showClaimDetail, setShowClaimDetail] = useState(false);

  // Get data for the selected state
  const stateData = stateVillageData[selectedState] || { villages: [], claims: [] };

  // Handle claim click to show detailed view
  const handleClaimClick = (claim) => {
    setSelectedClaim(claim);
    setShowClaimDetail(true);
    if (onClaimClick) onClaimClick(claim);
  };

  // Filter data based on selections
  const filteredVillages = stateData.villages.filter(village =>
    selectedDistrict === 'All' || village.district === selectedDistrict
  );

  const filteredClaims = stateData.claims.filter(claim => {
    const village = filteredVillages.find(v => v.name === claim.village);
    return village !== undefined;
  });

  // Village boundary styling
  const villageStyle = (feature) => ({
    fillColor: '#E5E7EB',
    weight: 2,
    opacity: 1,
    color: '#9CA3AF',
    fillOpacity: 0.3,
    className: 'village-boundary'
  });

  // Claim boundary styling
  const claimBoundaryStyle = (claim) => {
    const colors = {
      granted: '#10B981',
      pending: '#F59E0B',
      rejected: '#EF4444',
      'under_review': '#6366F1'
    };
    
    const color = colors[claim.status?.toLowerCase().replace(' ', '_')] || '#6B7280';
    
    return {
      fillColor: color,
      weight: 2,
      opacity: 0.8,
      color: color,
      fillOpacity: claim.type === 'CFR' ? 0.4 : 0.2,
      dashArray: claim.status === 'Pending' ? '5, 5' : null
    };
  };

  // Create GeoJSON for village boundaries
  const villageGeoJSON = {
    type: "FeatureCollection",
    features: filteredVillages.map(village => ({
      type: "Feature",
      properties: {
        id: village.id,
        name: village.name,
        district: village.district,
        population: village.population,
        tribalPopulation: village.tribalPopulation,
        forestArea: village.forestArea
      },
      geometry: {
        type: "Polygon",
        coordinates: [village.boundary]
      }
    }))
  };

  // Handle village feature events
  const onEachVillageFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        setHoveredVillage(feature.properties);
        layer.setStyle({
          weight: 3,
          color: '#6366F1',
          fillOpacity: 0.5
        });
      },
      mouseout: (e) => {
        setHoveredVillage(null);
        layer.setStyle(villageStyle());
      }
    });

    layer.bindPopup(`
      <div style="font-family: Arial, sans-serif; min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 16px;">${feature.properties.name}</h3>
        <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
          <strong>District:</strong> ${feature.properties.district}
        </p>
        <div style="margin: 8px 0; font-size: 11px; color: #6B7280;">
          <div>👥 Population: <strong>${feature.properties.population.toLocaleString()}</strong></div>
          <div>🏘️ Tribal Population: <strong>${feature.properties.tribalPopulation.toLocaleString()}</strong></div>
          <div>🌲 Forest Area: <strong>${feature.properties.forestArea}</strong></div>
        </div>
      </div>
    `);
  };

  // Calculate map bounds to fit all data
  const calculateBounds = () => {
    if (filteredVillages.length === 0) return null;
    
    const lats = filteredVillages.map(v => v.center[0]);
    const lngs = filteredVillages.map(v => v.center[1]);
    
    return [
      [Math.min(...lats) - 0.05, Math.min(...lngs) - 0.05],
      [Math.max(...lats) + 0.05, Math.max(...lngs) + 0.05]
    ];
  };

  // Default state centers
  const stateCenters = {
    'Tripura': [23.83, 91.28],
    'Madhya Pradesh': [23.47, 77.94],
    'Odisha': [20.95, 85.09],
    'Telangana': [18.11, 79.01]
  };

  const mapBounds = calculateBounds();
  const mapCenter = filteredVillages.length > 0 
    ? [
        filteredVillages.reduce((sum, v) => sum + v.center[0], 0) / filteredVillages.length,
        filteredVillages.reduce((sum, v) => sum + v.center[1], 0) / filteredVillages.length
      ]
    : stateCenters[selectedState] || [23.83, 91.28]; // Default to selected state center

  if (loading) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`${theme?.textMuted || 'text-gray-600'}`}>Loading FRA Atlas for {selectedState}...</p>
        </div>
      </div>
    );
  }

  // Show message when no data is available for the selected state
  if (filteredVillages.length === 0) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className={`text-xl font-bold ${theme?.text || 'text-gray-900'} mb-2`}>
            No FRA Data Available
          </h3>
          <p className={`${theme?.textMuted || 'text-gray-600'} mb-4`}>
            No village boundaries or FRA claims data is currently available for <strong>{selectedState}</strong>
            {selectedDistrict !== 'All' && ` in ${selectedDistrict} district`}.
          </p>
          <p className={`text-sm ${theme?.textMuted || 'text-gray-600'}`}>
            📍 FRA targeted states: Tripura, Madhya Pradesh, Odisha, Telangana
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Claim Detail Modal */}
      <ClaimDetailModal 
        claim={selectedClaim}
        isOpen={showClaimDetail}
        onClose={() => {
          setShowClaimDetail(false);
          setSelectedClaim(null);
        }}
      />
      {/* Status indicator */}
      <div className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg text-sm">
        <h4 className={`font-bold mb-2 ${theme?.text || 'text-gray-900'}`}>FRA Claims Overview</h4>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>
              Granted: {filteredClaims.filter(c => c.status === 'Granted').length}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
            <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>
              Pending: {filteredClaims.filter(c => c.status === 'Pending').length}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>
              Under Review: {filteredClaims.filter(c => c.status === 'Under Review').length}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>
              Rejected: {filteredClaims.filter(c => c.status === 'Rejected').length}
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg text-sm">
        <h4 className={`font-bold mb-2 ${theme?.text || 'text-gray-900'}`}>Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-200 border border-gray-400 rounded mr-2"></div>
            <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>Village Boundary</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>IFR Claim</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>CFR Claim</span>
          </div>
        </div>
      </div>

      {/* Hovered village info */}
      {hoveredVillage && (
        <div className="absolute bottom-4 left-4 z-10 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg text-sm max-w-xs">
          <h4 className={`font-bold ${theme?.text || 'text-gray-900'}`}>{hoveredVillage.name}</h4>
          <p className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>
            District: {hoveredVillage.district}
          </p>
          <p className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>
            Claims in village: {filteredClaims.filter(c => c.village === hoveredVillage.name).length}
          </p>
        </div>
      )}

      <MapContainer
        center={mapCenter}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg overflow-hidden"
        whenCreated={(map) => {
          map.getContainer().setAttribute('tabindex', '0');
          map.getContainer().setAttribute('role', 'application');
          map.getContainer().setAttribute('aria-label', 'Interactive FRA Atlas showing village boundaries and claim details');
        }}
      >
        {/* Base tile layer - satellite view for better forest visualization */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
        />
        
        {/* Alternative street map layer */}
        {/* <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        /> */}

        {/* Village boundaries layer */}
        {mapLayers?.villageBoundaries && (
          <GeoJSON
            data={villageGeoJSON}
            style={villageStyle}
            onEachFeature={onEachVillageFeature}
          />
        )}

        {/* Claim boundaries as rectangles */}
        {(mapLayers?.ifrClaims || mapLayers?.cfrClaims) && filteredClaims.map((claim, index) => {
          const shouldShow = (claim.type === 'IFR' && mapLayers?.ifrClaims) || 
                           (claim.type === 'CFR' && mapLayers?.cfrClaims);
          
          if (!shouldShow) return null;

          const bounds = [
            [claim.claimBoundary[0][0], claim.claimBoundary[0][1]],
            [claim.claimBoundary[2][0], claim.claimBoundary[2][1]]
          ];

          return (
            <Rectangle
              key={index}
              bounds={bounds}
              pathOptions={claimBoundaryStyle(claim)}
              eventHandlers={{
                click: () => handleClaimClick(claim)
              }}
            >
              <Popup>
                <div style={{ fontFamily: 'Arial, sans-serif', minWidth: '250px' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: '16px' }}>
                    {claim.type} Claim: {claim.id}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: '1.5' }}>
                    <p><strong>Holder:</strong> {claim.holder}</p>
                    <p><strong>Village:</strong> {claim.village}</p>
                    <p><strong>Area:</strong> {claim.area} acres</p>
                    <p><strong>Status:</strong> 
                      <span style={{ 
                        color: claim.status === 'Granted' ? '#10B981' : 
                              claim.status === 'Pending' ? '#F59E0B' :
                              claim.status === 'Rejected' ? '#EF4444' : '#6366F1',
                        fontWeight: 'bold',
                        marginLeft: '4px'
                      }}>
                        {claim.status}
                      </span>
                    </p>
                    {claim.grantDate && <p><strong>Grant Date:</strong> {claim.grantDate}</p>}
                    {claim.applicationDate && <p><strong>Application Date:</strong> {claim.applicationDate}</p>}
                    {claim.rejectionDate && <p><strong>Rejection Date:</strong> {claim.rejectionDate}</p>}
                    {claim.rejectionReason && <p><strong>Reason:</strong> {claim.rejectionReason}</p>}
                    <p><strong>Resolution:</strong> {claim.resolution}</p>
                  </div>
                </div>
              </Popup>
            </Rectangle>
          );
        })}

        {/* Claim markers */}
        {filteredClaims.map((claim, index) => {
          const shouldShow = (claim.type === 'IFR' && mapLayers?.ifrClaims) || 
                           (claim.type === 'CFR' && mapLayers?.cfrClaims);
          
          if (!shouldShow) return null;

          return (
            <Marker
              key={`marker-${index}`}
              position={claim.coordinates}
              icon={createClaimIcon(claim.type, claim.status)}
              eventHandlers={{
                click: () => handleClaimClick(claim)
              }}
            >
              <Popup>
                <div style={{ fontFamily: 'Arial, sans-serif', minWidth: '200px' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: '14px' }}>
                    {claim.type}: {claim.id}
                  </h3>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>
                    <div><strong>Holder:</strong> {claim.holder}</div>
                    <div><strong>Area:</strong> {claim.area} acres</div>
                    <div><strong>Status:</strong> {claim.status}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Map controller for bounds and center */}
        <MapController bounds={mapBounds} center={mapCenter} zoom={10} />
      </MapContainer>

      {/* Controls info */}
      <div className="absolute bottom-4 right-4 z-10 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg text-sm">
        <p className={`font-bold ${theme?.text || 'text-gray-900'} mb-1`}>Map Controls:</p>
        <p className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>• Click boundaries/markers for details</p>
        <p className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>• Hover villages for quick info</p>
        <p className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>• Zoom with mouse wheel</p>
      </div>
    </div>
  );
};

export default FRAAtlas;