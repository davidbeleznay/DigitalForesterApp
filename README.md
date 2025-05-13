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
  - Culvert Settings (slope, materials, fish passage, HW/D ratio)
  - Results Display (visualization and detailed metrics)
- **California Method implementation**:
  - Primary sizing based on lookup table for width and depth combinations
  - Detailed descriptions and visualizations for high water width measurement
  - Automatic 20% embedding when fish passage is required
- **Conservative hydraulic approach**:
  - Default 0.8 HW/D ratio (configurable)
  - Separate capacity and headwater checks
  - Detailed explanation when California Method and hydraulic check disagree
- **Improved UI/UX**:
  - Field card design for tool selection
  - Stream cross-section diagram to help with measurements
  - Enhanced GPS location with better error handling
  - Visual feedback for all calculation results

### Road Risk Assessment
- Form-based tool for evaluating forest road risk factors (in progress)
- Navigation structure in place

### Assessment History
- View saved assessments and calculations
- Local storage for saved data
- Draft tracking across tools

## Changelog

### 2025-05-13
- Implemented California Method lookup table as primary sizing method
- Added detailed high water width measurement instructions
- Updated home screen with field card design for tool selection
- Improved stream measurements screen with better descriptions
- Added proper handling for assessment history
- Created comprehensive California Method table component
- Enhanced high water width measurement descriptions
- Updated UI for all screens to be more consistent and user-friendly

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
