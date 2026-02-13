import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import UserService from '../services/userService';
import TreinoService from '../services/treinoService';

const StatIcon = ({ type }: { type: string }) => {
  const getIcon = () => {
    if (type === 'workouts') return <Icon name="check-circle" size={18} color="#2563eb" />;
    if (type === 'streak') return <Icon name="whatshot" size={18} color="#f59e0b" />;
    if (type === 'weight') return <Icon name="fitness-center" size={18} color="#2563eb" />;
    if (type === 'calories') return <Icon name="local-fire-department" size={18} color="#dc2626" />;
    return <Icon name="bar-chart" size={18} color="#2563eb" />;
  };

  return <View style={styles.statIconContainer}>{getIcon()}</View>;
};

const ActionIcon = ({ name, color }: { name: string; color: string }) => {
  const iconColors: Record<string, string> = {
    history: '#3b82f6',
    stats: '#10b981',
    goals: '#f59e0b',
    exercises: '#8b5cf6',
  };
  
  const iconNames: Record<string, string> = {
    history: 'history',
    stats: 'show-chart',
    goals: 'flag',
    exercises: 'format-list-bulleted',
  };
  
  return (
    <View style={[styles.actionIconContainer, { backgroundColor: `${color}15` }]}>
      <Icon name={iconNames[name]} size={22} color={iconColors[name] || '#2563eb'} />
    </View>
  );
};

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [personalName, setPersonalName] = useState('');
  const [treinos, setTreinos] = useState<any[]>([]);
  const [userData, setUserData] = useState<{
    name: string;
    type: 'aluno' | 'personal';
    stats: {
      completedWorkouts: number;
      currentStreak: number;
      totalWeight: number;
      caloriesBurned: number;
    };
    nextWorkout: {
      name: string;
      time: string;
      day: string;
    } | null;
    monthlyProgress: number;
  } | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      carregarDados();
    }, [user])
  );

  const carregarDados = async () => {
    if (!user) return;

    try {
      if (user.personalId) {
        const personal = await UserService.getPersonalById(user.personalId);
        if (personal) {
          setPersonalName(personal.name);
        }
      }

      const treinosAluno = await TreinoService.getTreinosByAluno(user.id);
      setTreinos(treinosAluno);

      const treinosConcluidos = treinosAluno.filter(t => 
        t.exercicios.length > 0 && t.exercicios.every((e: any) => e.concluido)
      ).length;

      const totalPeso = treinosAluno.reduce((acc, treino) => 
        acc + treino.exercicios.reduce((sum: number, ex: any) => 
          sum + (Number(ex.carga) || 0), 0
        ), 0
      );

      const proximoTreino = treinosAluno.find(t => 
        !t.exercicios.every((e: any) => e.concluido)
      );

      let progressoMensal = 0;
      if (treinosAluno.length > 0) {
        const somaProgresso = treinosAluno.reduce((acc, treino) => {
          const progresso = treino.exercicios.length > 0
            ? (treino.exercicios.filter((e: any) => e.concluido).length / treino.exercicios.length) * 100
            : 0;
          return acc + progresso;
        }, 0);
        progressoMensal = Math.round(somaProgresso / treinosAluno.length);
      }

      setUserData({
        name: user.name,
        type: 'aluno',
        stats: {
          completedWorkouts: treinosConcluidos,
          currentStreak: 0,
          totalWeight: totalPeso,
          caloriesBurned: 0,
        },
        nextWorkout: proximoTreino ? {
          name: proximoTreino.nome,
          time: 'Hoje',
          day: proximoTreino.diaSemana,
        } : null,
        monthlyProgress: progressoMensal,
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Carregando seus dados...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Não foi possível carregar os dados</Text>
          <TouchableOpacity style={styles.retryButton} onPress={carregarDados}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const stats = [
    { key: 'workouts', label: 'Treinos Concluídos', value: userData.stats.completedWorkouts.toString() },
    { key: 'streak', label: 'Dias Consecutivos', value: userData.stats.currentStreak.toString() },
    { key: 'weight', label: 'Peso Total', value: userData.stats.totalWeight > 0 ? `${userData.stats.totalWeight} kg` : '0 kg' },
    { key: 'calories', label: 'Calorias Queimadas', value: userData.stats.caloriesBurned > 0 ? `${userData.stats.caloriesBurned} kcal` : '0 kcal' },
  ];

  const quickActions = [
    { key: 'history', label: 'Histórico', color: '#3b82f6' },
    { key: 'stats', label: 'Estatísticas', color: '#10b981' },
    { key: 'goals', label: 'Metas', color: '#f59e0b' },
    { key: 'exercises', label: 'Exercícios', color: '#8b5cf6' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {userData.name.split(' ')[0]}</Text>
            <View style={styles.userTypeContainer}>
              <Text style={styles.userType}>Aluno</Text>
            </View>
            {user.personalId && personalName && (
              <View style={styles.personalBadge}>
                <Icon name="fitness-center" size={14} color="#6b7280" />
                <Text style={styles.personalBadgeText}>Personal: {personalName}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile' as never)}
          >
            <View style={styles.profileInitial}>
              <Text style={styles.profileInitialText}>
                {userData.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Seu Progresso</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat) => (
              <View key={stat.key} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <StatIcon type={stat.key} />
                  <Text style={styles.statValue}>{stat.value}</Text>
                </View>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Progresso do Mês</Text>
            <Text style={styles.progressPercent}>{userData.monthlyProgress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${userData.monthlyProgress}%` }]} />
          </View>
          <Text style={styles.progressHint}>
            {userData.monthlyProgress === 0 
              ? 'Comece seus treinos para ver o progresso' 
              : 'Continue assim! Ótimo progresso.'}
          </Text>
        </View>

        {userData.nextWorkout ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Próximo Treino</Text>
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeText}>{userData.nextWorkout.day}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.nextWorkoutCard}
              onPress={() => {
                const treino = treinos.find(t => t.nome === userData.nextWorkout?.name);
                if (treino) {
                  // @ts-ignore
                  navigation.navigate('WorkoutDetail', { treinoId: treino.id });
                }
              }}
            >
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutName}>{userData.nextWorkout.name}</Text>
                <View style={styles.workoutMeta}>
                  <View style={styles.timeBadge}>
                    <Icon name="access-time" size={12} color="#166534" />
                    <Text style={styles.timeBadgeText}>{userData.nextWorkout.time}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.startButton}
                onPress={() => {
                  const treino = treinos.find(t => t.nome === userData.nextWorkout?.name);
                  if (treino) {
                    // @ts-ignore
                    navigation.navigate('WorkoutDetail', { treinoId: treino.id });
                  }
                }}
              >
                <Text style={styles.startButtonText}>Iniciar</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seus Treinos</Text>
            <View style={styles.emptyStateCard}>
              <View style={styles.emptyStateIconContainer}>
                <Icon name="fitness-center" size={32} color="#6b7280" />
              </View>
              <Text style={styles.emptyStateTitle}>Nenhum treino agendado</Text>
              <Text style={styles.emptyStateText}>
                Seu personal ainda não criou um treino para você.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity key={action.key} style={styles.actionButton}>
                <ActionIcon name={action.key} color={action.color} />
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
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
    padding: 24,
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
    textAlign: 'center',
    marginBottom: 16,
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
    paddingBottom: 10,
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
    marginBottom: 8,
  },
  userType: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
  },
  personalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  personalBadgeText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
    marginLeft: 6,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  statCard: {
    width: '50%',
    padding: 6,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statIconContainer: {
    marginRight: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  section: {
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
    marginBottom: 16,
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  progressHint: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  dayBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dayBadgeText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },
  nextWorkoutCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeBadgeText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '600',
    marginLeft: 4,
  },
  startButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyStateCard: {
    alignItems: 'center',
    padding: 28,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  emptyStateIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f3f4f6',
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
    fontWeight: '500',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  actionButton: {
    width: '25%',
    alignItems: 'center',
    padding: 8,
  },
  actionIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: '#4b5563',
    textAlign: 'center',
    fontWeight: '600',
  },
  footerSpace: {
    height: 10,
  },
});