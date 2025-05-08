# Digital Forester App

A mobile application for forestry professionals to perform field calculations and collect data.

## Project Overview

The Digital Forester App is designed for forestry professionals to perform field calculations, collect data, and generate reports. It includes tools for road risk assessment and culvert sizing.

## Project Setup

1. Clone the repository: `git clone https://github.com/davidbeleznay/DigitalForesterApp.git`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. View the app in your browser at `http://localhost:3000`

## Current Status

The application now has:
- A basic routing structure with three main pages
- Comprehensive form state management for both tools
- Local storage for saving and retrieving form data
- Dashboard showing saved drafts
- Advanced Road Risk Assessment with industry-standard scoring framework
- Interactive risk factor selection with visual feedback
- Comprehensive Culvert Sizing Tool with dual-method sizing approach
- Regional flow estimation methods (BC, California, Pacific NW)
- Automatic save functionality for all field changes

## Features Implemented

1. **Basic Navigation**
   - React Router implementation
   - Links between all pages
   - Back buttons

2. **Form Management**
   - Form state using React hooks
   - Input handling and validation
   - Auto-saving to localStorage
   - Manual save with visual feedback

3. **Dashboard**
   - Links to both tools
   - Display of saved drafts with road name and location
   - Continue editing links

4. **Road Risk Assessment Tool**
   - Road and location information capturing
   - GPS coordinate functionality
   - Hazard Factors (Likelihood) assessment
   - Consequence Factors (Severity) assessment
   - Dynamic risk calculation with color-coded display
   - Logarithmic risk score distribution
   - Professional requirements based on risk level
   - Optional additional assessment factors
   - Risk scoring based on industry standards

5. **Culvert Sizing Tool**
   - Multi-step form with progress indicators
   - Stream geometry inputs (bankfull width, depth, channel slope)
   - Watershed characteristics input with regional selection
   - Fish passage indicators for ecological compliance
   - Dual sizing methodology:
     - Hydraulic sizing using Manning's equation
     - Transportability Matrix sizing based on stream width multipliers
   - Automatic selection of larger sizing method for final recommendation
   - Culvert specification selection (material, shape, Manning's n)
   - Toggle switches for climate change and transportability factors
   - Visual comparison of sizing methods in results
   - Rounding to standard culvert sizes with visual highlighting
   - Warning indicators for high velocity and erosion risks
   - Detailed design notes based on calculation method

## How to Use

1. Start the application and navigate to either the Road Risk Assessment or Culvert Sizing Tool
2. Fill out the form fields
3. For Road Risk Assessment:
   - Enter road information with start/end KM
   - Use "Get Location" to capture GPS coordinates
   - Rate each hazard and consequence factor
   - View the calculated risk score and professional requirements
   - Optionally add geotechnical and infrastructure assessments
   - Add general comments
4. For Culvert Sizing Tool:
   - Navigate through the 3-step form process
   - Select the appropriate region (BC, California, Pacific NW) 
   - Enter stream measurements (width, depth, slope)
   - Indicate if this is a fish-bearing stream
   - Enter watershed characteristics based on regional requirements
   - Configure culvert specifications and design preferences
   - Toggle climate change and transportability matrix options
   - Click "Calculate" to get sizing recommendations from both methods
   - Review the larger of the two recommended sizes
   - Read detailed notes and design recommendations
5. Changes are automatically saved as you type
6. Click "Save Draft" to explicitly save your progress
7. Return to the Dashboard to see your saved assessments
8. Click "Continue editing" to resume working on a draft

## Troubleshooting

If you encounter any issues:

1. Make sure you have the latest version: `git pull origin main`
2. Delete the node_modules folder: `rmdir /s /q node_modules` (Windows) or `rm -rf node_modules` (Mac/Linux)
3. Delete package-lock.json: `del package-lock.json` (Windows) or `rm package-lock.json` (Mac/Linux)
4. Reinstall dependencies: `npm install`
5. Start the server: `npm start`

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

### 2025-05-08 (Latest)
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

### 2025-05-08
- Updated risk scoring distribution with logarithmic approach for more accurate risk classification
- Fixed issues with saving data when navigating back to Dashboard
- Improved auto-saving for all form fields
- Enhanced dashboard draft display with road name and location
- Removed unnecessary UI elements and improved visual consistency

### 2025-05-08 (Earlier)
- Enhanced Road Risk Assessment with comprehensive field sections
- Added Hazard Factors (Terrain Stability, Slope Grade, Geology/Soil, Drainage, Road Failure History)
- Added Consequence Factors (Proximity to Water, Drainage Structure, Public/Industrial Use, Environmental Value)
- Implemented dynamic risk calculation with color-coded display
- Added optional additional assessment factors (Geotechnical Considerations, Infrastructure Elements)
- Added GPS location functionality
- Improved UI with color-coded risk levels and visual feedback

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