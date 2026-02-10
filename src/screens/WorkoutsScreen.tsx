import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Exercise = {
  name: string;
  sets: number;
  reps: string;
  rest: string;
};

export default function WorkoutDetailScreen() {
  const workout = {
    name: 'Peito e Tríceps',
    duration: '60 minutos',
    difficulty: 'Intermediário',
    exercises: [
      { name: 'Supino Reto', sets: 4, reps: '10-12', rest: '60s' },
      { name: 'Supino Inclinado', sets: 3, reps: '10-12', rest: '60s' },
      { name: 'Crucifixo', sets: 3, reps: '12-15', rest: '45s' },
      { name: 'Tríceps Corda', sets: 4, reps: '12-15', rest: '45s' },
      { name: 'Tríceps Francês', sets: 3, reps: '10-12', rest: '60s' },
    ] as Exercise[],
  };

  const renderExercise = (exercise: Exercise, index: number) => (
    <View key={index} style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <View style={styles.exerciseSets}>
          <Text style={styles.setsText}>{exercise.sets} séries</Text>
        </View>
      </View>
      
      <View style={styles.exerciseDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Repetições</Text>
          <Text style={styles.detailValue}>{exercise.reps}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Descanso</Text>
          <Text style={styles.detailValue}>{exercise.rest}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Carga</Text>
          <View style={styles.weightInput}>
            <Text style={styles.weightPlaceholder}>-- kg</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.exerciseActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Notas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.primaryAction]}>
          <Text style={styles.primaryActionText}>Concluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <View style={styles.workoutMeta}>
            <Text style={styles.metaItem}>⏱ {workout.duration}</Text>
            <Text style={styles.metaItem}>⚡ {workout.difficulty}</Text>
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Iniciar Treino</Text>
        </TouchableOpacity>

        {/* Exercises List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercícios</Text>
          
          {workout.exercises.map((exercise, index) => 
            renderExercise(exercise, index)
          )}
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notas do Personal</Text>
          <View style={styles.notesCard}>
            <Text style={styles.notesText}>
              • Mantenha as costas bem apoiadas no banco
              {'\n'}• Controle a descida do peso
              {'\n'}• Expire na fase concêntrica do movimento
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  workoutName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 12,
  },
  workoutMeta: {
    flexDirection: 'row',
  },
  metaItem: {
    fontSize: 16,
    color: '#636e72',
    marginRight: 20,
  },
  startButton: {
    backgroundColor: '#1a73e8',
    margin: 20,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 16,
  },
  exerciseCard: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
    flex: 1,
  },
  exerciseSets: {
    backgroundColor: '#e8f0fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  setsText: {
    color: '#1a73e8',
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
    color: '#636e72',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
  },
  weightInput: {
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  weightPlaceholder: {
    color: '#95a5a6',
    fontSize: 14,
  },
  exerciseActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    backgroundColor: '#f8f9fa',
  },
  actionButtonText: {
    color: '#636e72',
    fontWeight: '500',
  },
  primaryAction: {
    backgroundColor: '#1a73e8',
    borderColor: '#1a73e8',
  },
  primaryActionText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  notesCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1a73e8',
  },
  notesText: {
    fontSize: 14,
    color: '#2d3436',
    lineHeight: 20,
  },
});