# Digital Forester App

A web application for forestry professionals to perform field calculations and collect data.

## Project Overview

The Digital Forester App is designed for forestry professionals to perform field calculations, collect data, and generate reports. It includes tools for road risk assessment and culvert sizing.

## Project Setup

1. Clone the repository: `git clone https://github.com/davidbeleznay/DigitalForesterApp.git`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. View the app in your browser at `http://localhost:3000`

## Current Status

The application now has:
- A responsive web interface optimized for both desktop and mobile use
- React Router-based navigation system
- Comprehensive form state management
- Road Risk Assessment tool for evaluation of forest road hazards
- Culvert Sizing Tool with dual-method calculation approach
- Advanced California Method implementation with multiple measurements
- Professional design recommendation system based on culvert sizing results
- Detailed result visualization with comparison tables and warnings
- Improved field card design for better user experience
- Enhanced culvert form with separate top width, bottom width, and depth measurement inputs
- Improved GPS location capture

## Features Implemented

1. **React Web Application**
   - Single-page application architecture
   - Responsive design for mobile and desktop
   - Modern UI components
   - React Router for navigation

2. **Form Management**
   - Form state using React hooks
   - Input handling and validation
   - Step-by-step data entry process
   - Dynamic field calculations

3. **Home Dashboard**
   - Tool selection cards with modern field card design
   - Feature highlights with descriptions
   - Direct navigation to create new assessments
   - Recent drafts section for continuing work

4. **Road Risk Assessment Tool**
   - Comprehensive road evaluation form
   - Hazard and consequence factor scoring
   - Automatic risk calculation matrix
   - Photo documentation capability
   - PDF export functionality

