<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { authService } from '../../../lib/services/authService';
  import { bookService, type Book } from '../../../lib/services/bookService';
  import Button from '$lib/components/Button.svelte';

  export let data: { id: string };

  let book: Book | null = null;
  let loading = true;
  let error = '';

  onMount(async () => {
    const isAuthenticated = await authService.verifyAuth();
    if (!isAuthenticated) {
      goto('/');
      return;
    }
    await loadBook();
  });

  async function loadBook() {
    try {
      loading = true;
      error = '';
      book = await bookService.getBookById(data.id);
    } catch (err) {
      console.error('Error loading book:', err);
      error = err instanceof Error ? err.message : 'Erreur lors du chargement du livre';
    } finally {
      loading = false;
    }
  }

  function goBack() {
    goto('/books');
  }
</script>

<svelte:head>
  <title>{book ? `${book.name} - Détails` : 'Chargement...'}</title>
</svelte:head>

<div class="admin-page">
  <div class="page-header">
    <div class="header-content">
      <Button on:click={goBack} variant="secondary" size="small">
        ← Retour
      </Button>
      <h1>Détails du Livre</h1>
    </div>
  </div>

  {#if loading}
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Chargement des détails...</p>
    </div>
  {:else if error}
    <div class="error-banner">
      <span class="error-icon">⚠️</span>
      <span class="error-text">{error}</span>
    </div>
  {:else if book}
    <div class="book-detail">
      <div class="book-header">
        <div class="book-image-container">
          {#if book.imgUrl}
            <img src={book.imgUrl} alt={book.name} class="book-image" />
          {:else}
            <div class="book-placeholder">
              <span>📚</span>
            </div>
          {/if}
        </div>
        
        <div class="book-info">
          <h2 class="book-title">{book.name}</h2>
          <p class="book-author">par {book.authors.map(a => a.name).join(', ')}</p>
          
          <div class="book-meta">
            <div class="meta-item">
              <span class="meta-label">Note</span>
              <span class="meta-value rating">
                ⭐ {book.note ? book.note.toFixed(1) : 'N/A'}/10
              </span>
            </div>
            
            <div class="meta-item">
              <span class="meta-label">Volumes</span>
              <span class="meta-value">{book.nbVolume}</span>
            </div>
            
            <div class="meta-item">
              <span class="meta-label">Visites</span>
              <span class="meta-value visits">
                {book.nbVisit || 0}
              </span>
            </div>
            
            <div class="meta-item">
              <span class="meta-label">Statut</span>
              <span class="meta-value status" class:completed={book.userStatus === 'completed'}>
                {book.userStatus === 'completed' ? 'Complété' : 'En cours'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="book-content">
        <div class="content-section">
          <h3>Synopsis</h3>
          <p class="book-description">
            {book.synopsis || 'Aucun synopsis disponible.'}
          </p>
        </div>

        {#if book.tags && book.tags.length > 0}
          <div class="content-section">
            <h3>Tags</h3>
            <div class="book-tags">
              {#each book.tags as tag}
                <span class="tag">{tag.name}</span>
              {/each}
            </div>
          </div>
        {/if}

        <div class="content-section">
          <h3>Informations</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Date de début</span>
              <span class="info-value">
                {book.dateStart ? new Date(book.dateStart).toLocaleDateString('fr-FR') : 'Non définie'}
              </span>
            </div>
            
            <div class="info-item">
              <span class="info-label">Date de fin</span>
              <span class="info-value">
                {book.dateEnd ? new Date(book.dateEnd).toLocaleDateString('fr-FR') : 'Non définie'}
              </span>
            </div>
            
            <div class="info-item">
              <span class="info-label">ID</span>
              <span class="info-value id-value">{book.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="error-banner">
      <span class="error-icon">❌</span>
      <span class="error-text">Livre non trouvé</span>
    </div>
  {/if}
</div>

<style>
  .admin-page {
    min-height: 100vh;
    background: var(--color-bg);
    color: var(--color-text);
    padding: 2rem;
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .header-content h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
    color: var(--color-white);
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top: 3px solid var(--color-accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-banner {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(255, 59, 48, 0.1);
    border: 1px solid rgba(255, 59, 48, 0.3);
    border-radius: var(--border-radius-md);
    padding: 1rem 1.5rem;
    margin-bottom: 2rem;
  }

  .error-icon {
    font-size: 1.2rem;
  }

  .error-text {
    color: #FF3B30;
    font-weight: 500;
  }

  .book-detail {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-lg);
    backdrop-filter: blur(10px);
    overflow: hidden;
  }

  .book-header {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    padding: 2rem;
    background: rgba(0, 0, 0, 0.2);
  }

  .book-image-container {
    width: 300px;
    height: 400px;
    border-radius: var(--border-radius-md);
    overflow: hidden;
    background: rgba(0, 0, 0, 0.3);
  }

  .book-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .book-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    color: rgba(255, 255, 255, 0.3);
  }

  .book-info {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .book-title {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-white);
    line-height: 1.2;
  }

  .book-author {
    margin: 0;
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.8);
    font-style: italic;
  }

  .book-meta {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .meta-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .meta-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .meta-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-white);
  }

  .rating {
    color: var(--color-accent);
  }

  .visits {
    color: rgba(255, 255, 255, 0.9);
  }

  .status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.9rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .status.completed {
    background: rgba(52, 199, 89, 0.2);
    border-color: rgba(52, 199, 89, 0.4);
    color: #34C759;
  }

  .book-content {
    padding: 2rem;
  }

  .content-section {
    margin-bottom: 2rem;
  }

  .content-section:last-child {
    margin-bottom: 0;
  }

  .content-section h3 {
    margin: 0 0 1rem 0;
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--color-white);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.5rem;
  }

  .book-description {
    margin: 0;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
  }

  .book-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    background: rgba(255, 232, 21, 0.1);
    color: var(--color-accent);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    border: 1px solid rgba(255, 232, 21, 0.2);
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .info-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .info-value {
    font-size: 1rem;
    color: var(--color-white);
    font-weight: 500;
  }

  .id-value {
    font-family: monospace;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .admin-page {
      padding: 1rem;
    }

    .book-header {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      padding: 1.5rem;
    }

    .book-image-container {
      width: 100%;
      height: 300px;
    }

    .book-title {
      font-size: 2rem;
    }

    .book-meta {
      gap: 1rem;
    }

    .info-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
