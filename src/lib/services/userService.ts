import { API_CONFIG, buildApiUrl } from '../config';
import { authStore } from './authService';
import { get } from 'svelte/store';

export interface UserBook {
  bookId: number;
  title: string;
  authors: string[];
  imageUrl?: string;
  status: string;
  userRating?: number;
  currentVolume?: number;
  totalVolumes: number;
  startedAt?: string;
  completedAt?: string;
  modifiedAt?: string;
}

export interface AppUser {
  id: number;
  displayName: string;
  email: string;
  createdAt: string;
  modifiedAt?: string;
  lastLoginAt?: string;
  roles: string[];
  totalBooks?: number;
  booksInProgress?: number;
  booksCompleted?: number;
  averageRating?: number;
  profileImageUrl?: string;
  books?: UserBook[];
}

export interface UserFilter {
  search?: string;
  role?: string;
  createdAfter?: string;
  createdBefore?: string;
}

export interface UserPageResponse {
  content: AppUser[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

class UserService {
  private getAuthHeaders(): HeadersInit {
    const auth = get(authStore);
    return {
      'Content-Type': 'application/json',
      'API-KEY': API_CONFIG.API_KEY,
      'Authorization': auth.token ? `Bearer ${auth.token}` : ''
    };
  }

  async getUsers(
    page: number = 0, 
    size: number = 20, 
    filter: UserFilter = {}
  ): Promise<UserPageResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });

    const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN_USERS)}/search?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(filter)
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      throw new Error('Erreur lors du chargement des utilisateurs');
    }

    return await response.json();
  }

  async getUserById(id: number): Promise<AppUser> {
    const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.ADMIN_USERS}/${id}`), {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      if (response.status === 404) {
        throw new Error('Utilisateur non trouvé');
      }
      throw new Error('Erreur lors du chargement de l\'utilisateur');
    }

    return await response.json();
  }


}

export const userService = new UserService();
