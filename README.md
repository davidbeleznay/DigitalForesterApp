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
- Form-based tool for evaluating forest road risk factors (in progress)
- Navigation structure in place

### Assessment History
- View saved assessments and calculations
- Local storage for saved data
- Draft tracking across tools

## Changelog

### 2025-05-13
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

- Complete Road Risk Assessment form functionality
- Implement PDF export for completed calculations
- Add offline data synchronization
- Enhance GPS location capture with map integration
- Develop reporting functionality
