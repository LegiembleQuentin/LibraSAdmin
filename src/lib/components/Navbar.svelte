<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { authService } from '../services/authService';
  import Button from './Button.svelte';

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/livres', label: 'Livres' },
    { href: '/utilisateurs', label: 'Utilisateurs' },
    { href: '/stats', label: 'Stats' },
    { href: '/options', label: 'Options' }
  ];

  function handleLogout() {
    authService.logout();
    goto('/');
  }

  function isActive(href: string): boolean {
    return $page.url.pathname === href;
  }
</script>

<nav class="navbar">
  <div class="navbar-brand">
    <img src="/logo.png" alt="LibraS" class="navbar-logo" />
    <span class="navbar-title">LibraS-admin</span>
  </div>

  <div class="navbar-nav">
    {#each navItems as item}
      <a 
        href={item.href} 
        class="nav-link"
        class:active={isActive(item.href)}
      >
        {item.label}
      </a>
    {/each}
  </div>

  <div class="navbar-actions">
    <Button variant="secondary" on:click={handleLogout}>
      Se déconnecter
    </Button>
  </div>
</nav>
