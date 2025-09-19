# FRA Atlas & DSS Project

## Overview
The Forest Rights Act (FRA) Atlas & Decision Support System (DSS) is a comprehensive platform for visualizing and managing FRA-related data across India. This project provides tools for digitizing documents, mapping forest rights, and supporting decision-making processes.

## New GeoPortal Features
This version includes enhanced Google Maps-like functionality similar to government geoportals:

### Map Layers
- **Village Boundaries**: Detailed village boundary polygons
- **IFR Claims**: Individual Forest Rights claims with status indicators
- **CFR Claims**: Community Forest Rights claims with status indicators
- **Land Use Classification**: Different land use types visualization
- **Water Bodies**: Rivers, lakes, and other water features
- **Field Reports**: Mobile-submitted field reports
- **Advanced AI Layers**:
  - **Potential CFR Claims**: AI-identified potential claims
  - **Change Detection**: Land use/forest cover changes over time

### View Options
- **Standard View**: Traditional FRA Atlas view
- **GeoPortal View**: Enhanced map with all available layers

## Features
- Document digitization with AI-powered OCR
- Interactive maps with multiple data layers
- Targeted states visualization (Tripura, Madhya Pradesh, Odisha, Telangana)
- FRA claims tracking and management
- Decision support system for policy recommendations
- Multi-language support

## Technical Implementation
- React with Vite
- Leaflet for mapping
- Tailwind CSS for styling
- Jest for testing

## Documentation
- [GEO_PORTAL_FEATURES.md](GEO_PORTAL_FEATURES.md): Detailed feature documentation
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md): Implementation overview
- [TESTING_GUIDE.md](TESTING_GUIDE.md): Testing configuration and best practices

## Getting Started
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

## License
This project is licensed under the MIT License.