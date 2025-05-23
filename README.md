# AI-Forester-App

A web application for forestry professionals to perform field calculations and collect data.

## Project Setup

1. Install dependencies: `npm install`
2. Start the development server: `npm start`
3. Open your browser to view the application

## Current Status

The application features a comprehensive Road Risk Assessment tool with professional-grade matrix risk assessment methodology and a Culvert Sizing Tool. Both tools provide structured data collection with local storage persistence.

## Key Features

### Road Risk Assessment Tool
- **Professional Matrix Risk Assessment**: Industry-standard risk matrix methodology following ISO 31000
- **Visual Risk Matrix Diagram**: Interactive 5×5 risk matrix showing the intersection of hazard and consequence levels
- **Professional Override Capability**: Allows experts to override calculated risk levels with documented justification
- **Enhanced Optional Assessments**: Toggle-enabled geotechnical and infrastructure evaluation tables
- **Comprehensive Risk Factors**: Hazard factors (terrain stability, slope grade, geology/soil, drainage, failure history) and consequence factors (water proximity, drainage structures, land use, environmental values)  
- **Dynamic Risk Calculation**: Converts raw scores to risk levels, applies professional risk matrix
- **Detailed Results**: Professional requirements, recommended actions, and audit trail
- **Local Storage**: Automatic saving of assessment progress and override justifications

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

### 2025-05-19
- Improved Road Risk Assessment flow to open new form directly when clicking from home screen
- Added comment fields for hazard and consequence factors
- Implemented risk category override functionality with reason documentation
- Fixed navigation flow for Road Risk Assessment tool
- Updated home screen to display 2 most recent Road Risk assessments

### 2025-05-17
- Added GPS location capture for both start and end coordinates
- Implemented interactive optional assessments with toggle switches
- Created selectable geotechnical considerations with radio buttons
- Added selectable infrastructure elements with radio buttons
- Enhanced form state management to persist optional assessment selections

### 2025-05-16
- Implemented Consequence Factors section with four key factors from BC forestry guidelines
- Added risk calculation logic (Hazard × Consequence) following BC forestry standards
- Created visual risk results section with color-coded risk categorization
- Implemented professional requirements display based on risk level
- Added Optional Assessments with geotechnical and infrastructure tables

### 2025-05-15
- Implemented Hazard Factors section in the Road Risk Assessment form
- Added visual score selection buttons with color-coding (green, yellow, orange, red)
- Implemented state management for hazard factors with localStorage persistence
- Added automatic hazard score calculation based on selected factors

### 2025-05-14
- Removed React Navigation dependencies and switched to React Router for all navigation
- Fixed RoadRiskForm component to resolve syntax errors
- Simplified navigation structure with direct routing
- Created minimal placeholder for RoadRiskForm to be built incrementally

### 2025-05-08
- Completed RoadRiskForm implementation with PDF preview and export functionality
- Fixed code formatting issues in form button section
- Ensured proper saving and restoration of form state

### 2025-05-04
- Created fresh project with Expo
- Set up basic navigation structure
- Implemented HomeScreen with navigation to Culvert Tool
- Established color palette and basic styling

## Technical Architecture

### Matrix Risk Assessment System

The application implements a professional-grade matrix risk assessment system:

**Risk Matrix Methodology:**
- Converts raw factor scores to risk levels (Very Low, Low, Moderate, High, Very High)
- Uses standard 5×5 risk matrix following ISO 31000 guidelines
- Applies systematic scoring thresholds based on professional practice
- Visual matrix diagram shows intersection of hazard and consequence levels

**Professional Override System:**
- Allows qualified professionals to override calculated risk levels
- Requires detailed justification for any overrides
- Maintains audit trail of all risk assessment decisions
- Supports dropdown selection of alternative hazard/consequence levels
- Enhanced with "Modify Override" capability for editing existing overrides

**Optional Assessment Framework:**
- Toggle-enabled geotechnical considerations assessment
- Toggle-enabled infrastructure elements assessment
- Detailed evaluation tables with radio button selections
- Persistent state management for all optional assessment selections

