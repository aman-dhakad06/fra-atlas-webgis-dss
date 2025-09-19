import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider.jsx';

const TargetedStatesDisplay = ({ onStateClick, selectedStates = [] }) => {
  const [hoveredState, setHoveredState] = useState(null);
  const [targetStates, setTargetStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  // Fetch target states data
  useEffect(() => {
    const fetchTargetStates = async () => {
      try {
        // In a real application, this would be an API call
        // For now, we're simulating the API call with a mock
        const mockApi = {
          getTargetedStates: () => new Promise(resolve => {
            setTimeout(() => {
              // Generate consistent progress values for each state
              const generateProgress = () => Math.floor(Math.random() * 30 + 60);
              
              resolve([
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
                  status: 'Active',
                  progress: 78 // Fixed progress value
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
                  status: 'Active',
                  progress: 65 // Fixed progress value
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
                  status: 'Active',
                  progress: 82 // Fixed progress value
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
                  status: 'Active',
                  progress: 71 // Fixed progress value
                }
              ]);
            }, 1000);
          })
        };
        
        const data = await mockApi.getTargetedStates();
        setTargetStates(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching target states:', error);
        setLoading(false);
      }
    };

    fetchTargetStates();
  }, []);

  const handleStateClick = (state) => {
    if (onStateClick) {
      onStateClick(state);
    }
  };

  const handleViewDetailedReports = () => {
    // In a real application, this would navigate to a detailed reports page
    alert('Viewing detailed reports for all targeted states');
    console.log('Viewing detailed reports for states:', targetStates);
  };

  const handleExportData = () => {
    // In a real application, this would export the data to a file
    alert('Exporting data for all targeted states');
    console.log('Exporting data for states:', targetStates);
    
    // Create a simple CSV export
    const csvContent = [
      ['State', 'Villages Mapped', 'FRA Claims', 'Forest Cover', 'Districts', 'Priority', 'Progress %'],
      ...targetStates.map(state => [
        state.name,
        state.villages,
        state.claims,
        state.forestCover,
        state.districts.length,
        state.priority,
        state.progress
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'fra_targeted_states.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPriorityColor = (priority) => {
    const baseColors = {
      'High': theme.isDark ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-800',
      'Medium': theme.isDark ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
      'Low': theme.isDark ? 'bg-green-900/20 text-green-300' : 'bg-green-100 text-green-800',
      'default': theme.isDark ? 'bg-gray-900/20 text-gray-300' : `bg-gray-100 ${theme.textOnBackground}`
    };
    return baseColors[priority] || baseColors['default'];
  };

  const getStatusColor = () => {
    return theme.isDark ? 'bg-green-900/20 text-green-300' : 'bg-green-100 text-green-800';
  };

  const isSelected = (stateId) => selectedStates.some(s => s.id === stateId);

  if (loading) {
    return (
      <div className={`w-full h-full ${theme.gradientBg} rounded-2xl p-6 overflow-auto`}>
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold ${theme.text} mb-2`}>
            FRA Targeted States
          </h2>
          <p className={theme.textMuted}>
            Loading targeted states data...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((index) => (
            <div 
              key={index} 
              className={`${theme.cardBg} rounded-xl ${theme.shadow} animate-pulse h-64`}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${theme.gradientBg} rounded-2xl p-6 overflow-auto`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold ${theme.text} mb-2`}>
          FRA Targeted States
        </h2>
        <p className={theme.textMuted}>
          Key states identified for Forest Rights Act implementation and monitoring
        </p>
      </div>

      {/* States Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {targetStates.map((state) => (
          <div
            key={state.id}
            className={`
              relative ${theme.cardBg} rounded-xl ${theme.shadow} hover:shadow-2xl 
              transition-all duration-300 cursor-pointer
              border-2 ${isSelected(state.id) ? 'border-blue-500' : 'border-transparent'}
              ${hoveredState === state.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
            `}
            onClick={() => handleStateClick(state)}
            onMouseEnter={() => setHoveredState(state.id)}
            onMouseLeave={() => setHoveredState(null)}
            style={{
              transform: hoveredState === state.id ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease'
            }}
          >
            {/* State Header */}
            <div className={`relative p-6 border-b ${theme.border}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                    style={{ backgroundColor: state.color }}
                  >
                    {state.shortName}
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${theme.text}`}>
                      {state.name}
                    </h3>
                    <p className={`text-sm ${theme.textMuted}`}>
                      {state.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(state.priority)}`}>
                    {state.priority} Priority
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}>
                    {state.status}
                  </span>
                </div>
              </div>
            </div>

            {/* State Statistics */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`text-center p-4 ${theme.isDark ? 'bg-blue-900/20' : 'bg-blue-50'} rounded-lg`}>
                  <div className={`text-2xl font-bold ${theme.isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {state.villages.toLocaleString()}
                  </div>
                  <div className={`text-sm ${theme.textMuted}`}>Villages Mapped</div>
                </div>
                <div className={`text-center p-4 ${theme.isDark ? 'bg-green-900/20' : 'bg-green-50'} rounded-lg`}>
                  <div className={`text-2xl font-bold ${theme.isDark ? 'text-green-400' : 'text-green-600'}`}>
                    {state.claims.toLocaleString()}
                  </div>
                  <div className={`text-sm ${theme.textMuted}`}>FRA Claims</div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme.textMuted}`}>Forest Cover:</span>
                  <span className={`text-sm font-semibold ${theme.text}`}>{state.forestCover}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme.textMuted}`}>Coordinates:</span>
                  <span className={`text-sm font-semibold ${theme.text}`}>
                    {state.lat}°N, {state.lng}°E
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme.textMuted}`}>Districts:</span>
                  <span className={`text-sm font-semibold ${theme.text}`}>
                    {state.districts.length} districts
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className={`mt-4 pt-4 border-t ${theme.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${theme.textMuted}`}>Implementation Progress</span>
                  <span className={`text-sm font-semibold ${theme.text}`}>
                    {state.progress}%
                  </span>
                </div>
                <div className={`w-full ${theme.isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: state.color, 
                      width: `${state.progress}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Hover Effect Overlay */}
            {hoveredState === state.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none rounded-xl"></div>
            )}

            {/* Click Indicator */}
            {isSelected(state.id) && (
              <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${theme.cardBg} rounded-lg p-4 text-center ${theme.shadow}`}>
          <div className={`text-2xl font-bold ${theme.isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            {targetStates.reduce((sum, state) => sum + state.villages, 0).toLocaleString()}
          </div>
          <div className={`text-sm ${theme.textMuted}`}>Total Villages</div>
        </div>
        <div className={`${theme.cardBg} rounded-lg p-4 text-center ${theme.shadow}`}>
          <div className={`text-2xl font-bold ${theme.isDark ? 'text-green-400' : 'text-green-600'}`}>
            {targetStates.reduce((sum, state) => sum + state.claims, 0).toLocaleString()}
          </div>
          <div className={`text-sm ${theme.textMuted}`}>Total Claims</div>
        </div>
        <div className={`${theme.cardBg} rounded-lg p-4 text-center ${theme.shadow}`}>
          <div className={`text-2xl font-bold ${theme.isDark ? 'text-purple-400' : 'text-purple-600'}`}>
            {targetStates.length}
          </div>
          <div className={`text-sm ${theme.textMuted}`}>Target States</div>
        </div>
        <div className={`${theme.cardBg} rounded-lg p-4 text-center ${theme.shadow}`}>
          <div className={`text-2xl font-bold ${theme.isDark ? 'text-orange-400' : 'text-orange-600'}`}>
            {targetStates.reduce((sum, state) => sum + state.districts.length, 0)}
          </div>
          <div className={`text-sm ${theme.textMuted}`}>Total Districts</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-center space-x-4">
        <button 
          onClick={handleViewDetailedReports}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg"
        >
          View Detailed Reports
        </button>
        <button 
          onClick={handleExportData}
          className={`px-6 py-3 ${theme.isDark ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-600 hover:bg-gray-700'} text-white rounded-lg transition-colors font-semibold shadow-lg`}
        >
          Export Data
        </button>
      </div>
    </div>
  );
};

export default TargetedStatesDisplay;