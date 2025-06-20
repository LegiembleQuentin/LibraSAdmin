import { get } from 'svelte/store';
import { auth, type User } from '../stores/auth.js';

const API_BASE_URL = 'http://localhost:8080/api';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  expiresIn: number;
}

interface Book {
  id: number;
  title: string;
  authors: Author[];
  tags: Tag[];
  description?: string;
  isbn?: string;
  coverUrl?: string;
  createdAt: string;
  // Autres propriétés selon votre BookDto
}

interface Author {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Comment {
  id: number;
  content: string;
  user: User;
  book: Book;
  createdAt: string;
  // Autres propriétés selon votre modèle
}

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const authState = get(auth);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Ajouter le token d'authentification si disponible
    if (authState.token) {
      headers['Authorization'] = `Bearer ${authState.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expiré ou invalide
          auth.logout();
          throw new Error('Session expirée, veuillez vous reconnecter');
        }
        
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text() as T;
      
    } catch (error) {
      console.error(`Erreur API ${endpoint}:`, error);
      throw error;
    }
  }

  // Authentification
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Gestion des utilisateurs
  async getUsers(): Promise<User[]> {
    // Note: Vous devrez peut-être créer cet endpoint dans votre API Spring Boot
    return this.request<User[]>('/admin/users');
  }

  async getUser(id: number): Promise<User> {
    return this.request<User>(`/admin/users/${id}`);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    return this.request<User>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<void> {
    return this.request<void>(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserComments(userId: number): Promise<Comment[]> {
    return this.request<Comment[]>(`/admin/users/${userId}/comments`);
  }

  async deleteComment(commentId: number): Promise<void> {
    return this.request<void>(`/admin/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  // Gestion des livres
  async getBooks(): Promise<Book[]> {
    return this.request<Book[]>('/books');
  }

  async getBook(id: number): Promise<Book> {
    return this.request<Book>(`/book-details/${id}`);
  }

  async createBook(bookData: Partial<Book>): Promise<Book> {
    return this.request<Book>('/admin/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  }

  async updateBook(id: number, bookData: Partial<Book>): Promise<Book> {
    return this.request<Book>(`/admin/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
  }

  async deleteBook(id: number): Promise<void> {
    return this.request<void>(`/admin/books/${id}`, {
      method: 'DELETE',
    });
  }

  // Gestion des tags
  async getTags(): Promise<Tag[]> {
    return this.request<Tag[]>('/tags');
  }

  async createTag(tagData: { name: string }): Promise<Tag> {
    return this.request<Tag>('/admin/tags', {
      method: 'POST',
      body: JSON.stringify(tagData),
    });
  }

  async updateTag(id: number, tagData: { name: string }): Promise<Tag> {
    return this.request<Tag>(`/admin/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tagData),
    });
  }

  async deleteTag(id: number): Promise<void> {
    return this.request<void>(`/admin/tags/${id}`, {
      method: 'DELETE',
    });
  }

  // Recherche
  async searchBooks(query: string): Promise<Book[]> {
    return this.request<Book[]>(`/books/search/${encodeURIComponent(query)}`);
  }

  // Statistiques (à implémenter plus tard)
  async getStats(): Promise<any> {
    return this.request<any>('/admin/stats');
  }
}

export const api = new ApiService();
export type { User, Book, Author, Tag, Comment, LoginRequest, LoginResponse }; 