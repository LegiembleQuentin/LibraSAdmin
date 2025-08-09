<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let value: any = '';
  export let label: string = '';
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let error: string = '';
  export let size: 'small' | 'medium' | 'large' = 'medium';
  
  const dispatch = createEventDispatcher();
</script>

<div class="form-group">
  {#if label}
    <label for="{label.toLowerCase()}" class="form-label">
      {label}
    </label>
  {/if}
  
  <div class="select-wrapper">
    <select
      bind:value
      {required}
      {disabled}
      id="{label.toLowerCase()}"
      class="select"
      class:error={error}
      class:size-small={size === 'small'}
      class:size-medium={size === 'medium'}
      class:size-large={size === 'large'}
      on:change
      on:focus
      on:blur
    >
      <slot />
    </select>
    <div class="select-arrow">▼</div>
  </div>
  
  {#if error}
    <div class="error-message">{error}</div>
  {/if}
</div>
  
<style>
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .select-wrapper {
    position: relative;
    width: 100%;
  }

  .select {
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-md);
    color: var(--color-white);
    font-family: inherit;
    transition: all var(--transition-fast);
    backdrop-filter: blur(10px);
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  .select:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(255, 232, 21, 0.1);
  }

  .select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .select-arrow {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.8rem;
    pointer-events: none;
    transition: color var(--transition-fast);
  }

  .select:focus + .select-arrow {
    color: var(--color-accent);
  }

  .size-small {
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    font-size: 0.9rem;
    height: 36px;
  }

  .size-medium {
    padding: 0.75rem 2rem 0.75rem 1rem;
    font-size: 1rem;
    height: 44px;
  }

  .size-large {
    padding: 1rem 2rem 1rem 1.25rem;
    font-size: 1.1rem;
    height: 52px;
  }

  .error {
    border-color: #ff6b6b !important;
  }

  .error-message {
    color: #ff6b6b;
    font-size: 0.85rem;
    margin-top: 0.25rem;
  }
</style>
