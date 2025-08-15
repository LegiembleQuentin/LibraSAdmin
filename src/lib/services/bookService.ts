import { API_CONFIG, buildApiUrl } from '../config';

export interface BookFilter {
  tags?: string[];
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  author?: string;
  isCompleted?: boolean;
  minVolumes?: number;
  maxVolumes?: number;
  minRating?: number;
  maxRating?: number;
}

export interface Book {
  id: number;
  synopsis?: string;
  name: string;
  dateStart: string;
  dateEnd?: string;
  nbVolume: number;
  note?: number;
  nbVisit?: number;
  imgUrl?: string;
  tags: Tag[];
  authors: Author[];
  createdAt?: string;
  modifiedAt?: string;
  userStatus?: string;
  userRating?: number;
  userCurrentVolume?: number;
  userMatch?: number;
  totalUsers?: number;
  averageVolume?: number;
  usersInProgress?: number;
  usersCompleted?: number;
  usersNotStarted?: number;
  averageProgress?: number;
  completionRate?: number;
  activeUsersLast7Days?: number;
  activeUsersLast30Days?: number;
  engagementTrend?: number;
  activeUsersThisMonth?: number;
  activeUsersLastMonth?: number;
  newReadersThisMonth?: number;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Author {
  id: number;
  name: string;
}

export interface BookResponse {
  content: Book[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

class BookService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'API-KEY': API_CONFIG.API_KEY
    };
  }

  async getBooksWithFilters(filter: BookFilter = {}, page: number = 0, size: number = 20): Promise<BookResponse> {
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN_BOOKS)}?page=${page}&size=${size}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(filter)
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des livres');
    }

    return response.json();
  }

  async getAllBooks(): Promise<Book[]> {
    const response = await this.getBooksWithFilters({}, 0, 1000);
    return response.content;
  }

  async getBookById(id: string): Promise<Book> {
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN_BOOKS)}/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du livre');
    }

    return response.json();
  }

  async updateBook(id: number, book: Partial<Book>): Promise<Book> {
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN_BOOKS)}/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(book)
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du livre');
    }

    return response.json();
  }
}

export const bookService = new BookService();
