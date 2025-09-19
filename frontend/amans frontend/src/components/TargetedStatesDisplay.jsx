import React, { useState } from 'react';
import { useTheme } from './ThemeProvider.jsx';

const TargetedStatesDisplay = ({ onStateClick, selectedStates = [] }) => {
  const [hoveredState, setHoveredState] = useState(null);
  const theme = useTheme();

  // Target states data - to be populated from API
  const targetStates = [
    // State data will be loaded from backend API
    // Structure: { id, name, shortName, lat, lng, color, villages, claims, description, forestCover, districts, priority, status }
  ];

  const handleStateClick = (state) => {
    if (onStateClick) {
      onStateClick(state);
    }
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
              transition-all duration-300 transform hover:-translate-y-2 cursor-pointer
              border-2 ${isSelected(state.id) ? 'border-blue-500' : 'border-transparent'}
              ${hoveredState === state.id ? 'scale-105' : ''}
            `}
            onClick={() => handleStateClick(state)}
            onMouseEnter={() => setHoveredState(state.id)}
            onMouseLeave={() => setHoveredState(null)}
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
                    {Math.floor(Math.random() * 30 + 60)}%
                  </span>
                </div>
                <div className={`w-full ${theme.isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: state.color, 
                      width: `${Math.floor(Math.random() * 30 + 60)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Hover Effect Overlay */}
            {hoveredState === state.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none rounded-xl"></div>
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
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg">
          View Detailed Reports
        </button>
        <button className={`px-6 py-3 ${theme.isDark ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-600 hover:bg-gray-700'} text-white rounded-lg transition-colors font-semibold shadow-lg`}>
          Export Data
        </button>
      </div>
    </div>
  );
};

export default TargetedStatesDisplay;