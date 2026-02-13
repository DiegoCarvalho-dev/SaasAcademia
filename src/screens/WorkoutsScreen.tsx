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
import TreinoService, { Treino } from '../services/treinoService';
import UserService from '../services/userService';

export default function WorkoutsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [alunosMap, setAlunosMap] = useState<Record<string, string>>({});


  useFocusEffect(
    React.useCallback(() => {
      carregarDados();
    }, [user])
  );

  const carregarDados = async () => {
    if (!user) return;

    try {
      if (user.type === 'aluno') {
        const treinosAluno = await TreinoService.getTreinosByAluno(user.id);
        setTreinos(treinosAluno);
      } else {
        const treinosPersonal = await TreinoService.getTreinosByPersonal(user.id);
        
        const alunos = await UserService.getAllUsers();
        const map: Record<string, string> = {};
        alunos.forEach(a => {
          if (a.type === 'aluno') {
            map[a.id] = a.name;
          }
        });
        
        setAlunosMap(map);
        setTreinos(treinosPersonal);
      }
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDayColor = (dia: string, concluido: boolean) => {
    if (concluido) return '#10b981'; // Verde para concluído
    
    const cores: Record<string, string> = {
      'Segunda-feira': '#2563eb',
      'Terça-feira': '#7c3aed',
      'Quarta-feira': '#059669',
      'Quinta-feira': '#d97706',
      'Sexta-feira': '#dc2626',
      'Sábado': '#9333ea',
      'Domingo': '#b45309',
    };
    return cores[dia] || '#6b7280';
  };

  const getStatusTreino = (treino: Treino) => {
    const totalExercicios = treino.exercicios.length;
    const concluidos = treino.exercicios.filter(e => e.concluido).length;
    
    if (concluidos === 0) return 'nao_iniciado';
    if (concluidos === totalExercicios) return 'concluido';
    return 'em_andamento';
  };

  const handleVerTreino = (treinoId: string) => {
    // @ts-ignore
    navigation.navigate('WorkoutDetail', { treinoId });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Carregando treinos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {user?.type === 'aluno' ? 'Meus Treinos' : 'Treinos Criados'}
        </Text>
        {user?.type === 'personal' && (
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Dashboard' as never)}
          >
            <Icon name="add" size={24} color="#2563eb" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {treinos.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIconContainer}>
              <Icon name="fitness-center" size={48} color="#94a3b8" />
            </View>
            <Text style={styles.emptyStateTitle}>
              {user?.type === 'aluno' 
                ? 'Nenhum treino encontrado' 
                : 'Você ainda não criou treinos'}
            </Text>
            <Text style={styles.emptyStateText}>
              {user?.type === 'aluno'
                ? 'Seu personal ainda não criou nenhum treino para você.'
                : 'Crie seu primeiro treino para um aluno começar a acompanhar.'}
            </Text>
            {user?.type === 'personal' && (
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate('Dashboard' as never)}
              >
                <Icon name="add" size={20} color="#ffffff" />
                <Text style={styles.emptyStateButtonText}>Criar treino</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.treinosContainer}>
            <Text style={styles.sectionSubtitle}>
              {user?.type === 'aluno' ? 'Seus treinos da semana' : `${treinos.length} treinos criados`}
            </Text>
            
            {treinos.map((treino) => {
              const progresso = treino.exercicios.length > 0
                ? Math.round((treino.exercicios.filter(e => e.concluido).length / treino.exercicios.length) * 100)
                : 0;
              
              const statusTreino = getStatusTreino(treino);
              const diaColor = getDayColor(treino.diaSemana, statusTreino === 'concluido');

              return (
                <TouchableOpacity
                  key={treino.id}
                  style={styles.treinoCard}
                  onPress={() => handleVerTreino(treino.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.treinoHeader}>
                    <View style={[styles.dayBadge, { backgroundColor: diaColor + '15' }]}>
                      <Text style={[styles.dayBadgeText, { color: diaColor }]}>
                        {treino.diaSemana}
                      </Text>
                    </View>
                    
                    {user?.type === 'aluno' ? (
                      <View style={styles.statusContainer}>
                        {statusTreino === 'concluido' && (
                          <View style={styles.concluidoBadge}>
                            <Icon name="check-circle" size={14} color="#10b981" />
                            <Text style={styles.concluidoText}>Concluído</Text>
                          </View>
                        )}
                        {statusTreino === 'em_andamento' && (
                          <View style={styles.pendenteBadge}>
                            <Icon name="schedule" size={14} color="#f59e0b" />
                            <Text style={styles.pendenteText}>Em andamento</Text>
                          </View>
                        )}
                        {statusTreino === 'nao_iniciado' && (
                          <View style={styles.naoIniciadoBadge}>
                            <Icon name="fitness-center" size={14} color="#6b7280" />
                            <Text style={styles.naoIniciadoText}>A fazer</Text>
                          </View>
                        )}
                      </View>
                    ) : (
                      <View style={styles.alunoInfo}>
                        <Icon name="person" size={14} color="#2563eb" />
                        <Text style={styles.alunoNome}>{alunosMap[treino.alunoId] || 'Aluno'}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.treinoNome}>{treino.nome}</Text>
                  
                  <View style={styles.treinoMeta}>
                    <View style={styles.metaItem}>
                      <Icon name="fitness-center" size={14} color="#6b7280" />
                      <Text style={styles.metaText}>{treino.exercicios.length} exercícios</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Icon name="access-time" size={14} color="#6b7280" />
                      <Text style={styles.metaText}>{treino.duracao || '60 min'}</Text>
                    </View>
                  </View>

                  {user?.type === 'aluno' && (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Progresso</Text>
                        <Text style={styles.progressValue}>{progresso}%</Text>
                      </View>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progresso}%` }]} />
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  treinosContainer: {
    padding: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  treinoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  treinoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dayBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  concluidoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  concluidoText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
    marginLeft: 4,
  },
  pendenteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendenteText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
    marginLeft: 4,
  },
  naoIniciadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  naoIniciadoText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginLeft: 4,
  },
  alunoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alunoNome: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
    marginLeft: 4,
  },
  treinoNome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  treinoMeta: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 6,
  },
  progressContainer: {
    marginTop: 8,
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
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 3,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyStateIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
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
});