<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authService } from '../../lib/services/authService';
  import { userService, type AppUser, type UserFilter } from '../../lib/services/userService';
  import Input from '$lib/components/Input.svelte';
  import Button from '$lib/components/Button.svelte';
  import Select from '$lib/components/Select.svelte';

  let users: AppUser[] = [];
  let loading = true;
  let error = '';
  let currentPage = 0;
  let totalPages = 0;
  let totalElements = 0;
  let pageSize = 20;

  let filter: UserFilter = {};
  let searchTerm = '';
  let selectedRole = '';
  let dateFrom = '';
  let dateTo = '';

  const roleOptions = [
    { value: '', label: 'Tous les rôles' },
    { value: 'USER', label: 'Utilisateur' },
    { value: 'ADMIN', label: 'Administrateur' }
  ];



  onMount(async () => {
    const isAuthenticated = await authService.verifyAuth();
    if (!isAuthenticated) {
      goto('/');
      return;
    }
    await loadUsers();
  });

  async function loadUsers() {
    try {
      loading = true;
      error = '';

      const response = await userService.getUsers(currentPage, pageSize, filter);
      
      users = response.content;
      totalElements = response.totalElements;
      totalPages = response.totalPages;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs';
      if (error.includes('Session expirée')) {
        goto('/');
      }
    } finally {
      loading = false;
    }
  }

  function applyFilters() {
    let createdAfterISO = undefined;
    let createdBeforeISO = undefined;
    
    if (dateFrom) {
      createdAfterISO = new Date(dateFrom + 'T00:00:00').toISOString();
    }
    if (dateTo) {
      createdBeforeISO = new Date(dateTo + 'T23:59:59').toISOString();
    }

    filter = {
      search: searchTerm || undefined,
      role: selectedRole || undefined,
      createdAfter: createdAfterISO,
      createdBefore: createdBeforeISO
    };
    currentPage = 0;
    loadUsers();
  }

  function clearFilters() {
    searchTerm = '';
    selectedRole = '';
    dateFrom = '';
    dateTo = '';
    filter = {};
    currentPage = 0;
    loadUsers();
  }

  function goToPage(page: number) {
    if (page >= 0 && page < totalPages) {
      currentPage = page;
      loadUsers();
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

  function formatRoles(roles: string[]): string {
    if (!roles || roles.length === 0) return 'Aucun';
    return roles.map(role => {
      switch(role) {
        case 'USER': return 'Utilisateur';
        case 'ADMIN': return 'Administrateur';
        default: return role;
      }
    }).join(', ');
  }

  $: canPrevious = currentPage > 0;
  $: canNext = currentPage < totalPages - 1;
</script>

<svelte:head>
  <title>Administration - Utilisateurs</title>
</svelte:head>

<div class="admin-page">
    <div class="filters-section">
      <div class="filters-header">
        <h3>Filtres de recherche</h3>
        <div class="filters-actions">
          <Button on:click={applyFilters} variant="secondary" size="small">
            Appliquer
          </Button>
          <Button on:click={clearFilters} variant="secondary" size="small">
            Réinitialiser
          </Button>
        </div>
      </div>
      
      <div class="filters-grid">
        <div class="filter-group">
          <Input
            bind:value={searchTerm}
            label="Recherche"
            placeholder="Nom d'utilisateur ou email"
            size="medium"
          />
        </div>

        <div class="filter-group">
          <Select
            bind:value={selectedRole}
            label="Rôle"
            options={roleOptions}
            size="medium"
          />
        </div>

        <div class="date-filters">
          <Input
            bind:value={dateFrom}
            label="Date de création (de)"
            type="date"
            size="medium"
          />
          <Input
            bind:value={dateTo}
            label="Date de création (à)"
            type="date"
            size="medium"
          />
        </div>
      </div>
    </div>

  {#if error}
    <div class="error-banner">
      <span class="error-text">{error}</span>
    </div>
  {/if}

  <div class="content-section">
    {#if loading}
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>Chargement des utilisateurs...</p>
      </div>
    {:else if users.length === 0}
      <div class="empty-state">
        <h3>Aucun utilisateur trouvé</h3>
        <p>Aucun utilisateur ne correspond aux critères de recherche.</p>
      </div>
    {:else}
      <div class="users-section">
        <div class="users-header">
          <h3>Liste des utilisateurs</h3>
        </div>
        
        <div class="table-container">
          <table class="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom d'affichage</th>
                <th>Email</th>
                <th>Rôles</th>
                <th>Date de création</th>
                <th>Dernière connexion</th>
                <th>Livres</th>
              </tr>
            </thead>
            <tbody>
              {#each users as user}
                <tr>
                  <td class="id-cell">{user.id}</td>
                  <td class="name-cell">
                    <div class="user-info">
                      {#if user.profileImageUrl}
                        <img src={user.profileImageUrl} alt="Avatar" class="user-avatar" />
                      {:else}
                        <div class="user-avatar-placeholder">
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                      {/if}
                      <span class="user-name">{user.displayName}</span>
                    </div>
                  </td>
                  <td class="email-cell">{user.email}</td>
                  <td class="roles-cell">
                    <div class="roles-container">
                      {#each user.roles as role}
                        <span class="role-badge" class:admin={role === 'ADMIN'}>
                          {role === 'ADMIN' ? 'Admin' : 'Utilisateur'}
                        </span>
                      {/each}
                    </div>
                  </td>
                  <td class="date-cell">{formatDate(user.createdAt)}</td>
                  <td class="date-cell">{formatDate(user.lastLoginAt || '')}</td>
                  <td class="stats-cell">
                    <div class="book-stats">
                      <span class="stat">Total: {user.totalBooks || 0}</span>
                      <span class="stat">En cours: {user.booksInProgress || 0}</span>
                      <span class="stat">Terminés: {user.booksCompleted || 0}</span>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        
        <div class="pagination">
          <div class="pagination-info">
            <span>
              Affichage de {currentPage * pageSize + 1} à {Math.min((currentPage + 1) * pageSize, totalElements)} 
              sur {totalElements} utilisateurs
            </span>
          </div>
          <div class="pagination-controls">
            <Button 
              variant="secondary" 
              size="small" 
              disabled={currentPage === 0}
              on:click={() => goToPage(currentPage - 1)}
            >
              Précédent
            </Button>
            <span class="page-indicator">
              Page {currentPage + 1} sur {totalPages}
            </span>
            <Button 
              variant="secondary" 
              size="small" 
              disabled={currentPage >= totalPages - 1}
              on:click={() => goToPage(currentPage + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
