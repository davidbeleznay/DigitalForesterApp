import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RoadRiskForm from '../pages/RoadRiskForm';
import { colors } from '../constants/constants';

const Stack = createStackNavigator();

const RoadRiskNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="RoadRiskForm"
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
        name="RoadRiskForm" 
        component={RoadRiskForm} 
        options={{ title: 'Road Risk Assessment' }}
      />
    </Stack.Navigator>
  );
};

export default RoadRiskNavigator;
