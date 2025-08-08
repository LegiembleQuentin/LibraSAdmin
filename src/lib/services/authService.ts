import { API_CONFIG, buildApiUrl } from '../config';
import { writable } from 'svelte/store';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminUser {
  id: number;
  displayName: string;
  email: string;
  roles: string[];
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  userId: number;
  displayName: string;
  email: string;
  roles: string[];
}

export const authStore = writable<{
  isAuthenticated: boolean;
  user: AdminUser | null;
  token: string | null;
}>({
  isAuthenticated: false,
  user: null,
  token: null
});

const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

class AuthService {
  constructor() {
    this.loadFromStorage();
  }

  loadFromStorage() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEY);
      const userJson = localStorage.getItem(USER_KEY);
      
      if (token && userJson) {
        try {
          const user = JSON.parse(userJson);
          if (user.roles && user.roles.includes('ADMIN')) {
            authStore.set({
              isAuthenticated: true,
              user,
              token
            });
          } else {
            this.logout();
          }
        } catch (error) {
          console.error('Erreur lors du chargement des données d\'authentification:', error);
          this.logout();
        }
      } else {
        authStore.set({
          isAuthenticated: false,
          user: null,
          token: null
        });
      }
    }
  }

  // Login admin
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN_LOGIN), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-KEY': API_CONFIG.API_KEY
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      // Message d'erreur générique pour ne pas révéler d'informations
      throw new Error('Email ou mot de passe incorrect');
    }

    const loginResponse: LoginResponse = await response.json();
    
    // Vérifier si l'utilisateur a le rôle ADMIN
    if (!loginResponse.roles || !loginResponse.roles.includes('ADMIN')) {
      // Message d'erreur générique même si les credentials sont corrects
      throw new Error('Email ou mot de passe incorrect');
    }
    
    // Stocker les données d'authentification
    const user: AdminUser = {
      id: loginResponse.userId,
      displayName: loginResponse.displayName,
      email: loginResponse.email,
      roles: loginResponse.roles
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, loginResponse.token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    authStore.set({
      isAuthenticated: true,
      user,
      token: loginResponse.token
    });

    return loginResponse;
  }

  // Vérifier l'authentification (vérification locale uniquement)
  async verifyAuth(): Promise<boolean> {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    const userJson = typeof window !== 'undefined' ? localStorage.getItem(USER_KEY) : null;
    
    if (!token || !userJson) {
      return false;
    }

    try {
      const user = JSON.parse(userJson);
      // Vérifier si l'utilisateur a le rôle ADMIN
      if (!user.roles || !user.roles.includes('ADMIN')) {
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      this.logout();
      return false;
    }
  }

  // Logout
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    authStore.set({
      isAuthenticated: false,
      user: null,
      token: null
    });
  }

  // Obtenir le token actuel
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }
}

export const authService = new AuthService(); 