import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, Circle, Rectangle, useMap, LayersControl, LayerGroup } from 'react-leaflet';
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
  'Madhya Pradesh': {
    villages: [
      {
        id: 1,
        name: 'Sample Village 1',
        district: 'Indore',
        population: 1250,
        tribalPopulation: 890,
        forestArea: '420 acres',
        center: [22.72, 75.82],
        boundary: [[75.8, 22.7], [75.9, 22.7], [75.9, 22.8], [75.8, 22.8], [75.8, 22.7]]
      },
      {
        id: 2,
        name: 'Sample Village 2',
        district: 'Bhopal',
        population: 1890,
        tribalPopulation: 1420,
        forestArea: '650 acres',
        center: [23.22, 77.32],
        boundary: [[77.2, 23.1], [77.3, 23.1], [77.3, 23.2], [77.2, 23.2], [77.2, 23.1]]
      }
    ],
    claims: [
      {
        id: 'IFR-001',
        type: 'IFR',
        holder: 'Ramesh Kumar',
        village: 'Sample Village 1',
        area: '5.2 acres',
        status: 'Granted',
        coordinates: [22.75, 75.85],
        claimBoundary: [[75.82, 22.72], [75.88, 22.72], [75.88, 22.78], [75.82, 22.78], [75.82, 22.72]],
        grantDate: '2020-05-15'
      },
      {
        id: 'CFR-001',
        type: 'CFR',
        holder: 'Tribal Community A',
        village: 'Sample Village 2',
        area: '150 acres',
        status: 'Under Review',
        coordinates: [23.15, 77.25],
        claimBoundary: [[77.22, 23.12], [77.28, 23.12], [77.28, 23.18], [77.22, 23.18], [77.22, 23.12]],
        applicationDate: '2023-11-20'
      }
    ]
  },
  'Tripura': {
    villages: [
      {
        id: 3,
        name: 'Sample Village 3',
        district: 'West Tripura',
        population: 980,
        tribalPopulation: 720,
        forestArea: '320 acres',
        center: [23.82, 91.22],
        boundary: [[91.1, 23.8], [91.3, 23.8], [91.3, 24.0], [91.1, 24.0], [91.1, 23.8]]
      }
    ],
    claims: [
      {
        id: 'IFR-002',
        type: 'IFR',
        holder: 'Sunita Devi',
        village: 'Sample Village 3',
        area: '3.8 acres',
        status: 'Pending',
        coordinates: [23.85, 91.25],
        claimBoundary: [[91.2, 23.82], [91.3, 23.82], [91.3, 23.92], [91.2, 23.92], [91.2, 23.82]]
      }
    ]
  },
  'Odisha': {
    villages: [
      {
        id: 4,
        name: 'Sample Village 4',
        district: 'Cuttack',
        population: 1560,
        tribalPopulation: 980,
        forestArea: '580 acres',
        center: [20.52, 85.82],
        boundary: [[85.8, 20.5], [85.9, 20.5], [85.9, 20.6], [85.8, 20.6], [85.8, 20.5]]
      }
    ],
    claims: [
      {
        id: 'CFR-002',
        type: 'CFR',
        holder: 'Forest Community B',
        village: 'Sample Village 4',
        area: '220 acres',
        status: 'Granted',
        coordinates: [20.55, 85.85],
        claimBoundary: [[85.82, 20.52], [85.88, 20.52], [85.88, 20.58], [85.82, 20.58], [85.82, 20.52]],
        grantDate: '2019-08-12'
      }
    ]
  },
  'Telangana': {
    villages: [
      {
        id: 5,
        name: 'Sample Village 5',
        district: 'Hyderabad',
        population: 2100,
        tribalPopulation: 1350,
        forestArea: '450 acres',
        center: [17.42, 78.42],
        boundary: [[78.4, 17.4], [78.5, 17.4], [78.5, 17.5], [78.4, 17.5], [78.4, 17.4]]
      }
    ],
    claims: [
      {
        id: 'IFR-003',
        type: 'IFR',
        holder: 'Krishna Rao',
        village: 'Sample Village 5',
        area: '7.1 acres',
        status: 'Rejected',
        coordinates: [17.45, 78.45],
        claimBoundary: [[78.42, 17.42], [78.48, 17.42], [78.48, 17.48], [78.42, 17.48], [78.42, 17.42]],
        rejectionDate: '2021-03-18',
        rejectionReason: 'Insufficient documentation'
      }
    ]
  }
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
    if (bounds && map && typeof map.fitBounds === 'function') {
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (center && map && typeof map.setView === 'function') {
      map.setView(center, zoom || map.getZoom());
    }
  }, [bounds, center, zoom, map]);
  
  return null;
};

