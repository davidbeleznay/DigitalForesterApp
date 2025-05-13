// src/screens/culvert/InputScreen.js

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { determineOptimalCulvertSize } from '../../utils/CulvertCalculator';
import { colors, culvertMaterials, culvertShapes } from '../../constants/constants';

const InputScreen = ({ navigation }) => {
  // Basic culvert identification
  const [culvertId, setCulvertId] = useState('');
  const [roadName, setRoadName] = useState('');
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Stream measurements
  const [measurements, setMeasurements] = useState([
    { id: 1, topWidth: '', bottomWidth: '', depth: '' }
  ]);
  
  // Stream properties
  const [streamSlope, setStreamSlope] = useState('');
  const [bankfullDischarge, setBankfullDischarge] = useState('');
  const [fishBearing, setFishBearing] = useState(false);
  
  // Culvert specifications
  const [culvertMaterial, setCulvertMaterial] = useState('cmp');
  const [culvertShape, setCulvertShape] = useState('circular');
  const [manningsN, setManningsN] = useState('0.024');
  const [maxHwD, setMaxHwD] = useState('0.8');
  
  // Toggle options
  const [includeClimateChange, setIncludeClimateChange] = useState(true);
  const [useTransportabilityMatrix, setUseTransportabilityMatrix] = useState(true);

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        return;
      }

      setLocationError(null);
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    } catch (error) {
      setLocationError('Could not get location. Please try again.');
      console.error(error);
    }
  };

  // Add a new measurement row
  const addMeasurement = () => {
    const nextId = Math.max(...measurements.map(m => m.id), 0) + 1;
    setMeasurements([...measurements, { id: nextId, topWidth: '', bottomWidth: '', depth: '' }]);
  };

  // Remove a measurement row
  const removeMeasurement = (id) => {
    if (measurements.length > 1) {
      setMeasurements(measurements.filter(m => m.id !== id));
    } else {
      Alert.alert('Cannot Remove', 'You must have at least one measurement.');
    }
  };

  // Update a specific measurement field
  const updateMeasurement = (id, field, value) => {
    setMeasurements(measurements.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  // Calculate average measurements
  const calculateAverages = () => {
    if (measurements.length === 0) return { topWidth: 0, bottomWidth: 0, depth: 0 };
    
    const sumTopWidth = measurements.reduce((sum, m) => sum + parseFloat(m.topWidth || 0), 0);
    const sumBottomWidth = measurements.reduce((sum, m) => sum + parseFloat(m.bottomWidth || 0), 0);
    const sumDepth = measurements.reduce((sum, m) => sum + parseFloat(m.depth || 0), 0);
    
    return {
      topWidth: (sumTopWidth / measurements.length).toFixed(2),
      bottomWidth: (sumBottomWidth / measurements.length).toFixed(2),
      depth: (sumDepth / measurements.length).toFixed(2),
    };
  };

  // Calculate culvert size
  const calculateCulvertSize = () => {
    // Validate inputs
    if (!validateInputs()) {
      Alert.alert('Invalid Inputs', 'Please fill in all required fields with valid numbers.');
      return;
    }

    // Parse numeric inputs
    const slope = parseFloat(streamSlope);
    const discharge = parseFloat(bankfullDischarge);
    const hwD = parseFloat(maxHwD);
    const manningsValue = parseFloat(manningsN);

    // Apply climate change factor if selected
    const climateChangeFactor = includeClimateChange ? 1.2 : 1.0; // 20% increase
    const adjustedDischarge = discharge * climateChangeFactor;

    // Calculate the optimal culvert size
    const result = determineOptimalCulvertSize(
      measurements,
      slope,
      adjustedDischarge,
      culvertShape,
      manningsValue,
      hwD
    );

    // Navigate to the results screen with the calculation results
    navigation.navigate('CulvertResult', {
      result,
      measurements,
      averages: calculateAverages(),
      streamProperties: {
        slope,
        discharge,
        adjustedDischarge,
        fishBearing,
      },
      culvertSpecs: {
        material: culvertMaterial,
        shape: culvertShape,
        manningsN: manningsValue,
        maxHwD: hwD,
      },
      options: {
        includeClimateChange,
        useTransportabilityMatrix,
        climateChangeFactor,
      }
    });
  };

  // Validate all required inputs
  const validateInputs = () => {
    // Check if all measurements have valid values
    const validMeasurements = measurements.every(m => 
      !isNaN(parseFloat(m.topWidth)) && 
      !isNaN(parseFloat(m.bottomWidth)) && 
      !isNaN(parseFloat(m.depth)) &&
      parseFloat(m.topWidth) > 0 &&
      parseFloat(m.bottomWidth) > 0 &&
      parseFloat(m.depth) > 0
    );

    // Check if other required fields are valid
    const validSlope = !isNaN(parseFloat(streamSlope)) && parseFloat(streamSlope) > 0;
    const validDischarge = !isNaN(parseFloat(bankfullDischarge)) && parseFloat(bankfullDischarge) > 0;
    const validHwD = !isNaN(parseFloat(maxHwD)) && parseFloat(maxHwD) > 0;
    const validManningsN = !isNaN(parseFloat(manningsN)) && parseFloat(manningsN) > 0;

    return validMeasurements && validSlope && validDischarge && validHwD && validManningsN;
  };

  // Find the Manning's n value for the selected material
  useEffect(() => {
    const material = culvertMaterials.find(m => m.value === culvertMaterial);
    if (material) {
      setManningsN(material.manningsN.toString());
    }
  }, [culvertMaterial]);

  return (
    <ScrollView style={styles.container}>
      {/* Culvert ID Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Culvert ID</Text>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Culvert ID</Text>
          <TextInput
            style={styles.input}
            value={culvertId}
            onChangeText={setCulvertId}
            placeholder="Enter culvert ID"
          />
        </View>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Road Name</Text>
          <TextInput
            style={styles.input}
            value={roadName}
            onChangeText={setRoadName}
            placeholder="Enter road name"
          />
        </View>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Location</Text>
          <TouchableOpacity 
            style={styles.gpsButton} 
            onPress={getLocation}
          >
            <MaterialIcons name="gps-fixed" size={24} color="white" />
            <Text style={styles.gpsButtonText}>
              {location ? 
                `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : 
                'Get GPS Location'}
            </Text>
          </TouchableOpacity>
          {locationError && <Text style={styles.errorText}>{locationError}</Text>}
        </View>
      </View>

      {/* Stream Measurements Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Stream Measurements</Text>
        <Text style={styles.description}>
          Measure the stream at representative locations to determine average dimensions. The California Method uses average width × average height × 3 to calculate the required end area.
        </Text>
        
        {measurements.map((measurement, index) => (
          <View key={measurement.id} style={styles.measurementRow}>
            <View style={styles.measurementHeader}>
              <Text style={styles.measurementTitle}>Measurement {index + 1}</Text>
              {measurements.length > 1 && (
                <TouchableOpacity 
                  onPress={() => removeMeasurement(measurement.id)}
                  style={styles.removeButton}
                >
                  <MaterialIcons name="remove-circle" size={24} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.fieldRow}>
              <View style={[styles.fieldGroup, styles.fieldHalf]}>
                <Text style={styles.label}>Top Width (m)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={measurement.topWidth}
                  onChangeText={(value) => updateMeasurement(measurement.id, 'topWidth', value)}
                  placeholder="0.0"
                />
              </View>
              
              <View style={[styles.fieldGroup, styles.fieldHalf]}>
                <Text style={styles.label}>Bottom Width (m)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={measurement.bottomWidth}
                  onChangeText={(value) => updateMeasurement(measurement.id, 'bottomWidth', value)}
                  placeholder="0.0"
                />
              </View>
            </View>
            
            <View style={styles.fieldRow}>
              <View style={[styles.fieldGroup, styles.fieldHalf]}>
                <Text style={styles.label}>Depth (m)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={measurement.depth}
                  onChangeText={(value) => updateMeasurement(measurement.id, 'depth', value)}
                  placeholder="0.0"
                />
              </View>
            </View>
          </View>
        ))}
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={addMeasurement}
        >
          <MaterialIcons name="add-circle" size={20} color={colors.primary} />
          <Text style={styles.addButtonText}>Add Measurement</Text>
        </TouchableOpacity>
        
        <View style={styles.averageSection}>
          <Text style={styles.averageTitle}>Calculated Averages:</Text>
          <View style={styles.averageRow}>
            <View style={styles.averageItem}>
              <Text style={styles.averageLabel}>Avg. Top Width:</Text>
              <Text style={styles.averageValue}>{calculateAverages().topWidth} m</Text>
            </View>
            <View style={styles.averageItem}>
              <Text style={styles.averageLabel}>Avg. Bottom Width:</Text>
              <Text style={styles.averageValue}>{calculateAverages().bottomWidth} m</Text>
            </View>
            <View style={styles.averageItem}>
              <Text style={styles.averageLabel}>Avg. Depth:</Text>
              <Text style={styles.averageValue}>{calculateAverages().depth} m</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stream Properties Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Stream Properties</Text>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Stream Slope (m/m)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={streamSlope}
            onChangeText={setStreamSlope}
            placeholder="e.g., 0.02"
          />
        </View>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Bankfull Discharge (m³/s)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={bankfullDischarge}
            onChangeText={setBankfullDischarge}
            placeholder="e.g., 1.5"
          />
        </View>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Fish Passage Required</Text>
          <TouchableOpacity 
            style={[
              styles.toggleButton,
              fishBearing ? styles.toggleActive : styles.toggleInactive
            ]}
            onPress={() => setFishBearing(!fishBearing)}
          >
            <Text style={fishBearing ? styles.toggleActiveText : styles.toggleInactiveText}>
              {fishBearing ? 'Yes' : 'No'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Culvert Specifications Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Culvert Specifications</Text>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Culvert Material</Text>
          <View style={styles.optionsContainer}>
            {culvertMaterials.map(material => (
              <TouchableOpacity 
                key={material.value}
                style={[
                  styles.optionButton,
                  culvertMaterial === material.value ? styles.optionActive : styles.optionInactive
                ]}
                onPress={() => setCulvertMaterial(material.value)}
              >
                <Text style={culvertMaterial === material.value ? styles.optionActiveText : styles.optionInactiveText}>
                  {material.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Culvert Shape</Text>
          <View style={styles.optionsContainer}>
            {culvertShapes.map(shape => (
              <TouchableOpacity 
                key={shape.value}
                style={[
                  styles.optionButton,
                  culvertShape === shape.value ? styles.optionActive : styles.optionInactive
                ]}
                onPress={() => setCulvertShape(shape.value)}
              >
                <Text style={culvertShape === shape.value ? styles.optionActiveText : styles.optionInactiveText}>
                  {shape.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Manning's n Value</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={manningsN}
            onChangeText={setManningsN}
            placeholder="e.g., 0.024"
          />
          <Text style={styles.helperText}>
            Auto-filled based on material selection. Can be manually adjusted.
          </Text>
        </View>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Maximum Headwater Depth Ratio (HW/D)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={maxHwD}
            onChangeText={setMaxHwD}
            placeholder="e.g., 0.8"
          />
          <Text style={styles.helperText}>
            Standard design criterion is 0.8 (headwater depth = 0.8 × culvert diameter/height)
          </Text>
        </View>
      </View>

      {/* Design Options Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Design Options</Text>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Include Climate Change Factor (20% increase)</Text>
          <TouchableOpacity 
            style={[
              styles.toggleButton,
              includeClimateChange ? styles.toggleActive : styles.toggleInactive
            ]}
            onPress={() => setIncludeClimateChange(!includeClimateChange)}
          >
            <Text style={includeClimateChange ? styles.toggleActiveText : styles.toggleInactiveText}>
              {includeClimateChange ? 'Yes' : 'No'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Use Transportability Matrix (3x Bankfull Method)</Text>
          <TouchableOpacity 
            style={[
              styles.toggleButton,
              useTransportabilityMatrix ? styles.toggleActive : styles.toggleInactive
            ]}
            onPress={() => setUseTransportabilityMatrix(!useTransportabilityMatrix)}
          >
            <Text style={useTransportabilityMatrix ? styles.toggleActiveText : styles.toggleInactiveText}>
              {useTransportabilityMatrix ? 'Yes' : 'No'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Calculate Button */}
      <TouchableOpacity 
        style={styles.calculateButton}
        onPress={calculateCulvertSize}
      >
        <Text style={styles.calculateButtonText}>Calculate Culvert Size</Text>
      </TouchableOpacity>
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
  description: {
    fontSize: 14,
    color: colors.lightText,
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fieldHalf: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    color: colors.lightText,
    marginTop: 4,
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 4,
    justifyContent: 'center',
  },
  gpsButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  errorText: {
    color: colors.error,
    marginTop: 4,
  },
  measurementRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  measurementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  measurementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  removeButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginBottom: 16,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  averageSection: {
    backgroundColor: colors.background,
    borderRadius: 4,
    padding: 12,
  },
  averageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  averageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  averageItem: {
    marginRight: 16,
    marginBottom: 8,
  },
  averageLabel: {
    fontSize: 14,
    color: colors.lightText,
  },
  averageValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  optionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionInactive: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  optionActiveText: {
    color: colors.white,
  },
  optionInactiveText: {
    color: colors.text,
  },
  toggleButton: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    width: 80,
  },
  toggleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleInactive: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  toggleActiveText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  toggleInactiveText: {
    color: colors.text,
  },
  calculateButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calculateButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default InputScreen;