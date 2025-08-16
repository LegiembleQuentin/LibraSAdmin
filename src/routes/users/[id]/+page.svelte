<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { authService } from '$lib/services/authService';
  import { userService, type AppUser, type UserBook } from '$lib/services/userService';
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

  function getStatusLabel(status: string): string {
    switch (status) {
      case 'READING': return 'En cours';
      case 'COMPLETED': return 'Terminé';
      case 'TO_READ': return 'À lire';
      case 'PAUSED': return 'En pause';
      default: return status;
    }
  }

  function getStatusClass(status: string): string {
    switch (status) {
      case 'READING': return 'reading';
      case 'COMPLETED': return 'completed';
      case 'TO_READ': return 'to-read';
      case 'PAUSED': return 'paused';
      default: return '';
    }
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

      {#if user.books && user.books.length > 0}
        <div class="user-books-section">
          <h3 class="section-title">Livres de l'utilisateur</h3>
          <div class="books-table-container">
            <table class="books-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Auteur(s)</th>
                  <th>Statut</th>
                  <th>Note utilisateur</th>
                  <th>Progression</th>
                  <th>Dernière activité</th>
                </tr>
              </thead>
              <tbody>
                {#each user.books as book}
                  <tr>
                    <td class="book-title-cell">
                      <div class="book-info">
                        {#if book.imageUrl}
                          <img src={book.imageUrl} alt={book.title} class="book-thumbnail" />
                        {:else}
                          <div class="book-thumbnail-placeholder">📚</div>
                        {/if}
                        <span class="book-title">{book.title}</span>
                      </div>
                    </td>
                    <td class="authors-cell">
                      {book.authors.join(', ')}
                    </td>
                    <td class="status-cell">
                      <span class="status-badge {getStatusClass(book.status)}">
                        {getStatusLabel(book.status)}
                      </span>
                    </td>
                    <td class="rating-cell">
                      {#if book.userRating && book.userRating > 0}
                        <span class="rating">⭐ {book.userRating.toFixed(1)}/10</span>
                      {:else}
                        <span class="no-rating">Non noté</span>
                      {/if}
                    </td>
                    <td class="progress-cell">
                      {#if book.currentVolume && book.totalVolumes}
                        <div class="progress-info">
                          <span class="progress-text">{book.currentVolume}/{book.totalVolumes}</span>
                          <div class="progress-bar">
                            <div class="progress-fill" style="width: {(book.currentVolume / book.totalVolumes) * 100}%"></div>
                          </div>
                        </div>
                      {:else}
                        <span class="no-progress">-</span>
                      {/if}
                    </td>
                    <td class="activity-cell">
                      {formatDate(book.modifiedAt || '')}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
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

  .user-books-section {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-lg);
    padding: 2rem;
    backdrop-filter: blur(10px);
  }

  .books-table-container {
    overflow-x: auto;
    margin-top: 1.5rem;
    border-radius: var(--border-radius-md);
    background: rgba(255, 255, 255, 0.02);
  }

  .books-table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-secondary);
    font-size: 0.9rem;
  }

  .books-table th {
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-text);
    font-family: var(--font-primary);
    font-weight: 600;
    padding: 1rem;
    text-align: left;
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    white-space: nowrap;
  }

  .books-table td {
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--color-text);
    vertical-align: middle;
  }

  .books-table tr:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .book-title-cell {
    min-width: 250px;
  }

  .book-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .book-thumbnail {
    width: 40px;
    height: 60px;
    object-fit: cover;
    border-radius: var(--border-radius-sm);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .book-thumbnail-placeholder {
    width: 40px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-sm);
    font-size: 1.5rem;
  }

  .book-title {
    font-weight: 500;
    color: var(--color-white);
  }

  .authors-cell {
    min-width: 150px;
    color: rgba(255, 255, 255, 0.8);
  }

  .status-cell {
    min-width: 120px;
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: var(--border-radius-sm);
    font-size: 0.8rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .status-badge.reading {
    background: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.3);
  }

  .status-badge.completed {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.3);
  }

  .status-badge.to-read {
    background: rgba(156, 163, 175, 0.2);
    color: #9ca3af;
    border: 1px solid rgba(156, 163, 175, 0.3);
  }

  .status-badge.paused {
    background: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  .rating-cell {
    min-width: 100px;
  }

  .rating {
    color: var(--color-accent);
    font-weight: 500;
  }

  .no-rating {
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
  }

  .progress-cell {
    min-width: 120px;
  }

  .progress-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .progress-text {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.8);
  }

  .progress-bar {
    width: 60px;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--color-accent);
    transition: width var(--transition-normal);
  }

  .no-progress {
    color: rgba(255, 255, 255, 0.5);
  }

  .activity-cell {
    font-family: var(--font-monospace, monospace);
    font-size: 0.85rem;
    opacity: 0.8;
    white-space: nowrap;
    min-width: 130px;
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
