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
- Enhanced UI/UX for Road Risk Assessment with sophisticated visual design
- Added animated transitions and interactive feedback for form interactions
- Implemented sticky navigation and status messages for better user guidance
- Improved mobile responsiveness with better touch targets and layout adjustments
- Added visual distinction between form sections with color-coded headers
- Enhanced results display with better data visualization and recommended actions
- Improved form field styling with better focus states and input validation
- Added breadcrumb navigation for easier app traversal
- Improved photo gallery with better visual styling and interactions

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
│   │   ├── AppRouter.js
│   │   └── CulvertToolNavigator.js
│   ├── pages/            # Main form pages
│   │   ├── RoadRiskForm.js
│   │   └── HistoryPage.js
│   └── screens/          # Screen components
│       └── HomeScreen.js # Landing page with tool selection
```

## Technical Implementation Notes

### RoadRiskForm Component
- Uses React hooks for state management
- Implements auto-save to localStorage for all form data
- Features a modern button-based UI for risk factor selection
- Visually highlights selected values with appropriate colors
- Calculates risk scores based on user-selected factor values
- Provides user feedback through animated status messages
- Includes placeholder functionality for photo capture and PDF export
- Uses CSS transitions and animations for a more engaging experience
- Implements responsive design patterns for all screen sizes

### UI Design Principles
- Consistent color scheme with section-specific accents for better visual organization
- Visual distinction between different risk levels and form sections
- Clear and concise labeling with improved typography hierarchy
- Easy-to-understand rating system with clear value descriptions
- Mobile-friendly layout with responsive adjustment for different screen sizes
- Interactive feedback with hover and active states for all interactive elements
- Micro-animations and transitions for a more polished user experience
- Clear section organization with proper visual hierarchy using color, spacing, and typography
- Accessibility considerations with proper contrast ratios and focus states

## Next Steps

1. Complete the implementation of the Culvert Sizing Tool with calculation algorithms
2. Add photo capture functionality with device camera integration
3. Implement PDF export for assessment reports
4. Create visualization components for assessment results
5. Add offline functionality for field use
6. Implement user authentication for multi-user support
7. Add dark mode support with theme toggle

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