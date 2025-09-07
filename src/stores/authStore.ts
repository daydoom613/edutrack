import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials, RegisterData } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

// Mock API functions - will be replaced with real API calls
const mockLogin = async (credentials: LoginCredentials): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (credentials.email === 'student@edutrack.com' && credentials.password === 'password') {
    return {
      id: '1',
      email: credentials.email,
      name: 'John Student',
      role: 'student',
      grade: '10',
      school: 'Lincoln High School',
      createdAt: new Date(),
      totalPoints: 1250,
      level: 5,
      badges: ['First Assignment', 'Quiz Master'],
      streakDays: 7
    };
  }
  
  if (credentials.email === 'teacher@edutrack.com' && credentials.password === 'password') {
    return {
      id: '2',
      email: credentials.email,
      name: 'Ms. Sarah Johnson',
      role: 'teacher',
      school: 'Lincoln High School',
      createdAt: new Date()
    };
  }
  
  throw new Error('Invalid credentials');
};

const mockRegister = async (data: RegisterData): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: Date.now().toString(),
    email: data.email,
    name: data.name,
    role: data.role,
    grade: data.grade,
    school: data.school,
    createdAt: new Date(),
    ...(data.role === 'student' && {
      totalPoints: 0,
      level: 1,
      badges: [],
      streakDays: 0
    })
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          const user = await mockLogin(credentials);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const user = await mockRegister(data);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      }
    }),
    {
      name: 'edutrack-auth',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);