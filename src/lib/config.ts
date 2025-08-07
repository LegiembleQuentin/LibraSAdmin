//todo faire fonctionné les variables d'environnement...
export const API_CONFIG = {
  BASE_URL: import.meta.env.PUBLIC_API_URL || 'http://localhost:8080',
  API_KEY: import.meta.env.PUBLIC_API_KEY || 'Y7RFjqnZ7dBIgFFL/yhbapTwEh9pt1EDwKsPEsA4TYfgL/vEQbafmkw8k2cYJ9lgjETj37hQgh8K7d8ZtmfM0g==',
  ENDPOINTS: {
    ADMIN_LOGIN: '/api/admin/login',
    ADMIN_VERIFY: '/api/admin/verify',
    ADMIN_DASHBOARD: '/api/admin/dashboard'
  }
};

export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}; 