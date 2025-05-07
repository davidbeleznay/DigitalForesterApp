# Digital Forester App

A mobile application for forestry professionals to perform field calculations and collect data.

## Project Overview

The Digital Forester App is designed for forestry professionals to perform field calculations, collect data, and generate reports. It includes tools for road risk assessment and culvert sizing.

## Project Setup

1. Clone the repository: `git clone https://github.com/davidbeleznay/DigitalForesterApp.git`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. View the app in your browser at `http://localhost:3000`

## Core Features

1. **Road Risk Assessment Tool**
   - Evaluate surface conditions
   - Assess transportability factors
   - Calculate climate impact
   - Generate risk scores and recommendations

2. **Culvert Sizing Tool**
   - Input watershed characteristics
   - Calculate appropriate culvert dimensions
   - Visualize results
   - Export calculations

## Current Status

Project has a basic UI framework with navigation between pages. The dashboard and form skeletons have been implemented. State management and form functionality will be added next.

## Changelog

### 2025-05-07
- Created initial project setup with React and Tailwind CSS
- Set up basic folder structure and routing
- Implemented dashboard with navigation to both tools
- Created basic form structure for Road Risk Assessment
- Created basic form structure for Culvert Sizing Tool

## Next Steps

1. Implement form state management for user inputs
2. Set up local storage for saving draft forms
3. Add actual form fields for Road Risk Assessment (surface conditions, transportability, climate impact)
4. Add actual form fields for Culvert Sizing Tool (watershed characteristics)
5. Develop risk calculation logic for the Road Risk form

## Testing

After pulling the latest changes:

1. Run `npm install` to install dependencies
2. Start the development server with `npm start`
3. Verify you can navigate between the dashboard and both forms
4. Check that the UI is responsive on mobile and desktop viewports

## Development Standards

- Use functional components with React hooks
- Follow mobile-first design principles
- Keep components small and focused
- Document code changes in the README changelog
