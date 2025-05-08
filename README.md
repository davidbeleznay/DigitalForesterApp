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

The application now has:
- A basic routing structure with three main pages
- Form state management for both tools
- Local storage for saving and retrieving form data
- Dashboard showing saved drafts

## Features Implemented

1. **Basic Navigation**
   - React Router implementation
   - Links between all pages
   - Back buttons

2. **Form Management**
   - Form state using React hooks
   - Input handling and validation
   - Auto-saving to localStorage
   - Manual save with visual feedback

3. **Dashboard**
   - Links to both tools
   - Display of saved drafts
   - Continue editing links

## How to Use

1. Start the application and navigate to either the Road Risk Assessment or Culvert Sizing Tool
2. Fill out the form fields
3. Click "Save Draft" to manually save your progress
4. Return to the Dashboard to see your saved drafts
5. Click "Continue editing" to resume working on a draft

## Troubleshooting

If you encounter any issues:

1. Make sure you have the latest version: `git pull origin main`
2. Delete the node_modules folder: `rmdir /s /q node_modules` (Windows) or `rm -rf node_modules` (Mac/Linux)
3. Delete package-lock.json: `del package-lock.json` (Windows) or `rm package-lock.json` (Mac/Linux)
4. Reinstall dependencies: `npm install`
5. Start the server: `npm start`

## Next Steps

1. Add more field sections to the Road Risk Assessment:
   - Surface Condition evaluation
   - Transportability metrics
   - Climate Impact factors
   
2. Add more field sections to the Culvert Sizing Tool:
   - Watershed Characteristics
   - Flow Calculation inputs
   - Results visualization

3. Add calculation logic for both tools
4. Enhance the UI with improved styling

## Changelog

### 2025-05-07
- Added form state management using React hooks
- Implemented localStorage for saving and retrieving form data
- Updated Dashboard to display saved drafts
- Added feedback messages for form actions

### 2025-05-07 (Earlier)
- Added basic routing with React Router
- Created Dashboard, Road Risk Form, and Culvert Sizing Form pages
- Implemented navigation between pages
- Added basic form UI with styled inputs
- Simplified app structure to resolve formatting issues