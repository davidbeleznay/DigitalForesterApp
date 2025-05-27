# AI-Forester-App

A web application for forestry professionals to perform field calculations and collect data.

## Project Setup

1. Install dependencies: `npm install`
2. Start the development server: `npm start`
3. Open your browser to view the application

## Current Status

The application features a fully implemented Road Risk Assessment tool with comprehensive form sections and matrix-based risk assessment methodology, plus a Culvert Sizing Tool. Both tools provide structured data collection with local storage persistence.

## Key Features

### Road Risk Assessment Tool - FULLY IMPLEMENTED ✅
- **Complete 5-Section Form**: Basic Information, Hazard Factors, Consequence Factors, Optional Assessments, and Results
- **Matrix Risk Assessment**: Professional hazard × consequence risk matrix with color-coded visualization
- **Interactive Scoring**: Color-coded score buttons (2-10 scale) with detailed explanations for each factor
- **GPS Integration**: Capture start/end coordinates using device location services
- **Optional Assessments**: Toggle-enabled geotechnical and infrastructure assessment tables
- **Professional Override**: Direct risk level override with required justification and audit trail
- **Real-time Calculations**: Live hazard and consequence score totals with instant risk matrix results
- **Comprehensive Results**: Risk matrix visualization, score breakdown, and professional recommendations
- **Local Storage Persistence**: All form data automatically saved and restored between sessions
- **Form Navigation**: Tab-based navigation between sections with progress indicators

### Culvert Sizing Tool
- **Watershed Input Form**: Collection of watershed characteristics and design parameters
- **Calculation Engine**: Hydraulic calculations for culvert sizing
- **Results Visualization**: Display of recommended culvert dimensions

### General Features
- **History Tracking**: Save assessment records with details and timestamps
- **GPS Integration**: Capture coordinates for assessment locations
- **Photo Documentation**: Placeholder for field photo integration
- **Responsive Design**: Works on desktop and mobile devices

## Changelog

### 2025-05-27 - Fixed Road Risk Routing Issue
- **FIXED**: Road Risk routing export issue resolved by refreshing file cache
- **TECHNICAL**: Added comment header to RoadRiskForm.js to force Git recognition
- **VERIFIED**: All routing paths working correctly for both tools
- **STATUS**: Application ready for production use

### 2025-05-26 - COMPLETED Road Risk Assessment Form Implementation ✅
- **MAJOR COMPLETION**: Fully implemented all 5 sections of Road Risk Assessment form
- **NEW**: Complete Basic Information section with GPS coordinate capture
- **NEW**: Complete Hazard Factors section with 5 interactive scoring factors (terrain stability, slope grade, geology/soil, drainage conditions, failure history)
- **NEW**: Complete Consequence Factors section with 4 interactive scoring factors (water proximity, drainage structures, public/industrial use, environmental values)
- **NEW**: Complete Optional Assessments section with geotechnical and infrastructure toggle tables
- **NEW**: Complete Results section with professional risk matrix visualization and override capabilities
- **ENHANCED**: Color-coded scoring buttons (green=2, yellow=4, orange=6, red=10) with detailed explanations
- **ENHANCED**: Real-time score calculation with live totals for hazard and consequence factors
- **ENHANCED**: Professional risk matrix with 5×5 grid showing risk intersections
- **ENHANCED**: Tab-based navigation between form sections with active section highlighting
- **ENHANCED**: Comprehensive form validation and error handling
- **ENHANCED**: GPS location capture for both start and end coordinates
- **ENHANCED**: Toggle switches for optional assessment sections (geotechnical and infrastructure)
- **ENHANCED**: Professional override system with modify/reset capabilities
- **TECHNICAL**: Complete state management with localStorage persistence for all form sections
- **TECHNICAL**: Proper event handlers for all form interactions and navigation
- **TECHNICAL**: Full integration with MatrixRiskAssessment utility class
- **TECHNICAL**: Responsive CSS styling for all form components
- **UI**: Fixed action buttons (Save Progress, Reset Form) at bottom of form
- **UI**: Section navigation buttons with Previous/Next functionality
- **UI**: Comments sections for additional observations in each major section

### 2025-05-26 - Simplified Risk Assessment System
- **MAJOR UPDATE**: Replaced complex matrix lookup with simplified Hazard × Consequence multiplication
- **NEW**: Conservative risk ranges implemented (Low: 64-250, Moderate: 251-750, High: 751-1400, Very High: 1401-2000)
- **SIMPLIFIED**: Professional override now directly overrides overall risk level instead of separate hazard/consequence levels
- **ENHANCED**: Clear display of Risk Score = Hazard × Consequence calculation in results
- **ENHANCED**: Risk ranges display shows where current score falls within conservative thresholds
- **TECHNICAL**: Updated MatrixRiskAssessment utility to use multiplication methodology
- **TECHNICAL**: Added applyDirectOverride method for simplified override workflow
- **TECHNICAL**: Maintained backwards compatibility with legacy override system
- **UI**: Streamlined override interface to show Current Risk → Override to selection
- **UI**: Removed complex optional assessment tables to focus on core functionality

