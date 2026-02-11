import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import UserService, { User } from '../services/userService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { signUp } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'personal' | 'aluno' | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [personais, setPersonais] = useState<User[]>([]);
  const [selectedPersonalId, setSelectedPersonalId] = useState<string>('');
  const [loadingPersonais, setLoadingPersonais] = useState(true);

  useEffect(() => {
    async function loadPersonais() {
      setLoadingPersonais(true);
      await UserService.criarPersonaisMock();
      const listaPersonais = await UserService.getPersonais();
      setPersonais(listaPersonais);
      setLoadingPersonais(false);
    }
    loadPersonais();
  }, []);

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, informe seu nome');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Erro', 'Por favor, informe um email válido');
      return;
    }

    if (!password || password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (!userType) {
      Alert.alert('Erro', 'Selecione o tipo de usuário');
      return;
    }

    if (userType === 'aluno' && !selectedPersonalId) {
      Alert.alert('Erro', 'Selecione um personal trainer para te acompanhar');
      return;
    }

    try {
      setLoading(true);
      await signUp(name, email, password, userType, selectedPersonalId);
      
      Alert.alert(
        'Sucesso!',
        `Conta criada com sucesso! Bem-vindo, ${name}.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MainTabs'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Preencha seus dados para começar</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome completo"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.showPasswordButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.showPasswordText}>
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Digite a senha novamente"
                  placeholderTextColor="#94a3b8"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.showPasswordButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Text style={styles.showPasswordText}>
                    {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de Usuário</Text>
              <View style={styles.userTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.userTypeOption,
                    userType === 'personal' && styles.userTypeOptionActive,
                  ]}
                  onPress={() => setUserType('personal')}
                >
                  <View style={styles.userTypeIcon}>
                    <Icon name="fitness-center" size={24} color={userType === 'personal' ? '#2563eb' : '#6b7280'} />
                  </View>
                  <Text style={[
                    styles.userTypeTitle,
                    userType === 'personal' && styles.userTypeTitleActive
                  ]}>
                    Personal Trainer
                  </Text>
                  <Text style={styles.userTypeDescription}>
                    Criar e gerenciar treinos
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.userTypeOption,
                    userType === 'aluno' && styles.userTypeOptionActive,
                  ]}
                  onPress={() => setUserType('aluno')}
                >
                  <View style={styles.userTypeIcon}>
                    <Icon name="directions-run" size={24} color={userType === 'aluno' ? '#2563eb' : '#6b7280'} />
                  </View>
                  <Text style={[
                    styles.userTypeTitle,
                    userType === 'aluno' && styles.userTypeTitleActive
                  ]}>
                    Aluno
                  </Text>
                  <Text style={styles.userTypeDescription}>
                    Seguir e executar treinos
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {userType === 'aluno' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Seu Personal Trainer</Text>
                <Text style={styles.hintText}>
                  Escolha o profissional que vai acompanhar seus treinos
                </Text>
                
                {loadingPersonais ? (
                  <ActivityIndicator size="small" color="#2563eb" style={styles.personalLoader} />
                ) : (
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.personalScroll}
                  >
                    {personais.map((personal) => (
                      <TouchableOpacity
                        key={personal.id}
                        style={[
                          styles.personalCard,
                          selectedPersonalId === personal.id && styles.personalCardActive
                        ]}
                        onPress={() => setSelectedPersonalId(personal.id)}
                      >
                        <View style={[
                          styles.personalAvatar,
                          { backgroundColor: selectedPersonalId === personal.id ? '#2563eb' : '#e5e7eb' }
                        ]}>
                          <Text style={[
                            styles.personalAvatarText,
                            { color: selectedPersonalId === personal.id ? '#ffffff' : '#6b7280' }
                          ]}>
                            {personal.name.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <Text style={[
                          styles.personalName,
                          selectedPersonalId === personal.id && styles.personalNameActive
                        ]}>
                          {personal.name.split(' ')[0]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            )}

            <TouchableOpacity
              style={[styles.registerButton, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.registerButtonText}>Criar Conta</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Já tem uma conta?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}> Faça login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  formContainer: {
    flex: 1,
    padding: 24,
    paddingTop: 0,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f8fafc',
    color: '#1f2937',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 80,
  },
  showPasswordButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  showPasswordText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  userTypeOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  userTypeOptionActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  userTypeIcon: {
    marginBottom: 8,
  },
  userTypeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 4,
    textAlign: 'center',
  },
  userTypeTitleActive: {
    color: '#2563eb',
  },
  userTypeDescription: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  personalLoader: {
    marginVertical: 20,
  },
  personalScroll: {
    marginTop: 8,
  },
  personalCard: {
    alignItems: 'center',
    marginRight: 20,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  personalCardActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  personalAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  personalAvatarText: {
    fontSize: 24,
    fontWeight: '600',
  },
  personalName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  personalNameActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
  },
  loginLink: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
});