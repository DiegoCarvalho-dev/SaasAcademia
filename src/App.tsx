import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importar telas
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import TabNavigator from './navigation/TabNavigator';

// Definir tipos para navegação principal
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;  // Esta é a tela com abas
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a73e8',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        {/* Tela inicial */}
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        
        {/* Tela de login */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
        
        {/* Tela de cadastro */}
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{ title: 'Criar Conta' }}
        />
        
        {/* Telas principais com abas (Dashboard, Treinos, Perfil) */}
        <Stack.Screen 
          name="MainTabs" 
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;