### 2025-05-23 - Reverted to Original Color Bar Implementation
- **REVERTED**: Removed RiskAssessmentSlider components 
- **MAINTAINED**: Original color-coded score buttons (green, yellow, orange, red) for risk factors
- **PRESERVED**: Table-based optional assessments with radio button selections
- **CLEANED**: Removed slider-related files and references

### 2025-05-23 - Enhanced Risk Assessment Features
- **NEW**: Added visual risk matrix diagram with 5×5 professional risk matrix display
- **NEW**: Restored missing optional assessments with geotechnical and infrastructure toggle sections
- **FIXED**: Professional override re-application bug - can now modify existing overrides
- **ENHANCED**: Optional assessments now include toggle switches for geotechnical considerations and infrastructure elements
- **ENHANCED**: Added comprehensive assessment tables with radio button selections for detailed evaluation
- **ENHANCED**: Improved override functionality with "Modify Override" capability
- **ENHANCED**: Risk matrix visualization shows color-coded risk intersections
- **TECHNICAL**: Added MatrixRiskAssessment.css styles for risk matrix table and toggle switches
- **TECHNICAL**: Enhanced state management for optional assessment toggles
- **TECHNICAL**: Fixed override state management to allow re-editing of applied overrides

### 2025-05-22 - Matrix Risk Assessment Implementation
- **NEW**: Implemented professional matrix risk assessment methodology
- **NEW**: Added professional override capability with required justification
- **NEW**: Created MatrixRiskAssessment utility class following industry standards
- **ENHANCED**: Risk assessment now uses proper risk matrix (Hazard Level × Consequence Level)
- **ENHANCED**: Risk levels converted from raw scores to professional categories (Very Low, Low, Moderate, High, Very High)
- **ENHANCED**: Results section completely redesigned with matrix visualization
- **ENHANCED**: Added professional requirements and recommendations based on final risk level
- **ENHANCED**: Override functionality with audit trail and justification requirements
- **TECHNICAL**: Added MatrixRiskAssessment.css for professional UI styling
- **TECHNICAL**: Enhanced state management for override capabilities
- **TECHNICAL**: Added localStorage persistence for override justifications

### 2025-05-21
- Implemented Consequence Factors section with four key assessment criteria
- Added risk score calculation (Hazard × Consequence) with color-coded risk categorization
- Created Results section with professional requirements and recommended actions
- Simplified comment fields to a single box per major section
- Added specific descriptions for each factor and score level
- Enhanced total score calculation for hazard and consequence factors
- Added conditional content in Results section based on risk level
- Added Hazard Factors section with interactive scoring buttons and live total calculation
- Implemented color-coded risk scoring system (green, yellow, orange, red) with descriptions
- Enhanced form state management to include hazard factors and comments
- Improved save functionality to include hazard data in assessments

### 2025-05-20
- Fixed UI styling issues with comprehensive CSS improvements
- Enhanced form layout with proper spacing and visual hierarchy
- Added fixed action bar at the bottom for consistent button placement
- Improved navigation between form sections with clearer indicators
- Added better styling for input fields, buttons, and form elements
- Implemented responsive design for mobile devices

## Technical Architecture

### Road Risk Assessment System - Complete Implementation

The application implements a comprehensive professional risk assessment system with full form workflow:

**Complete Form Sections:**
1. **Basic Information**: Road details, coordinates (with GPS capture), assessment date, assessor name
2. **Hazard Factors**: 5 interactive scoring factors with color-coded buttons and live total calculation
3. **Consequence Factors**: 4 interactive scoring factors with color-coded buttons and live total calculation  
4. **Optional Assessments**: Toggle-enabled geotechnical and infrastructure assessment tables
5. **Results**: Professional risk matrix, score visualization, and override capabilities

**Risk Calculation Methodology:**
- Matrix-based calculation: Risk Level determined by Hazard Score vs Consequence Score intersection
- Professional risk matrix with 5×5 grid visualization
- Real-time calculation updates as factors are scored
- Clear visualization of calculation steps in results section

**Interactive Scoring System:**
- Color-coded score buttons: Green (2), Yellow (4), Orange (6), Red (10)
- Detailed explanations for each score level and factor
- Live calculation of section totals
- Visual feedback for selected scores

**Professional Override System:**
- Direct override of overall risk level with detailed justification
- Modify/reset capabilities for existing overrides
- Complete audit trail of all risk assessment decisions
- Professional dropdown selection for override risk level

**Data Persistence:**
- Complete localStorage integration for all form sections
- Automatic save/restore of form progress between sessions
- Persistent storage of override justifications and timestamps
- Form state management across all sections and navigation

**Form Navigation:**
- Tab-based section navigation with active highlighting
- Previous/Next buttons for sequential workflow
- Jump-to-section capability for non-linear editing
- Progress indicators and section completion status

## Project Structure

