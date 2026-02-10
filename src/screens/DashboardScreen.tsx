import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  // Dados fictícios
  const userData = {
    name: 'Carlos Silva',
    type: 'Aluno',
    progress: 75,
  };

  const stats = [
    { label: 'Treinos Concluídos', value: '12' },
    { label: 'Dias Consecutivos', value: '7' },
    { label: 'Peso Levantado', value: '1.2t' },
    { label: 'Calorias', value: '4.5k' },
  ];

  const workouts = [
    { id: 1, name: 'Peito e Tríceps', time: '60 min', completed: true },
    { id: 2, name: 'Costas e Bíceps', time: '60 min', completed: false },
    { id: 3, name: 'Pernas e Ombros', time: '75 min', completed: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {userData.name}!</Text>
            <Text style={styles.userType}>{userData.type}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileInitial}>
              {userData.name.charAt(0)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Progress Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Progresso do Mês</Text>
            <Text style={styles.progressPercent}>{userData.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${userData.progress}%` }]} 
            />
          </View>
        </View>

        {/* Next Workout */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximo Treino</Text>
          <View style={styles.nextWorkoutCard}>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutName}>Costas e Bíceps</Text>
              <Text style={styles.workoutTime}>⏱ 60 minutos</Text>
            </View>
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>Iniciar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Workout List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meus Treinos</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          {workouts.map((workout) => (
            <View key={workout.id} style={styles.workoutItem}>
              <View style={styles.workoutItemLeft}>
                <View style={[
                  styles.workoutStatus,
                  workout.completed && styles.workoutStatusCompleted
                ]}>
                  {workout.completed ? '✓' : '●'}
                </View>
                <View>
                  <Text style={styles.workoutItemName}>{workout.name}</Text>
                  <Text style={styles.workoutItemTime}>{workout.time}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.workoutActionButton}>
                <Text style={styles.workoutActionText}>
                  {workout.completed ? 'Refazer' : 'Iniciar'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d3436',
  },
  userType: {
    fontSize: 16,
    color: '#1a73e8',
    fontWeight: '600',
    marginTop: 4,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a73e8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    margin: '1%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#636e72',
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
  },
  seeAllText: {
    fontSize: 14,
    color: '#1a73e8',
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a73e8',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1a73e8',
    borderRadius: 4,
  },
  nextWorkoutCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8f0fe',
    padding: 20,
    borderRadius: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 4,
  },
  workoutTime: {
    fontSize: 14,
    color: '#636e72',
  },
  startButton: {
    backgroundColor: '#1a73e8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  workoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  workoutItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workoutStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f1f3f4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  workoutStatusCompleted: {
    backgroundColor: '#d4edda',
  },
  workoutItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d3436',
    marginBottom: 2,
  },
  workoutItemTime: {
    fontSize: 14,
    color: '#636e72',
  },
  workoutActionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  workoutActionText: {
    fontSize: 14,
    color: '#1a73e8',
    fontWeight: '500',
  },
});