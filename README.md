# AI-Forester-App

A web application for forestry professionals to perform field calculations and collect data.

## Project Setup

1. Install dependencies: `npm install`
2. Start the development server: `npm start`
3. Open your browser to view the application

## Current Status

The application features a fully implemented Road Risk Assessment tool with official scoring methodology and comprehensive form sections, plus an enhanced Culvert Sizing Tool with climate change projections for coastal British Columbia. Both tools provide structured data collection with local storage persistence and support for editing existing assessments.

## Key Features

### Road Risk Assessment Tool - FULLY IMPLEMENTED ✅
- **Official Scoring Methodology**: Uses proper 4-point scale (2, 4, 6, 10) matching forest road risk assessment standards
- **Complete 5-Section Form**: Basic Information, Hazard Factors, Consequence Factors, Optional Assessments, and Results
- **Matrix Risk Assessment**: Professional hazard × consequence risk calculation with official score ranges
- **Official Hazard Factors**: Terrain Stability, Slope Grade, Geology/Soil Type, Drainage Conditions, and Failure History
- **Official Consequence Factors**: Proximity to Water, Drainage Structure Capacity, Public/Industrial Use, and Environmental/Cultural Values
- **Interactive Scoring**: Beautiful button-style rating options with color-coded indicators and detailed explanations
- **Professional Override**: Direct risk level override with required justification and audit trail
- **Management Recommendations**: Official recommendations based on final risk level classification
- **Real-time Calculations**: Live hazard and consequence score totals with instant risk matrix results
- **Comprehensive Results**: Risk matrix visualization, score breakdown, and professional recommendations
- **Local Storage Persistence**: All form data automatically saved and restored between sessions
- **Enhanced Navigation**: Sticky section navigation with beautiful tab design and progress indicators
- **COMPLETE Optional Assessments**: Full geotechnical and infrastructure evaluation modules

### Culvert Sizing Tool - ENHANCED WITH CLIMATE PROJECTIONS ✅
- **BC Coastal Climate Projections**: Integrated PCIC & EGBC climate change factors for coastal British Columbia
- **Climate Factor Presets**: Professional preset options for 2030, 2050, 2080, and 2100 planning horizons
- **With/Without Climate Comparison**: Side-by-side display showing culvert sizing with and without climate factors
- **California Method Default**: California Method is set as the default sizing approach (recommended standard)
- **Professional Method Selection**: Choose between California Method, Hydraulic Calculation, or Method Comparison
- **Interactive Method Display**: Clear visualization of selected vs. reference methods in results
- **Matching UI Design**: Uses the same ribbon navigation style as Road Risk Assessment
- **4-Section Workflow**: Site Information, Stream Measurements, Sizing Method & Options, and Results
- **Method-Specific Parameters**: Hydraulic parameters only required when hydraulic methods are selected
- **Enhanced Results Display**: Shows selected method with status indicators and comparative analysis
- **Comprehensive Sizing Comparison**: Side-by-side display of California Method vs. Hydraulic calculations
- **Professional Styling**: Consistent color scheme and visual design language with method highlighting
- **Watershed Input Form**: Collection of watershed characteristics and design parameters
- **Stream Measurements**: Multiple measurement inputs with dynamic averaging
- **Calculation Engine**: Hydraulic calculations for culvert sizing with method selection
- **Results Visualization**: Display of recommended culvert dimensions with method comparison
- **GPS Integration**: Coordinate capture for culvert locations
- **Fish Passage Options**: Special considerations for fish-bearing streams

### Enhanced Climate Change Features ✅
- **Coastal BC Specific**: Climate factors based on PCIC (Pacific Climate Impacts Consortium) and EGBC (Engineers and Geoscientists BC) recommendations
- **Professional Presets**: 
  - **Present–2030**: F_CC = 1.10 (+10% - PCIC & EGBC suggest for short-term upgrades)
  - **Mid-century (2050)**: F_CC = 1.20 (+20% - Rule-of-thumb used by EGBC when local data are sparse)
  - **Late-century (2080+)**: F_CC = 1.30 (+30% coast / +25% interior - Consistent with hydrologic projections)
- **Comparison Display**: Shows both current climate sizing and climate-adjusted sizing side-by-side
- **Professional Rationale**: Detailed explanations of climate factor selections with scientific backing
- **Method Integration**: Climate factors work with all sizing methods (California, Hydraulic, Comparison)