5. **Culvert Sizing Tool**
   - Multi-section form with separate measurement inputs for different dimensions:
     - Individual top width measurements with averaging
     - Individual bottom width measurements with averaging
     - Individual depth measurements with averaging
   - Enhanced GPS location capture with visual confirmation
   - Trapezoid cross-sectional area calculations
   - Dual sizing methodology:
     - Hydraulic sizing using Manning's equation
     - California Method sizing using 3× bankfull cross-sectional area
   - Q100 detection and professional design recommendations
   - Headwater criterion (HW/D) validation
   - Culvert specification selection (material, shape, Manning's n)
   - Toggle switches for climate change factors
   - Comprehensive results display with method comparison
   - Auto-save functionality for draft recovery

## How to Use

1. Start the application and select a tool from the homepage
2. For Road Risk Assessment:
   - Enter road name and location information
   - Rate hazard and consequence factors
   - View calculated risk score and professional requirements
   - Add photos and comments
   - Save assessment or export as PDF

3. For Culvert Sizing:
   - Enter culvert ID and road information
   - Use the GPS button to capture coordinates (requires location permissions)
   - Add multiple stream measurements:
     - Add multiple top width measurements to capture variation
     - Add multiple bottom width measurements if needed
     - Add multiple depth measurements at different locations
   - View calculated averages automatically
   - Enter stream properties (slope, discharge, fish passage requirements)
   - Configure culvert specifications and design preferences
   - Toggle climate change option for future-proofing
   - Save your draft at any time
   - Click "Calculate Culvert Size" to get sizing recommendations from both methods

4. Review History:
   - Access previously saved assessments and drafts
   - Continue editing existing drafts
   - View completed assessments

## Troubleshooting

If you encounter any issues:

1. Make sure you have the latest version: `git pull origin main`
2. Delete the node_modules folder: `rmdir /s /q node_modules` (Windows) or `rm -rf node_modules` (Mac/Linux)
3. Delete package-lock.json: `del package-lock.json` (Windows) or `rm package-lock.json` (Mac/Linux)
4. Reinstall dependencies: `npm install`
5. Start the server: `npm start`

If you encounter any dependency conflicts:
```
npm install --legacy-peer-deps
```

## Next Steps

1. Add Culvert Visualization:
   - Graphic representation of recommended culvert
   - Dynamic cross-section diagram showing water levels
   - Comparison of different shapes and materials
   
2. Add Result Export Functionality:
   - Export calculations as PDF reports
   - Save culvert designs to local database
   - Generate QR codes for field reference

3. Enhance Offline Capabilities:
   - Pre-load regional data for offline use
   - Implement offline map tiles for GPS functionality
   - Periodic background sync when connectivity returns

4. Add Advanced Design Features:
   - Multi-culvert configurations for wider streams
   - Scour and headcutting analysis
   - Energy dissipation structure recommendations

5. Implement User Management:
   - User profiles with saved preferences
   - Team sharing of culvert designs
   - Design approval workflows

## Changelog

### 2025-05-13 (Latest)
- Enhanced Culvert Sizing Tool with separate measurement input sections
- Added ability to capture multiple measurements for top width, bottom width, and depth independently
- Improved GPS location capturing with better visual feedback and error handling
- Updated measurement grid layout for more intuitive data entry
- Added draft saving functionality with status messages
- Enhanced form validation for better user experience
- Updated form styling and component organization for clarity

### 2025-05-13 
- Redesigned HomeScreen with improved field card layout
- Updated navigation to create new assessments when clicking on tool cards
- Enhanced draft card styling with better visual hierarchy
- Improved responsive design for various screen sizes
- Added card descriptions to better explain each tool's purpose

### 2025-05-13
- Fixed Road Risk Assessment routing issues
- Added proper navigation link to Road Risk Assessment from HomeScreen
- Added route for History page
- Ensured proper connectivity between all application components
- Updated README with comprehensive documentation on all tools

### 2025-05-13
- Converted application to React web app from React Native
- Fixed dependency conflicts and package structure
- Updated navigation to use React Router instead of React Navigation
- Modified GPS functionality to use web Geolocation API
- Updated UI components to use web-compatible styling
- Created modern responsive HomeScreen with tool navigation cards
- Fixed React error handling and validation

### 2025-05-13 (Earlier)
- Implemented California Method culvert sizing with 3x bankfull area calculation
- Added multiple measurement inputs for top width, bottom width, and depth
- Added automatic calculation of cross-sectional area and required culvert size
- Implemented Q100 handling with professional design recommendations
- Created comprehensive results screen with detailed calculation breakdowns
- Added formula display and comparison tables for sizing methods
- Enhanced culvert sizing calculator with headwater criterion checks
- Added warning banner for streams requiring professional design

### 2025-05-13 (Earlier)
- Simplified Culvert ID section by removing Assessment title
- Replaced Location field with GPS button for automatic coordinate capture
- Removed Region field from Culvert ID section
- Added expo-location integration for GPS functionality

### 2025-05-08
- Enhanced Culvert Sizing Tool with dual sizing methodology
- Added stream geometry inputs (width, depth, slope, fish passage)
- Implemented transportability matrix sizing alongside hydraulic sizing
- Added comparison logic to recommend larger of two sizes
- Added regional calculation methods (BC, California, Pacific NW)
- Implemented fish passage considerations and debris transport requirements
- Enhanced results display with sizing method comparison
- Added toggles for climate change and transportability matrix options
- Improved UI with additional field validations and tooltips

### 2025-05-08 (Earlier)
- Implemented comprehensive Culvert Sizing Tool with multi-step form process
- Added watershed characteristics input section with runoff coefficient selection
- Integrated bankfull measurement inputs for ecological compliance
- Added culvert specifications section with material, shape, and Manning's n selection
- Implemented calculation logic using Rational Method and Manning's equation
- Created results display with recommended culvert sizes and velocity checks
- Added climate change and debris factors for resilient design
- Enhanced form with safety factor inputs and design recommendations

### 2025-05-07
- Added form state management using React hooks
- Implemented localStorage for saving and retrieving form data
- Updated Dashboard to display saved drafts
- Added feedback messages for form actions

### 2025-05-06
- Added basic routing with React Router
- Created Dashboard, Road Risk Form, and Culvert Sizing Form pages
- Implemented navigation between pages
- Added basic form UI with styled inputs
- Simplified app structure to resolve formatting issues