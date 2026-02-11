import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';;
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Login');
    }, 500);
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a73e8" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>GYM</Text>
          <Text style={styles.logoSubtitle}>PRO</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>
              Transforme sua experiência na academia
            </Text>
            <Text style={styles.heroSubtitle}>
              Controle completo para personal trainers e alunos
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.iconText}>👨‍🏫</Text>
              </View>
              <Text style={styles.featureTitle}>Personal Trainer</Text>
              <Text style={styles.featureDescription}>
                Crie e gerencie treinos personalizados para seus alunos
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.iconText}>🏋️‍♂️</Text>
              </View>
              <Text style={styles.featureTitle}>Aluno</Text>
              <Text style={styles.featureDescription}>
                Acompanhe seus treinos, séries e evolução
              </Text>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Carregando...' : 'Login'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleRegister}
            >
              <Text style={styles.secondaryButtonText}>Criar Conta</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>
            Ao continuar, você concorda com nossos Termos e Política de Privacidade
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1, // Faz o conteúdo expandir dentro do ScrollView
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#1a73e8',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
  },
  logoSubtitle: {
    fontSize: 32,
    fontWeight: '300',
    color: '#ffffff',
    marginLeft: 5,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 50,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2d3436',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 34,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a73e8',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#636e72',
    lineHeight: 20,
  },
  buttonsContainer: {
    marginTop: 20,
  },
  button: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#1a73e8',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#1a73e8',
  },
  secondaryButtonText: {
    color: '#1a73e8',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 30,
    lineHeight: 16,
  },
});