```
AI-Forester-App/
├── src/
│   ├── components/       # Reusable UI components
│   ├── navigation/       # Router configuration
│   │   └── AppRouter.js  # Main router using React Router
│   ├── pages/            # Main form pages
│   │   ├── RoadRiskForm.js      # COMPLETE Road Risk assessment form ✅
│   │   ├── CulvertSizingForm.js # Culvert sizing calculations
│   │   └── HistoryPage.js       # Assessment history
│   ├── screens/          # Screen components
│   │   └── HomeScreen.js        # Landing page with tool selection
│   ├── styles/           # CSS files for styling
│   │   ├── RoadRiskForm.css          # Road Risk form styles
│   │   └── MatrixRiskAssessment.css  # Risk assessment UI styles
│   └── utils/            # Utility functions
│       ├── MatrixRiskAssessment.js   # Risk calculator with matrix methodology
│       ├── CulvertCalculator.js      # Culvert sizing algorithms  
│       └── storageUtils.js           # Local storage functions
```

## Professional Feature Highlights

### Complete Road Risk Assessment Workflow ✅

**Section 1: Basic Information**
- Road name/segment identification
- Start/End KM markers with GPS coordinate capture
- Assessment date and assessor name
- "Use Current Location" GPS buttons for both start and end points

**Section 2: Hazard Factors Assessment**
- Terrain Stability (slopes, terrain classification)
- Slope Grade (road steepness evaluation)
- Geology/Soil Type (soil and geological conditions)
- Drainage Conditions (water management evaluation)
- Road/Slope Failure History (historical performance)
- Live hazard score total with color coding
- Comments section for additional observations

**Section 3: Consequence Factors Assessment**
- Proximity to Water Resources (distance and sensitivity assessment)
- Drainage Structure Capacity (culvert and bridge adequacy)
- Public/Industrial Use Level (road importance and usage)
- Environmental/Cultural Values (sensitive resource assessment)
- Live consequence score total with color coding
- Comments section for downstream considerations

**Section 4: Optional Assessments**
- Toggle-enabled Geotechnical Assessment table (cut/fill slopes, bedrock, groundwater, erosion)
- Toggle-enabled Infrastructure Assessment table (road surface, ditches, culverts, age)
- Comprehensive radio button selections for detailed evaluation
- Comments section for additional technical observations

**Section 5: Results**
- Professional 5×5 risk matrix visualization
- Score breakdown (Hazard Score × Consequence Score)
- Risk level determination with color-coded display
- Professional override capabilities with justification requirements
- Modify/reset override functionality
- Professional recommendations based on final risk level

### Professional Standards Compliance

The Road Risk Assessment tool follows established professional standards:

- **Systematic Approach**: Complete 5-section workflow ensuring comprehensive evaluation
- **Professional Methodology**: Matrix-based risk assessment with industry-standard factors
- **Expert Override**: Professional judgment capability with documentation requirements
- **Audit Trail**: Complete record of assessment decisions and justifications
- **Field-Ready Design**: GPS integration and mobile-optimized interface

## Risk Matrix Categories

**Extreme Risk:**
- Critical risk requiring immediate professional attention and comprehensive mitigation
- Immediate professional assessment required
- Implement access controls until remediation complete

**High Risk:**
- Significant risk requiring prompt professional assessment and active management
- Professional assessment required within 30 days
- Develop maintenance/inspection plan

**Moderate Risk:**
- Moderate risk requiring professional monitoring and planned maintenance
- Schedule professional field verification
- Implement standard monitoring protocol

**Low Risk:**
- Low risk suitable for routine monitoring and standard maintenance
- Maintain standard documentation
- Include in routine maintenance schedule

## Next Steps

1. **Testing and Validation**: Complete field testing of Road Risk Assessment form
2. **Enhanced Calculations**: Integrate advanced hydraulic calculations for culvert sizing
3. **Mobile Optimization**: Further optimize for field use on mobile devices  
4. **PDF Export**: Complete implementation of professional PDF report generation
5. **Photo Integration**: Connect with device camera for field photo documentation
6. **Offline Capability**: Add full offline functionality for remote field locations
7. **Multi-user Support**: Implement user authentication and role-based access

## Dependencies

- React (web application framework)
- React Router (client-side routing)
- CSS3 (styling and responsive design)
- HTML5 Geolocation API (GPS coordinates)
- localStorage (client-side data persistence)

## Professional Use Notes

This application is designed for use by qualified forestry professionals, engineers, and technicians. The Road Risk Assessment tool provides a complete workflow for systematic risk evaluation with professional-grade features including GPS integration, comprehensive factor assessment, and expert override capabilities.

The professional override feature is intended for use by qualified professionals who can provide technical justification for deviating from calculated risk levels based on site-specific conditions, local knowledge, or factors not captured in the standard assessment framework.

## Contributing

1. Create feature branches for new development
2. Follow consistent code style with JSDoc comments  
3. Test on multiple device sizes before submitting changes
4. Update the changelog with your changes
5. Ensure compliance with professional risk assessment standards