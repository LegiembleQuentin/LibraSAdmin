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
  let selectedStatus = '';
  let dateFrom = '';
  let dateTo = '';

  const roleOptions = [
    { value: '', label: 'Tous les rôles' },
    { value: 'USER', label: 'Utilisateur' },
    { value: 'ADMIN', label: 'Administrateur' }
  ];

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'true', label: 'Actif' },
    { value: 'false', label: 'Inactif' }
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
      
      // Construire le filtre
      const currentFilter: UserFilter = {};
      if (searchTerm.trim()) currentFilter.search = searchTerm.trim();
      if (selectedRole) currentFilter.role = selectedRole;
      if (selectedStatus !== '') currentFilter.isActive = selectedStatus === 'true';
      if (dateFrom) currentFilter.createdAfter = dateFrom;
      if (dateTo) currentFilter.createdBefore = dateTo;

      const response = await userService.getUsers(currentPage, pageSize, currentFilter);
      
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

  async function handleSearch() {
    currentPage = 0;
    await loadUsers();
  }

  async function handlePageChange(newPage: number) {
    currentPage = newPage;
    await loadUsers();
  }

  async function toggleUserStatus(user: AppUser) {
    try {
      await userService.updateUserStatus(user.id, !user.isActive);
      await loadUsers(); // Recharger la liste
    } catch (err) {
      error = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du statut';
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

<div class="page-container">
  <div class="page-content">
    <div class="filters-section">
      <div class="filters-row">
        <div class="filter-group">
          <Input
            bind:value={searchTerm}
            placeholder="Rechercher par nom ou email..."
            on:keypress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <div class="filter-group">
          <Select
            bind:value={selectedRole}
            options={roleOptions}
            label="Filtrer par rôle"
            on:change={handleSearch}
          />
        </div>
        <div class="filter-group">
          <Select
            bind:value={selectedStatus}
            options={statusOptions}
            label="Filtrer par statut"
            on:change={handleSearch}
          />
        </div>
        <div class="filter-group">
          <Button on:click={handleSearch} disabled={loading}>
            {loading ? 'Recherche...' : 'Rechercher'}
          </Button>
        </div>
      </div>
      
      <div class="filters-row">
        <div class="filter-group">
          <label class="filter-label" for="date-from">Date de création (de) :</label>
          <input
            id="date-from"
            type="date"
            bind:value={dateFrom}
            class="input date-input"
            on:change={handleSearch}
          />
        </div>
        <div class="filter-group">
          <label class="filter-label" for="date-to">Date de création (à) :</label>
          <input
            id="date-to"
            type="date"
            bind:value={dateTo}
            class="input date-input"
            on:change={handleSearch}
          />
        </div>
      </div>
    </div>

    {#if error}
      <div class="error-banner">
        <p>⚠️ {error}</p>
      </div>
    {/if}

    {#if loading}
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Chargement des utilisateurs...</p>
      </div>
    {:else if users.length === 0}
      <div class="empty-state">
        <h3>Aucun utilisateur trouvé</h3>
        <p>Aucun utilisateur ne correspond aux critères de recherche.</p>
      </div>
    {:else}
      <div class="table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom d'affichage</th>
              <th>Email</th>
              <th>Rôles</th>
              <th>Statut</th>
              <th>Date de création</th>
              <th>Dernière connexion</th>
              <th>Livres</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each users as user}
              <tr class:inactive={!user.isActive}>
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
                <td class="status-cell">
                  <span class="status-badge" class:active={user.isActive} class:inactive={!user.isActive}>
                    {user.isActive ? 'Actif' : 'Inactif'}
                  </span>
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
                <td class="actions-cell">
                  <Button
                    variant="secondary"
                    size="small"
                    on:click={() => toggleUserStatus(user)}
                  >
                    {user.isActive ? 'Désactiver' : 'Activer'}
                  </Button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      
      <div class="pagination-container">
        <div class="pagination-info">
          <p>
            Affichage de {currentPage * pageSize + 1} à {Math.min((currentPage + 1) * pageSize, totalElements)} 
            sur {totalElements} utilisateurs
          </p>
        </div>
        <div class="pagination-controls">
          <Button
            variant="secondary"
            disabled={!canPrevious}
            on:click={() => handlePageChange(currentPage - 1)}
          >
            Précédent
          </Button>
          <span class="page-info">Page {currentPage + 1} sur {totalPages}</span>
          <Button
            variant="secondary"
            disabled={!canNext}
            on:click={() => handlePageChange(currentPage + 1)}
          >
            Suivant
          </Button>
        </div>
      </div>
    {/if}
  </div>
</div>
