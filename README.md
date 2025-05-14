# AI-Forester-App

A mobile application for forestry professionals to perform field calculations and collect data.

## Project Setup

1. Install Expo CLI: `npm install -g expo-cli`
2. Install dependencies: `npm install`
3. Start the development server: `npx expo start`
4. Scan the QR code with Expo Go app on your mobile device

## Current Status

We've rebuilt the application from scratch to resolve persistent issues with React Native Gesture Handler and TypeScript.

Navigation structure is fully implemented with consistent routing for all tools. The Culvert Sizing Tool now features a multi-stage process with support for multiple stream measurements and detailed visualization. The California Method lookup table is implemented as the primary sizing approach with hydraulic checks for validation.

The Road Risk Assessment tool has been completely redesigned with a modular component architecture and improved UI for risk assessment. The tool provides a comprehensive evaluation of forest road risk factors with color-coded risk level indicators and numeric risk rating system.

## Features

### Culvert Sizing Tool
- **Multi-stage process**:
  - Site Information (Culvert ID, Road Name, GPS Location)
  - Stream Measurements (high water width, bottom width, depth measurements with automatic averaging)
  - Culvert Settings (slope, materials, fish passage, HW/D ratio, climate factor)
  - Results Display (visualization and detailed metrics)
- **California Method implementation**:
  - Primary sizing based on lookup table for width and depth combinations
  - Detailed descriptions and visualizations for high water width measurement
  - Automatic 20% embedding when fish passage is required
  - Climate change factor adjustment for flow calculations
- **Method comparison**:
  - Clear side-by-side comparison of California Method and Hydraulic Calculation results
  - Detailed explanation of any discrepancies between methods
  - Visual representation of sizing recommendations
- **Enhanced results display**:
  - Large circle visualization of recommended culvert size
  - Detailed calculation tables with key parameters
  - Comparative method analysis
  - Stream measurement summaries

### Road Risk Assessment
- **Modular component architecture**:
  - Reusable RiskLevelSelector and RiskSelector components
  - Centralized risk factor definitions and utilities
  - Consistent styling and user interface elements
- **Comprehensive risk factors**:
  - Six key risk categories: Slope Steepness, Fill Slope, Cut Slope Stability, Drainage Features, Stream Crossings, Surface Material
  - Three-level risk assessment (Low, Moderate, High) for each factor with color-coded feedback
  - Numeric rating system (2-4-6-10 scale) for precise risk quantification
  - Overall risk score calculation with category assignment
- **Risk visualization**:
  - Color-coded indicators for each risk level
  - Visual risk score display with category styling
  - Contextual recommendations based on risk category
- **Data management**:
  - Automated draft saving with localStorage
  - Unified assessment history system
  - Ability to view, filter, and delete assessment records

### Assessment History
- View saved assessments and calculations with filtering options
- Unified local storage system for all assessment types
- Assessment details view with risk level indicators
- Delete functionality for assessment management
- Backward compatibility with legacy data structures

## Changelog

### 2025-05-14
- Implemented new CulvertResults component with enhanced visual design
- Added clear result visualization with prominent circular size display
- Created methodical results layout with categorized sections
- Improved method comparison display with side-by-side boxes
- Added detailed calculation tables with better readability
- Enhanced stream measurement summary with averages and calculated values
- Created responsive design for all screen sizes
- Updated CulvertSizingForm to integrate new results component
- Completely rebuilt Road Risk Assessment with modular component architecture
- Created reusable RiskLevelSelector and RiskSelector components
- Implemented centralized risk factor definitions and utilities
- Added unified assessment history system with localStorage integration
- Enhanced HomeScreen to handle assessment history display
- Updated HistoryPage with filtering and improved data handling
- Fixed syntax errors in previous implementation
- Updated README with current project status and features

### 2025-05-13
- Implemented toggleable additional assessment factors in Road Risk Assessment
- Added Geotechnical Considerations with Low/Moderate/High risk level selectors
- Added Infrastructure Elements with Low/Moderate/High risk level selectors
- Improved PDF export to include additional assessment factors
- Enhanced local storage to save all assessment data
- Fixed Road Risk navigation and routing
- Enhanced result screen with large circular size visualization
- Added side-by-side method comparison section
- Implemented climate change factor adjustment for flow calculations
- Updated calculations to show detailed comparisons between methods
- Improved results layout with tabular format for measurements and calculations
- Added comprehensive capacity and headwater checks
- Created more detailed stream measurement summary in results
- Enhanced hydraulic calculation to determine final culvert size when appropriate

### 2025-05-04
- Created fresh project with Expo
- Set up basic navigation structure
- Implemented HomeScreen with navigation to Culvert Tool
- Established color palette and basic styling

## Next Steps

- Complete comprehensive ResultScreen for Road Risk Assessment visualization
- Add export functionality for Road Risk results (PDF generation)
- Implement form validation with error handling and user feedback
- Add offline capability with automatic synchronization when online
- Enhance GPS location capture with map integration
- Add photo capture and geo-tagging functionality
- Implement data synchronization with cloud storage
- Develop user authentication for team collaboration
- Create admin panel for managing assessment templates
