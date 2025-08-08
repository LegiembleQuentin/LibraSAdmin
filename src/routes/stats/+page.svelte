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
  <title>Administration - Statistiques</title>
</svelte:head>

<div class="page-container">
  <div class="page-header">
    <h1 class="page-title">Statistiques</h1>
    <p class="page-subtitle">Consultez les statistiques de la bibliothèque</p>
  </div>

  <div class="page-content">
    <div class="coming-soon">
      <h2>🚧 À venir</h2>
      <p>Les statistiques seront bientôt disponibles.</p>
    </div>
  </div>
</div>
