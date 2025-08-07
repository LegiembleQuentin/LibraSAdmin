<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authService, authStore, type LoginCredentials } from '../lib/services/authService';

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

<div class="login-container">
  <div class="login-card">
    <div class="login-header">
      <h1>🔐 Administration</h1>
      <p>Connectez-vous avec vos identifiants administrateur</p>
    </div>

    <form on:submit|preventDefault={handleLogin} class="login-form">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          on:keypress={handleKeyPress}
          placeholder="admin@example.com"
          required
          disabled={loading}
        />
      </div>

      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          on:keypress={handleKeyPress}
          placeholder="••••••••"
          required
          disabled={loading}
        />
      </div>

      {#if error}
        <div class="error-message">
          {error}
        </div>
      {/if}

      <button type="submit" class="login-button" disabled={loading}>
        {#if loading}
          <span class="spinner"></span>
          Connexion...
        {:else}
          Se connecter
        {/if}
      </button>
    </form>

    <div class="login-footer">
      <p>Seuls les administrateurs peuvent accéder à cette interface.</p>
    </div>
  </div>
</div>

<style>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
  }

  .login-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 100%;
    max-width: 400px;
  }

  .login-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .login-header h1 {
    margin: 0 0 10px 0;
    font-size: 2rem;
    color: #2d3748;
  }

  .login-header p {
    margin: 0;
    color: #718096;
    font-size: 0.9rem;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .form-group label {
    font-weight: 500;
    color: #4a5568;
    font-size: 0.9rem;
  }

  .form-group input {
    padding: 12px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .form-group input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .form-group input:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
  }

  .error-message {
    background-color: #fed7d7;
    color: #c53030;
    padding: 12px;
    border-radius: 8px;
    font-size: 0.9rem;
    text-align: center;
    border: 1px solid #feb2b2;
  }

  .login-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 14px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .login-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  .login-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .login-footer {
    text-align: center;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #e2e8f0;
  }

  .login-footer p {
    margin: 0;
    color: #a0aec0;
    font-size: 0.8rem;
  }
</style>
