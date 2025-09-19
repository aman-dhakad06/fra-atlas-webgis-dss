# GeoPortal Map Features

This document describes the enhanced GeoPortal map features added to the FRA Atlas application, similar to the functionality found in government geoportals like https://geoportal.mp.gov.in/

## Features Implemented

### 1. Map Layers Control
- **Village Boundaries**: Shows village boundary polygons with detailed information
- **IFR Claims**: Displays Individual Forest Rights claims with status indicators
- **CFR Claims**: Displays Community Forest Rights claims with status indicators
- **Land Use Classification**: Shows different land use types (agricultural, forest, residential, etc.)
- **Water Bodies**: Displays rivers, lakes, and other water features
- **Field Reports (Mobile)**: Shows field reports submitted via mobile devices
- **Advanced AI Layers**:
  - **Potential CFR Claims**: AI-identified potential community forest rights claims
  - **Change Detection**: Shows changes in land use or forest cover over time

### 2. Layer Switching
Users can toggle between:
- **Standard View**: Traditional FRA Atlas view
- **GeoPortal View**: Enhanced map with all available layers

### 3. Interactive Features
- Click on any map feature to view detailed information
- Hover over village boundaries to see quick info
- Layer control panel for enabling/disabling specific map layers
- Legend for understanding map symbols and colors

### 4. Base Map Options
- **Satellite View**: High-resolution satellite imagery for better visualization of forest areas
- **Street View**: Traditional map view with roads and place names

## Technical Implementation

### Components
1. **GeoPortalMap.jsx**: New component that implements the enhanced map functionality
2. **FRAAtlas.jsx**: Enhanced with additional layer support
3. **IndiaMap.jsx**: Updated with additional layer capabilities
4. **App.jsx**: Updated with map view toggle functionality

### Data Structure
Sample data structures for each layer type:
- Village boundaries as GeoJSON polygons
- Claims as GeoJSON points and polygons
- Land use classification as GeoJSON polygons
- Water bodies as GeoJSON lines and polygons
- Field reports as markers with popup information
- Change detection as GeoJSON polygons with special styling

### Styling
- Color-coded layers for easy identification
- Different marker styles for different feature types
- Popup windows with detailed information
- Responsive design that works on different screen sizes

## Usage Instructions

1. Navigate to the FRA Atlas section in the application
2. Select a state and district to view
3. Toggle between Standard and GeoPortal views using the view switcher
4. Enable/disable layers using the layer control panel
5. Click on any map feature to view detailed information
6. Use the legend to understand map symbols

## Future Enhancements

1. Integration with real geospatial data APIs
2. Time slider for change detection visualization
3. Export functionality for map views
4. Measurement tools for distance and area calculation
5. Printing capabilities for map views
6. Advanced search and filtering options