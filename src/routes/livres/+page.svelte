<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authService } from '../../lib/services/authService';

  onMount(async () => {
    const isAuthenticated = await authService.verifyAuth();
    if (!isAuthenticated) {
      goto('/');
    }
  });
</script>

<svelte:head>
  <title>Administration - Livres</title>
</svelte:head>

<div class="page-container">
  <div class="page-header">
    <h1 class="page-title">Gestion des Livres</h1>
    <p class="page-subtitle">Gérez le catalogue de livres de la bibliothèque</p>
  </div>

  <div class="page-content">
    <div class="coming-soon">
      <h2>🚧 À venir</h2>
      <p>La gestion des livres sera bientôt disponible.</p>
    </div>
  </div>
</div>
