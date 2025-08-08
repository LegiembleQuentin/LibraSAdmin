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
  <title>Administration - Options</title>
</svelte:head>

<div class="page-container">
  <div class="page-header">
    <h1 class="page-title">Options</h1>
    <p class="page-subtitle">Configurez les paramètres de l'administration</p>
  </div>

  <div class="page-content">
    <div class="coming-soon">
      <h2>🚧 À venir</h2>
      <p>Les options de configuration seront bientôt disponibles.</p>
    </div>
  </div>
</div>
