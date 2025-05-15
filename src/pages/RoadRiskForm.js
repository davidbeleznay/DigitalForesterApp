import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RoadRiskForm.css';

// Default values for form reset
const defaultBasicInfo = {
  roadName: '',
  startKm: '',
  endKm: '',
  startLat: '',
  startLong: '',
  endLat: '',
  endLong: '',
  date: new Date().toISOString().split('T')[0],
  inspector: ''
};

// Rest of your RoadRiskForm.js file remains the same...
