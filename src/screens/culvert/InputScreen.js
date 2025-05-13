import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { colors } from '../../constants/constants';

const InputScreen = ({ navigation }) => {
  const [culvertId, setCulvertId] = useState('');
  const [roadName, setRoadName] = useState('');
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

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

  return (
    <View style={styles.container}>
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

      {/* More fields and content will go here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.primary,
  },
  fieldGroup: {
    marginBottom: 16,
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
    color: 'red',
    marginTop: 4,
  }
});

export default InputScreen;