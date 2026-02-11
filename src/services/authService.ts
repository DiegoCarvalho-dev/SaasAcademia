import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  id: string;
  name: string;
  email: string;
  type: 'aluno' | 'personal';
  createdAt: string;
};

export type AuthResponse = {
  user: User;
  token?: string;
};

class AuthService {
  private async delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    await this.delay(800);
    
    const usersString = await AsyncStorage.getItem('@GymApp:users');
    const users = usersString ? JSON.parse(usersString) : [];
    
    const user = users.find((u: any) => u.email === email);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (user.password !== password) {
      throw new Error('Senha incorreta');
    }

    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token: 'mock-jwt-token-' + Date.now(),
    };
  }

  async register(
    name: string,
    email: string,
    password: string,
    type: 'aluno' | 'personal'
  ): Promise<AuthResponse> {
    await this.delay(1000);

    const usersString = await AsyncStorage.getItem('@GymApp:users');
    const users = usersString ? JSON.parse(usersString) : [];

    const emailExists = users.some((u: any) => u.email === email);
    if (emailExists) {
      throw new Error('Email já cadastrado');
    }

    const newUser = {
      id: String(Date.now()),
      name,
      email,
      password,
      type,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await AsyncStorage.setItem('@GymApp:users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;

    return {
      user: userWithoutPassword,
      token: 'mock-jwt-token-' + Date.now(),
    };
  }

  async logout(): Promise<void> {
    await this.delay(300);
    return;
  }

  async getCurrentUser(): Promise<User | null> {
    await this.delay(200);
    const userString = await AsyncStorage.getItem('@GymApp:user');
    return userString ? JSON.parse(userString) : null;
  }
}

export default new AuthService();