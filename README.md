# AI-Forester-App

A web application for forestry professionals to perform field calculations and collect data.

## Project Setup

1. Install dependencies: `npm install`
2. Start the development server: `npm start`
3. Open your browser to view the application

## Current Status

The application features a comprehensive Road Risk Assessment tool with simplified professional-grade risk assessment methodology and a Culvert Sizing Tool. Both tools provide structured data collection with local storage persistence.

## Key Features

### Road Risk Assessment Tool
- **Simplified Risk Assessment**: Hazard × Consequence multiplication methodology with conservative professional ranges
- **Professional Override Capability**: Direct override of overall risk level with documented justification
- **Conservative Risk Ranges**: Low (64-250), Moderate (251-750), High (751-1400), Very High (1401-2000)
- **Comprehensive Risk Factors**: Hazard factors (terrain stability, slope grade, geology/soil, drainage, failure history) and consequence factors (water proximity, drainage structures, land use, environmental values)  
- **Dynamic Risk Calculation**: Real-time calculation showing Hazard Score × Consequence Score = Risk Score
- **Detailed Results**: Professional requirements, recommended actions, and clear risk level display
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

### Simplified Risk Assessment System

The application implements a streamlined professional risk assessment system:

**Risk Calculation Methodology:**
- Simple multiplication: Risk Score = Hazard Score × Consequence Score
- Conservative ranges for professional risk categorization
- Clear visualization of calculation steps in results section

**Conservative Risk Ranges:**
```javascript
Low Risk:        64-250
Moderate Risk:   251-750  
High Risk:       751-1400
Very High Risk:  1401-2000
```

**Professional Override System:**
- Direct override of overall risk level (not separate hazard/consequence)
- Requires detailed justification for any overrides
- Maintains audit trail of all risk assessment decisions
- Simple dropdown selection for override risk level
- Enhanced with "Modify Override" capability for editing existing overrides

**Score Validation:**
- Hazard scores: 8-50 (4 factors × 2-10 each, 5 factors maximum)
- Consequence scores: 8-40 (4 factors × 2-10 each)
- Automatic validation and warning for out-of-range scores

## Project Structure

```
AI-Forester-App/
├── src/
│   ├── components/       # Reusable UI components
│   ├── navigation/       # Router configuration
│   │   └── AppRouter.js  # Main router using React Router
│   ├── pages/            # Main form pages
│   │   ├── RoadRiskForm.js      # Road Risk assessment form with simplified methodology
│   │   ├── CulvertSizingForm.js # Culvert sizing calculations
│   │   └── HistoryPage.js       # Assessment history
│   ├── screens/          # Screen components
│   │   └── HomeScreen.js        # Landing page with tool selection
│   ├── styles/           # CSS files for styling
│   │   ├── RoadRiskForm.css          # Road Risk form styles
│   │   └── MatrixRiskAssessment.css  # Risk assessment UI styles
│   └── utils/            # Utility functions
│       ├── MatrixRiskAssessment.js   # Simplified risk calculator with conservative ranges
│       ├── CulvertCalculator.js      # Culvert sizing algorithms  
│       └── storageUtils.js           # Local storage functions
```

## Professional Standards Compliance

The Road Risk Assessment tool follows established professional standards with simplified implementation:

- **Conservative Approach**: Uses conservative risk ranges for safety-first assessment
- **Professional Override**: Allows for expert judgment while maintaining documentation requirements
- **Audit Trail**: Complete record of risk assessment decisions and justifications
- **Simplified Methodology**: Easy-to-understand multiplication approach while maintaining professional rigor

## Risk Categories and Requirements

**Very High Risk (1401-2000):**
- Critical risk requiring immediate professional attention and comprehensive mitigation
- Immediate professional assessment required
- Implement access controls until remediation complete
- Develop comprehensive risk mitigation plan
- Schedule frequent monitoring during wet season
- Allocate budget for major engineering works

**High Risk (751-1400):**
- Significant risk requiring prompt professional assessment and active management
- Professional assessment required within 30 days
- Develop maintenance/inspection plan
- Consider temporary drainage improvements
- Schedule annual professional inspection
- Plan for potential major repairs in next budget cycle

**Moderate Risk (251-750):**
- Moderate risk requiring professional monitoring and planned maintenance
- Schedule professional field verification
- Implement standard monitoring protocol
- Conduct routine maintenance of drainage structures
- Document changes in conditions
- Review during bi-annual inspection cycle

**Low Risk (64-250):**
- Low risk suitable for routine monitoring and standard maintenance
- Maintain standard documentation
- Include in routine maintenance schedule
- No immediate action required
- Monitor during normal operations

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

This application is designed for use by qualified forestry professionals, engineers, and technicians. The risk assessment methodology uses conservative ranges and simplified calculations while maintaining professional standards.

The professional override feature is intended for use by qualified professionals who can provide technical justification for deviating from calculated risk levels based on site-specific conditions, local knowledge, or factors not captured in the standard assessment framework.

## Contributing

1. Create feature branches for new development
2. Follow consistent code style with JSDoc comments  
3. Test on multiple device sizes before submitting changes
4. Update the changelog with your changes
5. Ensure compliance with professional risk assessment standards