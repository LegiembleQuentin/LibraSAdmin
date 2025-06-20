<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let mounted = false;

	onMount(() => {
		console.log('Layout mounting...');
		try {
			// Initialisation simplifiée pour déboguer
			mounted = true;
			console.log('Layout mounted successfully');
		} catch (error) {
			console.error('Error during mount:', error);
			mounted = true; // Force mounted même en cas d'erreur
		}
	});

	// Navigation items
	const navItems = [
		{ href: '/', label: 'Dashboard', icon: '📊' },
		{ href: '/users', label: 'Utilisateurs', icon: '👥' },
		{ href: '/books', label: 'Livres', icon: '📚' },
		{ href: '/tags', label: 'Tags', icon: '🏷️' },
	];

	$: isLoginPage = $page.url.pathname === '/login';
	
	// Simplification temporaire - on affiche toujours le contenu
	$: isAuthenticated = !isLoginPage;
</script>

<svelte:head>
	<title>LibraS Admin</title>
	<meta name="description" content="Interface d'administration LibraS" />
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
	{#if mounted}
		{#if isLoginPage}
			<!-- Page de connexion -->
			<main class="min-h-screen flex items-center justify-center">
				<slot />
			</main>
		{:else}
			<!-- Layout principal avec navigation -->
			<div class="flex h-screen">
				<!-- Sidebar -->
				<aside class="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
					<!-- Logo/Header -->
					<div class="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
						<div class="gradient-primary text-white px-4 py-2 rounded-lg font-bold text-lg">
							LibraS Admin
						</div>
					</div>
					
					<!-- Navigation -->
					<nav class="flex-1 mt-8">
						<ul class="space-y-2 px-4">
							{#each navItems as item}
								<li>
									<a
										href={item.href}
										class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 {
											$page.url.pathname === item.href 
												? 'bg-primary-100 dark:bg-primary-900/20 text-primary-900 dark:text-primary-400' 
												: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
										}"
									>
										<span class="text-xl">{item.icon}</span>
										<span class="font-medium">{item.label}</span>
									</a>
								</li>
							{/each}
						</ul>
					</nav>
					
					<!-- User info simplifié -->
					<div class="p-4 border-t border-gray-200 dark:border-gray-700">
						<div class="flex items-center space-x-3 mb-4">
							<div class="w-8 h-8 bg-primary-900 rounded-full flex items-center justify-center text-white font-medium">
								A
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-gray-900 dark:text-white truncate">
									Admin User
								</p>
								<p class="text-xs text-gray-500 dark:text-gray-400 truncate">
									admin@libras.com
								</p>
							</div>
						</div>
						
						<div class="flex space-x-2">
							<button
								class="flex-1 btn-outline text-sm py-2"
								title="Changer le thème"
							>
								🌙
							</button>
							<button
								class="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded-lg transition-colors duration-200"
							>
								Déconnexion
							</button>
						</div>
					</div>
				</aside>
				
				<!-- Main content -->
				<main class="flex-1 overflow-auto">
					<div class="p-8">
						<slot />
					</div>
				</main>
			</div>
		{/if}
	{:else}
		<!-- Loading state -->
		<div class="min-h-screen flex items-center justify-center">
			<div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-600"></div>
		</div>
	{/if}
</div>
