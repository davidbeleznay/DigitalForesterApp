// src/navigation/CulvertToolNavigator.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InputScreen from '../screens/culvert/InputScreen';
import ResultScreen from '../screens/culvert/ResultScreen';
import { colors } from '../constants/constants';

const Stack = createNativeStackNavigator();

const CulvertToolNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="CulvertInput" 
        component={InputScreen}
        options={{
          title: 'Culvert Tool',
        }}
      />
      <Stack.Screen 
        name="CulvertResult" 
        component={ResultScreen}
        options={{
          title: 'Results',
        }}
      />
    </Stack.Navigator>
  );
};

export default CulvertToolNavigator;