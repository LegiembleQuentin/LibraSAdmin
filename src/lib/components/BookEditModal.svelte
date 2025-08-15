<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Modal from './Modal.svelte';
  import Input from './Input.svelte';
  import Select from './Select.svelte';
  import MultiSelect from './MultiSelect.svelte';
  import Button from './Button.svelte';
  import type { Book, Author, Tag } from '../services/bookService';
  
  export let isOpen = false;
  export let book: Book;
  export let availableAuthors: Author[] = [];
  export let availableTags: Tag[] = [];
  
  const dispatch = createEventDispatcher();
  
  let formData = {
    name: '',
    synopsis: '',
    nbVolume: 0,
    dateStart: '',
    dateEnd: '',
    authorIds: [] as number[],
    tagIds: [] as number[]
  };
  
  let errors: Record<string, string> = {};
  let isLoading = false;
  
  $: if (book && isOpen) {
    formData = {
      name: book.name || '',
      synopsis: book.synopsis || '',
      nbVolume: book.nbVolume || 0,
      dateStart: book.dateStart ? book.dateStart.split('T')[0] : '',
      dateEnd: book.dateEnd ? book.dateEnd.split('T')[0] : '',
      authorIds: book.authors?.map(a => a.id) || [],
      tagIds: book.tags?.map(t => t.id) || []
    };
  }
  
  $: authorOptions = (availableAuthors || []).map(author => ({
    value: author.id,
    label: author.name
  }));
  
  $: tagOptions = (availableTags || []).map(tag => ({
    value: tag.id,
    label: tag.name
  }));
  
  function validateForm(): boolean {
    errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Le titre est requis';
    }
    
    if (formData.nbVolume <= 0) {
      errors.nbVolume = 'Le nombre de volumes doit être supérieur à 0';
    }
    

    
    if (!formData.dateStart) {
      errors.dateStart = 'La date de début est requise';
    }
    
    if (formData.dateEnd && formData.dateStart && formData.dateEnd < formData.dateStart) {
      errors.dateEnd = 'La date de fin doit être postérieure à la date de début';
    }
    
    if (formData.authorIds.length === 0) {
      errors.authors = 'Au moins un auteur doit être sélectionné';
    }
    
    return Object.keys(errors).length === 0;
  }
  
  async function handleSave() {
    if (!validateForm()) {
      return;
    }
    
    isLoading = true;
    
    try {
      const updatedBook = {
        ...book,
        name: formData.name,
        synopsis: formData.synopsis,
        nbVolume: formData.nbVolume,
        dateStart: formData.dateStart,
        dateEnd: formData.dateEnd || undefined,
        authors: availableAuthors.filter(a => formData.authorIds.includes(a.id)),
        tags: availableTags.filter(t => formData.tagIds.includes(t.id))
      };
      
      dispatch('save', updatedBook);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      isLoading = false;
    }
  }
  
  function handleClose() {
    errors = {};
    dispatch('close');
  }
  
  function handleAuthorChange(selectedIds: number[]) {
    formData.authorIds = selectedIds;
    if (errors.authors) {
      delete errors.authors;
    }
  }
  
  function handleTagChange(selectedIds: number[]) {
    formData.tagIds = selectedIds;
  }
</script>

<Modal {isOpen} title="Modifier le livre" size="large" on:close={handleClose}>
  <form on:submit|preventDefault={handleSave} class="edit-form">
    <div class="form-grid">
      <div class="form-group full-width">
        <Input
          bind:value={formData.name}
          label="Titre"
          placeholder="Titre du livre"
          size="medium"
          required
          error={errors.name}
        />
      </div>
      
      <div class="form-group">
        <Input
          bind:value={formData.nbVolume}
          label="Nombre de volumes"
          type="number"
          min="1"
          size="medium"
          required
          error={errors.nbVolume}
        />
      </div>
      
      <div class="form-group date-group">
        <Input
          bind:value={formData.dateStart}
          label="Date de début"
          type="date"
          size="medium"
          required
          error={errors.dateStart}
        />
        <Input
          bind:value={formData.dateEnd}
          label="Date de fin"
          type="date"
          size="medium"
          error={errors.dateEnd}
        />
      </div>
      
      <div class="form-group full-width">
        <MultiSelect
          bind:value={formData.authorIds}
          options={authorOptions}
          label="Auteurs"
          placeholder="Sélectionner les auteurs"
          size="medium"
          on:change={(e) => handleAuthorChange(e.detail)}
        />
        {#if errors.authors}
          <span class="error-message">{errors.authors}</span>
        {/if}
      </div>
      
      <div class="form-group full-width">
        <MultiSelect
          bind:value={formData.tagIds}
          options={tagOptions}
          label="Tags"
          placeholder="Sélectionner les tags"
          size="medium"
          on:change={(e) => handleTagChange(e.detail)}
        />
      </div>
      
      <div class="form-group full-width">
        <label for="synopsis" class="textarea-label">Synopsis</label>
        <textarea
          id="synopsis"
          bind:value={formData.synopsis}
          placeholder="Description du livre..."
          class="synopsis-textarea"
          rows="4"
        ></textarea>
      </div>
    </div>
  </form>
  
  <div slot="footer" class="modal-actions">
    <Button
      variant="secondary"
      size="medium"
      on:click={handleClose}
      disabled={isLoading}
    >
      Annuler
    </Button>
    
    <Button
      variant="primary"
      size="medium"
      on:click={handleSave}
      disabled={isLoading}
      loading={isLoading}
    >
      {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
    </Button>
  </div>
</Modal>

<style>
  .edit-form {
    width: 100%;
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-group.full-width {
    grid-column: 1 / -1;
  }
  
  .form-group.date-group {
    grid-column: 1 / -1;
    display: flex;
    gap: 1rem;
  }
  
  .date-group > :global(.form-group) {
    flex: 1;
  }
  
  .textarea-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin-bottom: 0.25rem;
  }
  
  .synopsis-textarea {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-md);
    padding: 0.75rem 1rem;
    color: var(--color-text-primary);
    font-size: 0.875rem;
    font-family: inherit;
    resize: vertical;
    min-height: 100px;
    transition: all var(--transition-fast);
    outline: none;
  }
  
  .synopsis-textarea:hover {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }
  
  .synopsis-textarea:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 2px rgba(var(--color-accent-rgb), 0.2);
  }
  
  .synopsis-textarea::placeholder {
    color: var(--color-text-secondary);
  }
  
  .error-message {
    color: var(--color-error);
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
  
  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    width: 100%;
  }
  
  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .form-group.date-group {
      flex-direction: column;
      gap: 1rem;
    }
    
    .modal-actions {
      flex-direction: column-reverse;
    }
  }
</style>