// Sample data for additional layers
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
        coordinates: [[[77.5, 12.5], [78.0, 12.5], [78.0, 13.0], [77.5, 13.0], [77.5, 12.5]]]
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
        coordinates: [[[78.0, 13.0], [78.5, 13.0], [78.5, 13.5], [78.0, 13.5], [78.0, 13.0]]]
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
        coordinates: [[77.6, 12.6], [77.8, 12.8], [78.0, 13.0]]
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
        coordinates: [[[78.2, 13.2], [78.4, 13.2], [78.4, 13.4], [78.2, 13.4], [78.2, 13.2]]]
      }
    }
  ]
};

const fieldReportsData = [
  {
    id: 1,
    coordinates: [23.5, 78.0],
    title: "Forest Boundary Dispute",
    description: "Community reported unclear forest boundaries near village X",
    date: "2025-01-15",
    reporter: "Field Officer A",
    status: "Pending Review"
  },
  {
    id: 2,
    coordinates: [23.7, 78.2],
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
    coordinates: [23.6, 78.1],
    title: "Potential CFR Claim",
    description: "Community eligible for CFR claim based on traditional use",
    confidence: "High",
    area: "150 acres"
  },
  {
    id: 2,
    coordinates: [23.8, 78.3],
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
        coordinates: [[[77.7, 12.7], [77.9, 12.7], [77.9, 12.9], [77.7, 12.9], [77.7, 12.7]]]
      }
    }
  ]
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

  // Land use styling
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

  // Water bodies styling
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

  // Change detection styling
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

  // Handle land use feature events
  const onEachLandUseFeature = (feature, layer) => {
    layer.bindPopup(`
      <div style="font-family: Arial, sans-serif; min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 16px;">${feature.properties.name}</h3>
        <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
          <strong>Type:</strong> ${feature.properties.type}
        </p>
        <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
          <strong>Area:</strong> ${feature.properties.area}
        </p>
      </div>
    `);
  };

  // Handle water bodies feature events
  const onEachWaterBodyFeature = (feature, layer) => {
    layer.bindPopup(`
      <div style="font-family: Arial, sans-serif; min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 16px;">${feature.properties.name}</h3>
        <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
          <strong>Type:</strong> ${feature.properties.type}
        </p>
      </div>
    `);
  };

  // Handle change detection feature events
  const onEachChangeFeature = (feature, layer) => {
    layer.bindPopup(`
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
          {mapLayers?.landUse && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>Land Use</span>
            </div>
          )}
          {mapLayers?.waterBodies && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>Water Bodies</span>
            </div>
          )}
          {mapLayers?.changeDetection && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className={`text-xs ${theme?.textMuted || 'text-gray-600'}`}>Change Detection</span>
            </div>
          )}
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

        {/* Land Use Classification layer */}
        {mapLayers?.landUse && (
          <GeoJSON
            data={landUseData}
            style={landUseStyle}
            onEachFeature={onEachLandUseFeature}
          />
        )}

        {/* Water Bodies layer */}
        {mapLayers?.waterBodies && (
          <GeoJSON
            data={waterBodiesData}
            style={waterBodiesStyle}
            onEachFeature={onEachWaterBodyFeature}
          />
        )}

        {/* Change Detection layer */}
        {mapLayers?.changeDetection && (
          <GeoJSON
            data={changeDetectionData}
            style={changeDetectionStyle}
            onEachFeature={onEachChangeFeature}
          />
        )}

        {/* Field Reports (Mobile) markers */}
        {mapLayers?.fieldReports && fieldReportsData.map((report, index) => (
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

        {/* Potential CFR Claims markers */}
        {mapLayers?.potentialClaims && potentialClaimsData.map((claim, index) => (
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
                    {claim.resolution && <p><strong>Resolution:</strong> {claim.resolution}</p>}
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