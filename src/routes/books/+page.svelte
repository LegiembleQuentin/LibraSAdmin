<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authService } from '../../lib/services/authService';
  import { bookService, type Book, type BookFilter, type Author, type Tag } from '../../lib/services/bookService';
  import Input from '$lib/components/Input.svelte';
  import Button from '$lib/components/Button.svelte';
  import Select from '$lib/components/Select.svelte';
  import BookEditModal from '$lib/components/BookEditModal.svelte';

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

  // Variables pour la modale de création
  let showCreateModal = false;
  let availableAuthors: Author[] = [];
  let availableTags: Tag[] = [];
  let emptyBook: Book = {
    id: 0,
    name: '',
    synopsis: '',
    nbVolume: 1,
    dateStart: new Date().toISOString().split('T')[0],
    dateEnd: '',
    authors: [],
    tags: []
  };

  onMount(async () => {
    const isAuthenticated = await authService.verifyAuth();
    if (!isAuthenticated) {
      goto('/');
      return;
    }
    await Promise.all([loadBooks(), loadAuthorsAndTags()]);
  });

  async function loadBooks() {
    try {
      loading = true;
      error = '';

      const response = await bookService.getBooksWithFilters(filter, currentPage, pageSize);
      console.log('Books response:', response);
      books = response.content;
      totalPages = response.totalPages;
      totalElements = response.totalElements;
      console.log('Books loaded:', books.length);
    } catch (err) {
      console.error('Error loading books:', err);
      error = err instanceof Error ? err.message : 'Erreur lors du chargement des livres';
    } finally {
      loading = false;
      console.log('Loading finished, books count:', books.length);
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

  async function loadAuthorsAndTags() {
    try {
      const books = await bookService.getAllBooks();
      const authorsMap = new Map<number, Author>();
      const tagsMap = new Map<number, Tag>();
      
      if (books && Array.isArray(books)) {
        books.forEach(book => {
          if (book.authors && Array.isArray(book.authors)) {
            book.authors.forEach(author => {
              if (author.id && author.name) {
                authorsMap.set(author.id, author);
              }
            });
          }
          if (book.tags && Array.isArray(book.tags)) {
            book.tags.forEach(tag => {
              if (tag.id && tag.name) {
                tagsMap.set(tag.id, tag);
              }
            });
          }
        });
      }
      
      availableAuthors = Array.from(authorsMap.values());
      availableTags = Array.from(tagsMap.values());
    } catch (err) {
      console.error('Error loading authors and tags:', err);
      availableAuthors = [];
      availableTags = [];
    }
  }

  function openCreateModal() {
    showCreateModal = true;
  }

  function closeCreateModal() {
    showCreateModal = false;
  }

  async function handleBookCreate(event: CustomEvent<Book>) {
    const newBook = event.detail;
    try {
      await bookService.createBook(newBook);
      closeCreateModal();
      await loadBooks();
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      error = err instanceof Error ? err.message : 'Erreur lors de la création';
    }
  }
</script>

<svelte:head>
  <title>Administration - Livres</title>
</svelte:head>

<div class="admin-page">
  <div class="filters-section">
    <div class="filters-header">
      <h3>Filtres de recherche</h3>
      <div class="filters-actions">
        <Button on:click={applyFilters} variant="secondary" size="small">
          Appliquer
        </Button>
        <Button on:click={clearFilters} variant="secondary" size="small">
          Réinitialiser
        </Button>
        <Button on:click={openCreateModal} variant="primary" size="medium">
          + Ajouter un livre
        </Button>
      </div>
    </div>
    
    <div class="filters-grid">
      <div class="filter-group">
        <Input
          bind:value={searchTerm}
          label="Titre"
          placeholder="Titre"
          size="medium"
        />
      </div>

      <div class="filter-group">
        <Input
          bind:value={author}
          label="Auteur"
          placeholder="Nom de l'auteur"
          size="medium"
        />
      </div>

      <div class="filter-group">
        <Select
          bind:value={isCompleted}
          label="Statut"
          options={[
            { value: undefined, label: 'Tous les statuts' },
            { value: true, label: 'Complété' },
            { value: false, label: 'En cours' }
          ]}
          size="medium"
        />
      </div>

      <div class="volume-filters">
        <Input
          bind:value={minVolumes}
          label="Nb volumes (min)"
          type="number"
          min="0"
          size="medium"
        />
        <Input
          bind:value={maxVolumes}
          label="Nb volumes (max)"
          type="number"
          min="0"
          size="medium"
        />
      </div>

      <div class="note-filters">
        <Input
          bind:value={minRating}
          label="Note (min)"
          type="number"
          min="0"
          max="5"
          step="0.1"
          size="medium"
        />
        <Input
          bind:value={maxRating}
          label="Note (max)"
          type="number"
          min="0"
          max="5"
          step="0.1"
          size="medium"
        />
      </div>

      <div class="date-filters">
        <Input
          bind:value={dateFrom}
          label="Date de début"
          type="date"
          size="medium"
        />
        <Input
          bind:value={dateTo}
          label="Date de fin"
          type="date"
          size="medium"
        />
      </div>
    </div>
  </div>

  {#if error}
    <div class="error-banner">
      <span class="error-text">{error}</span>
    </div>
  {/if}

  <div class="content-section">
    {#if loading}
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>Chargement des livres...</p>
      </div>
    {:else if books.length === 0}
      <div class="empty-state">
        <h3>Aucun livre trouvé</h3>
        <p>Aucun livre ne correspond aux critères de recherche.</p>
      </div>
    {:else}
      <div class="books-grid">
        {#each books as book}
          <div 
            class="book-card" 
            on:click={() => goto(`/books/${book.id}`)} 
            on:keydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goto(`/books/${book.id}`);
              }
            }}
            role="button" 
            tabindex="0"
          >
            <div class="book-image-container">
              {#if book.imgUrl}
                <img src={book.imgUrl} alt={book.name} class="book-image" />
              {:else}
                <div class="book-image-placeholder">
                  <span>📖</span>
                </div>
              {/if}
            </div>
            
            <div class="book-content">
              <h4 class="book-title">{book.name}</h4>
              
              {#if book.authors.length > 0}
                <p class="book-author">
                  {book.authors.map(a => a.name).join(', ')}
                </p>
              {/if}
              
              <div class="book-meta">
                <span class="meta-item">
                  {book.nbVolume} volume{book.nbVolume > 1 ? 's' : ''}
                </span>
                
                {#if book.note}
                  <span class="meta-item">
                    <span class="rating-star">★</span>
                    {book.note.toFixed(1)}/10
                  </span>
                {/if}
              </div>
              
              {#if book.tags.length > 0}
                <div class="book-tags">
                  {#each book.tags.slice(0, 3) as tag}
                    <span class="tag">{tag.name}</span>
                  {/each}
                  {#if book.tags.length > 3}
                    <span class="tag-more">+{book.tags.length - 3}</span>
                  {/if}
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
            size="small"
            disabled={currentPage === 0}
            on:click={() => goToPage(currentPage - 1)}
          >
            ← Précédent
          </Button>
          
          <div class="page-info">
            Page {currentPage + 1} sur {totalPages}
          </div>
          
          <Button 
            variant="secondary" 
            size="small"
            disabled={currentPage >= totalPages - 1}
            on:click={() => goToPage(currentPage + 1)}
          >
            Suivant →
          </Button>
        </div>
      {/if}
    {/if}
  </div>
</div>

<BookEditModal 
  isOpen={showCreateModal} 
  book={emptyBook}
  {availableAuthors}
  {availableTags}
  on:close={closeCreateModal}
  on:save={handleBookCreate}
/>

<style>
  /* Styles spécifiques aux filtres des livres */
  .volume-filters,
  .note-filters,
  .date-filters {
    display: flex;
    gap: 0.5rem;
  }

  .note-filters {
    margin-left: 2rem;
    margin-right: 2rem;
  }



  @media (max-width: 1200px) {
    .filters-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .volume-filters,
    .note-filters,
    .date-filters {
      grid-column: span 2;
    }
  }

  @media (max-width: 768px) {
    .filters-grid {
      grid-template-columns: 1fr;
    }

    .volume-filters,
    .note-filters,
    .date-filters {
      grid-column: span 1;
      flex-direction: column;
    }
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

  .error-text {
    color: #FF3B30;
    font-weight: 500;
  }

  /* Styles supprimés car maintenant dans le CSS global */

  .books-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .book-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    transition: all var(--transition-normal);
    backdrop-filter: blur(10px);
    min-height: 480px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
  }

  .book-card:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  .book-card:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(255, 232, 21, 0.1);
  }

  .book-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: rgba(255, 232, 21, 0.3);
  }

  .book-image-container {
    height: 320px;
    overflow: hidden;
    flex-shrink: 0;
  }

  .book-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform var(--transition-normal);
  }

  .book-card:hover .book-image {
    transform: scale(1.05);
  }

  .book-image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: rgba(255, 255, 255, 0.3);
  }

  .book-content {
    padding: 1rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .book-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    line-height: 1.3;
    color: var(--color-white);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .book-author {
    margin-bottom: 1rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .book-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .rating-star {
    color: var(--color-accent);
    font-size: 0.9rem;
  }

  .book-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: auto;
  }

  .tag {
    background: rgba(255, 232, 21, 0.1);
    color: var(--color-accent);
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid rgba(255, 232, 21, 0.2);
  }

  .tag-more {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.6);
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .page-info {
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
    min-width: 120px;
    text-align: center;
  }

  @media (max-width: 768px) {
    /* Styles déplacés dans le CSS global */





    .books-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .book-card {
      min-height: 420px;
    }

    .book-image-container {
      height: 240px;
    }

    .pagination {
      flex-direction: column;
      gap: 1rem;
    }
  }

  /* Media queries 480px déplacées dans le CSS global */
</style>

