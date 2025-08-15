<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let type: string = 'text';
  export let placeholder: string = '';
  export let value: string = '';
  export let label: string = '';
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let error: string = '';
  export let size: 'small' | 'medium' | 'large' = 'medium';
  export let min: string | number | undefined = undefined;
  export let max: string | number | undefined = undefined;
  export let step: string | number | undefined = undefined;
  
  const dispatch = createEventDispatcher();
</script>

<div class="form-group">
  {#if label}
    <label for="{label.toLowerCase().replace(/\s+/g, '-')}" class="form-label">
      {label}
    </label>
  {/if}
  
  <input
    {type}
    {placeholder}
    bind:value
    {required}
    {disabled}
    {min}
    {max}
    {step}
    id="{label.toLowerCase().replace(/\s+/g, '-')}"
    class="input"
    class:error={error}
    class:size-small={size === 'small'}
    class:size-medium={size === 'medium'}
    class:size-large={size === 'large'}
    on:input
    on:change
    on:focus
    on:blur
    on:keypress
  />
  
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

  .input {
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-md);
    color: var(--color-white);
    font-family: inherit;
    transition: all var(--transition-fast);
    backdrop-filter: blur(10px);
  }

  .input:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(255, 232, 21, 0.1);
  }

  .input::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  .input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .size-small {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    height: 36px;
  }

  .size-medium {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    height: 44px;
  }

  .size-large {
    padding: 1rem 1.25rem;
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

    .input[type="number"]::-webkit-outer-spin-button,
  .input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  .input[type="number"] {
    -moz-appearance: textfield;
  }

  /* Styles pour les inputs de type date */
  .input[type="date"]::-webkit-calendar-picker-indicator {
    background-color: transparent;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3e%3cpath fill='%23ffffff' d='M15 2V1a1 1 0 0 0-2 0v1H7V1a1 1 0 0 0-2 0v1H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-2zM3 6h14v10H3V6z'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 16px;
    width: 20px;
    height: 20px;
    border: none;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity var(--transition-fast);
  }
  
  .input[type="date"]::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
  }

  /* Pour Firefox */
  .input[type="date"] {
    position: relative;
  }
</style>