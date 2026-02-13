import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import TreinoService from '../services/treinoService';

type RouteParams = {
  alunoId: string;
  alunoNome: string;
};

type ExercicioForm = {
  id: string;
  nome: string;
  series: string;
  repeticoes: string;
  descanso: string;
  observacao: string;
};

export default function CreateWorkoutScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { alunoId, alunoNome } = route.params as RouteParams;

  const [loading, setLoading] = useState(false);
  const [loadingDias, setLoadingDias] = useState(true);
  const [nomeTreino, setNomeTreino] = useState('');
  const [diaSemana, setDiaSemana] = useState('');
  const [duracao, setDuracao] = useState('60');
  const [nivel, setNivel] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Intermediário');
  const [notas, setNotas] = useState('');
  const [diasDisponiveis, setDiasDisponiveis] = useState<string[]>([]);
  const [exercicios, setExercicios] = useState<ExercicioForm[]>([
    {
      id: String(Date.now()),
      nome: '',
      series: '3',
      repeticoes: '12',
      descanso: '60',
      observacao: '',
    },
  ]);

  const todosDias = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo',
  ];

  useEffect(() => {
    carregarDiasDisponiveis();
  }, []);

  const carregarDiasDisponiveis = async () => {
    try {
      const treinosAluno = await TreinoService.getTreinosByAluno(alunoId);
      const diasOcupados = treinosAluno.map(t => t.diaSemana);
      const disponiveis = todosDias.filter(dia => !diasOcupados.includes(dia));
      setDiasDisponiveis(disponiveis);
    } catch (error) {
      console.error('Erro ao carregar dias disponíveis:', error);
      setDiasDisponiveis(todosDias);
    } finally {
      setLoadingDias(false);
    }
  };

  const adicionarExercicio = () => {
    setExercicios([
      ...exercicios,
      {
        id: String(Date.now() + Math.random()),
        nome: '',
        series: '3',
        repeticoes: '12',
        descanso: '60',
        observacao: '',
      },
    ]);
  };

  const removerExercicio = (id: string) => {
    if (exercicios.length > 1) {
      setExercicios(exercicios.filter(e => e.id !== id));
    }
  };

  const atualizarExercicio = (id: string, campo: keyof ExercicioForm, valor: string) => {
    setExercicios(exercicios.map(e => 
      e.id === id ? { ...e, [campo]: valor } : e
    ));
  };

  const handleCriarTreino = async () => {
    if (!nomeTreino.trim()) {
      Alert.alert('Erro', 'Dê um nome para o treino');
      return;
    }

    if (!diaSemana) {
      Alert.alert('Erro', 'Selecione o dia da semana');
      return;
    }

    const exerciciosInvalidos = exercicios.some(e => !e.nome.trim());
    if (exerciciosInvalidos) {
      Alert.alert('Erro', 'Preencha o nome de todos os exercícios');
      return;
    }

    if (!user?.id) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    setLoading(true);

    try {
      await TreinoService.criarTreino({
        alunoId,
        personalId: user.id,
        nome: nomeTreino,
        dataCriacao: new Date().toISOString(),
        dataAtribuida: new Date().toLocaleDateString('pt-BR'),
        diaSemana,
        duracao: `${duracao} min`,
        nivel,
        notasPersonal: notas || undefined,
        exercicios: exercicios.map(e => ({
          id: String(Date.now() + Math.random()),
          nome: e.nome,
          series: Number(e.series),
          repeticoes: `${e.repeticoes}`,
          descanso: `${e.descanso}s`,
          observacao: e.observacao || undefined,
        })),
      });

      Alert.alert('Sucesso', `Treino criado para ${alunoNome}`, [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível criar o treino');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Novo Treino</Text>
            <Text style={styles.headerSubtitle}>para {alunoNome}</Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações do Treino</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome do Treino</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Hipertrofia - Costas"
                placeholderTextColor="#94a3b8"
                value={nomeTreino}
                onChangeText={setNomeTreino}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dia da Semana</Text>
              {loadingDias ? (
                <ActivityIndicator size="small" color="#2563eb" style={styles.diasLoader} />
              ) : diasDisponiveis.length === 0 ? (
                <View style={styles.semDiasContainer}>
                  <Icon name="info-outline" size={20} color="#f59e0b" />
                  <Text style={styles.semDiasText}>
                    Este aluno já tem treinos em todos os dias da semana
                  </Text>
                </View>
              ) : (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.diasScroll}
                >
                  {diasDisponiveis.map((dia) => (
                    <TouchableOpacity
                      key={dia}
                      style={[
                        styles.diaButton,
                        diaSemana === dia && styles.diaButtonActive
                      ]}
                      onPress={() => setDiaSemana(dia)}
                    >
                      <Text style={[
                        styles.diaButtonText,
                        diaSemana === dia && styles.diaButtonTextActive
                      ]}>
                        {dia}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.label}>Duração (min)</Text>
                <TextInput
                  style={styles.input}
                  value={duracao}
                  onChangeText={setDuracao}
                  keyboardType="numeric"
                  placeholder="60"
                  placeholderTextColor="#94a3b8"
                  maxLength={3}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nível</Text>
              <View style={styles.nivelContainer}>
                {['Iniciante', 'Intermediário', 'Avançado'].map((n) => (
                  <TouchableOpacity
                    key={n}
                    style={[
                      styles.nivelButton,
                      nivel === n && styles.nivelButtonActive
                    ]}
                    onPress={() => setNivel(n as any)}
                  >
                    <Text style={[
                      styles.nivelButtonText,
                      nivel === n && styles.nivelButtonTextActive
                    ]}>
                      {n}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Exercícios</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={adicionarExercicio}
              >
                <Icon name="add" size={20} color="#ffffff" />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>

            {exercicios.map((exercicio, index) => (
              <View key={exercicio.id} style={styles.exercicioCard}>
                <View style={styles.exercicioHeader}>
                  <Text style={styles.exercicioNumero}>
                    Exercício {index + 1}
                  </Text>
                  {exercicios.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removerExercicio(exercicio.id)}
                    >
                      <Icon name="delete-outline" size={20} color="#dc2626" />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nome do Exercício</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Supino Reto"
                    placeholderTextColor="#94a3b8"
                    value={exercicio.nome}
                    onChangeText={(text) => 
                      atualizarExercicio(exercicio.id, 'nome', text)
                    }
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                    <Text style={styles.label}>Séries</Text>
                    <TextInput
                      style={styles.input}
                      value={exercicio.series}
                      onChangeText={(text) => 
                        atualizarExercicio(exercicio.id, 'series', text)
                      }
                      keyboardType="numeric"
                      placeholder="3"
                      placeholderTextColor="#94a3b8"
                      maxLength={2}
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                    <Text style={styles.label}>Repetições</Text>
                    <TextInput
                      style={styles.input}
                      value={exercicio.repeticoes}
                      onChangeText={(text) => 
                        atualizarExercicio(exercicio.id, 'repeticoes', text)
                      }
                      keyboardType="numeric"
                      placeholder="12"
                      placeholderTextColor="#94a3b8"
                      maxLength={3}
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Descanso (s)</Text>
                    <TextInput
                      style={styles.input}
                      value={exercicio.descanso}
                      onChangeText={(text) => 
                        atualizarExercicio(exercicio.id, 'descanso', text)
                      }
                      keyboardType="numeric"
                      placeholder="60"
                      placeholderTextColor="#94a3b8"
                      maxLength={3}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Observação (opcional)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Ex: Controlar descida, cotovelo próximo ao corpo..."
                    placeholderTextColor="#94a3b8"
                    value={exercicio.observacao}
                    onChangeText={(text) => 
                      atualizarExercicio(exercicio.id, 'observacao', text)
                    }
                    multiline
                    numberOfLines={2}
                  />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas do Personal</Text>
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Adicione observações gerais sobre o treino..."
                placeholderTextColor="#94a3b8"
                value={notas}
                onChangeText={setNotas}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.createButton, loading && styles.buttonDisabled]}
            onPress={handleCriarTreino}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Icon name="check-circle" size={24} color="#ffffff" />
                <Text style={styles.createButtonText}>Criar Treino</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  form: {
    padding: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#f8fafc',
    color: '#1f2937',
  },
  textArea: {
    textAlignVertical: 'top',
    paddingTop: 12,
    minHeight: 80,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  diasLoader: {
    marginVertical: 10,
  },
  semDiasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  semDiasText: {
    flex: 1,
    fontSize: 14,
    color: '#92400e',
    marginLeft: 12,
  },
  diasScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  diaButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  diaButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  diaButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  diaButtonTextActive: {
    color: '#ffffff',
  },
  nivelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  nivelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  nivelButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  nivelButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  nivelButtonTextActive: {
    color: '#ffffff',
  },
  exercicioCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  exercicioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exercicioNumero: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
});