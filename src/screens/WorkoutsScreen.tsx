import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView as SafeArea } from 'react-native-safe-area-context';

const workouts = [
  { id: '1', name: 'Peito e Tríceps', day: 'Segunda', time: '60 min', type: 'Força' },
  { id: '2', name: 'Costas e Bíceps', day: 'Terça', time: '60 min', type: 'Força' },
  { id: '3', name: 'Pernas', day: 'Quarta', time: '75 min', type: 'Força' },
  { id: '4', name: 'Ombro e Trapézio', day: 'Quinta', time: '50 min', type: 'Força' },
  { id: '5', name: 'Cardio Intervalado', day: 'Sexta', time: '45 min', type: 'Cardio' },
  { id: '6', name: 'Alongamento', day: 'Sábado', time: '30 min', type: 'Mobilidade' },
];

export default function WorkoutsScreen() {
  const renderWorkoutItem = ({ item }) => (
    <TouchableOpacity style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutName}>{item.name}</Text>
        <View style={[styles.typeBadge, item.type === 'Cardio' && styles.cardioBadge]}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
      </View>
      <View style={styles.workoutDetails}>
        <Text style={styles.detailText}>📅 {item.day}</Text>
        <Text style={styles.detailText}>⏱ {item.time}</Text>
      </View>
      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>Iniciar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeArea style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Treinos</Text>
        <Text style={styles.subtitle}>Seus planos de treino</Text>
      </View>

      <FlatList
        data={workouts}
        renderItem={renderWorkoutItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <TouchableOpacity style={styles.newWorkoutButton}>
            <Text style={styles.newWorkoutText}>+ Novo Treino</Text>
          </TouchableOpacity>
        }
      />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#636e72',
  },
  listContent: {
    padding: 16,
  },
  newWorkoutButton: {
    backgroundColor: '#1a73e8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  newWorkoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  workoutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
    flex: 1,
  },
  typeBadge: {
    backgroundColor: '#e8f0fe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardioBadge: {
    backgroundColor: '#d4edda',
  },
  typeText: {
    color: '#1a73e8',
    fontSize: 12,
    fontWeight: '600',
  },
  workoutDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailText: {
    color: '#636e72',
    marginRight: 16,
  },
  startButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#1a73e8',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#1a73e8',
    fontWeight: '600',
  },
});