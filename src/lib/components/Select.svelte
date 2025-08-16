<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  
  export let value: any = '';
  export let label: string = '';

  export let disabled: boolean = false;
  export let error: string = '';
  export let size: 'small' | 'medium' | 'large' = 'medium';
  export let options: Array<{value: any, label: string}> = [];
  
  const dispatch = createEventDispatcher();
  
  let isOpen = false;
  let selectedText = '';
  let selectElement: HTMLElement;
  let selectId = `select-${Math.random().toString(36).substr(2, 9)}`;
  
  $: if (value && options.length > 0) {
    const option = options.find(opt => opt.value === value);
    selectedText = option ? option.label : '';
  }
  
  function toggleDropdown() {
    if (!disabled) {
      isOpen = !isOpen;
    }
  }
  
  function selectOption(optionValue: any, optionLabel: string) {
    value = optionValue;
    selectedText = optionLabel;
    isOpen = false;
    dispatch('change', { value: optionValue });
  }
  
  function handleClickOutside(event: MouseEvent) {
    if (selectElement && !selectElement.contains(event.target as Node)) {
      isOpen = false;
    }
  }
  
  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<div class="form-group">
  {#if label}
    <label class="form-label" for={selectId}>
      {label}
    </label>
  {/if}
  
  <div class="select-wrapper" bind:this={selectElement}>
    <div 
      id={selectId}
      class="select"
      class:error={error}
      class:size-small={size === 'small'}
      class:size-medium={size === 'medium'}
      class:size-large={size === 'large'}
      class:open={isOpen}
      class:disabled={disabled}
      on:click={toggleDropdown}
      role="button"
      tabindex="0"
      on:keydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleDropdown();
        }
      }}
    >
      <span class="select-value">{selectedText || 'Sélectionner...'}</span>
      <div class="select-arrow">▼</div>
    </div>
    
    {#if isOpen}
      <div class="dropdown">
        {#each options as option}
          <div 
            class="dropdown-option"
            class:selected={option.value === value}
            on:click={() => selectOption(option.value, option.label)}
            role="button"
            tabindex="0"
            on:keydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectOption(option.value, option.label);
              }
            }}
          >
            {option.label}
          </div>
        {/each}
      </div>
    {/if}
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
  }

  .select:hover:not(.disabled) {
    border-color: rgba(255, 255, 255, 0.2);
  }

  .select.open {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(255, 232, 21, 0.1);
  }

  .select:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(255, 232, 21, 0.1);
  }

  .select.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .select-value {
    flex: 1;
    padding-left: 0.75rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .select-arrow {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.8rem;
    padding-right: 0.75rem;
    transition: transform var(--transition-fast);
  }

  .select.open .select-arrow {
    transform: rotate(180deg);
    color: var(--color-accent);
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-md);
    margin-top: 0.25rem;
    max-height: 200px;
    overflow-y: auto;
    z-index: 999999;
    backdrop-filter: blur(10px);
    box-shadow: var(--shadow-lg);
    transform-origin: top;
    animation: dropdownSlide 0.2s ease-out;
  }

  @keyframes dropdownSlide {
    from {
      opacity: 0;
      transform: translateY(-10px) scaleY(0.8);
    }
    to {
      opacity: 1;
      transform: translateY(0) scaleY(1);
    }
  }

  .dropdown-option {
    padding: 0.75rem 1rem;
    color: var(--color-white);
    cursor: pointer;
    transition: background-color var(--transition-fast);
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
    font-family: inherit;
    font-size: inherit;
  }

  .dropdown-option:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .dropdown-option.selected {
    color: var(--color-accent);
    font-weight: 600;
  }

  .size-small {
    height: 36px;
    font-size: 0.9rem;
  }

  .size-medium {
    height: 44px;
    font-size: 1rem;
  }

  .size-large {
    height: 52px;
    font-size: 1.1rem;
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
