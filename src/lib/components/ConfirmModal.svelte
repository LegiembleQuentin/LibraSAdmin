<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Modal from './Modal.svelte';
  import Button from './Button.svelte';
  
  export let isOpen = false;
  export let title = 'Confirmer l\'action';
  export let message = 'Êtes-vous sûr de vouloir continuer ?';
  export let confirmText = 'Confirmer';
  export let cancelText = 'Annuler';
  export let variant: 'danger' | 'warning' | 'info' = 'danger';
  export let isLoading = false;
  
  const dispatch = createEventDispatcher();
  
  function handleConfirm() {
    dispatch('confirm');
  }
  
  function handleCancel() {
    dispatch('cancel');
  }
</script>

<Modal {isOpen} {title} size="small" on:close={handleCancel}>
  <div class="confirm-content">
    <div class="confirm-icon {variant}">
      {#if variant === 'danger'}
        ⚠️
      {:else if variant === 'warning'}
        ⚠️
      {:else}
        ℹ️
      {/if}
    </div>
    
    <p class="confirm-message">{message}</p>
  </div>
  
  <div slot="footer" class="confirm-actions">
    <Button
      variant="secondary"
      size="medium"
      on:click={handleCancel}
      disabled={isLoading}
    >
      {cancelText}
    </Button>
    
    <Button
      variant="primary"
      size="medium"
      on:click={handleConfirm}
      disabled={isLoading}
      loading={isLoading}
      class="btn-{variant}"
    >
      {isLoading ? 'Traitement...' : confirmText}
    </Button>
  </div>
</Modal>

<style>
  .confirm-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 1rem 0;
    text-align: center;
  }
  
  .confirm-icon {
    font-size: 3rem;
    opacity: 0.8;
  }
  
  .confirm-icon.danger {
    filter: hue-rotate(0deg);
  }
  
  .confirm-icon.warning {
    filter: hue-rotate(30deg);
  }
  
  .confirm-icon.info {
    filter: hue-rotate(200deg);
  }
  
  .confirm-message {
    font-size: 1rem;
    color: var(--color-text-primary);
    line-height: 1.5;
    margin: 0;
    max-width: 300px;
  }
  
  .confirm-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    width: 100%;
  }
  
  :global(.btn-danger) {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    border-color: #dc2626;
  }
  
  :global(.btn-danger:hover:not(:disabled)) {
    background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
    border-color: #b91c1c;
  }
  
  :global(.btn-warning) {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    border-color: #f59e0b;
  }
  
  :global(.btn-warning:hover:not(:disabled)) {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    border-color: #d97706;
  }
  
  @media (max-width: 768px) {
    .confirm-actions {
      flex-direction: column-reverse;
    }
    
    .confirm-message {
      font-size: 0.9rem;
    }
    
    .confirm-icon {
      font-size: 2.5rem;
    }
  }
</style>
