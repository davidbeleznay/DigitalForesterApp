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

### 2025-05-22
- Implemented OptionalAssessments component with toggle controls
- Added data tables for culvert and water crossing information
- Implemented form validation and data persistence using localStorage
- Added autosave functionality for form drafts
- Fixed Road Risk routing in AppRouter.js
- Created reusable toggle switches for optional assessments
- Added storageUtils for consistent data management

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
- Implemented full form fields for Basic Information section in Road Risk Assessment
- Added placeholders for other form sections (Optional Assessments, etc.)
- Enhanced GPS location capture functionality
- Added form validation for required fields
- Fixed EditScreen.js implementation with proper handler functions
- Added localStorage integration for saving assessments and drafts
- Implemented form reset functionality with confirmation dialog
- Cleaned up unused variables and improved code organization
- Enhanced CSS styling for all form elements and responsive layout
- Improved navigation between form sections

### 2025-05-20
- Fixed UI styling issues with comprehensive CSS improvements
- Enhanced form layout with proper spacing and visual hierarchy
- Added fixed action bar at the bottom for consistent button placement
- Improved navigation between form sections with clearer indicators
- Added better styling for input fields, buttons, and form elements
- Implemented responsive design for mobile devices
- Enhanced comment fields with proper styling and spacing
- Added style improvements for risk category override section
- Improved road risk form with more professional appearance

### 2025-05-19
- Improved Road Risk Assessment flow to open new form directly when clicking from home screen
- Added comment fields for hazard and consequence factors
- Implemented risk category override functionality with reason documentation
- Fixed navigation flow for Road Risk Assessment tool
- Updated home screen to display 2 most recent Road Risk assessments
- Enhanced form state management to include comments and overrides
- Improved usability with clearer interaction patterns

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
│   │   └── OptionalAssessments.js # Component for toggle-based assessments
│   ├── navigation/       # Router configuration
│   │   ├── AppRouter.js  # Main router using React Router
│   │   └── CulvertToolNavigator.js # Culvert-specific routes
│   ├── pages/            # Main form pages
│   │   ├── RoadRiskForm.js  # Road Risk assessment form
│   │   └── HistoryPage.js   # History viewing page
│   ├── screens/          # Screen components
│   │   ├── HomeScreen.js    # Landing page with tool selection
│   │   ├── culvert/         # Culvert tool screens
│   │   └── roadRisk/        # Road Risk Assessment screens
│   ├── styles/           # CSS files for styling
│   │   ├── index.css
│   │   ├── RoadRiskForm.css # Styles for Road Risk form
│   │   └── OptionalAssessments.css # Styles for optional assessments
│   └── utils/            # Utility functions
│       └── storageUtils.js # Local storage functions
```

## Technical Implementation Notes

### Optional Assessments Implementation
- Created reusable OptionalAssessments component with toggle controls
- Implemented data tables for culvert and water crossing information
- Added dynamic form fields that appear/disappear based on toggle state
- Implemented data persistence for all optional assessment data
- Added validation for optional assessment fields
- Created responsive tables for data collection

### Storage Implementation
- Created storageUtils.js for consistent data persistence
- Implemented autosave functionality for form drafts
- Added functions for saving to history
- Created proper data structure for saved assessments

### Results Section Implementation
- Added risk calculation display (Hazard Score × Consequence Score = Risk Score)
- Implemented risk categorization logic based on total risk score
- Created color-coded risk categories (Very Low, Low, Moderate, High, Very High)
- Added dynamic professional requirements based on risk category
- Implemented recommended actions list that changes based on risk level
- Created conditional display of results for incomplete assessments

### Navigation Structure
- AppRouter: Top-level router that sets up the main routes (/, /road-risk, /culvert/*, /history)
- CulvertToolNavigator: Specialized router for the Culvert Tool's multi-screen workflow

## Next Steps

1. Connect photo upload functionality with device camera integration
2. Implement PDF export for assessment reports
3. Add ability to save final report as PDF
4. Complete the implementation of the Culvert Sizing Tool with calculation algorithms
5. Add offline functionality for field use
6. Implement user authentication for multi-user support

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
