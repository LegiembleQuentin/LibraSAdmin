<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  
  export let isOpen = false;
  export let title = '';
  export let size: 'small' | 'medium' | 'large' | 'xl' = 'medium';
  
  const dispatch = createEventDispatcher();
  
  function closeModal() {
    dispatch('close');
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }
  
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  function handleBackdropKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      if (event.target === event.currentTarget) {
        closeModal();
      }
    }
  }
  
  onMount(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  });
  
  $: if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <div 
    class="modal-backdrop" 
    on:click={handleBackdropClick}
    on:keydown={handleBackdropKeydown}
    role="button"
    tabindex="0"
  >
    <div class="modal-container {size}">
      <div class="modal-header">
        <h2 class="modal-title">{title}</h2>
        <button class="modal-close" on:click={closeModal}>
          ✕
        </button>
      </div>
      
      <div class="modal-content">
        <slot />
      </div>
      
      <div class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
    box-sizing: border-box;
  }
  
  .modal-container {
    background: var(--color-bg-secondary);
    border-radius: var(--border-radius-lg);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: var(--shadow-xl);
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: modalSlide 0.3s ease-out;
  }
  
  .modal-container.small {
    width: 100%;
    max-width: 400px;
  }
  
  .modal-container.medium {
    width: 100%;
    max-width: 600px;
  }
  
  .modal-container.large {
    width: 100%;
    max-width: 800px;
  }
  
  .modal-container.xl {
    width: 100%;
    max-width: 1000px;
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.02);
  }
  
  .modal-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }
  
  .modal-close {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: var(--border-radius-sm);
    transition: all var(--transition-fast);
    line-height: 1;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-text-primary);
  }
  
  .modal-content {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
  }
  
  .modal-footer {
    padding: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.02);
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }
  
  @keyframes modalSlide {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @media (max-width: 768px) {
    .modal-backdrop {
      padding: 0.5rem;
    }
    
    .modal-container {
      max-height: 95vh;
    }
    
    .modal-header,
    .modal-content,
    .modal-footer {
      padding: 1rem;
    }
    
    .modal-title {
      font-size: 1.25rem;
    }
  }
</style>
