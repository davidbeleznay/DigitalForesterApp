// src/screens/HomeScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'react-router-dom';
import { colors } from '../constants/constants';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Digital Forester</Text>
        <Text style={styles.subtitle}>Forestry Calculation Tools</Text>
      </View>
      
      <View style={styles.toolsContainer}>
        <Link to="/culvert" style={{ textDecoration: 'none' }}>
          <View style={styles.toolCard}>
            <Text style={styles.toolTitle}>Culvert Sizing Tool</Text>
            <Text style={styles.toolDescription}>
              Calculate appropriate culvert dimensions using the California Method and hydraulic analysis.
            </Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureText}>✓ 3× Bankfull Area Method</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureText}>✓ Multiple Stream Measurements</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureText}>✓ Hydraulic Analysis</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureText}>✓ Climate Change Factors</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Open Tool</Text>
            </TouchableOpacity>
          </View>
        </Link>
        
        <View style={[styles.toolCard, styles.comingSoon]}>
          <Text style={styles.toolTitle}>Road Risk Assessment</Text>
          <Text style={styles.toolDescription}>
            Evaluate forestry road risk factors and generate assessment reports.
          </Text>
          <Text style={styles.comingSoonLabel}>Coming Soon</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Digital Forester App © 2025</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.lightText,
  },
  toolsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    flex: 1,
  },
  toolCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    width: 320,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  comingSoon: {
    opacity: 0.7,
    position: 'relative',
    overflow: 'hidden',
  },
  toolTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
  },
  toolDescription: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 1.5,
    marginBottom: 16,
  },
  featureList: {
    marginBottom: 20,
  },
  featureItem: {
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  comingSoonLabel: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.secondary,
    color: colors.white,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.lightText,
  }
});

export default HomeScreen;