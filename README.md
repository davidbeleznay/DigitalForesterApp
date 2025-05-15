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

### 2025-05-15
- Fixed syntax error in RoadRiskForm component
- Simplified implementation of photo functionality with placeholder
- Removed dependencies on external libraries for PDF generation
- Enhanced form stability and improved error handling

### 2025-05-14
- Implemented comprehensive Road Risk Assessment form with enhanced UI
- Added field photo capture functionality with preview
- Created PDF export capability for assessment reports
- Implemented form validation and auto-save features
- Added geolocation support for start/end coordinates
- Fixed Road Risk routing and navigation integration

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
│   │   ├── AppRouter.js
│   │   └── CulvertToolNavigator.js
│   ├── pages/            # Main form pages
│   │   ├── RoadRiskForm.js
│   │   └── HistoryPage.js
│   └── screens/          # Screen components
│       └── HomeScreen.js # Landing page with tool selection
```

## Next Steps

1. Complete the implementation of the Culvert Sizing Tool with calculation algorithms
2. Add photo capture functionality with device camera integration
3. Implement PDF export for assessment reports
4. Create visualization components for assessment results
5. Add offline functionality for field use
6. Implement user authentication for multi-user support

## Dependencies

- React/React Native
- React Router
- Expo
- AsyncStorage (for local data persistence)

## Known Issues

- Photo capture functionality is currently a placeholder
- PDF export is simulated and will be fully implemented in the next version
- GPS location functionality needs to be connected to device location services

## Contributing

1. Create feature branches for new development
2. Follow consistent code style with JSDoc comments
3. Test on multiple device sizes before submitting changes
4. Update the changelog with your changes