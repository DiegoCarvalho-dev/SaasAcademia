import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  name: string;
  email: string;
  type: 'aluno' | 'personal';
};

type AuthContextData = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, type: 'aluno' | 'personal') => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  async function loadStoredData() {
    try {
      const storedUser = await AsyncStorage.getItem('@GymApp:user');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      setLoading(true);
      
      if (password.length < 6) {
        throw new Error('Senha inválida');
      }

      const usersString = await AsyncStorage.getItem('@GymApp:users');
      const users = usersString ? JSON.parse(usersString) : [];
      
      const foundUser = users.find((u: any) => u.email === email);
      
      if (!foundUser) {
        throw new Error('Usuário não encontrado');
      }

      if (foundUser.password !== password) {
        throw new Error('Senha incorreta');
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      
      await AsyncStorage.setItem('@GymApp:user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function signUp(name: string, email: string, password: string, type: 'aluno' | 'personal') {
    try {
      setLoading(true);

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
      await AsyncStorage.setItem('@GymApp:user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);

    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      setLoading(true);
      await AsyncStorage.removeItem('@GymApp:user');
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};