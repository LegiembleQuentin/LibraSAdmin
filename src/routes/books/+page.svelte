<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authService } from '../../lib/services/authService';
  import { bookService, type Book, type BookFilter } from '../../lib/services/bookService';
  import Input from '$lib/components/Input.svelte';
  import Button from '$lib/components/Button.svelte';

  let books: Book[] = [];
  let loading = true;
  let error = '';
  let currentPage = 0;
  let totalPages = 0;
  let totalElements = 0;
  let pageSize = 20;

  let filter: BookFilter = {};
  let searchTerm = '';
  let selectedTags: string[] = [];
  let dateFrom = '';
  let dateTo = '';
  let author = '';
  let isCompleted: boolean | undefined = undefined;
  let minVolumes = '';
  let maxVolumes = '';
  let minRating = '';
  let maxRating = '';

  onMount(async () => {
    const isAuthenticated = await authService.verifyAuth();
    if (!isAuthenticated) {
      goto('/');
      return;
    }
    await loadBooks();
  });

  async function loadBooks() {
    try {
      loading = true;
      error = '';

      const response = await bookService.getBooksWithFilters(filter, currentPage, pageSize);
      books = response.content;
      totalPages = response.totalPages;
      totalElements = response.totalElements;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Erreur lors du chargement des livres';
    } finally {
      loading = false;
    }
  }

  function applyFilters() {
    filter = {
      search: searchTerm || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      author: author || undefined,
      isCompleted: isCompleted,
      minVolumes: minVolumes ? parseInt(minVolumes) : undefined,
      maxVolumes: maxVolumes ? parseInt(maxVolumes) : undefined,
      minRating: minRating ? parseFloat(minRating) : undefined,
      maxRating: maxRating ? parseFloat(maxRating) : undefined
    };
    currentPage = 0;
    loadBooks();
  }

  function clearFilters() {
    searchTerm = '';
    selectedTags = [];
    dateFrom = '';
    dateTo = '';
    author = '';
    isCompleted = undefined;
    minVolumes = '';
    maxVolumes = '';
    minRating = '';
    maxRating = '';
    filter = {};
    currentPage = 0;
    loadBooks();
  }

  function goToPage(page: number) {
    if (page >= 0 && page < totalPages) {
      currentPage = page;
      loadBooks();
    }
  }
</script>

<svelte:head>
  <title>Administration - Livres</title>
</svelte:head>

<div class="page-container">
  <div class="page-header">
    <h1 class="page-title">Gestion des Livres</h1>
    <p class="page-subtitle">Gérez le catalogue de livres de la bibliothèque</p>
  </div>

  <div class="page-content">
    <div class="filters-section">
      <h3>Filtres</h3>
      <div class="filters-grid">
        <Input
          label="Recherche"
          bind:value={searchTerm}
          placeholder="Rechercher un livre..."
        />
        
        <Input
          label="Auteur"
          bind:value={author}
          placeholder="Nom de l'auteur"
        />
        
        <Input
          label="Date de début"
          type="date"
          bind:value={dateFrom}
        />
        
        <Input
          label="Date de fin"
          type="date"
          bind:value={dateTo}
        />
        
        <Input
          label="Volumes min"
          type="number"
          bind:value={minVolumes}
          placeholder="0"
        />
        
        <Input
          label="Volumes max"
          type="number"
          bind:value={maxVolumes}
          placeholder="100"
        />
        
        <Input
          label="Note min"
          type="number"
          bind:value={minRating}
          placeholder="0"
        />
        
        <Input
          label="Note max"
          type="number"
          bind:value={maxRating}
          placeholder="5"
        />
      </div>
      
      <div class="filters-actions">
        <Button on:click={applyFilters}>
          Appliquer les filtres
        </Button>
        <Button variant="secondary" on:click={clearFilters}>
          Effacer les filtres
        </Button>
      </div>
    </div>

    {#if error}
      <div class="error-message">{error}</div>
    {/if}

    {#if loading}
      <div class="loading-section">
        <div class="spinner"></div>
        <p>Chargement des livres...</p>
      </div>
    {:else if books.length === 0}
      <div class="empty-section">
        <h3>Aucun livre trouvé</h3>
        <p>Aucun livre ne correspond aux critères de recherche.</p>
      </div>
    {:else}
      <div class="books-section">
        <div class="books-header">
          <h3>Livres ({totalElements} résultat{totalElements > 1 ? 's' : ''})</h3>
        </div>
        
        <div class="books-grid">
          {#each books as book}
            <div class="book-card">
              {#if book.imgUrl}
                <img src={book.imgUrl} alt={book.names[0]} class="book-image" />
              {:else}
                <div class="book-image-placeholder">
                  <span>📚</span>
                </div>
              {/if}
              
              <div class="book-info">
                <h4 class="book-title">{book.names[0]}</h4>
                {#if book.authors.length > 0}
                  <p class="book-author">Par {book.authors.map(a => a.name).join(', ')}</p>
                {/if}
                <p class="book-volumes">{book.nbVolume} volume{book.nbVolume > 1 ? 's' : ''}</p>
                {#if book.note}
                  <p class="book-rating">Note: {book.note}/5</p>
                {/if}
                {#if book.tags.length > 0}
                  <div class="book-tags">
                    {#each book.tags.slice(0, 3) as tag}
                      <span class="tag">{tag.name}</span>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>

        {#if totalPages > 1}
          <div class="pagination">
            <Button 
              variant="secondary" 
              disabled={currentPage === 0}
              on:click={() => goToPage(currentPage - 1)}
            >
              Précédent
            </Button>
            
            <span class="page-info">
              Page {currentPage + 1} sur {totalPages}
            </span>
            
            <Button 
              variant="secondary" 
              disabled={currentPage === totalPages - 1}
              on:click={() => goToPage(currentPage + 1)}
            >
              Suivant
            </Button>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
