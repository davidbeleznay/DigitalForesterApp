// src/screens/HomeScreen.js

import React from 'react';
import { Link } from 'react-router-dom';
import { colors } from '../constants/constants';

const HomeScreen = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Digital Forester</h1>
        <p style={styles.subtitle}>Forestry Calculation Tools</p>
      </div>
      
      <div style={styles.toolsContainer}>
        <Link to="/culvert" style={{ textDecoration: 'none' }}>
          <div style={styles.toolCard}>
            <h2 style={styles.toolTitle}>Culvert Sizing Tool</h2>
            <p style={styles.toolDescription}>
              Calculate appropriate culvert dimensions using the California Method and hydraulic analysis.
            </p>
            <div style={styles.featureList}>
              <div style={styles.featureItem}>
                <p style={styles.featureText}>✓ 3× Bankfull Area Method</p>
              </div>
              <div style={styles.featureItem}>
                <p style={styles.featureText}>✓ Multiple Stream Measurements</p>
              </div>
              <div style={styles.featureItem}>
                <p style={styles.featureText}>✓ Hydraulic Analysis</p>
              </div>
              <div style={styles.featureItem}>
                <p style={styles.featureText}>✓ Climate Change Factors</p>
              </div>
            </div>
            <button style={styles.button}>
              <span style={styles.buttonText}>Open Tool</span>
            </button>
          </div>
        </Link>
        
        <div style={{...styles.toolCard, ...styles.comingSoon}}>
          <h2 style={styles.toolTitle}>Road Risk Assessment</h2>
          <p style={styles.toolDescription}>
            Evaluate forestry road risk factors and generate assessment reports.
          </p>
          <span style={styles.comingSoonLabel}>Coming Soon</span>
        </div>
      </div>
      
      <div style={styles.footer}>
        <p style={styles.footerText}>Digital Forester App © 2025</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: colors.background,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    marginBottom: '40px',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '18px',
    color: colors.lightText,
    margin: 0,
  },
  toolsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
    flex: 1,
  },
  toolCard: {
    backgroundColor: colors.white,
    borderRadius: '12px',
    padding: '24px',
    width: '320px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  comingSoon: {
    opacity: 0.7,
    position: 'relative',
    overflow: 'hidden',
  },
  toolTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: '12px',
  },
  toolDescription: {
    fontSize: '16px',
    color: colors.text,
    lineHeight: 1.5,
    marginBottom: '16px',
  },
  featureList: {
    marginBottom: '20px',
  },
  featureItem: {
    marginBottom: '8px',
  },
  featureText: {
    fontSize: '14px',
    color: colors.text,
    margin: 0,
  },
  button: {
    backgroundColor: colors.primary,
    padding: '12px 16px',
    borderRadius: '8px',
    textAlign: 'center',
    marginTop: 'auto',
    border: 'none',
    cursor: 'pointer',
  },
  buttonText: {
    color: colors.white,
    fontSize: '16px',
    fontWeight: 'bold',
  },
  comingSoonLabel: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    backgroundColor: colors.secondary,
    color: colors.white,
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: '40px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '14px',
    color: colors.lightText,
    margin: 0,
  }
};

export default HomeScreen;