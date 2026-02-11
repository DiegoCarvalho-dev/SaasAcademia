import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

// Importar as telas
import DashboardScreen from '../screens/DashboardScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Definir tipos
type TabParamList = {
  Dashboard: undefined;
  Workouts: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// Componente para ícone com emoji CORRETAMENTE encapsulado
interface TabIconProps {
  emoji: string;
  color: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ emoji, color, focused }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, color }}>
        {emoji}
      </Text>
    </View>
  );
};

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
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon emoji="🏠" color={color} focused={focused} />
          ),
        }}
      />
      
      <Tab.Screen 
        name="Workouts" 
        component={WorkoutsScreen}
        options={{
          title: 'Treinos',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon emoji="🏋️‍♂️" color={color} focused={focused} />
          ),
        }}
      />
      
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon emoji="👤" color={color} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}