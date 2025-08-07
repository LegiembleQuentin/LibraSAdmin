import { API_CONFIG, buildApiUrl } from '../config';
import { writable } from 'svelte/store';

// Types
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

// Store pour l'état d'authentification
export const authStore = writable<{
  isAuthenticated: boolean;
  user: AdminUser | null;
  token: string | null;
}>({
  isAuthenticated: false,
  user: null,
  token: null
});

// Clé pour le localStorage
const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

class AuthService {
  constructor() {
    this.loadFromStorage();
  }

  // Charger les données depuis le localStorage
  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEY);
      const userJson = localStorage.getItem(USER_KEY);
      
      if (token && userJson) {
        try {
          const user = JSON.parse(userJson);
          authStore.set({
            isAuthenticated: true,
            user,
            token
          });
        } catch (error) {
          console.error('Erreur lors du chargement des données d\'authentification:', error);
          this.logout();
        }
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
      const error = await response.json();
      throw new Error(error.error || 'Échec de la connexion');
    }

    const loginResponse: LoginResponse = await response.json();
    
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

  // Vérifier l'authentification
  async verifyAuth(): Promise<boolean> {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    
    if (!token) {
      return false;
    }

    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN_VERIFY), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'API-KEY': API_CONFIG.API_KEY
        }
      });

      if (!response.ok) {
        this.logout();
        return false;
      }

      const verifyResponse = await response.json();
      return verifyResponse.valid;
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