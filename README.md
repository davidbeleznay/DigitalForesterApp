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
- Added GPS location capture for both start and end coordinates
- Implemented interactive optional assessments with toggle switches
- Created selectable geotechnical considerations with radio buttons
- Added selectable infrastructure elements with radio buttons
- Enhanced form state management to persist optional assessment selections
- Improved mobile responsiveness for tables and form elements
- Added comments field with localStorage persistence

### 2025-05-16
- Implemented Consequence Factors section with four key factors from BC forestry guidelines
- Added risk calculation logic (Hazard × Consequence) following BC forestry standards
- Created visual risk results section with color-coded risk categorization
- Implemented professional requirements display based on risk level
- Added Optional Assessments with geotechnical and infrastructure tables
- Enhanced the UI with better visual feedback for selections
- Added photo upload placeholders and comments section

### 2025-05-15
- Implemented Hazard Factors section in the Road Risk Assessment form
- Added visual score selection buttons with color-coding (green, yellow, orange, red)
- Implemented state management for hazard factors with localStorage persistence
- Added automatic hazard score calculation based on selected factors
- Enhanced form UI with interactive score buttons and better visual feedback

### 2025-05-14
- Removed React Navigation dependencies and switched to React Router for all navigation
- Fixed RoadRiskForm component to resolve syntax errors
- Simplified navigation structure with direct routing
- Created minimal placeholder for RoadRiskForm to be built incrementally
- Removed unused RoadRiskNavigator and streamlined routing architecture
- Updated MainNavigator to use consistent React Router approach
- Fixed project structure for better maintainability
- Added clear navigation paths between all screens

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
│   │   ├── RoadRiskForm.js  # Road Risk Assessment form with all sections
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
- Basic Information section with text inputs and GPS location capture for both start and end points
- Hazard Factors section with interactive score selection and automatic calculation
- Consequence Factors section with BC forestry-standard assessment criteria
- Optional Assessments section with toggleable geotechnical and infrastructure considerations
- Results section with risk calculation, categorization, and professional requirements
- Added localStorage persistence for all form data
- Implemented reset and save functionality

### Risk Assessment Implementation
- Used official BC forestry scoring methodology with 2, 4, 6, 10 scale
- Implemented hazard × consequence calculation for risk scoring
- Added risk categorization with five levels (Very Low, Low, Moderate, High, Very High)
- Displayed appropriate professional requirements for each risk level
- Created custom recommended actions based on risk category

### Navigation Structure
- AppRouter: Top-level router that sets up the main routes (/home, /road-risk, /culvert, /history)
- MainNavigator: Secondary router that could be expanded for more complex navigation in the future
- CulvertToolNavigator: Specialized router for the Culvert Tool's multi-screen workflow

## Next Steps

1. Connect photo upload functionality with device camera integration
2. Implement PDF export for assessment reports
3. Complete the implementation of the Culvert Sizing Tool with calculation algorithms
4. Add offline functionality for field use
5. Implement user authentication for multi-user support
6. Add form validation for required fields
7. Create a map visualization component for viewing assessment locations

## Dependencies

- React/React Native
- React Router (for navigation)
- Expo
- AsyncStorage (for local data persistence)

## Known Issues

- Photo upload functionality is currently a placeholder
- PDF export is simulated and will be fully implemented in the next version
- GPS location functionality needs to be tested with real device location services
- The UI needs better support for even smaller screens (under 320px width)

## Contributing

1. Create feature branches for new development
2. Follow consistent code style with JSDoc comments
3. Test on multiple device sizes before submitting changes
4. Update the changelog with your changes
