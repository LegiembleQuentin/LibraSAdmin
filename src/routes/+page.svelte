<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authService, authStore, type LoginCredentials } from '../lib/services/authService';
  import Input from '$lib/components/Input.svelte';
  import Button from '$lib/components/Button.svelte';

  let email = '';
  let password = '';
  let loading = false;
  let error = '';

  // Vérifier si l'utilisateur est déjà connecté
  onMount(async () => {
    const isAuthenticated = await authService.verifyAuth();
    if (isAuthenticated) {
      goto('/dashboard');
    }
  });

  async function handleLogin() {
    if (!email || !password) {
      error = 'Veuillez remplir tous les champs';
      return;
    }

    loading = true;
    error = '';

    try {
      const credentials: LoginCredentials = { email, password };
      await authService.login(credentials);
      goto('/dashboard');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Une erreur est survenue';
    } finally {
      loading = false;
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleLogin();
    }
  }
</script>

<svelte:head>
  <title>Administration - Connexion</title>
</svelte:head>

<div class="login-page">
  <div class="login-container">
    <div class="login-header">
      <div class="login-logo">📚</div>
      <div class="login-subtitle">Nom de l'application que j'ai pas encore</div>
    </div>

    <div class="login-form">
      <h2 class="login-title">Connexion Admin</h2>
      
      <form on:submit|preventDefault={handleLogin} class="form">
        <Input
          label="Email"
          type="email"
          bind:value={email}
          placeholder="admin@example.com"
          required
          disabled={loading}
        />

        <Input
          label="Mot de passe"
          type="password"
          bind:value={password}
          placeholder="••••••••"
          required
          disabled={loading}
        />

        {#if error}
          <div class="error-message">{error}</div>
        {/if}

        <Button type="submit" disabled={loading} loading={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
    </div>
  </div>
</div>
