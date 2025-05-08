# Digital Forester App

A mobile application for forestry professionals to perform field calculations and collect data.

## Project Overview

The Digital Forester App is designed for forestry professionals to perform field calculations, collect data, and generate reports. It includes tools for road risk assessment and culvert sizing.

## Project Setup

1. Clone the repository: `git clone https://github.com/davidbeleznay/DigitalForesterApp.git`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. View the app in your browser at `http://localhost:3000`

## Current Status

The application now has a basic routing structure with three main pages:
- Dashboard (Home) with links to both tools
- Road Risk Assessment form
- Culvert Sizing Tool form

Basic navigation between pages is working, but no form state management or data persistence yet.

## Features Implemented

1. **Basic Navigation**
   - React Router implementation
   - Links between all pages
   - Back buttons

2. **Simple Form UI**
   - Basic form fields
   - Consistent styling
   - Mobile-responsive layout

## Troubleshooting

If you encounter any issues:

1. Make sure you have the latest version: `git pull origin main`
2. Delete the node_modules folder: `rmdir /s /q node_modules` (Windows) or `rm -rf node_modules` (Mac/Linux)
3. Delete package-lock.json: `del package-lock.json` (Windows) or `rm package-lock.json` (Mac/Linux)
4. Reinstall dependencies: `npm install`
5. Start the server: `npm start`

## Next Steps

1. Add form state management with React hooks
2. Implement local storage for saving draft forms
3. Add more fields to the Road Risk Assessment
4. Add more fields to the Culvert Sizing tool
5. Create calculation logic for both tools

## Changelog

### 2025-05-07
- Added basic routing with React Router
- Created Dashboard, Road Risk Form, and Culvert Sizing Form pages
- Implemented navigation between pages
- Added basic form UI with styled inputs

### 2025-05-07 (Earlier)
- Simplified app to basic structure to resolve formatting issues
- Removed complex dependencies temporarily
- Created minimal working example to establish foundation