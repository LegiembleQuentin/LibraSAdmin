<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authService, authStore } from '../../lib/services/authService';

  let user: any = null;
  let loading = true;

  // S'abonner au store d'authentification
  $: if ($authStore.user) {
    user = $authStore.user;
  }

  onMount(async () => {
    const isAuthenticated = await authService.verifyAuth();
    if (!isAuthenticated) {
      goto('/');
      return;
    }
    loading = false;
  });
</script>

<svelte:head>
  <title>Administration - Dashboard</title>
</svelte:head>

{#if loading}
  <div class="dashboard-page">
    <div class="dashboard-content">
      <div class="spinner"></div>
      <p>Chargement...</p>
    </div>
  </div>
{:else}
  <div class="dashboard-page">
    <div class="dashboard-header">
      <h1 class="dashboard-title">Dashboard Administrateur</h1>
      {#if user}
        <p class="dashboard-subtitle">Bienvenue, {user.displayName}</p>
      {/if}
    </div>

    <div class="dashboard-content">
      <h2 class="coming-soon">🚧 À venir</h2>
      <p class="coming-soon-text">
        Le dashboard administrateur est en cours de développement.
        Les fonctionnalités de gestion des utilisateurs, livres et commentaires
        seront bientôt disponibles.
      </p>
    </div>
  </div>
{/if}

<!-- Les styles sont maintenant dans src/lib/styles/pages.css --> 