import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { login as apiLogin, fetchProfile } from '../services/apiService';

// Интерфейсы для типизации
interface GeneralProfile {
  username: string;
  displayName: string;
  role: string;
  avatar?: string;
}

interface ContactProfile {
  email: string;
  mobile: string;
}

interface OrganizationProfile {
  title: string;
  department: string;
}

interface MetaProfile {
  userPrincipalName: string;
}

interface Profile {
  general: GeneralProfile;
  contact: ContactProfile;
  organization: OrganizationProfile;
  meta: MetaProfile;
}

interface User {
  username: string;
  displayName: string;
  email: string;
  role: string;
  profile?: Profile; // Добавляем профиль для аватара
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void; // Добавляем setUser
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(Cookies.get('authToken') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('authToken'));

  // Загрузка профиля при наличии токена
  useEffect(() => {
    const loadProfileData = async () => {
      if (isAuthenticated && token && !user?.profile) {
        try {
          const profile = await fetchProfile(token);
          if (profile) {
            setUser((prevUser) => (prevUser ? { ...prevUser, profile } : { username: '', displayName: '', email: '', role: '', profile }));
          }
        } catch (err) {
          console.error('Failed to load profile:', err);
        }
      }
    };
    loadProfileData();
  }, [isAuthenticated, token, user]);

  const login = async (username: string, password: string) => {
    try {
      const data = await apiLogin(username, password);
      if (data.token) {
        Cookies.set('authToken', data.token, { expires: 1 }); // Хранится 1 день
        setToken(data.token);
        setUser(data.user); // Устанавливаем начальные данные пользователя
        setIsAuthenticated(true);
        // После логина загружаем полный профиль
        const profile = await fetchProfile(data.token);
        if (profile) {
          setUser((prevUser) => (prevUser ? { ...prevUser, profile } : { username, displayName: '', email: '', role: '', profile }));
        }
      }
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    Cookies.remove('authToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Проверка истечения токена
  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedToken = Cookies.get('authToken');
      if (storedToken) {
        const tokenAge = (Date.now() - new Date(Cookies.get('authTokenCreated') || Date.now()).getTime()) / (1000 * 60 * 60);
        if (tokenAge > 1) {
          logout();
          Cookies.remove('authTokenCreated');
        }
      }
    };
    const interval = setInterval(checkTokenExpiration, 60000); // Проверка каждую минуту
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (token) {
      Cookies.set('authTokenCreated', new Date().toISOString(), { expires: 1 });
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};