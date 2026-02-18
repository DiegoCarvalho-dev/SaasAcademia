import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleDarkMode, colors } = useTheme();
  
  const [notifications, setNotifications] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);

 
  useEffect(() => {
    carregarFotoSalva();
  }, []);

  const carregarFotoSalva = async () => {
    try {
      const fotoSalva = await AsyncStorage.getItem('@GymApp:profileImage');
      if (fotoSalva) {
        setProfileImage(fotoSalva);
      }
    } catch (error) {
      console.error('Erro ao carregar foto:', error);
    }
  };

  const formatarMemberSince = () => {
    if (!user?.createdAt) return 'Jan 2024';
    
    try {
      const data = new Date(user.createdAt);
      if (Object.prototype.toString.call(data) !== '[object Date]' || isNaN(data.getTime())) {
        return 'Jan 2024';
      }
      
      return data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    } catch (error) {
      return 'Jan 2024';
    }
  };

  const userData = {
    name: user?.name || 'Usuário',
    email: user?.email || 'email@exemplo.com',
    type: user?.type === 'aluno' ? 'Aluno' : 'Personal Trainer',
    memberSince: formatarMemberSince(),
    height: '175 cm', // Pode ser adicionado no cadastro futuramente
    weight: '78 kg',   // Pode ser adicionado no cadastro futuramente
    goal: 'Hipertrofia',
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para adicionar uma foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      try {
        await AsyncStorage.setItem('@GymApp:profileImage', result.assets[0].uri);
        Alert.alert('Sucesso', 'Foto salva com sucesso!');
      } catch (error) {
        console.error('Erro ao salvar imagem:', error);
        Alert.alert('Erro', 'Não foi possível salvar a foto');
      }
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            // @ts-ignore
            navigation.navigate('Welcome');
          },
        },
      ]
    );
  };

  const menuItems = [
    { 
      icon: 'bar-chart', 
      label: 'Estatísticas', 
      color: '#3b82f6',
      onPress: () => Alert.alert('Em breve', 'Estatísticas em desenvolvimento') 
    },
    { 
      icon: 'fitness-center', 
      label: user?.type === 'aluno' ? 'Meu Personal' : 'Meus Alunos', 
      color: '#10b981',
      onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento') 
    },
    { 
      icon: 'credit-card', 
      label: 'Assinatura', 
      color: '#f59e0b',
      onPress: () => Alert.alert('Em breve', 'Assinatura em desenvolvimento') 
    },
    { 
      icon: 'help', 
      label: 'Ajuda', 
      color: '#8b5cf6',
      onPress: () => Alert.alert('Em breve', 'Central de ajuda em desenvolvimento') 
    },
    { 
      icon: 'description', 
      label: 'Termos de Uso', 
      color: '#6b7280',
      onPress: () => Alert.alert('Termos de Uso', 'Aceito os termos e condições...') 
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={handlePickImage}
            activeOpacity={0.8}
          >
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userData.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.editAvatarBadge}>
              <Icon name="camera-alt" size={16} color="#ffffff" />
            </View>
          </TouchableOpacity>
          
          <Text style={[styles.userName, { color: colors.text }]}>{userData.name}</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{userData.email}</Text>
          
          <View style={[styles.userTypeBadge, 
            { backgroundColor: user?.type === 'aluno' ? '#eff6ff' : '#f0fdf4' }
          ]}>
            <Icon 
              name={user?.type === 'aluno' ? 'school' : 'fitness-center'} 
              size={14} 
              color={user?.type === 'aluno' ? '#2563eb' : '#166534'} 
            />
            <Text style={[styles.userTypeText, 
              { color: user?.type === 'aluno' ? '#2563eb' : '#166534' }
            ]}>
              {userData.type}
            </Text>
          </View>
        </View>

        {/* Informações Pessoais */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Informações Pessoais</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Icon name="event" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Membro desde</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{userData.memberSince}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Icon name="straighten" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Altura</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{userData.height}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Icon name="fitness-center" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Peso</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{userData.weight}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Icon name="flag" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Objetivo</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{userData.goal}</Text>
            </View>
          </View>
        </View>

        {/* Configurações */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Configurações</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingLeft}>
              <Icon name="notifications" size={22} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Notificações</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notifications ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingLeft}>
              <Icon name="dark-mode" size={22} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Modo Escuro</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Menu */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Menu</Text>
          
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                <Icon name={item.icon as any} size={20} color={item.color} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
              <Icon name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão Sair */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Icon name="logout" size={20} color="#dc2626" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '600',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563eb',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 12,
  },
  userTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  userTypeText: {
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    marginTop: 16,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
    padding: 18,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fee2e2',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  logoutText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
});