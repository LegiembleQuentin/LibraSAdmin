<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { authService } from '$lib/services/authService';
  import Navbar from '$lib/components/Navbar.svelte';

  let isAuthenticated = false;
  let loading = true;

  onMount(async () => {
    isAuthenticated = await authService.verifyAuth();
    loading = false;
  });

  $: showNavbar = isAuthenticated && !loading && $page.url.pathname !== '/';
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
