import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Detail } from '~/pages/Detail';
import { Incidents } from '~/pages/Incidents';

const StackNavigator = createNativeStackNavigator();

export default () => (
  <NavigationContainer>
    <StackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <StackNavigator.Screen name="Incidents" component={Incidents} />
      <StackNavigator.Screen name="Detail" component={Detail} />
    </StackNavigator.Navigator>
  </NavigationContainer>
);
