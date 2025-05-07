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

## Troubleshooting

If you're seeing the default React startup screen ("Edit src/App.js and save to reload"), try these steps:

1. Delete the `node_modules` folder and `package-lock.json` file
2. Run `npm install` to reinstall all dependencies
3. Restart the development server with `npm start`
4. Check browser console (F12) for any errors

If you're still having issues, try:

1. Updating to the latest changes: `git pull`
2. Clearing your browser cache
3. Verifying that all dependencies are installed correctly

## Changelog

### 2025-05-07
- Created initial project setup with React and Tailwind CSS
- Set up basic folder structure and routing
- Implemented dashboard with navigation to both tools
- Created basic form structure for Road Risk Assessment
- Created basic form structure for Culvert Sizing Tool
- Added Tailwind CSS via both build process and CDN fallback
- Added testing components to help troubleshoot rendering
- Simplified App.js for easier debugging

## Next Steps

1. Implement form state management for user inputs
2. Set up local storage for saving draft forms
3. Add actual form fields for Road Risk Assessment (surface conditions, transportability, climate impact)
4. Add actual form fields for Culvert Sizing Tool (watershed characteristics)
5. Develop risk calculation logic for the Road Risk form

## Development Standards

- Use functional components with React hooks
- Follow mobile-first design principles
- Keep components small and focused
- Document code changes in the README changelog

## Downloading Without Git

If you don't have Git installed, you can download the project directly:

1. Go to https://github.com/davidbeleznay/DigitalForesterApp
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file
5. Open a command prompt in the extracted folder
6. Run `npm install` and then `npm start`
