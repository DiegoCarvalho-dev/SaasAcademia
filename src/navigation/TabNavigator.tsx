import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Importar as telas que EXISTEM na sua pasta screens
import DashboardScreen from '../screens/DashboardScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Criar o navegador de abas
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
      {/* Aba 1: Dashboard/Início */}
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
      
      {/* Aba 2: Treinos */}
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
      
      {/* Aba 3: Perfil */}
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