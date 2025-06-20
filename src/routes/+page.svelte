<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '../lib/stores/auth.js';
  import { goto } from '$app/navigation';
  
  // Données statistiques (simulées pour l'instant)
  let stats = {
    totalUsers: 0,
    totalBooks: 0,
    totalComments: 0,
    newUsersThisMonth: 0,
    loading: true
  };
  
  let recentActivity = [
    { type: 'user', action: 'Nouvel utilisateur inscrit', user: 'john.doe@email.com', time: '5 min' },
    { type: 'book', action: 'Nouveau livre ajouté', book: 'Le Petit Prince', time: '12 min' },
    { type: 'comment', action: 'Nouveau commentaire', user: 'marie@email.com', time: '1h' },
    { type: 'user', action: 'Utilisateur supprimé', user: 'spam@email.com', time: '2h' }
  ];
  
  onMount(() => {
    // Vérifier l'authentification
    if (!$auth.isAuthenticated || !$auth.isAdmin) {
      goto('/login');
      return;
    }
    
    // Charger les statistiques
    loadStats();
  });
  
  async function loadStats() {
    try {
      // TODO: Remplacer par de vraies données de l'API
      // const response = await api.getStats();
      
      // Simulation de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      stats = {
        totalUsers: 1247,
        totalBooks: 856,
        totalComments: 3421,
        newUsersThisMonth: 89,
        loading: false
      };
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      stats.loading = false;
    }
  }
  
  function getActivityIcon(type: string) {
    switch (type) {
      case 'user': return '👤';
      case 'book': return '📚';
      case 'comment': return '💬';
      default: return '📊';
    }
  }
  
  function getActivityColor(type: string) {
    switch (type) {
      case 'user': return 'text-blue-600 dark:text-blue-400';
      case 'book': return 'text-green-600 dark:text-green-400';
      case 'comment': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  }
</script>

<svelte:head>
  <title>Dashboard - LibraS Admin</title>
</svelte:head>

<div class="space-y-8">
  <!-- Header -->
  <div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
      Tableau de bord
    </h1>
    <p class="text-gray-600 dark:text-gray-400 mt-2">
      Bienvenue dans votre interface d'administration LibraS
    </p>
  </div>
  
  <!-- Statistiques principales -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Total utilisateurs -->
    <div class="card p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <span class="text-2xl">👥</span>
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Utilisateurs
          </p>
          {#if stats.loading}
            <div class="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
          {:else}
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalUsers.toLocaleString()}
            </p>
          {/if}
        </div>
      </div>
    </div>
    
    <!-- Total livres -->
    <div class="card p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <span class="text-2xl">📚</span>
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Livres
          </p>
          {#if stats.loading}
            <div class="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
          {:else}
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalBooks.toLocaleString()}
            </p>
          {/if}
        </div>
      </div>
    </div>
    
    <!-- Total commentaires -->
    <div class="card p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <span class="text-2xl">💬</span>
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Commentaires
          </p>
          {#if stats.loading}
            <div class="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
          {:else}
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalComments.toLocaleString()}
            </p>
          {/if}
        </div>
      </div>
    </div>
    
    <!-- Nouveaux utilisateurs -->
    <div class="card p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/20 rounded-lg flex items-center justify-center">
            <span class="text-2xl">📈</span>
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
            Nouveaux ce mois
          </p>
          {#if stats.loading}
            <div class="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
          {:else}
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              +{stats.newUsersThisMonth}
            </p>
          {/if}
        </div>
      </div>
    </div>
  </div>
  
  <!-- Actions rapides -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <a href="/users" class="card p-6 hover:shadow-lg transition-shadow duration-200 group">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-900 dark:group-hover:text-primary-400">
            Gérer les utilisateurs
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Voir, modifier et supprimer des comptes utilisateurs
          </p>
        </div>
        <span class="text-2xl">👥</span>
      </div>
    </a>
    
    <a href="/books" class="card p-6 hover:shadow-lg transition-shadow duration-200 group">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-900 dark:group-hover:text-primary-400">
            Gérer les livres
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Ajouter, modifier et organiser la bibliothèque
          </p>
        </div>
        <span class="text-2xl">📚</span>
      </div>
    </a>
    
    <a href="/tags" class="card p-6 hover:shadow-lg transition-shadow duration-200 group">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-900 dark:group-hover:text-primary-400">
            Gérer les tags
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Organiser et catégoriser le contenu
          </p>
        </div>
        <span class="text-2xl">🏷️</span>
      </div>
    </a>
  </div>
  
  <!-- Activité récente -->
  <div class="card">
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
        Activité récente
      </h2>
    </div>
    <div class="divide-y divide-gray-200 dark:divide-gray-700">
      {#each recentActivity as activity}
        <div class="px-6 py-4">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <span class="text-xl">{getActivityIcon(activity.type)}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {activity.action}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {activity.user || activity.book || ''} • il y a {activity.time}
              </p>
            </div>
            <div class="flex-shrink-0">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getActivityColor(activity.type)} bg-gray-100 dark:bg-gray-800">
                {activity.type}
              </span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
