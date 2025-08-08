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
  <title>Administration - Utilisateurs</title>
</svelte:head>

<div class="page-container">
  <div class="page-header">
    <h1 class="page-title">Gestion des Utilisateurs</h1>
    <p class="page-subtitle">Gérez les comptes utilisateurs de la bibliothèque</p>
  </div>

  <div class="page-content">
    <div class="coming-soon">
      <h2>🚧 À venir</h2>
      <p>La gestion des utilisateurs sera bientôt disponible.</p>
    </div>
  </div>
</div>