### General Features ✅
- **Consistent Design Language**: Both tools share the same professional ribbon navigation interface
- **History Tracking**: Save assessment records with details and timestamps
- **GPS Integration**: Capture coordinates for assessment locations
- **Photo Documentation**: Placeholder for field photo integration
- **Responsive Design**: Works on desktop and mobile devices with optimized layouts
- **Modern UI**: Professional design with gradients, shadows, and smooth animations
- **Edit Support**: Load and modify existing assessments from history
- **Professional Validation**: Form validation ensures data quality and completeness

## Changelog

### 2025-05-29 - MAJOR UPDATE: Climate Change Projections for Coastal BC ✅
- **NEW FEATURE**: Coastal British Columbia climate change projections based on PCIC & EGBC recommendations
- **NEW**: Professional climate factor presets with scientific rationale:
  - Present–2030: F_CC = 1.10 (PCIC & EGBC suggest +10% for short-term upgrades)
  - Mid-century (2050): F_CC = 1.20 (Rule-of-thumb used by EGBC when local data are sparse)
  - Late-century (2080+): F_CC = 1.30 coast / 1.25 interior (Consistent with hydrologic projections)
- **NEW**: Climate Factor Comparison section showing with and without climate adjustments
- **NEW**: Side-by-side display of current climate vs. climate-adjusted culvert sizing
- **NEW**: Professional preset selection interface with detailed descriptions and rationale
- **NEW**: Enhanced routing support for editing existing assessments (/culvert/edit/:id and /road-risk/edit/:id)
- **ENHANCED**: CulvertCalculator with proper climate change factor application based on planning horizon
- **ENHANCED**: CulvertResults component with dedicated climate comparison section
- **ENHANCED**: Form validation and error handling for climate parameters
- **ENHANCED**: Professional styling for climate factor presets and comparison displays
- **TECHNICAL**: Updated CulvertCalculator.js with getClimateChangeFactor() and getClimateFactorPresets() functions
- **TECHNICAL**: Enhanced CulvertResults.jsx with climate-comparison-section and specialized styling
- **TECHNICAL**: Updated AppRouter.js to support edit routes for both tools
- **TECHNICAL**: Improved CulvertSizingForm.js with climate preset selection and useParams for editing
- **UI**: Climate factor presets clearly show F_CC values and scientific backing
- **UI**: Professional comparison boxes with current vs. climate-adjusted sizing
- **UI**: Enhanced visual indicators for selected climate scenarios
- **UI**: Comprehensive climate explanation section with coastal BC rationale

### 2025-05-28 - MAJOR UPDATE: California Method Default Selection Implementation ✅
- **NEW FEATURE**: California Method is now the default sizing method (industry standard recommended approach)
- **NEW**: Comprehensive sizing method selection with three options: California Method, Hydraulic Calculation, and Method Comparison
- **NEW**: Method-specific parameter requirements - hydraulic parameters only shown when hydraulic methods are selected
- **NEW**: Enhanced results display with selected method indicators and status badges
- **NEW**: Method comparison visualization showing California vs. Hydraulic calculations side-by-side
- **NEW**: Professional method selection interface with detailed descriptions and recommendations
- **ENHANCED**: CulvertResults component now shows selected method with highlighting and status indicators
- **ENHANCED**: Calculation details table shows which method is selected vs. reference calculations
- **ENHANCED**: Method explanation section adapts based on selected approach
- **ENHANCED**: Form validation now method-specific - only validates required parameters for selected method
- **TECHNICAL**: Updated CulvertSizingForm with sizingMethod state defaulting to 'california'
- **TECHNICAL**: Enhanced CulvertResults with method-aware display logic and conditional rendering
- **TECHNICAL**: Updated CSS with method selection styling, status indicators, and highlighted boxes
- **UI**: California Method clearly marked as "Default" and "Recommended" in selection interface
- **UI**: Method comparison boxes show visual indicators for selected vs. reference methods
- **UI**: Green highlighting and status badges for selected methods throughout results
- **UI**: Method-specific explanations and formulas displayed based on user selection

