//todo faire fonctionné les variables d'environnement...
export const API_CONFIG = {
  BASE_URL: import.meta.env.PUBLIC_API_URL || 'http://localhost:8080',
  API_KEY: import.meta.env.PUBLIC_API_KEY || 'Y7RFjqnZ7dBIgFFL/yhbapTwEh9pt1EDwKsPEsA4TYfgL/vEQbafmkw8k2cYJ9lgjETj37hQgh8K7d8ZtmfM0g==',
  ENDPOINTS: {
    ADMIN_LOGIN: '/api/admin/login',
    ADMIN_VERIFY: '/api/admin/verify',
    ADMIN_BOOKS: '/api/admin/books',
    ADMIN_BOOKS_SEARCH: '/api/admin/books/search',
    ADMIN_USERS: '/api/admin/users'
  }
};

export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}; 