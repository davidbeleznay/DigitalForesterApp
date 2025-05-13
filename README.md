# AI-Forester-App

A mobile application for forestry professionals to perform field calculations and collect data.

## Project Setup

1. Install Expo CLI: `npm install -g expo-cli`
2. Install dependencies: `npm install`
3. Start the development server: `npx expo start`
4. Scan the QR code with Expo Go app on your mobile device

## Current Status

We've rebuilt the application from scratch to resolve persistent issues with React Native Gesture Handler and TypeScript.

Navigation structure is fully implemented with consistent routing for all tools. The Culvert Sizing Tool now features a multi-stage process with support for multiple stream measurements and detailed visualization. The California Method is implemented as the primary sizing approach with hydraulic checks for validation.

## Features

### Culvert Sizing Tool
- **Multi-stage process**:
  - Site Information (Culvert ID, Road Name, GPS Location)
  - Stream Measurements (multiple width/depth measurements with automatic averaging)
  - Culvert Settings (slope, materials, fish passage)
  - Results Display (visualization and detailed metrics)
- **California Method implementation**:
  - Primary sizing based on width × depth × 3 formula
  - Alternative sizing based on 1.2 × bankfull width
  - Lookup table for standard sizing based on California Method
- **Fish passage integration**:
  - Automatic 20% embedding when fish passage is required
  - Detailed recommendations for fish-bearing streams
- **Hydraulic validation**:
  - Manning's equation check for flow capacity
  - Headwater ratio calculation and warnings
- **Save and export**:
  - Draft saving functionality
  - Future PDF export capability

### Road Risk Assessment
- Form-based tool for evaluating forest road risk factors (in progress)
- Navigation structure in place

### Data Management
- Local storage for saved calculations
- Draft tracking across tools
- History view for accessing saved field cards

## Changelog

### 2025-05-13
- Implemented multi-stage process for Culvert Sizing Tool with progress indicator
- Added support for multiple stream width and depth measurements with automatic averaging
- Integrated GPS location capture functionality
- Updated form fields to use Culvert ID and Road Name instead of project information
- Enhanced California Method implementation with proper width × depth × 3 formula
- Added detailed culvert visualization with embedding for fish passage
- Created custom styles for improved user experience

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
