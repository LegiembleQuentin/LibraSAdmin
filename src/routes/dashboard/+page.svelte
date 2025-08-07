<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authService, authStore } from '../../lib/services/authService';
  import { API_CONFIG, buildApiUrl } from '../../lib/config';

  let user: any = null;
  let loading = true;
  let dashboardData: any = null;

  // S'abonner au store d'authentification
  $: if ($authStore.user) {
    user = $authStore.user;
  }

  onMount(async () => {
    // Vérifier l'authentification
    const isAuthenticated = await authService.verifyAuth();
    if (!isAuthenticated) {
      goto('/');
      return;
    }

    // Charger les données du dashboard
    await loadDashboard();
    loading = false;
  });

  async function loadDashboard() {
    try {
      const token = authService.getToken();
      if (!token) return;

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN_DASHBOARD), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'API-KEY': API_CONFIG.API_KEY
        }
      });

      if (response.ok) {
        dashboardData = await response.json();
      }
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    }
  }

  function handleLogout() {
    authService.logout();
    goto('/');
  }
</script>

<svelte:head>
  <title>Administration - Dashboard</title>
</svelte:head>

{#if loading}
  <div class="loading-container">
    <div class="spinner-large"></div>
    <p>Chargement...</p>
  </div>
{:else}
  <div class="dashboard">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <h1>🎛️ Dashboard Administrateur</h1>
          {#if user}
            <p>Bienvenue, <strong>{user.displayName}</strong></p>
          {/if}
        </div>
        <div class="header-right">
          <div class="user-info">
            {#if user}
              <span class="user-email">{user.email}</span>
              <div class="user-roles">
                {#each user.roles as role}
                  <span class="role-badge">{role}</span>
                {/each}
              </div>
            {/if}
          </div>
          <button class="logout-button" on:click={handleLogout}>
            🚪 Déconnexion
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="dashboard-grid">
        <!-- Statistiques -->
        <div class="card">
          <div class="card-header">
            <h3>📊 Statistiques</h3>
          </div>
          <div class="card-content">
            <div class="stat-item">
              <span class="stat-label">Utilisateurs totaux</span>
              <span class="stat-value">-</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Livres dans la base</span>
              <span class="stat-value">-</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Commentaires</span>
              <span class="stat-value">-</span>
            </div>
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="card">
          <div class="card-header">
            <h3>⚡ Actions rapides</h3>
          </div>
          <div class="card-content">
            <button class="action-button">👥 Gérer les utilisateurs</button>
            <button class="action-button">📚 Gérer les livres</button>
            <button class="action-button">💬 Modérer les commentaires</button>
            <button class="action-button">🏷️ Gérer les tags</button>
          </div>
        </div>

        <!-- Informations système -->
        <div class="card">
          <div class="card-header">
            <h3>🔧 Système</h3>
          </div>
          <div class="card-content">
            <div class="system-info">
              <p><strong>API Status:</strong> <span class="status-ok">🟢 En ligne</span></p>
              <p><strong>Base de données:</strong> <span class="status-ok">🟢 Connectée</span></p>
              {#if dashboardData}
                <p><strong>Dernière mise à jour:</strong> {new Date(dashboardData.timestamp).toLocaleString('fr-FR')}</p>
              {/if}
            </div>
          </div>
        </div>

        <!-- Messages système -->
        <div class="card full-width">
          <div class="card-header">
            <h3>📋 Messages système</h3>
          </div>
          <div class="card-content">
            {#if dashboardData?.message}
              <div class="message-item">
                <span class="message-type">INFO</span>
                <span class="message-text">{dashboardData.message}</span>
              </div>
            {/if}
            <div class="message-item">
              <span class="message-type">SUCCESS</span>
              <span class="message-text">Interface d'administration initialisée avec succès</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
{/if}

<style>
  .loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f7fafc;
  }

  .spinner-large {
    width: 40px;
    height: 40px;
    border: 4px solid #e2e8f0;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .dashboard {
    min-height: 100vh;
    background-color: #f7fafc;
  }

  .header {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    padding: 20px 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-left h1 {
    margin: 0 0 5px 0;
    font-size: 1.8rem;
    color: #2d3748;
  }

  .header-left p {
    margin: 0;
    color: #718096;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .user-info {
    text-align: right;
  }

  .user-email {
    display: block;
    color: #4a5568;
    font-size: 0.9rem;
    margin-bottom: 5px;
  }

  .user-roles {
    display: flex;
    gap: 5px;
    justify-content: flex-end;
  }

  .role-badge {
    background: #667eea;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 500;
  }

  .logout-button {
    background: #e53e3e;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .logout-button:hover {
    background: #c53030;
  }

  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }

  .card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .card.full-width {
    grid-column: 1 / -1;
  }

  .card-header {
    background: #f7fafc;
    padding: 16px 20px;
    border-bottom: 1px solid #e2e8f0;
  }

  .card-header h3 {
    margin: 0;
    color: #2d3748;
    font-size: 1.1rem;
  }

  .card-content {
    padding: 20px;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e2e8f0;
  }

  .stat-item:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  .stat-label {
    color: #718096;
    font-size: 0.9rem;
  }

  .stat-value {
    font-weight: 600;
    color: #2d3748;
    font-size: 1.2rem;
  }

  .action-button {
    display: block;
    width: 100%;
    background: #667eea;
    color: white;
    border: none;
    padding: 12px 16px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 10px;
    font-size: 0.9rem;
    transition: background-color 0.2s, transform 0.2s;
  }

  .action-button:last-child {
    margin-bottom: 0;
  }

  .action-button:hover {
    background: #5a67d8;
    transform: translateY(-1px);
  }

  .system-info p {
    margin: 0 0 10px 0;
    color: #4a5568;
    font-size: 0.9rem;
  }

  .system-info p:last-child {
    margin-bottom: 0;
  }

  .status-ok {
    color: #38a169;
    font-weight: 500;
  }

  .message-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    padding: 12px;
    background: #f7fafc;
    border-radius: 8px;
    border-left: 4px solid #667eea;
  }

  .message-item:last-child {
    margin-bottom: 0;
  }

  .message-type {
    background: #667eea;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 600;
    min-width: 60px;
    text-align: center;
  }

  .message-text {
    color: #4a5568;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      gap: 15px;
      text-align: center;
    }

    .header-right {
      flex-direction: column;
      gap: 10px;
    }

    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }
</style> 