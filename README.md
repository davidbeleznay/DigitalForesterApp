# AI-Forester-App

A mobile application for forestry professionals to perform field calculations and collect data.

## Project Setup

1. Install Expo CLI: `npm install -g expo-cli`
2. Install dependencies: `npm install`
3. Start the development server: `npx expo start`
4. Scan the QR code with Expo Go app on your mobile device

## Current Status

We've rebuilt the application from scratch to resolve persistent issues with React Native Gesture Handler and TypeScript.

Navigation structure is fully implemented with consistent routing for all tools. The Culvert Sizing Tool now features a multi-stage process with support for multiple stream measurements and detailed visualization. The California Method is implemented with proper trapezoidal channel geometry support and a more conservative hydraulic check approach.

## Features

### Culvert Sizing Tool
- **Multi-stage process**:
  - Site Information (Culvert ID, Road Name, GPS Location)
  - Stream Measurements (top width, bottom width, depth measurements with automatic averaging)
  - Culvert Settings (slope, materials, fish passage, HW/D ratio)
  - Results Display (visualization and detailed metrics)
- **Enhanced California Method implementation**:
  - Primary sizing based on width × depth × 3 formula
  - Support for trapezoidal channel geometry (top width and bottom width)
  - Automatic 20% embedding when fish passage is required
- **Conservative hydraulic approach**:
  - Default 0.8 HW/D ratio (configurable)
  - Separate capacity and headwater checks
  - Detailed explanation when California Method and hydraulic check disagree
  - Automatic upsizing when conservative criteria aren't met
- **Improved UI/UX**:
  - Stream cross-section diagram to help with measurements
  - Enhanced GPS location with better error handling
  - Incision ratio calculation for incised streams
  - Visual feedback for all calculation results

### Road Risk Assessment
- Form-based tool for evaluating forest road risk factors (in progress)
- Navigation structure in place

### Data Management
- Local storage for saved calculations
- Draft tracking across tools
- History view for accessing saved field cards

## Changelog

### 2025-05-13
- Added support for trapezoidal channel geometry with top/bottom width measurements
- Implemented conservative hydraulic checks with configurable HW/D ratio (default 0.8)
- Added stream cross-section visualization to help with measurements
- Improved GPS location handling with better error messages
- Enhanced the culvert sizing algorithm to better handle incised streams
- Added detailed explanation when California Method and hydraulic check disagree
- Updated visualization to show trapezoidal channel shape

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
