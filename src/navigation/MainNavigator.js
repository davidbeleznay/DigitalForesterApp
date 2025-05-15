// src/navigation/MainNavigator.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CulvertToolNavigator from './CulvertToolNavigator';
import RoadRiskNavigator from './RoadRiskNavigator';
import HistoryPage from '../pages/HistoryPage';
import { colors } from '../constants/constants';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
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
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Digital Forester',
        }}
      />
      <Stack.Screen 
        name="CulvertTool" 
        component={CulvertToolNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="RoadRiskTool" 
        component={RoadRiskNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="History" 
        component={HistoryPage}
        options={{
          title: 'Assessment History',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;