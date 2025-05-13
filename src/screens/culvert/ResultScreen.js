// src/screens/culvert/ResultScreen.js

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, culvertMaterials, culvertShapes } from '../../constants/constants';

const ResultScreen = ({ route, navigation }) => {
  // Get calculation results from route params
  const { 
    result, 
    measurements, 
    averages, 
    streamProperties, 
    culvertSpecs, 
    options 
  } = route.params || {};

  // Get material and shape labels
  const getMaterialLabel = (value) => {
    const material = culvertMaterials.find(m => m.value === value);
    return material ? material.label : value;
  };

  const getShapeLabel = (value) => {
    const shape = culvertShapes.find(s => s.value === value);
    return shape ? shape.label : value;
  };

  // If no result, show placeholder message
  if (!result) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Results</Text>
          <Text style={styles.placeholder}>
            No calculation results available. Please complete the input form to calculate culvert size.
          </Text>
        </View>
      </ScrollView>
    );
  }

  // Extract relevant data from result
  const { 
    bankfullDimensions, 
    californiaSizing, 
    hydraulicSizing, 
    finalSize, 
    governingMethod, 
    message,
    professionalDesignRequired
  } = result;

  return (
    <ScrollView style={styles.container}>
      {/* Final Recommendation */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Recommended Culvert Size</Text>
        <View style={styles.sizeBadgeContainer}>
          <View style={styles.sizeBadge}>
            <Text style={styles.sizeValue}>{finalSize} mm</Text>
            <Text style={styles.sizeLabel}>{getShapeLabel(culvertSpecs.shape)}</Text>
          </View>
        </View>
        <Text style={styles.message}>{message}</Text>
        
        {professionalDesignRequired && (
          <View style={styles.warningBanner}>
            <MaterialIcons name="warning" size={24} color={colors.white} />
            <Text style={styles.warningBannerText}>
              Professional Design Required
            </Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Governing Method:</Text>
          <Text style={styles.infoValue}>{governingMethod}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Material:</Text>
          <Text style={styles.infoValue}>{getMaterialLabel(culvertSpecs.material)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Manning's n:</Text>
          <Text style={styles.infoValue}>{culvertSpecs.manningsN}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Headwater Criterion:</Text>
          <Text style={styles.infoValue}>HW/D ≤ {culvertSpecs.maxHwD}</Text>
        </View>
        
        {options.includeClimateChange && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Climate Change Factor:</Text>
            <Text style={styles.infoValue}>{options.climateChangeFactor.toFixed(2)}x</Text>
          </View>
        )}
      </View>

      {/* Sizing Method Comparison */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Sizing Method Comparison</Text>
        
        <View style={styles.comparisonContainer}>
          <View style={[
            styles.comparisonItem, 
            governingMethod.includes('California') && styles.governingMethod
          ]}>
            <Text style={styles.comparisonTitle}>California Method</Text>
            <Text style={styles.comparisonValue}>
              {typeof californiaSizing.size === 'string' && californiaSizing.size === 'Q100' 
                ? 'Q100' 
                : `${californiaSizing.size} mm`}
            </Text>
            <Text style={styles.comparisonDescription}>
              3× Bankfull Area: {(bankfullDimensions.bankfullArea * 3).toFixed(2)} m²
            </Text>
            <Text style={styles.comparisonNote}>{californiaSizing.message}</Text>
          </View>
          
          <View style={[
            styles.comparisonItem, 
            governingMethod.includes('Hydraulic') && styles.governingMethod
          ]}>
            <Text style={styles.comparisonTitle}>Hydraulic Calculation</Text>
            <Text style={styles.comparisonValue}>{hydraulicSizing.size} mm</Text>
            <Text style={styles.comparisonDescription}>
              Design Discharge: {streamProperties.adjustedDischarge.toFixed(2)} m³/s
            </Text>
            <Text style={styles.comparisonNote}>{hydraulicSizing.message}</Text>
          </View>
        </View>
      </View>

      {/* Calculation Details */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Calculation Details</Text>
        
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Method</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Key Parameter</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Result</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>California Table</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>
              Width: {bankfullDimensions.averageWidth.toFixed(2)} m 
              Depth: {averages.depth} m
            </Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>
              {typeof californiaSizing.size === 'string' ? californiaSizing.size : `${californiaSizing.size} mm`}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>Cross-Section</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>
              Area: {bankfullDimensions.bankfullArea.toFixed(2)} m² 
              × 3 = {(bankfullDimensions.bankfullArea * 3).toFixed(2)} m²
            </Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>
              {bankfullDimensions.calculatedSize} mm
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>Hydraulic</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>
              Discharge: {streamProperties.adjustedDischarge.toFixed(2)} m³/s
              HW/D ≤ {culvertSpecs.maxHwD}
            </Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>
              {hydraulicSizing.size} mm
            </Text>
          </View>
        </View>
      </View>

      {/* Stream Measurements */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Stream Measurements</Text>
        
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>#</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Top (m)</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Bottom (m)</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Depth (m)</Text>
          </View>
          
          {measurements.map((measurement, index) => (
            <View key={measurement.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{measurement.topWidth}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{measurement.bottomWidth}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{measurement.depth}</Text>
            </View>
          ))}
          
          <View style={[styles.tableRow, styles.tableFooter]}>
            <Text style={[styles.tableFooterCell, { flex: 0.5 }]}>Avg</Text>
            <Text style={[styles.tableFooterCell, { flex: 1 }]}>{averages.topWidth}</Text>
            <Text style={[styles.tableFooterCell, { flex: 1 }]}>{averages.bottomWidth}</Text>
            <Text style={[styles.tableFooterCell, { flex: 1 }]}>{averages.depth}</Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Average Width:</Text>
          <Text style={styles.infoValue}>{bankfullDimensions.averageWidth.toFixed(2)} m</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Bankfull Area:</Text>
          <Text style={styles.infoValue}>{bankfullDimensions.bankfullArea.toFixed(2)} m²</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>End Area (3×):</Text>
          <Text style={styles.infoValue}>{(bankfullDimensions.bankfullArea * 3).toFixed(2)} m²</Text>
        </View>
      </View>

      {/* California Method Explanation */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>California Method Explanation</Text>
        <Text style={styles.explanationText}>
          The California Method (End Area Design Aid) uses the average stream width and depth to determine the appropriate culvert size based on area. This method uses average width × average depth × 3 to result in the end opening area of the culvert.
        </Text>
        <View style={styles.formula}>
          <Text style={styles.formulaText}>
            End Area = ((W₁ + W₂) ÷ 2) × D × 3
          </Text>
          <Text style={styles.formulaLegend}>
            W₁ = Average Top Width, W₂ = Average Bottom Width, D = Average Depth
          </Text>
        </View>
        <View style={styles.imageContainer}>
          <Text style={styles.imageCaption}>Cross-Sectional Area Diagram</Text>
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="image" size={48} color={colors.lightText} />
            <Text style={styles.imagePlaceholderText}>Diagram will display here in future version</Text>
          </View>
        </View>
      </View>

      {/* Design Recommendations */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Design Recommendations</Text>
        
        <View style={styles.recommendationItem}>
          <MaterialIcons name="check-circle" size={24} color={colors.success} style={styles.recommendationIcon} />
          <View style={styles.recommendationContent}>
            <Text style={styles.recommendationTitle}>Installation</Text>
            <Text style={styles.recommendationText}>
              Install culvert at stream grade to maintain natural flow characteristics and minimize scouring.
            </Text>
          </View>
        </View>
        
        <View style={styles.recommendationItem}>
          <MaterialIcons name="check-circle" size={24} color={colors.success} style={styles.recommendationIcon} />
          <View style={styles.recommendationContent}>
            <Text style={styles.recommendationTitle}>Inlet/Outlet Protection</Text>
            <Text style={styles.recommendationText}>
              Use riprap or other erosion control measures at inlet and outlet to prevent scouring.
            </Text>
          </View>
        </View>
        
        {streamProperties.fishBearing && (
          <View style={styles.recommendationItem}>
            <MaterialIcons name="check-circle" size={24} color={colors.success} style={styles.recommendationIcon} />
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle}>Fish Passage</Text>
              <Text style={styles.recommendationText}>
                Embed culvert 20% of its height into streambed and maintain natural substrate through the culvert.
              </Text>
            </View>
          </View>
        )}
        
        {finalSize >= 1200 && (
          <View style={styles.recommendationItem}>
            <MaterialIcons name="warning" size={24} color={colors.warning} style={styles.recommendationIcon} />
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle}>Large Culvert Considerations</Text>
              <Text style={styles.recommendationText}>
                For culverts larger than 1200mm, consider using arch culverts or bridges to better accommodate high flows and debris.
              </Text>
            </View>
          </View>
        )}
        
        {professionalDesignRequired && (
          <View style={styles.recommendationItem}>
            <MaterialIcons name="error" size={24} color={colors.error} style={styles.recommendationIcon} />
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle}>Professional Design Required</Text>
              <Text style={styles.recommendationText}>
                The California Method indicates this stream is too large for a standard culvert (Q100 result). A professional engineer should design this crossing, possibly considering a bridge or large arch culvert.
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="edit" size={20} color={colors.white} />
          <Text style={styles.buttonText}>Edit Inputs</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]}
          onPress={() => {
            // This would be connected to PDF export functionality in the future
            alert('PDF export will be available in a future update');
          }}
        >
          <MaterialIcons name="save-alt" size={20} color={colors.white} />
          <Text style={styles.buttonText}>Export PDF</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.primary,
  },
  placeholder: {
    fontSize: 16,
    color: colors.lightText,
    textAlign: 'center',
    marginVertical: 40,
  },
  sizeBadgeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  sizeBadge: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  sizeValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
  },
  sizeLabel: {
    fontSize: 16,
    color: colors.white,
    marginTop: 4,
  },
  message: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  warningBannerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.secondary,
    flex: 1,
    textAlign: 'right',
  },
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comparisonItem: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    marginHorizontal: 4,
  },
  governingMethod: {
    backgroundColor: colors.primary + '20', // 20% opacity primary color
    borderWidth: 2,
    borderColor: colors.primary,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.primary,
  },
  comparisonValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  comparisonDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  comparisonNote: {
    fontSize: 12,
    color: colors.lightText,
    fontStyle: 'italic',
  },
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderCell: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
    padding: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tableCell: {
    fontSize: 14,
    color: colors.text,
    padding: 8,
  },
  tableFooter: {
    backgroundColor: colors.background,
  },
  tableFooterCell: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    padding: 8,
  },
  explanationText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 24,
  },
  formula: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 4,
    marginBottom: 16,
    alignItems: 'center',
  },
  formulaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  formulaLegend: {
    fontSize: 14,
    color: colors.lightText,
    textAlign: 'center',
  },
  imageContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  imageCaption: {
    fontSize: 14,
    color: colors.lightText,
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: colors.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: colors.lightText,
    marginTop: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  recommendationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editButton: {
    backgroundColor: colors.secondary,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ResultScreen;