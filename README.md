# AI-Forester-App

A mobile application for forestry professionals to perform field calculations and collect data.

## Project Setup

1. Install Expo CLI: `npm install -g expo-cli`
2. Install dependencies: `npm install`
3. Start the development server: `npx expo start`
4. Scan the QR code with Expo Go app on your mobile device

## Current Status

We've rebuilt the application from scratch to resolve persistent issues with React Native Gesture Handler and TypeScript.

Navigation structure is fully implemented with consistent routing for all tools. The Culvert Sizing Tool is now functional with California sizing method and integrated fish passage requirements. Road Risk Assessment navigation is fixed.

## Features

### Culvert Sizing Tool
- Calculates appropriate culvert dimensions based on:
  - California Sizing Method (primary): Sizes culverts based on 1.2 × bankfull width
  - Hydraulic Capacity Check (secondary): Verifies culvert can pass bankfull flow
- Automatic embedding integration for fish passage requirements
- Visual results showing culvert dimensions and embedding
- Option to save calculations as drafts for later reference

### Road Risk Assessment
- Form-based tool for evaluating forest road risk factors (in progress)
- Navigation structure in place

### Data Management
- Local storage for saved calculations
- Draft tracking across tools
- History view for accessing saved field cards

## Changelog

### 2025-05-13
- Added comprehensive CulvertCalculator utility with bankfull width method and fish passage support
- Created CulvertSizingForm component with integration of California sizing method
- Implemented ResultScreen with visual representation of culvert dimensions
- Updated navigation structure for consistent routing
- Fixed Road Risk routing in AppRouter and HomeScreen
- Enhanced styling with fish passage and culvert visualization components

### 2025-05-04
- Created fresh project with Expo
- Set up basic navigation structure
- Implemented HomeScreen with navigation to Culvert Tool
- Established color palette and basic styling

## Next Steps

- Complete Road Risk Assessment form functionality
- Implement PDF export for completed calculations
- Add offline data synchronization
- Integrate GPS location capture
- Develop reporting functionality
