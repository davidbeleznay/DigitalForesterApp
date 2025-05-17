# AI-Forester-App

A mobile application for forestry professionals to perform field calculations and collect data.

## Project Setup

1. Install Expo CLI: `npm install -g expo-cli`
2. Install dependencies: `npm install`
3. Start the development server: `npx expo start`
4. Scan the QR code with Expo Go app on your mobile device

## Current Status

The application has been rebuilt from scratch to resolve persistent issues with React Native Gesture Handler and TypeScript. Both the Culvert Sizing Tool and Road Risk Assessment Tool are now functioning with proper routing and components.

## Key Features

- **Road Risk Assessment**: Complete form with multiple risk factors, calculation of risk scores, photo integration and PDF export
- **Culvert Sizing Tool**: Input form for watershed characteristics and culvert dimensions
- **History Tracking**: Save assessment records with details and timestamps
- **Local Storage**: Persist data across sessions with automatic saving of drafts
- **PDF Export**: Generate professional PDF reports for fieldwork documentation

## Changelog

### 2025-05-17
- Implemented Hazard Factors section in the Road Risk Assessment form
- Added visual score selection buttons with color-coding (green, yellow, orange, red)
- Implemented state management for hazard factors with localStorage persistence
- Added automatic hazard score calculation based on selected factors
- Enhanced form UI with interactive score buttons and better visual feedback

### 2025-05-15
- Removed React Navigation dependencies and switched to React Router for all navigation
- Fixed RoadRiskForm component to resolve syntax errors
- Simplified navigation structure with direct routing
- Created minimal placeholder for RoadRiskForm to be built incrementally
- Removed unused RoadRiskNavigator and streamlined routing architecture
- Updated MainNavigator to use consistent React Router approach
- Fixed project structure for better maintainability
- Added clear navigation paths between all screens

### 2025-05-14
- Redesigned the RoadRiskForm UI with button-based factor selection interface
- Changed from dropdown selects to interactive button grids for better usability
- Implemented visual highlighting of selected factor values
- Maintained color-coding for risk level indicators (green for low, orange for medium, red for high)
- Fixed all syntax errors while providing an improved user experience
- Added consistent section styling and improved visual hierarchy

### 2025-05-08
- Completed RoadRiskForm implementation with PDF preview and export functionality
- Fixed code formatting issues in form button section
- Ensured proper saving and restoration of form state
- Added visual feedback for user actions through status messages

### 2025-05-04
- Created fresh project with Expo
- Set up basic navigation structure
- Implemented HomeScreen with navigation to Culvert Tool
- Established color palette and basic styling

## Project Structure

```
AI-Forester-App/
├── src/
│   ├── components/       # Reusable UI components
│   ├── navigation/       # Router configuration
│   │   ├── AppRouter.js  # Main router using React Router
│   │   ├── MainNavigator.js # Secondary router layer
│   │   └── CulvertToolNavigator.js # Culvert-specific routes
│   ├── pages/            # Main form pages
│   │   ├── RoadRiskForm.js  # Road Risk Assessment form with sections
│   │   └── HistoryPage.js   # History viewing page
│   ├── screens/          # Screen components
│   │   ├── HomeScreen.js    # Landing page with tool selection
│   │   └── culvert/         # Culvert tool screens
│   └── styles/           # CSS files for styling
│       ├── index.css
│       ├── RoadRiskForm.css # Styles for Road Risk form
│       └── culvert-form.css # Styles for Culvert Tool
```

## Technical Implementation Notes

### Bug Fixes Applied
- Resolved React Navigation dependency issue by switching entirely to React Router
- Fixed syntax errors in RoadRiskForm.js by creating a simplified minimal component
- Simplified navigation structure to use a consistent approach throughout the app
- Standardized on React Router for web-based navigation
- Created clean, minimal interfaces for easier incremental development

### RoadRiskForm Component
- Implemented multi-section form with tabbed navigation
- Basic Information section with text inputs and GPS location capture
- Hazard Factors section with interactive score selection and automatic calculation
- Form sections for Consequence Factors, Optional Assessments, and Results (placeholders)
- Added localStorage persistence for form data
- Implemented reset and save functionality

### Navigation Structure
- AppRouter: Top-level router that sets up the main routes (/home, /road-risk, /culvert, /history)
- MainNavigator: Secondary router that could be expanded for more complex navigation in the future
- CulvertToolNavigator: Specialized router for the Culvert Tool's multi-screen workflow

## Next Steps

1. Implement the Consequence Factors section with interactive score selection
2. Create the Optional Assessments section with photo capture and additional inputs
3. Build the Results visualization with risk matrix and recommendations
4. Complete the implementation of the Culvert Sizing Tool with calculation algorithms
5. Implement PDF export for assessment reports
6. Add offline functionality for field use
7. Implement user authentication for multi-user support

## Dependencies

- React/React Native
- React Router (for navigation)
- Expo
- AsyncStorage (for local data persistence)

## Known Issues

- Consequence Factors section is currently a placeholder
- Optional Assessments section is currently a placeholder
- Results section is currently a placeholder showing only the hazard score
- PDF export is simulated and will be fully implemented in the next version
- GPS location functionality needs to be tested with real device location services

## Contributing

1. Create feature branches for new development
2. Follow consistent code style with JSDoc comments
3. Test on multiple device sizes before submitting changes
4. Update the changelog with your changes
