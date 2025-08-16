<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { authService } from '$lib/services/authService';
  import { userService, type AppUser } from '$lib/services/userService';
  import Button from '$lib/components/Button.svelte';

  let user: AppUser | null = null;
  let loading = true;
  let error = '';

  $: userId = parseInt($page.params.id);

  onMount(async () => {
    const isAuthenticated = await authService.verifyAuth();
    if (!isAuthenticated) {
      goto('/');
      return;
    }
    await loadUser();
  });

  async function loadUser() {
    try {
      loading = true;
      error = '';
      user = await userService.getUserById(userId);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Erreur lors du chargement de l\'utilisateur';
      if (error.includes('Session expirée')) {
        goto('/');
      }
    } finally {
      loading = false;
    }
  }

  function formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function goBack() {
    goto('/users');
  }
</script>

<svelte:head>
  <title>Administration - Détail Utilisateur</title>
</svelte:head>

<div class="admin-page">
  <div class="page-header">
    <Button variant="secondary" size="medium" on:click={goBack}>
      ← Retour à la liste
    </Button>
    <h1 class="page-title">Détail de l'utilisateur</h1>
  </div>

  {#if error}
    <div class="error-banner">
      <span class="error-text">{error}</span>
    </div>
  {/if}

  {#if loading}
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Chargement des informations...</p>
    </div>
  {:else if user}
    <div class="user-detail-container">
      <div class="user-profile-section">
        <div class="profile-header">
          <div class="profile-avatar">
            {#if user.profileImageUrl}
              <img src={user.profileImageUrl} alt="Avatar" class="avatar-image" />
            {:else}
              <div class="avatar-placeholder">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            {/if}
          </div>
          <div class="profile-info">
            <h2 class="user-display-name">{user.displayName}</h2>
            <p class="user-email">{user.email}</p>
            <div class="user-roles">
              {#each user.roles as role}
                <span class="role-badge" class:admin={role === 'ADMIN'}>
                  {role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
                </span>
              {/each}
            </div>
          </div>
        </div>
      </div>

      <div class="user-details-section">
        <h3 class="section-title">Informations générales</h3>
        <div class="details-grid">
          <table class="details-table">
            <tbody>
              <tr>
                <th>ID Utilisateur</th>
                <td>{user.id}</td>
              </tr>
              <tr>
                <th>Nom d'affichage</th>
                <td>{user.displayName}</td>
              </tr>
              <tr>
                <th>Adresse email</th>
                <td>{user.email}</td>
              </tr>
              <tr>
                <th>Rôles</th>
                <td>
                  {#each user.roles as role, index}
                    {role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}{index < user.roles.length - 1 ? ', ' : ''}
                  {/each}
                </td>
              </tr>
              <tr>
                <th>Date de création</th>
                <td>{formatDate(user.createdAt)}</td>
              </tr>
              <tr>
                <th>Dernière modification</th>
                <td>{formatDate(user.modifiedAt || '')}</td>
              </tr>
              <tr>
                <th>Dernière connexion</th>
                <td>{formatDate(user.lastLoginAt || '')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="user-stats-section">
        <h3 class="section-title">Statistiques de lecture</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{user.totalBooks || 0}</div>
            <div class="stat-label">Livres total</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{user.booksInProgress || 0}</div>
            <div class="stat-label">En cours</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{user.booksCompleted || 0}</div>
            <div class="stat-label">Terminés</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{user.averageRating ? user.averageRating.toFixed(1) : 'N/A'}</div>
            <div class="stat-label">Note moyenne</div>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="empty-state">
      <h3>Utilisateur non trouvé</h3>
      <p>L'utilisateur demandé n'existe pas ou a été supprimé.</p>
    </div>
  {/if}
</div>

<style>
  .page-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .page-title {
    font-size: 2rem;
    font-weight: 600;
    color: var(--color-accent);
    margin: 0;
  }

  .user-detail-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .user-profile-section {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-lg);
    padding: 2rem;
    backdrop-filter: blur(10px);
  }

  .profile-header {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .profile-avatar {
    flex-shrink: 0;
  }

  .avatar-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid rgba(255, 255, 255, 0.2);
  }

  .avatar-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--color-accent);
    color: var(--color-black);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 2rem;
    border: 3px solid rgba(255, 255, 255, 0.2);
  }

  .profile-info {
    flex: 1;
  }

  .user-display-name {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--color-white);
    margin: 0 0 0.5rem 0;
  }

  .user-email {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0 0 1rem 0;
  }

  .user-roles {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .role-badge {
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-text);
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius-md);
    font-size: 0.9rem;
    font-weight: 500;
  }

  .role-badge.admin {
    background: var(--color-accent);
    color: var(--color-black);
  }

  .user-details-section,
  .user-stats-section {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-lg);
    padding: 2rem;
    backdrop-filter: blur(10px);
  }

  .section-title {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-accent);
    margin: 0 0 1.5rem 0;
  }

  .details-table {
    width: 100%;
    border-collapse: collapse;
  }

  .details-table th {
    text-align: left;
    font-weight: 600;
    color: var(--color-white);
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    width: 200px;
    background: rgba(255, 255, 255, 0.05);
  }

  .details-table td {
    padding: 1rem;
    color: rgba(255, 255, 255, 0.9);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .details-table tr:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1.5rem;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-md);
    padding: 1.5rem;
    text-align: center;
    transition: all var(--transition-normal);
  }

  .stat-card:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-accent);
    margin-bottom: 0.5rem;
  }

  .stat-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .profile-header {
      flex-direction: column;
      text-align: center;
      gap: 1.5rem;
    }

    .details-table th {
      width: 150px;
      font-size: 0.9rem;
    }

    .details-table th,
    .details-table td {
      padding: 0.75rem;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .details-table th {
      width: 120px;
      font-size: 0.8rem;
    }
  }
</style>
