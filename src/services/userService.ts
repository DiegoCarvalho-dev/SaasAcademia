import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  type: 'aluno' | 'personal';
  personalId?: string;
  status?: 'ativo' | 'sem_treino';
  ultimoTreino?: string;
  progresso?: number;
  createdAt: string;
};

class UserService {
  async getAllUsers(): Promise<User[]> {
    const usersString = await AsyncStorage.getItem('@GymApp:users');
    return usersString ? JSON.parse(usersString) : [];
  }

  async getPersonais(): Promise<User[]> {
    const users = await this.getAllUsers();
    return users.filter(user => user.type === 'personal');
  }

  async getAlunosByPersonal(personalId: string): Promise<User[]> {
    const users = await this.getAllUsers();
    return users.filter(user => 
      user.type === 'aluno' && user.personalId === personalId
    );
  }

  async vincularAluno(alunoId: string, personalId: string): Promise<void> {
    const users = await this.getAllUsers();
    const alunoIndex = users.findIndex(u => u.id === alunoId);
    
    if (alunoIndex !== -1) {
      users[alunoIndex].personalId = personalId;
      await AsyncStorage.setItem('@GymApp:users', JSON.stringify(users));
      
      const currentUserString = await AsyncStorage.getItem('@GymApp:user');
      if (currentUserString) {
        const currentUser = JSON.parse(currentUserString);
        if (currentUser.id === alunoId) {
          currentUser.personalId = personalId;
          await AsyncStorage.setItem('@GymApp:user', JSON.stringify(currentUser));
        }
      }
    }
  }

  async getPersonalById(personalId: string): Promise<User | null> {
    const users = await this.getAllUsers();
    return users.find(u => u.id === personalId && u.type === 'personal') || null;
  }

  async criarPersonaisMock() {
    const users = await this.getAllUsers();
    const personaisExistentes = users.filter(u => u.type === 'personal');
    if (personaisExistentes.length > 0) return;

    const mockPersonais = [
      {
        id: 'personal-1',
        name: 'Carlos Personal',
        email: 'carlos@email.com',
        password: '123456',
        type: 'personal' as const,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'personal-2',
        name: 'Ana Trainer',
        email: 'ana@email.com',
        password: '123456',
        type: 'personal' as const,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'personal-3',
        name: 'Marcos Fitness',
        email: 'marcos@email.com',
        password: '123456',
        type: 'personal' as const,
        createdAt: new Date().toISOString(),
      },
    ];

    users.push(...mockPersonais);
    await AsyncStorage.setItem('@GymApp:users', JSON.stringify(users));
  }
}

export default new UserService();