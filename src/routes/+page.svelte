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

  onMount(async () => {
    // Vérifier si l'utilisateur est déjà connecté
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (token) {
      goto('/dashboard');
    }
  });

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
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
  <div class="login-background"></div>
  
  <div class="login-container">
    <div class="login-header">
      <img src="/logo.png" alt="LibraS" class="login-logo-img" />
      <h1 class="login-brand-name">Libras-admin</h1>
    </div>
    
    <form on:submit|preventDefault={handleLogin} class="login-form">
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