**Risk Level Conversion:**
```javascript
// Hazard Score → Hazard Level
10-14 points: Very Low
15-19 points: Low  
20-29 points: Moderate
30-39 points: High
40-50 points: Very High

// Consequence Score → Consequence Level  
8-11 points: Very Low
12-15 points: Low
16-23 points: Moderate
24-31 points: High
32-40 points: Very High
```

**Matrix Risk Calculation:**
The final risk is determined by looking up the combination of Hazard Level × Consequence Level in the professional risk matrix, not by simple multiplication of scores.

## Project Structure

```
AI-Forester-App/
├── src/
│   ├── components/       # Reusable UI components
│   ├── navigation/       # Router configuration
│   │   └── AppRouter.js  # Main router using React Router
│   ├── pages/            # Main form pages
│   │   ├── RoadRiskForm.js      # Road Risk assessment form with matrix methodology
│   │   ├── CulvertSizingForm.js # Culvert sizing calculations
│   │   └── HistoryPage.js       # Assessment history
│   ├── screens/          # Screen components
│   │   └── HomeScreen.js        # Landing page with tool selection
│   ├── styles/           # CSS files for styling
│   │   ├── RoadRiskForm.css          # Road Risk form styles
│   │   └── MatrixRiskAssessment.css  # Matrix assessment UI styles
│   └── utils/            # Utility functions
│       ├── MatrixRiskAssessment.js   # Professional risk matrix calculator
│       ├── CulvertCalculator.js      # Culvert sizing algorithms  
│       └── storageUtils.js           # Local storage functions
```

## Professional Standards Compliance

The Road Risk Assessment tool follows established professional standards:

- **ISO 31000**: Risk management principles and guidelines
- **Engineering Risk Assessment**: Standard matrix methodology used in infrastructure assessment  
- **Professional Override**: Allows for expert judgment while maintaining documentation requirements
- **Audit Trail**: Complete record of risk assessment decisions and justifications

## Risk Categories and Requirements

**Very High Risk (Professional Override Applied):**
- Full professional team with CRP and specialist PORs
- Geometric design required, multiple field reviews
- Frequent inspection during wet season, annual otherwise
- Formal assurance statements and detailed documentation

**High Risk:**
- CRP and road activity POR with specialist consultation
- Field reviews at critical stages, annual inspections
- Assurance statements and maintenance/inspection plans

**Moderate Risk:**
- CRP and road activity POR oversight
- Standard designs with field verification, bi-annual inspections
- Basic assurance documentation and monitoring schedule

**Low Risk:**
- Standard professional oversight, routine field reviews
- As-needed inspections, standard recordkeeping

**Very Low Risk:**
- Routine professional oversight
- Inspections during routine maintenance
- Basic documentation in Quick Capture app

## Next Steps

1. **Enhanced Calculations**: Integrate advanced hydraulic calculations for culvert sizing
2. **Mobile Optimization**: Further optimize for field use on mobile devices  
3. **PDF Export**: Complete implementation of professional PDF report generation
4. **Photo Integration**: Connect with device camera for field photo documentation
5. **Offline Capability**: Add full offline functionality for remote field locations
6. **Multi-user Support**: Implement user authentication and role-based access

## Dependencies

- React (web application framework)
- React Router (client-side routing)
- CSS3 (styling and responsive design)
- HTML5 Geolocation API (GPS coordinates)
- localStorage (client-side data persistence)

## Professional Use Notes

This application is designed for use by qualified forestry professionals, engineers, and technicians. The risk assessment methodology follows established professional standards but should be used in conjunction with appropriate field expertise and local regulatory requirements.

The professional override feature is intended for use by qualified professionals who can provide technical justification for deviating from calculated risk levels based on site-specific conditions, local knowledge, or factors not captured in the standard assessment framework.

## Contributing

1. Create feature branches for new development
2. Follow consistent code style with JSDoc comments  
3. Test on multiple device sizes before submitting changes
4. Update the changelog with your changes
5. Ensure compliance with professional risk assessment standards