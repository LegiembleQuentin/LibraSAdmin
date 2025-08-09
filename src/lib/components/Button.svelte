<script lang="ts">
  export let variant: 'primary' | 'secondary' = 'primary';
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let size: 'small' | 'medium' | 'large' = 'medium';
</script>

<button
  {type}
  {disabled}
  class="btn"
  class:btn-secondary={variant === 'secondary'}
  class:loading={loading}
  class:size-small={size === 'small'}
  class:size-medium={size === 'medium'}
  class:size-large={size === 'large'}
  on:click
>
  {#if loading}
    <div class="spinner"></div>
  {:else}
    <slot />
  {/if}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: none;
    border-radius: var(--border-radius-md);
    font-family: inherit;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    text-decoration: none;
    white-space: nowrap;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn:not(:disabled):hover {
    transform: translateY(-1px);
  }

  .btn:not(:disabled):active {
    transform: translateY(0);
  }



  .btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-white);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .btn-secondary:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: var(--shadow-sm);
  }

  .size-small {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    height: 32px;
  }

  .size-medium {
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
    height: 40px;
  }

  .size-large {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    height: 48px;
  }

  .loading {
    pointer-events: none;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
