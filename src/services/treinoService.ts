import AsyncStorage from '@react-native-async-storage/async-storage';

export type Exercicio = {
  id: string;
  nome: string;
  series: number;
  repeticoes: string;
  descanso: string;
  observacao?: string;
  carga?: string;
  concluido?: boolean;
};

export type Treino = {
  id: string;
  alunoId: string;
  personalId: string;
  nome: string;
  dataCriacao: string;
  dataAtribuida: string;
  diaSemana: string;
  duracao: string;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  exercicios: Exercicio[];
  notasPersonal?: string;
  concluido?: boolean;
};

class TreinoService {
  async getAllTreinos(): Promise<Treino[]> {
    const treinosString = await AsyncStorage.getItem('@GymApp:treinos');
    return treinosString ? JSON.parse(treinosString) : [];
  }

  async getTreinosByAluno(alunoId: string): Promise<Treino[]> {
    const treinos = await this.getAllTreinos();
    return treinos.filter(t => t.alunoId === alunoId);
  }

  async getTreinosByPersonal(personalId: string): Promise<Treino[]> {
    const treinos = await this.getAllTreinos();
    return treinos.filter(t => t.personalId === personalId);
  }

  async criarTreino(treino: Omit<Treino, 'id'>): Promise<Treino> {
    const treinos = await this.getAllTreinos();
    
    const novoTreino = {
      ...treino,
      id: String(Date.now()),
    };

    treinos.push(novoTreino);
    await AsyncStorage.setItem('@GymApp:treinos', JSON.stringify(treinos));
    
    await this.atualizarStatusAluno(treino.alunoId, 'ativo');
    
    return novoTreino;
  }

  async atualizarStatusAluno(alunoId: string, status: 'ativo' | 'sem_treino') {
    const usersString = await AsyncStorage.getItem('@GymApp:users');
    const users = usersString ? JSON.parse(usersString) : [];
    
    const alunoIndex = users.findIndex((u: any) => u.id === alunoId);
    if (alunoIndex !== -1) {
      users[alunoIndex].status = status;
      users[alunoIndex].ultimoTreino = status === 'ativo' 
        ? new Date().toLocaleDateString('pt-BR') 
        : users[alunoIndex].ultimoTreino;
      
      await AsyncStorage.setItem('@GymApp:users', JSON.stringify(users));
    }
  }

  async concluirExercicio(treinoId: string, exercicioId: string): Promise<void> {
    const treinos = await this.getAllTreinos();
    const treinoIndex = treinos.findIndex(t => t.id === treinoId);
    
    if (treinoIndex !== -1) {
      const exercicioIndex = treinos[treinoIndex].exercicios
        .findIndex(e => e.id === exercicioId);
      
      if (exercicioIndex !== -1) {
        treinos[treinoIndex].exercicios[exercicioIndex].concluido = true;
        await AsyncStorage.setItem('@GymApp:treinos', JSON.stringify(treinos));
      }
    }
  }

  async adicionarCarga(
    treinoId: string, 
    exercicioId: string, 
    carga: string
  ): Promise<void> {
    const treinos = await this.getAllTreinos();
    const treinoIndex = treinos.findIndex(t => t.id === treinoId);
    
    if (treinoIndex !== -1) {
      const exercicioIndex = treinos[treinoIndex].exercicios
        .findIndex(e => e.id === exercicioId);
      
      if (exercicioIndex !== -1) {
        treinos[treinoIndex].exercicios[exercicioIndex].carga = carga;
        await AsyncStorage.setItem('@GymApp:treinos', JSON.stringify(treinos));
      }
    }
  }
}

export default new TreinoService();