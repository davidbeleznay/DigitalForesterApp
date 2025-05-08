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
- Comprehensive Culvert Sizing Tool with multi-step input process
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
   - Watershed characteristics input (area, length, slope)
   - Runoff coefficient selection based on land cover type
   - Bankfull measurement recording for ecological compliance
   - Culvert specification selection (material, shape, Manning's n)
   - Climate change and debris factors for resilient design
   - Automatic calculations using Rational Method and Manning's equation
   - Results display with recommended culvert sizes
   - Warning indicators for high velocity and erosion risks
   - Detailed notes and recommendations

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
   - Enter basic info, watershed characteristics, and culvert specifications
   - Provide bankfull measurements for ecological compliance
   - Click "Calculate" to get sizing recommendations
   - Review velocity and headwater depth results
   - Read detailed notes and recommendations
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
   - Comparison of different shapes and materials
   
2. Add user authentication

3. Create a Results History page

4. Add offline functionality for field use

5. Implement export capabilities (PDF, CSV)

## Changelog

### 2025-05-08 (Latest)
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