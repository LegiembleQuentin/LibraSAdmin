<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { authService } from '../services/authService';
  import Button from './Button.svelte';

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/livres', label: 'Livres', icon: '📚' },
    { href: '/utilisateurs', label: 'Utilisateurs', icon: '👥' },
    { href: '/stats', label: 'Stats', icon: '📈' },
    { href: '/options', label: 'Options', icon: '⚙️' }
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
        <span class="nav-icon">{item.icon}</span>
        <span class="nav-label">{item.label}</span>
      </a>
    {/each}
  </div>

  <div class="navbar-actions">
    <Button variant="secondary" on:click={handleLogout}>
      Se déconnecter
    </Button>
  </div>
</nav>
