import React, { useState } from 'react';
import { useTheme } from './ThemeProvider.jsx';

// Enhanced claim detail modal component
const ClaimDetailModal = ({ claim, isOpen, onClose }) => {
  const theme = useTheme();

  if (!isOpen || !claim) return null;

  const getStatusColor = (status) => {
    const colors = {
      'Granted': 'text-green-600 dark:text-green-400',
      'Pending': 'text-yellow-600 dark:text-yellow-400',
      'Rejected': 'text-red-600 dark:text-red-400',
      'Under Review': 'text-blue-600 dark:text-blue-400'
    };
    return colors[status] || 'text-gray-600';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Granted': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'Under Review': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${theme.cardBg} rounded-2xl shadow-2xl w-full max-w-2xl max-h-screen overflow-hidden border ${theme.border}`}>
        {/* Header */}
        <div className={`p-6 border-b ${theme.border} bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900 dark:to-green-900`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className={`text-2xl font-bold ${theme.text} mb-2`}>FRA Claim Details</h2>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(claim.status)}`}>
                  {claim.status}
                </span>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${theme.isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                  {claim.type}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full ${theme.textMuted} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              aria-label="Close details"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div>
              <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center`}>
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Basic Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className={`text-sm font-medium ${theme.textMuted}`}>Claim ID</label>
                  <p className={`${theme.text} font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded`}>{claim.id}</p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${theme.textMuted}`}>Holder Name</label>
                  <p className={`${theme.text} font-medium`}>{claim.holder}</p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${theme.textMuted}`}>Village</label>
                  <p className={`${theme.text}`}>{claim.village}</p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${theme.textMuted}`}>Area</label>
                  <p className={`${theme.text} font-semibold text-lg`}>{claim.area} acres</p>
                </div>
              </div>
            </div>

            {/* Status & Dates */}
            <div>
              <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center`}>
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Status & Timeline
              </h3>
              <div className="space-y-3">
                <div>
                  <label className={`text-sm font-medium ${theme.textMuted}`}>Current Status</label>
                  <p className={`font-semibold ${getStatusColor(claim.status)}`}>{claim.status}</p>
                </div>
                {claim.grantDate && (
                  <div>
                    <label className={`text-sm font-medium ${theme.textMuted}`}>Grant Date</label>
                    <p className={`${theme.text}`}>{new Date(claim.grantDate).toLocaleDateString()}</p>
                  </div>
                )}
                {claim.applicationDate && (
                  <div>
                    <label className={`text-sm font-medium ${theme.textMuted}`}>Application Date</label>
                    <p className={`${theme.text}`}>{new Date(claim.applicationDate).toLocaleDateString()}</p>
                  </div>
                )}
                {claim.rejectionDate && (
                  <div>
                    <label className={`text-sm font-medium ${theme.textMuted}`}>Rejection Date</label>
                    <p className={`${theme.text}`}>{new Date(claim.rejectionDate).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <label className={`text-sm font-medium ${theme.textMuted}`}>Gram Sabha Resolution</label>
                  <p className={`${theme.text} font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded`}>{claim.resolution}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {claim.rejectionReason && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Rejection Reason
              </h4>
              <p className="text-red-700 dark:text-red-300">{claim.rejectionReason}</p>
            </div>
          )}

          {/* Location Map Preview */}
          <div className="mt-6">
            <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center`}>
              <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location Details
            </h3>
            <div className={`p-4 ${theme.isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`}>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className={`${theme.textMuted}`}>Latitude:</span>
                  <span className={`${theme.text} ml-2 font-mono`}>{claim.coordinates[0].toFixed(6)}</span>
                </div>
                <div>
                  <span className={`${theme.textMuted}`}>Longitude:</span>
                  <span className={`${theme.text} ml-2 font-mono`}>{claim.coordinates[1].toFixed(6)}</span>
                </div>
              </div>
              <p className={`text-xs ${theme.textMuted} mt-2`}>
                💡 Click on the map to view this claim's boundary in detail
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${theme.border} bg-gray-50 dark:bg-gray-800`}>
          <div className="flex justify-between items-center">
            <p className={`text-xs ${theme.textMuted}`}>
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetailModal;