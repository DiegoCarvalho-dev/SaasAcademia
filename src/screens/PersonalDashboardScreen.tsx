import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import UserService from '../services/userService';

type Aluno = {
  id: string;
  nome: string;
  status: 'ativo' | 'sem_treino';
  ultimoTreino?: string;
  progresso?: number;
};

export default function PersonalDashboardScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [personalData, setPersonalData] = useState<{
    nome: string;
    totalAlunos: number;
    treinosAtivos: number;
    treinosSemana: number;
    alunosSemTreino: number;
    alunos: Aluno[];
  } | null>(null);

  useEffect(() => {
    async function loadPersonalData() {
      if (!user?.id) return;
      
      const alunos = await UserService.getAlunosByPersonal(user.id);
      
      const alunosFormatados: Aluno[] = alunos.map(a => ({
        id: a.id,
        nome: a.name,
        status: a.status || 'sem_treino',
        ultimoTreino: a.ultimoTreino,
        progresso: a.progresso || 0,
      }));

      const ativos = alunosFormatados.filter(a => a.status === 'ativo').length;
      const semTreino = alunosFormatados.filter(a => a.status === 'sem_treino').length;
      
      setPersonalData({
        nome: user.name,
        totalAlunos: alunos.length,
        treinosAtivos: ativos,
        treinosSemana: 0,
        alunosSemTreino: semTreino,
        alunos: alunosFormatados,
      });
      setLoading(false);
    }

    loadPersonalData();
  }, [user]);

  const handleCriarTreino = (alunoId: string, alunoNome: string) => {
    alert(`Criar treino para ${alunoNome}`);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ativo':
        return {
          label: 'Treino ativo',
          bgColor: '#dcfce7',
          textColor: '#166534',
          icon: 'check-circle' as const,
        };
      case 'sem_treino':
        return {
          label: 'Sem treino',
          bgColor: '#fee2e2',
          textColor: '#991b1b',
          icon: 'warning' as const,
        };
      default:
        return {
          label: status,
          bgColor: '#f3f4f6',
          textColor: '#4b5563',
          icon: 'info' as const,
        };
    }
  };

  const renderAlunoCard = ({ item }: { item: Aluno }) => {
    const statusConfig = getStatusConfig(item.status);

    return (
      <View style={styles.alunoCard}>
        <View style={styles.alunoHeader}>
          <View style={styles.alunoInfo}>
            <View style={styles.alunoAvatar}>
              <Text style={styles.alunoAvatarText}>
                {item.nome.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.alunoNome}>{item.nome}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
                <Icon name={statusConfig.icon} size={12} color={statusConfig.textColor} />
                <Text style={[styles.statusText, { color: statusConfig.textColor }]}>
                  {statusConfig.label}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.criarTreinoButton}
            onPress={() => handleCriarTreino(item.id, item.nome)}
          >
            <Icon name="add" size={18} color="#ffffff" />
            <Text style={styles.criarTreinoText}>Criar</Text>
          </TouchableOpacity>
        </View>

        {item.progresso !== undefined && item.progresso > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progresso</Text>
              <Text style={styles.progressValue}>{item.progresso}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${item.progresso}%` }]} 
              />
            </View>
            {item.ultimoTreino && (
              <View style={styles.ultimoTreino}>
                <Icon name="access-time" size={12} color="#6b7280" />
                <Text style={styles.ultimoTreinoText}>Último treino: {item.ultimoTreino}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIconContainer}>
        <Icon name="people-outline" size={48} color="#94a3b8" />
      </View>
      <Text style={styles.emptyStateTitle}>Nenhum aluno cadastrado</Text>
      <Text style={styles.emptyStateText}>
        Adicione seu primeiro aluno para começar a criar treinos personalizados.
      </Text>
      <TouchableOpacity style={styles.emptyStateButton}>
        <Icon name="person-add" size={20} color="#ffffff" />
        <Text style={styles.emptyStateButtonText}>Cadastrar Aluno</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Carregando dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!personalData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={48} color="#dc2626" />
          <Text style={styles.errorText}>Erro ao carregar dados</Text>
          <TouchableOpacity style={styles.retryButton}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {personalData.nome.split(' ')[0]}</Text>
            <View style={styles.userTypeContainer}>
              <Text style={styles.userType}>Personal Trainer</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile' as never)}
          >
            <View style={styles.profileInitial}>
              <Text style={styles.profileInitialText}>
                {personalData.nome.charAt(0).toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Visão Geral</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={[styles.statIconBg, { backgroundColor: '#dbeafe' }]}>
                  <Icon name="people" size={22} color="#2563eb" />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{personalData.totalAlunos}</Text>
                  <Text style={styles.statLabel}>Total de alunos</Text>
                </View>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIconBg, { backgroundColor: '#dcfce7' }]}>
                  <Icon name="fitness-center" size={22} color="#166534" />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{personalData.treinosAtivos}</Text>
                  <Text style={styles.statLabel}>Treinos ativos</Text>
                </View>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={[styles.statIconBg, { backgroundColor: '#fef3c7' }]}>
                  <Icon name="event" size={22} color="#d97706" />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{personalData.treinosSemana}</Text>
                  <Text style={styles.statLabel}>Treinos na semana</Text>
                </View>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIconBg, { backgroundColor: '#fee2e2' }]}>
                  <Icon name="warning" size={22} color="#dc2626" />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{personalData.alunosSemTreino}</Text>
                  <Text style={styles.statLabel}>Alunos sem treino</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.primaryActionContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => alert('Funcionalidade em desenvolvimento')}
          >
            <Icon name="add-circle-outline" size={24} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Criar novo treino</Text>
          </TouchableOpacity>
          <Text style={styles.primaryButtonHint}>
            Selecione um aluno ou crie um treino do zero
          </Text>
        </View>

        <View style={styles.alunosSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Icon name="people-outline" size={20} color="#2563eb" />
              <Text style={styles.sectionTitleText}>Meus Alunos</Text>
            </View>
            {personalData.alunos.length > 0 && (
              <Text style={styles.sectionCount}>{personalData.alunos.length}</Text>
            )}
          </View>

          {personalData.alunos.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={personalData.alunos}
              renderItem={renderAlunoCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>

        {personalData.alunosSemTreino > 0 && (
          <View style={styles.tipContainer}>
            <View style={styles.tipContent}>
              <Icon name="lightbulb-outline" size={20} color="#d97706" />
              <Text style={styles.tipText}>
                {personalData.alunosSemTreino === 1 
                  ? '1 aluno está sem treino. Crie um treino para ele agora!'
                  : `${personalData.alunosSemTreino} alunos estão sem treino. Crie treinos para eles agora!`}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.footerSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#dc2626',
    marginTop: 16,
    marginBottom: 24,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  userTypeContainer: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  userType: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitialText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '700',
  },
  statsContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    marginHorizontal: -6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  primaryActionContainer: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  primaryButtonHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 12,
  },
  alunosSection: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
    },
  sectionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyStateContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
  alunoCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  alunoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alunoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alunoAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alunoAvatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  alunoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  criarTreinoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  criarTreinoText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  progressContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 3,
  },
  ultimoTreino: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ultimoTreinoText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  separator: {
    height: 12,
  },
  tipContainer: {
    backgroundColor: '#fef3c7',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#92400e',
    marginLeft: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  footerSpace: {
    height: 20,
  },
});