### 2025-05-28 - MAJOR UPDATE: Culvert Tool Ribbon Navigation Implementation ✅
- **MAJOR UI ENHANCEMENT**: Updated Culvert Sizing Tool to match Road Risk Assessment design language
- **NEW**: Ribbon navigation system with 4 color-coded sections (Site Info, Measurements, Settings, Results)
- **NEW**: Professional section headers with gradient accent bars and color coding
- **NEW**: Consistent styling with enhanced-form.css integration
- **NEW**: Interactive ribbon buttons with icons and hover effects
- **NEW**: Matching color scheme across both tools for unified user experience
- **NEW**: Professional form sections with proper spacing and visual hierarchy
- **ENHANCED**: Site Information section with improved GPS capture interface
- **ENHANCED**: Stream Measurements section with factor-group styling
- **ENHANCED**: Culvert Settings section with consistent form inputs
- **ENHANCED**: Results section with professional styling matching Road Risk tool
- **ENHANCED**: Navigation between sections with smooth transitions
- **TECHNICAL**: Integrated enhanced-form.css for consistent styling
- **TECHNICAL**: Updated component structure to match ribbon navigation pattern
- **TECHNICAL**: Improved form validation with error message styling
- **UI**: Consistent icons and color coding - 📋 Site Info (Blue), 📏 Measurements (Orange), ⚙️ Settings (Purple), 📊 Results (Green)
- **UI**: Professional button styling with gradient backgrounds and hover effects
- **UI**: Enhanced form group styling with proper spacing and visual feedback
- **ACCESSIBILITY**: Improved keyboard navigation and screen reader support

### 2025-05-28 - MAJOR UPDATE: Complete Optional Assessments Implementation ✅
- **NEW FEATURE**: Complete Geotechnical Assessment module with 5 evaluation factors
- **NEW FEATURE**: Complete Infrastructure Assessment module with 5 evaluation factors
- **NEW**: Geotechnical factors include Cut Slope Height, Fill Slope Height, Bedrock Condition, Groundwater Conditions, and Erosion Evidence
- **NEW**: Infrastructure factors include Road Surface Type/Condition, Ditch Condition, Culvert Sizing Adequacy, Culvert Physical Condition, and Road Age
- **NEW**: Simple rating system for optional assessments (Low/Moderate/High risk for geotechnical, Good/Fair/Poor condition for infrastructure)
- **NEW**: Beautiful toggle-enabled sections with professional styling and descriptions
- **NEW**: Optional assessment summary in results section with color-coded indicators
- **NEW**: Detailed assessment descriptions and evaluation criteria for each factor
- **ENHANCED**: Professional styling for optional assessment sections with gradient backgrounds
- **ENHANCED**: Color-coded rating options with risk-based and condition-based indicators
- **ENHANCED**: Comprehensive results display including optional assessment summaries
- **TECHNICAL**: Complete state management for optional assessments with localStorage persistence
- **TECHNICAL**: Enhanced form validation and error handling for all optional factors
- **TECHNICAL**: Added specialized CSS styling for optional assessment components
- **UI**: Professional assessment factor cards with detailed descriptions and examples
- **UI**: Toggle-enabled sections with modern checkbox styling and professional descriptions
- **UI**: Color-coded summary badges in results section for quick assessment overview

### 2025-05-28 - MAJOR UPDATE: Official Scoring System Implementation ✅
- **CRITICAL UPDATE**: Updated to match official forest road risk assessment scoring methodology
- **NEW**: Official 4-point scoring scale: 2 (Low), 4 (Moderate), 6 (High), 10 (Very High)
- **NEW**: Official hazard factors with proper descriptions and scoring criteria
- **NEW**: Official consequence factors aligned with professional standards
- **NEW**: Proper score ranges - Hazard: 10-50 points, Consequence: 8-40 points, Final: 80-2000 points
- **NEW**: Official risk level categories with correct thresholds (Low: 80-250, Moderate: 251-750, High: 751-1400, Very High: 1401-2000)
- **NEW**: Management recommendations matching professional standards for each risk level
- **NEW**: Enhanced validation and score range checking
- **UPDATED**: MatrixRiskAssessment utility completely rewritten to match official methodology
- **UPDATED**: All factor descriptions now match professional assessment criteria
- **UPDATED**: Color coding updated to match official standards (Green, Yellow, Orange, Red)
- **UPDATED**: Risk calculation displays now show official methodology explanation
- **TECHNICAL**: Score validation ensures compliance with official ranges
- **TECHNICAL**: Enhanced professional override system with proper audit trail
- **UI**: Updated all scoring interfaces to reflect official 4-point scale
- **UI**: Added methodology explanations throughout the assessment process

## Technical Architecture

### Unified Design System - Ribbon Navigation Interface ✅

Both the Road Risk Assessment and Culvert Sizing tools now share a consistent design language:

**Shared Navigation Pattern:**
- **Ribbon Navigation**: Sticky navigation bar with color-coded sections
- **Section Icons**: Meaningful icons for each section (📋 📏 ⚙️ 📊)
- **Progress Indicators**: Visual progress tracking across form sections
- **Color Coding**: Consistent color scheme across both tools
- **Interactive Elements**: Hover effects and smooth transitions

