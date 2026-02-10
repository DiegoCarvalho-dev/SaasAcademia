import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import DashboardScreen from '../screens/DashboardScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1a73e8',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: '#1a73e8',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size - 4 }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Workouts" 
        component={WorkoutsScreen}
        options={{
          title: 'Treinos',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size - 4 }}>🏋️‍♂️</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size - 4 }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}