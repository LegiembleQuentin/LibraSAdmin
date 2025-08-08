<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { authStore, authService } from '$lib/services/authService';
  import Navbar from '$lib/components/Navbar.svelte';

  let isAuthenticated = false;

  onMount(() => {
    authService.loadFromStorage();
    isAuthenticated = $authStore.isAuthenticated;
  });

  $: {
    isAuthenticated = $authStore.isAuthenticated;
  }

  $: showNavbar = isAuthenticated && $page.url.pathname !== '/';
</script>

<svelte:head>
  <title>LibraS Admin</title>
</svelte:head>

{#if showNavbar}
  <Navbar />
{/if}

<main class="main-content" class:with-navbar={showNavbar}>
  <slot />
</main>
