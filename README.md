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

The application has been simplified to ensure it works correctly across different environments. We've removed complex dependencies and styling frameworks temporarily to establish a working foundation.

## Troubleshooting

If you encounter any issues:

1. Make sure you have the latest version: `git pull origin main`
2. Delete the node_modules folder: `rm -rf node_modules`
3. Delete package-lock.json: `rm package-lock.json`
4. Reinstall dependencies: `npm install`
5. Start the server: `npm start`

## Next Steps

1. Once the basic app is working, we'll incrementally add:
   - React Router for navigation
   - Form state management
   - Road Risk Assessment tool
   - Culvert Sizing tool
   - Local storage for saving drafts

## Changelog

### 2025-05-07
- Simplified app to basic structure to resolve formatting issues
- Removed complex dependencies temporarily
- Created minimal working example to establish foundation