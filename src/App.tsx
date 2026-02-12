import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './contexts/AuthContext';

// Telas de autenticação
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// Navegação principal
import TabNavigator from './navigation/TabNavigator';

// Telas de treino
import CreateWorkoutScreen from './screens/CreateWorkoutScreen';
import WorkoutDetailScreen from './screens/WorkoutDetailScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  CreateWorkout: { alunoId: string; alunoNome: string };
  WorkoutDetail: { treinoId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Welcome"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2563eb',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        >
          {/* Telas públicas */}
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ title: 'Login' }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ title: 'Criar Conta' }}
          />
          
          {/* Telas principais (com abas) */}
          <Stack.Screen 
            name="MainTabs" 
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          
          {/* Telas de treino */}
          <Stack.Screen 
            name="CreateWorkout" 
            component={CreateWorkoutScreen}
            options={{ 
              title: 'Criar Treino',
              headerShown: false 
            }}
          />
          <Stack.Screen 
            name="WorkoutDetail" 
            component={WorkoutDetailScreen}
            options={{ 
              title: 'Detalhes do Treino',
              headerShown: false 
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;