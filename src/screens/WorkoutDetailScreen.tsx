import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import TreinoService, { Treino, Exercicio } from '../services/treinoService';

type RouteParams = {
  treinoId: string;
};

export default function WorkoutDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const params = route.params as RouteParams;
  const treinoId = params?.treinoId;
  
  const [treino, setTreino] = useState<Treino | null>(null);
  const [loading, setLoading] = useState(true);
  const [cargaInput, setCargaInput] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (treinoId) {
      carregarTreino();
    }
  }, [treinoId]);

  const carregarTreino = async () => {
    try {
      const treinos = await TreinoService.getAllTreinos();
      const treinoEncontrado = treinos.find(t => t.id === treinoId);
      setTreino(treinoEncontrado || null);
    } catch (error) {
      console.error('Erro ao carregar treino:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConcluirExercicio = async (exercicioId: string) => {
    if (!treino) return;
    
    try {
      await TreinoService.concluirExercicio(treino.id, exercicioId);
      await carregarTreino();
      Alert.alert('✅', 'Exercício concluído!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível concluir o exercício');
    }
  };

  const handleSalvarCarga = async (exercicioId: string) => {
    if (!treino || !cargaInput[exercicioId]) return;
    
    try {
      await TreinoService.adicionarCarga(
        treino.id, 
        exercicioId, 
        cargaInput[exercicioId]
      );
      
      await carregarTreino();
      setCargaInput(prev => ({ ...prev, [exercicioId]: '' }));
      Alert.alert('💪', 'Carga registrada!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível registrar a carga');
    }
  };

  const renderExercicio = (exercicio: Exercicio, index: number) => {
    const isConcluido = exercicio.concluido || false;
    const cargaAtual = exercicio.carga || cargaInput[exercicio.id] || '';

    return (
      <View 
        key={exercicio.id} 
        style={[styles.exerciseCard, isConcluido && styles.exerciseCardConcluido]}
      >
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseTitleContainer}>
            <Text style={styles.exerciseName}>{exercicio.nome}</Text>
            {isConcluido && (
              <View style={styles.concluidoBadge}>
                <Icon name="check-circle" size={16} color="#10b981" />
                <Text style={styles.concluidoText}>Concluído</Text>
              </View>
            )}
          </View>
          <View style={styles.exerciseSets}>
            <Text style={styles.setsText}>{exercicio.series} séries</Text>
          </View>
        </View>
        
        <View style={styles.exerciseDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Repetições</Text>
            <Text style={styles.detailValue}>{exercicio.repeticoes}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Descanso</Text>
            <Text style={styles.detailValue}>{exercicio.descanso}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Carga</Text>
            {cargaAtual ? (
              <Text style={styles.detailValue}>{cargaAtual} kg</Text>
            ) : (
              <View style={styles.weightInputContainer}>
                <TextInput
                  style={styles.weightInput}
                  placeholder="kg"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={cargaInput[exercicio.id]}
                  onChangeText={(text) => 
                    setCargaInput(prev => ({ ...prev, [exercicio.id]: text }))
                  }
                />
                <TouchableOpacity
                  style={styles.saveWeightButton}
                  onPress={() => handleSalvarCarga(exercicio.id)}
                >
                  <Icon name="check" size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {exercicio.observacao ? (
          <View style={styles.observacaoContainer}>
            <Icon name="info-outline" size={14} color="#6b7280" />
            <Text style={styles.observacaoText}>{exercicio.observacao}</Text>
          </View>
        ) : null}
        
        {!isConcluido && (
          <TouchableOpacity
            style={styles.concluirButton}
            onPress={() => handleConcluirExercicio(exercicio.id)}
          >
            <Icon name="check-circle-outline" size={20} color="#2563eb" />
            <Text style={styles.concluirButtonText}>Marcar como concluído</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Carregando treino...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!treino) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={48} color="#dc2626" />
          <Text style={styles.errorText}>Treino não encontrado</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const progresso = treino.exercicios.length > 0 
    ? Math.round((treino.exercicios.filter(e => e.concluido).length / treino.exercicios.length) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.workoutName}>{treino.nome}</Text>
            <View style={styles.workoutMeta}>
              <View style={styles.metaItem}>
                <Icon name="access-time" size={16} color="#6b7280" />
                <Text style={styles.metaText}>{treino.duracao || '60 min'}</Text>
              </View>
              <View style={styles.metaItem}>
                <Icon name="fitness-center" size={16} color="#6b7280" />
                <Text style={styles.metaText}>{treino.nivel || 'Intermediário'}</Text>
              </View>
            </View>
            <View style={styles.dayBadge}>
              <Icon name="event" size={14} color="#2563eb" />
              <Text style={styles.dayBadgeText}>{treino.diaSemana}</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressSummary}>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Exercícios</Text>
            <Text style={styles.progressValue}>
              {treino.exercicios.filter(e => e.concluido).length}/{treino.exercicios.length}
            </Text>
          </View>
          <View style={styles.progressDivider} />
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Progresso</Text>
            <Text style={styles.progressValue}>{progresso}%</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercícios</Text>
          {treino.exercicios.map((exercicio, index) => 
            renderExercicio(exercicio, index)
          )}
        </View>

        {treino.notasPersonal ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas do Personal</Text>
            <View style={styles.notesCard}>
              <Icon name="fitness-center" size={20} color="#2563eb" />
              <Text style={styles.notesText}>{treino.notasPersonal}</Text>
            </View>
          </View>
        ) : null}
        
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
  },
  backButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backIcon: {
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  workoutName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  workoutMeta: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  dayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dayBadgeText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
    marginLeft: 6,
  },
  progressSummary: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginTop: 8,
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  progressItem: {
    flex: 1,
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563eb',
  },
  progressDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 20,
  },
  exerciseCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  exerciseCardConcluido: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  exerciseTitleContainer: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 6,
  },
  concluidoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  concluidoText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
    marginLeft: 4,
  },
  exerciseSets: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  setsText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 14,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  weightInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 70,
    textAlign: 'center',
    fontSize: 14,
    backgroundColor: '#ffffff',
  },
  saveWeightButton: {
    backgroundColor: '#2563eb',
    padding: 8,
    borderRadius: 6,
    marginLeft: 6,
  },
  observacaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  observacaoText: {
    fontSize: 13,
    color: '#92400e',
    marginLeft: 8,
    flex: 1,
  },
  concluirButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 12,
    borderRadius: 8,
  },
  concluirButtonText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  notesCard: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  notesText: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
    marginLeft: 12,
    lineHeight: 20,
  },
  footerSpace: {
    height: 20,
  },
});