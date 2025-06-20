import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface User {
  id: number;
  email: string;
  displayname: string;
  name?: string;
  fname?: string;
  img_url?: string;
  roles: string[];
  created_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isAdmin: false
  });

  return {
    subscribe,
    init: () => {
      if (browser) {
        const token = localStorage.getItem('admin_token');
        const user = localStorage.getItem('admin_user');
        
        if (token && user) {
          try {
            const parsedUser: User = JSON.parse(user);
            const isAdmin = parsedUser.roles.includes('ADMIN');
            
            set({
              user: parsedUser,
              token,
              isAuthenticated: true,
              isAdmin
            });
          } catch (error) {
            console.error('Erreur lors du parsing des données utilisateur:', error);
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
          }
        }
      }
    },
    login: (token: string, user: User) => {
      const isAdmin = user.roles.includes('ADMIN');
      
      if (!isAdmin) {
        throw new Error('Accès non autorisé. Rôle admin requis.');
      }
      
      if (browser) {
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(user));
      }
      
      set({
        user,
        token,
        isAuthenticated: true,
        isAdmin: true
      });
    },
    logout: () => {
      if (browser) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isAdmin: false
      });
    },
    updateUser: (user: User) => {
      if (browser) {
        localStorage.setItem('admin_user', JSON.stringify(user));
      }
      
      update(state => ({
        ...state,
        user
      }));
    }
  };
}

export const auth = createAuthStore(); 