**Consistent Styling:**
- **Professional Headers**: Section headers with gradient accent bars
- **Form Elements**: Unified form input styling and validation
- **Button Design**: Consistent button styling with gradients and hover effects
- **Responsive Layout**: Mobile-optimized design across both tools
- **Visual Hierarchy**: Consistent typography and spacing

### Road Risk Assessment System - Complete Implementation

The application implements the official professional risk assessment system methodology:

**Official Scoring System:**
- **4-Point Scale**: 2 (Low), 4 (Moderate), 6 (High), 10 (Very High)
- **Hazard Factors**: 5 factors (Terrain Stability, Slope Grade, Geology/Soil, Drainage Conditions, Failure History)
- **Consequence Factors**: 4 factors (Proximity to Water, Drainage Structure Capacity, Public/Industrial Use, Environmental/Cultural Values)
- **Score Ranges**: Hazard 10-50, Consequence 8-40, Final Risk 80-2000
- **Risk Categories**: Low (80-250), Moderate (251-750), High (751-1400), Very High (1401-2000)

### Culvert Sizing System - Enhanced Implementation with Climate Projections

**Comprehensive Sizing Method Options:**
1. **California Method (Default/Recommended)**: Industry standard using bankfull area × 3 with table lookup
2. **Hydraulic Calculation**: Advanced Manning's equation approach with slope and roughness parameters
3. **Method Comparison**: Conservative approach using the larger of both California and Hydraulic methods

**Enhanced Climate Change Integration:**
- **BC Coastal Projections**: Based on PCIC & EGBC recommendations for coastal British Columbia
- **Professional Presets**: Four planning horizons (2030, 2050, 2080, 2100) with scientifically-backed climate factors
- **Comparison Analysis**: Side-by-side display of current vs. climate-adjusted sizing
- **Method Integration**: Climate factors work seamlessly with all three sizing methods

**Enhanced 4-Section Workflow:**
1. **Site Information**: Culvert ID, road name, GPS coordinates
2. **Stream Measurements**: Top width, bottom width (optional), depth measurements with dynamic averaging
3. **Sizing Method & Options**: Method selection, hydraulic parameters (when needed), climate and debris assessments
4. **Results**: Method-aware calculation display with climate comparison and selected method highlighting

**Professional Climate Change Features:**
- **Coastal BC Specific**: Climate factors optimized for coastal British Columbia conditions
- **Scientific Backing**: Each preset includes rationale from PCIC & EGBC recommendations
- **Professional Display**: Clear comparison between current and climate-adjusted sizing
- **Method Flexibility**: Climate factors apply to all sizing methods uniformly

## Professional Feature Highlights

### Enhanced Culvert Sizing Workflow with Climate Projections ✅

**Section 1: Site Information (📋 Blue)**
- Culvert ID and road name identification
- Professional GPS coordinate capture interface
- Manual coordinate input with validation
- Location display with accuracy indicators

**Section 2: Stream Measurements (📏 Orange)**
- Multiple top width measurements with dynamic inputs
- Optional bottom width measurements for incised channels
- Multiple depth measurements with averaging
- Professional measurement interface with add/remove functionality
- Real-time average calculations display

**Section 3: Sizing Method & Options (⚙️ Purple)**
- **PRIMARY FEATURE**: Comprehensive sizing method selection with California Method as default
- **Method Options**: California Method (recommended), Hydraulic Calculation, or Method Comparison
- **Conditional Parameters**: Hydraulic parameters (slope, headwater ratio, roughness) only shown for hydraulic methods
- **Climate Change Factors**: BC coastal climate projections with professional presets
- **Professional Guidance**: Clear descriptions and recommendations for each method choice

**Section 4: Results (📊 Green)**
- **Method-Aware Display**: Results clearly show selected method with status indicators
- **Climate Comparison**: Dedicated section showing with and without climate factors
- **Professional Recommendations**: Method-specific explanations and formulas
- **Status Indicators**: Visual badges showing "Selected" vs. "Reference" methods
- **Comprehensive Results**: Complete sizing analysis with climate factor comparison

## Project Structure

