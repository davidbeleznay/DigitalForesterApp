// src/screens/culvert/ResultScreen.js

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  MdImage,
  MdCheckCircle,
  MdWarning,
  MdError,
  MdEdit,
  MdSave 
} from 'react-icons/md';
import { colors, culvertMaterials, culvertShapes } from '../../constants/constants';

const ResultScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    result, 
    measurements, 
    averages, 
    streamProperties, 
    culvertSpecs, 
    options 
  } = location.state || {};

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
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Results</h2>
          <p style={styles.placeholder}>
            No calculation results available. Please complete the input form to calculate culvert size.
          </p>
        </div>
      </div>
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
    <div style={styles.container}>
      {/* Final Recommendation */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Recommended Culvert Size</h2>
        <div style={styles.sizeBadgeContainer}>
          <div style={styles.sizeBadge}>
            <p style={styles.sizeValue}>{finalSize} mm</p>
            <p style={styles.sizeLabel}>{getShapeLabel(culvertSpecs.shape)}</p>
          </div>
        </div>
        <p style={styles.message}>{message}</p>
        
        {professionalDesignRequired && (
          <div style={styles.warningBanner}>
            <MdWarning size={24} color="white" />
            <p style={styles.warningBannerText}>
              Professional Design Required
            </p>
          </div>
        )}
        
        <div style={styles.infoRow}>
          <p style={styles.infoLabel}>Governing Method:</p>
          <p style={styles.infoValue}>{governingMethod}</p>
        </div>
        
        <div style={styles.infoRow}>
          <p style={styles.infoLabel}>Material:</p>
          <p style={styles.infoValue}>{getMaterialLabel(culvertSpecs.material)}</p>
        </div>
        
        <div style={styles.infoRow}>
          <p style={styles.infoLabel}>Manning's n:</p>
          <p style={styles.infoValue}>{culvertSpecs.manningsN}</p>
        </div>
        
        <div style={styles.infoRow}>
          <p style={styles.infoLabel}>Headwater Criterion:</p>
          <p style={styles.infoValue}>HW/D ≤ {culvertSpecs.maxHwD}</p>
        </div>
        
        {options.includeClimateChange && (
          <div style={styles.infoRow}>
            <p style={styles.infoLabel}>Climate Change Factor:</p>
            <p style={styles.infoValue}>{options.climateChangeFactor.toFixed(2)}x</p>
          </div>
        )}
      </div>

      {/* Sizing Method Comparison */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Sizing Method Comparison</h2>
        
        <div style={styles.comparisonContainer}>
          <div style={{
            ...styles.comparisonItem, 
            ...(governingMethod.includes('California') ? styles.governingMethod : {})
          }}>
            <p style={styles.comparisonTitle}>California Method</p>
            <p style={styles.comparisonValue}>
              {typeof californiaSizing.size === 'string' && californiaSizing.size === 'Q100' 
                ? 'Q100' 
                : `${californiaSizing.size} mm`}
            </p>
            <p style={styles.comparisonDescription}>
              3× Bankfull Area: {(bankfullDimensions.bankfullArea * 3).toFixed(2)} m²
            </p>
            <p style={styles.comparisonNote}>{californiaSizing.message}</p>
          </div>
          
          <div style={{
            ...styles.comparisonItem, 
            ...(governingMethod.includes('Hydraulic') ? styles.governingMethod : {})
          }}>
            <p style={styles.comparisonTitle}>Hydraulic Calculation</p>
            <p style={styles.comparisonValue}>{hydraulicSizing.size} mm</p>
            <p style={styles.comparisonDescription}>
              Design Discharge: {streamProperties.adjustedDischarge.toFixed(2)} m³/s
            </p>
            <p style={styles.comparisonNote}>{hydraulicSizing.message}</p>
          </div>
        </div>
      </div>

      {/* Calculation Details */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Calculation Details</h2>
        
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <p style={{...styles.tableHeaderCell, flex: 1}}>Method</p>
            <p style={{...styles.tableHeaderCell, flex: 1.5}}>Key Parameter</p>
            <p style={{...styles.tableHeaderCell, flex: 1}}>Result</p>
          </div>

          <div style={styles.tableRow}>
            <p style={{...styles.tableCell, flex: 1}}>California Table</p>
            <p style={{...styles.tableCell, flex: 1.5}}>
              Width: {bankfullDimensions.averageWidth.toFixed(2)} m 
              Depth: {averages.depth} m
            </p>
            <p style={{...styles.tableCell, flex: 1}}>
              {typeof californiaSizing.size === 'string' ? californiaSizing.size : `${californiaSizing.size} mm`}
            </p>
          </div>

          <div style={styles.tableRow}>
            <p style={{...styles.tableCell, flex: 1}}>Cross-Section</p>
            <p style={{...styles.tableCell, flex: 1.5}}>
              Area: {bankfullDimensions.bankfullArea.toFixed(2)} m² 
              × 3 = {(bankfullDimensions.bankfullArea * 3).toFixed(2)} m²
            </p>
            <p style={{...styles.tableCell, flex: 1}}>
              {bankfullDimensions.calculatedSize} mm
            </p>
          </div>

          <div style={styles.tableRow}>
            <p style={{...styles.tableCell, flex: 1}}>Hydraulic</p>
            <p style={{...styles.tableCell, flex: 1.5}}>
              Discharge: {streamProperties.adjustedDischarge.toFixed(2)} m³/s
              HW/D ≤ {culvertSpecs.maxHwD}
            </p>
            <p style={{...styles.tableCell, flex: 1}}>
              {hydraulicSizing.size} mm
            </p>
          </div>
        </div>
      </div>

      {/* Stream Measurements */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Stream Measurements</h2>
        
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <p style={{...styles.tableHeaderCell, flex: 0.5}}>#</p>
            <p style={{...styles.tableHeaderCell, flex: 1}}>Top (m)</p>
            <p style={{...styles.tableHeaderCell, flex: 1}}>Bottom (m)</p>
            <p style={{...styles.tableHeaderCell, flex: 1}}>Depth (m)</p>
          </div>
          
          {measurements.map((measurement, index) => (
            <div key={measurement.id} style={styles.tableRow}>
              <p style={{...styles.tableCell, flex: 0.5}}>{index + 1}</p>
              <p style={{...styles.tableCell, flex: 1}}>{measurement.topWidth}</p>
              <p style={{...styles.tableCell, flex: 1}}>{measurement.bottomWidth}</p>
              <p style={{...styles.tableCell, flex: 1}}>{measurement.depth}</p>
            </div>
          ))}
          
          <div style={{...styles.tableRow, ...styles.tableFooter}}>
            <p style={{...styles.tableFooterCell, flex: 0.5}}>Avg</p>
            <p style={{...styles.tableFooterCell, flex: 1}}>{averages.topWidth}</p>
            <p style={{...styles.tableFooterCell, flex: 1}}>{averages.bottomWidth}</p>
            <p style={{...styles.tableFooterCell, flex: 1}}>{averages.depth}</p>
          </div>
        </div>
        
        <div style={styles.infoRow}>
          <p style={styles.infoLabel}>Average Width:</p>
          <p style={styles.infoValue}>{bankfullDimensions.averageWidth.toFixed(2)} m</p>
        </div>
        
        <div style={styles.infoRow}>
          <p style={styles.infoLabel}>Bankfull Area:</p>
          <p style={styles.infoValue}>{bankfullDimensions.bankfullArea.toFixed(2)} m²</p>
        </div>
        
        <div style={styles.infoRow}>
          <p style={styles.infoLabel}>End Area (3×):</p>
          <p style={styles.infoValue}>{(bankfullDimensions.bankfullArea * 3).toFixed(2)} m²</p>
        </div>
      </div>

      {/* California Method Explanation */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>California Method Explanation</h2>
        <p style={styles.explanationText}>
          The California Method (End Area Design Aid) uses the average stream width and depth to determine the appropriate culvert size based on area. This method uses average width × average depth × 3 to result in the end opening area of the culvert.
        </p>
        <div style={styles.formula}>
          <p style={styles.formulaText}>
            End Area = ((W₁ + W₂) ÷ 2) × D × 3
          </p>
          <p style={styles.formulaLegend}>
            W₁ = Average Top Width, W₂ = Average Bottom Width, D = Average Depth
          </p>
        </div>
        <div style={styles.imageContainer}>
          <p style={styles.imageCaption}>Cross-Sectional Area Diagram</p>
          <div style={styles.imagePlaceholder}>
            <MdImage size={48} color={colors.lightText} />
            <p style={styles.imagePlaceholderText}>Diagram will display here in future version</p>
          </div>
        </div>
      </div>

      {/* Design Recommendations */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Design Recommendations</h2>
        
        <div style={styles.recommendationItem}>
          <MdCheckCircle size={24} color={colors.success} style={styles.recommendationIcon} />
          <div style={styles.recommendationContent}>
            <h3 style={styles.recommendationTitle}>Installation</h3>
            <p style={styles.recommendationText}>
              Install culvert at stream grade to maintain natural flow characteristics and minimize scouring.
            </p>
          </div>
        </div>
        
        <div style={styles.recommendationItem}>
          <MdCheckCircle size={24} color={colors.success} style={styles.recommendationIcon} />
          <div style={styles.recommendationContent}>
            <h3 style={styles.recommendationTitle}>Inlet/Outlet Protection</h3>
            <p style={styles.recommendationText}>
              Use riprap or other erosion control measures at inlet and outlet to prevent scouring.
            </p>
          </div>
        </div>
        
        {streamProperties.fishBearing && (
          <div style={styles.recommendationItem}>
            <MdCheckCircle size={24} color={colors.success} style={styles.recommendationIcon} />
            <div style={styles.recommendationContent}>
              <h3 style={styles.recommendationTitle}>Fish Passage</h3>
              <p style={styles.recommendationText}>
                Embed culvert 20% of its height into streambed and maintain natural substrate through the culvert.
              </p>
            </div>
          </div>
        )}
        
        {finalSize >= 1200 && (
          <div style={styles.recommendationItem}>
            <MdWarning size={24} color={colors.warning} style={styles.recommendationIcon} />
            <div style={styles.recommendationContent}>
              <h3 style={styles.recommendationTitle}>Large Culvert Considerations</h3>
              <p style={styles.recommendationText}>
                For culverts larger than 1200mm, consider using arch culverts or bridges to better accommodate high flows and debris.
              </p>
            </div>
          </div>
        )}
        
        {professionalDesignRequired && (
          <div style={styles.recommendationItem}>
            <MdError size={24} color={colors.error} style={styles.recommendationIcon} />
            <div style={styles.recommendationContent}>
              <h3 style={styles.recommendationTitle}>Professional Design Required</h3>
              <p style={styles.recommendationText}>
                The California Method indicates this stream is too large for a standard culvert (Q100 result). A professional engineer should design this crossing, possibly considering a bridge or large arch culvert.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={styles.buttonContainer}>
        <button 
          style={{...styles.button, ...styles.editButton}}
          onClick={() => navigate('/culvert')}
        >
          <MdEdit size={20} color="white" />
          <span style={styles.buttonText}>Edit Inputs</span>
        </button>
        
        <button 
          style={{...styles.button, ...styles.primaryButton}}
          onClick={() => {
            // This would be connected to PDF export functionality in the future
            alert('PDF export will be available in a future update');
          }}
        >
          <MdSave size={20} color="white" />
          <span style={styles.buttonText}>Export PDF</span>
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: '8px',
    padding: '16px',
    margin: '16px 0',
    marginBottom: '8px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: colors.primary,
  },
  placeholder: {
    fontSize: '16px',
    color: colors.lightText,
    textAlign: 'center',
    margin: '40px 0',
  },
  sizeBadgeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  sizeBadge: {
    backgroundColor: colors.primary,
    borderRadius: '50%',
    width: '150px',
    height: '150px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sizeValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: colors.white,
    margin: 0,
  },
  sizeLabel: {
    fontSize: '16px',
    color: colors.white,
    marginTop: '4px',
    margin: 0,
  },
  message: {
    fontSize: '16px',
    color: colors.text,
    textAlign: 'center',
    marginBottom: '16px',
  },
  warningBanner: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '16px',
  },
  warningBannerText: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: '8px',
    margin: 0,
  },
  infoRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: `1px solid ${colors.border}`,
  },
  infoLabel: {
    fontSize: '16px',
    color: colors.text,
    flex: 1,
    margin: 0,
  },
  infoValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: colors.secondary,
    flex: 1,
    textAlign: 'right',
    margin: 0,
  },
  comparisonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  comparisonItem: {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: colors.background,
    margin: '4px',
    minWidth: '200px',
  },
  governingMethod: {
    backgroundColor: `${colors.primary}20`, // 20% opacity primary color
    border: `2px solid ${colors.primary}`,
  },
  comparisonTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: colors.primary,
    margin: '0 0 8px 0',
  },
  comparisonValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: colors.text,
    margin: '0 0 8px 0',
  },
  comparisonDescription: {
    fontSize: '14px',
    color: colors.text,
    margin: '0 0 8px 0',
  },
  comparisonNote: {
    fontSize: '12px',
    color: colors.lightText,
    fontStyle: 'italic',
    margin: 0,
  },
  table: {
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    marginBottom: '16px',
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: '8px',
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
  },
  tableHeaderCell: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: colors.white,
    padding: '4px',
    margin: 0,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    borderTop: `1px solid ${colors.border}`,
  },
  tableCell: {
    fontSize: '14px',
    color: colors.text,
    padding: '8px',
    margin: 0,
  },
  tableFooter: {
    backgroundColor: colors.background,
  },
  tableFooterCell: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: colors.primary,
    padding: '8px',
    margin: 0,
  },
  explanationText: {
    fontSize: '16px',
    color: colors.text,
    marginBottom: '16px',
    lineHeight: 1.5,
  },
  formula: {
    backgroundColor: colors.background,
    padding: '16px',
    borderRadius: '4px',
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formulaText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  formulaLegend: {
    fontSize: '14px',
    color: colors.lightText,
    textAlign: 'center',
    margin: 0,
  },
  imageContainer: {
    margin: '16px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  imageCaption: {
    fontSize: '14px',
    color: colors.lightText,
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  imagePlaceholder: {
    width: '100%',
    height: '150px',
    backgroundColor: colors.background,
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: '14px',
    color: colors.lightText,
    marginTop: '8px',
    margin: '8px 0 0 0',
  },
  recommendationItem: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '16px',
  },
  recommendationIcon: {
    marginRight: '12px',
    marginTop: '2px',
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: '4px',
    margin: '0 0 4px 0',
  },
  recommendationText: {
    fontSize: '14px',
    color: colors.text,
    lineHeight: 1.4,
    margin: 0,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '16px 0',
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    borderRadius: '8px',
    flex: 1,
    margin: '0 4px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    border: 'none',
  },
  editButton: {
    backgroundColor: colors.secondary,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.white,
    fontSize: '16px',
    fontWeight: 'bold',
    marginLeft: '8px',
  },
};

export default ResultScreen;