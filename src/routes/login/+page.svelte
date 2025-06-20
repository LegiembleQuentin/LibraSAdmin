<script lang="ts">
  import { goto } from '$app/navigation';
  import { auth } from '../../lib/stores/auth.js';
  import { api } from '../../lib/services/api.js';
  import { onMount } from 'svelte';
  
  let email = '';
  let password = '';
  let loading = false;
  let error = '';
  
  onMount(() => {
    // Rediriger si déjà connecté
    if ($auth.isAuthenticated && $auth.isAdmin) {
      goto('/');
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
      // Première étape : authentification
      const loginResponse = await api.login({ email, password });
      
      // Deuxième étape : décoder le token pour obtenir les infos utilisateur
      // Pour l'instant, on simule les données utilisateur
      // TODO: Implémenter la récupération des données utilisateur depuis le token ou un endpoint
      const mockUser = {
        id: 1,
        email: email,
        displayname: 'Admin User',
        name: 'Admin',
        fname: 'User',
        roles: ['ADMIN'],
        created_at: new Date().toISOString()
      };
      
      auth.login(loginResponse.token, mockUser);
      goto('/');
      
    } catch (err) {
      console.error('Erreur de connexion:', err);
      error = err instanceof Error ? err.message : 'Erreur de connexion';
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
  <title>Connexion - LibraS Admin</title>
</svelte:head>

<div class="w-full max-w-md">
  <div class="card p-8">
    <!-- Logo -->
    <div class="text-center mb-8">
      <div class="gradient-primary text-white px-6 py-3 rounded-lg font-bold text-2xl inline-block mb-4">
        LibraS
      </div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Administration
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Connectez-vous pour accéder au panneau d'administration
      </p>
    </div>
    
    <!-- Formulaire -->
    <form on:submit|preventDefault={handleLogin} class="space-y-6">
      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Adresse email
        </label>
        <input
          id="email"
          type="email"
          bind:value={email}
          on:keypress={handleKeyPress}
          disabled={loading}
          class="input-field"
          placeholder="admin@libras.com"
          required
        />
      </div>
      
      <!-- Mot de passe -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          bind:value={password}
          on:keypress={handleKeyPress}
          disabled={loading}
          class="input-field"
          placeholder="••••••••"
          required
        />
      </div>
      
      <!-- Message d'erreur -->
      {#if error}
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-400">
                Erreur de connexion
              </h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        </div>
      {/if}
      
      <!-- Bouton de connexion -->
      <button
        type="submit"
        disabled={loading}
        class="w-full btn-primary {loading ? 'opacity-50 cursor-not-allowed' : ''}"
      >
        {#if loading}
          <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Connexion en cours...
          </div>
        {:else}
          Se connecter
        {/if}
      </button>
    </form>
    
    <!-- Note de sécurité -->
    <div class="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
      <div class="flex">
        <div class="flex-shrink-0">
          <span class="text-primary-600 dark:text-primary-400">🔒</span>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-primary-800 dark:text-primary-400">
            Accès restreint
          </h3>
          <div class="mt-1 text-sm text-primary-700 dark:text-primary-300">
            Seuls les utilisateurs avec le rôle administrateur peuvent accéder à cette interface.
          </div>
        </div>
      </div>
    </div>
  </div>
</div> 