```
AI-Forester-App/
├── src/
│   ├── components/       # Reusable UI components
│   │   └── culvert/      # Culvert-specific components
│   │       ├── CulvertResults.jsx    # ENHANCED results with climate comparison ✅
│   │       └── CulvertResults.css    # Enhanced styling for climate display ✅
│   ├── navigation/       # Router configuration
│   │   └── AppRouter.js  # ENHANCED router with edit routes ✅
│   ├── pages/            # Main form pages
│   │   ├── RoadRiskForm.js      # COMPLETE Road Risk assessment ✅
│   │   ├── CulvertSizingForm.js # ENHANCED with climate projections ✅
│   │   └── HistoryPage.js       # Assessment history
│   ├── screens/          # Screen components
│   │   └── HomeScreen.js        # Landing page with tool selection
│   ├── styles/           # CSS files for styling
│   │   ├── index.css                 # Enhanced main styles with modern UI
│   │   ├── enhanced-form.css         # SHARED ribbon navigation and form styling ✅
│   │   ├── form-elements.css         # Base form styling
│   │   ├── optional-assessments.css  # Optional assessment styling ✅
│   │   └── RoadRiskForm.css          # Results section styling
│   └── utils/            # Utility functions
│       ├── MatrixRiskAssessment.js   # Official risk calculator ✅
│       ├── CulvertCalculator.js      # ENHANCED culvert sizing with climate factors ✅
│       └── storageUtils.js           # Local storage functions
```

## Visual Design Features

### Modern UI Elements ✨
- **Unified Color System**: Consistent color coding across both tools with climate-specific highlighting
- **Climate Comparison Interface**: Professional side-by-side display of current vs. climate-adjusted sizing
- **Method Selection Interface**: Professional method selection with clear recommendations and status indicators
- **Gradient Backgrounds**: Subtle gradients throughout the interface for depth and professionalism
- **Glass-Morphism Effects**: Modern backdrop blur effects on navigation and key elements
- **Smooth Animations**: Carefully crafted transitions and hover effects for better user experience
- **Professional Typography**: Enhanced font weights, spacing, and hierarchy
- **Responsive Design**: Optimized layouts for desktop, tablet, and mobile devices

### Interactive Elements
- **Climate Factor Presets**: Professional preset selection interface with scientific rationale
- **Method Selection Cards**: Professional method selection interface with recommendations and descriptions
- **Status Indicators**: Visual badges showing selected vs. reference methods throughout results
- **Climate Comparison**: Side-by-side display of current climate vs. climate-adjusted results
- **Ribbon Navigation**: Professional navigation system shared across both tools
- **Button-Style Ratings**: Large, attractive cards instead of traditional radio buttons
- **Hover Effects**: Subtle animations and visual feedback on interactive elements
- **Progress Indicators**: Visual progress tracking across form sections
- **Custom Radio Indicators**: Beautiful circular indicators with smooth selection animations
- **Sticky Navigation**: Always-accessible section navigation with modern tab design
- **Professional Toggles**: Modern checkbox styling for optional assessment sections

## Next Steps

1. **Complete Form Implementation**: Finish full CulvertSizingForm implementation with all sections
2. **PDF Export Enhancement**: Integrate climate comparison data into PDF reports
3. **Mobile App**: Convert to React Native for native mobile app experience
4. **Photo Integration**: Connect with device camera for field photo documentation
5. **Offline Capability**: Add full offline functionality for remote field locations
6. **Multi-user Support**: Implement user authentication and role-based access
7. **Data Export**: CSV and shapefile export capabilities with climate data
8. **GPS Enhancement**: Integrate with device GPS for automatic coordinate capture
9. **Advanced Analytics**: Implement assessment trending and climate impact analysis
10. **Regional Expansion**: Add climate factors for other Canadian provinces and regions

## Dependencies

- React (web application framework)
- React Router (client-side routing with edit support)
- CSS3 (modern styling with gradients, animations, and responsive design)
- HTML5 Geolocation API (GPS coordinates)
- localStorage (client-side data persistence)

## Professional Use Notes

This application is designed for use by qualified forestry professionals, engineers, and technicians. Both tools provide complete workflows for systematic evaluation using professional methodologies with a unified, intuitive interface that reduces user error and improves data quality while maintaining professional standards and regulatory compliance requirements.

The Culvert Sizing Tool now includes professional climate change projections specifically calibrated for coastal British Columbia, based on recommendations from PCIC (Pacific Climate Impacts Consortium) and EGBC (Engineers and Geoscientists BC). The climate factor presets provide scientifically-backed multipliers for different planning horizons, helping professionals design resilient infrastructure for future climate conditions.

## Contributing

1. Create feature branches for new development
2. Follow consistent code style with JSDoc comments  
3. Test on multiple device sizes before submitting changes
4. Update the changelog with your changes
5. Ensure compliance with professional standards and climate science recommendations
6. Maintain modern UI design principles and accessibility standards