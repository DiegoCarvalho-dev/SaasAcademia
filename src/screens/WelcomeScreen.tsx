import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons as Icon } from '@expo/vector-icons';

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Icon name="fitness-center" size={40} color="#2563eb" />
            </View>
            <View style={styles.logoTextContainer}>
              <Text style={styles.logoText}>GYM</Text>
              <Text style={styles.logoTextHighlight}>PRO</Text>
            </View>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Transforme sua experiência
            <Text style={styles.heroTitleHighlight}> na academia</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Plataforma completa para personal trainers e alunos gerenciarem treinos com eficiência
          </Text>
        </View>

        {/* Features Cards  */}
        <View style={styles.featuresContainer}>
          {/* Card Personal Trainer */}
          <View style={styles.featureCard}>
            <View style={[styles.featureIconContainer, { backgroundColor: '#dbeafe' }]}>
              <Icon name="fitness-center" size={32} color="#2563eb" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Personal Trainer</Text>
              <Text style={styles.featureDescription}>
                Crie treinos personalizados, acompanhe a evolução e gerencie seus alunos
              </Text>
              <View style={styles.featureBadge}>
                <Icon name="check-circle" size={14} color="#2563eb" />
                <Text style={styles.featureBadgeText}>Gestão completa</Text>
              </View>
            </View>
          </View>

          {/* Card Aluno */}
          <View style={styles.featureCard}>
            <View style={[styles.featureIconContainer, { backgroundColor: '#dcfce7' }]}>
              <Icon name="directions-run" size={32} color="#166534" />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: '#166534' }]}>Aluno</Text>
              <Text style={styles.featureDescription}>
                Acesse seus treinos diários, acompanhe séries e veja sua evolução
              </Text>
              <View style={[styles.featureBadge, { backgroundColor: '#dcfce7' }]}>
                <Icon name="check-circle" size={14} color="#166534" />
                <Text style={[styles.featureBadgeText, { color: '#166534' }]}>
                  Treinos personalizados
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Diferenciais */}
        <View style={styles.differentialsContainer}>
          <View style={styles.differentialItem}>
            <View style={styles.differentialIconContainer}>
              <Icon name="schedule" size={24} color="#2563eb" />
            </View>
            <View style={styles.differentialContent}>
              <Text style={styles.differentialTitle}>Treinos sob medida</Text>
              <Text style={styles.differentialDescription}>
                Exercícios adaptados ao seu objetivo e nível
              </Text>
            </View>
          </View>

          <View style={styles.differentialItem}>
            <View style={styles.differentialIconContainer}>
              <Icon name="insights" size={24} color="#2563eb" />
            </View>
            <View style={styles.differentialContent}>
              <Text style={styles.differentialTitle}>Acompanhamento real</Text>
              <Text style={styles.differentialDescription}>
                Métricas e evolução dos seus treinos
              </Text>
            </View>
          </View>

          <View style={styles.differentialItem}>
            <View style={styles.differentialIconContainer}>
              <Icon name="people" size={24} color="#2563eb" />
            </View>
            <View style={styles.differentialContent}>
              <Text style={styles.differentialTitle}>Conexão personal-aluno</Text>
              <Text style={styles.differentialDescription}>
                Comunicação via dados e treinos personalizados
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Acessar minha conta</Text>
            <Icon name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Criar nova conta</Text>
          </TouchableOpacity>
        </View>

        {/* Footer  */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Ao continuar, você concorda com nossos
          </Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Termos de Uso</Text>
            </TouchableOpacity>
            <Text style={styles.footerSeparator}>e</Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Política de Privacidade</Text>
            </TouchableOpacity>
          </View>
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
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
  },
  logoTextHighlight: {
    fontSize: 28,
    fontWeight: '300',
    color: '#2563eb',
    marginLeft: 4,
  },
  heroSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    lineHeight: 42,
    marginBottom: 12,
    textAlign: 'center',
  },
  heroTitleHighlight: {
    color: '#2563eb',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    textAlign: 'center',
  },
  featuresContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  featureBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
    marginLeft: 4,
  },
  differentialsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  differentialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  differentialIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  differentialContent: {
    flex: 1,
  },
  differentialTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  differentialDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  actionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 14,
    height: 56,
    marginBottom: 16,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    height: 56,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  secondaryButtonText: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footerLink: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },
  footerSeparator: {
    fontSize: 12,
    color: '#9ca3af',
    marginHorizontal: 4,
  },
});