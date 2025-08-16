<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { authService } from '../services/authService';
  import Button from './Button.svelte';
  import { onMount } from 'svelte';

  const navItems = [
    { href: '/books', label: 'Livres' },
    { href: '/users', label: 'Utilisateurs' },
    { href: '/stats', label: 'Stats' },
    { href: '/options', label: 'Options' }
  ];

  let isMenuOpen = false;

  function handleLogout() {
    authService.logout();
    goto('/');
  }

  function isActive(href: string): boolean {
    return $page.url.pathname === href;
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function closeMenu() {
    isMenuOpen = false;
  }

  onMount(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.navbar')) {
        closeMenu();
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<nav class="navbar">
  <div class="navbar-brand">
    <img src="/logo.png" alt="LibraS" class="navbar-logo" />
    <span class="navbar-title">LibraS-admin</span>
  </div>

  <button class="navbar-toggle" on:click={toggleMenu} aria-label="Menu">
    <span class="hamburger" class:active={isMenuOpen}></span>
  </button>

  <div class="navbar-nav" class:open={isMenuOpen}>
    {#each navItems as item}
      <a 
        href={item.href} 
        class="nav-link"
        class:active={isActive(item.href)}
        on:click={closeMenu}
      >
        {item.label}
      </a>
    {/each}
  </div>

  <div class="navbar-actions" class:open={isMenuOpen}>
    <Button variant="secondary" on:click={handleLogout}>
      Se déconnecter
    </Button>
  </div>
</nav>
