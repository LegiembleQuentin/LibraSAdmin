import { API_CONFIG, buildApiUrl } from '../config';

export interface EntityCountDto {
  name: string;
  count: number;
}

export interface BookTrendDto {
  id: number;
  name: string;
  delta: number; // variation d'engagement
  imgUrl?: string;
}

export interface AdminStatsDto {
  // Utilisateurs
  totalUsers: number;
  newUsersDay: number;
  newUsersWeek: number;
  newUsersMonth: number;

  // Activité utilisateurs
  dau: number;
  wau: number;
  mau: number;

  // Livres
  totalBooks: number;
  newBooksDay: number;
  newBooksWeek: number;
  newBooksMonth: number;

  // Tops livres
  topBooksByVisits: any[]; // BookDto[]
  topBooksByReaders: any[]; // BookDto[]
  trendingBooks: BookTrendDto[];
  topBooksByRating: any[]; // BookDto[]

  // Auteurs / Tags
  topAuthorsByReaders: EntityCountDto[];
  topTagsByReaders: EntityCountDto[];
}

class StatsService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'API-KEY': API_CONFIG.API_KEY
    };
  }

  async getAdminStats(): Promise<AdminStatsDto> {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN_STATS), {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Erreur lors du chargement des statistiques');
    }

    return response.json();
  }
}

export const statsService = new StatsService(); 