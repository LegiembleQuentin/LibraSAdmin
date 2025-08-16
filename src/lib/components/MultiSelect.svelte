<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  
  export let value: any[] = [];
  export let options: { value: any; label: string }[] = [];
  export let placeholder = 'Sélectionner...';
  export let label = '';
  export let size: 'small' | 'medium' | 'large' = 'medium';
  export let disabled = false;
  export let id = '';
  
  const dispatch = createEventDispatcher();
  
  let isOpen = false;
  let selectElement: HTMLDivElement;
  let uniqueId = id || `multiselect-${Math.random().toString(36).substr(2, 9)}`;
  
  $: selectedItems = options.filter(option => value.includes(option.value));
  $: displayText = selectedItems.length > 0 
    ? selectedItems.map(item => item.label).join(', ')
    : placeholder;
  
  function toggleDropdown() {
    if (!disabled) {
      isOpen = !isOpen;
    }
  }
  
  function selectOption(option: { value: any; label: string }) {
    const newValue = [...value];
    const index = newValue.findIndex(v => v === option.value);
    
    if (index > -1) {
      newValue.splice(index, 1);
    } else {
      newValue.push(option.value);
    }
    
    value = newValue;
    dispatch('change', value);
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      isOpen = false;
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleDropdown();
    }
  }

  function handleOptionKeydown(event: KeyboardEvent, option: { value: any; label: string }) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectOption(option);
    }
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

<div class="multiselect-wrapper">
  {#if label}
    <label for={uniqueId} class="multiselect-label">{label}</label>
  {/if}
  
  <div 
    bind:this={selectElement}
    class="multiselect {size}"
    class:disabled
    class:open={isOpen}
    on:click={toggleDropdown}
    on:keydown={handleKeydown}
    tabindex={disabled ? -1 : 0}
    role="button"
    aria-haspopup="listbox"
    aria-expanded={isOpen}
    aria-labelledby={label ? `${uniqueId}-label` : undefined}
    id={uniqueId}
  >
    <div class="multiselect-display">
      <span class="multiselect-text" class:placeholder={selectedItems.length === 0}>
        {displayText}
      </span>
      <span class="multiselect-arrow" class:rotated={isOpen}>▼</span>
    </div>
    
    {#if isOpen}
      <div class="multiselect-dropdown">
        {#each options as option}
          <div 
            class="multiselect-option"
            class:selected={value.includes(option.value)}
            on:click|stopPropagation={() => selectOption(option)}
            on:keydown={(event) => handleOptionKeydown(event, option)}
            role="option"
            aria-selected={value.includes(option.value)}
            tabindex="0"
          >
            <div class="option-checkbox">
              {#if value.includes(option.value)}
                ✓
              {/if}
            </div>
            <span class="option-label">{option.label}</span>
          </div>
        {/each}
        
        {#if options.length === 0}
          <div class="multiselect-empty">Aucune option disponible</div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .multiselect-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }
  
  .multiselect-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin-bottom: 0.25rem;
  }
  
  .multiselect {
    position: relative;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    outline: none;
  }
  
  .multiselect.small {
    min-height: 2.25rem;
  }
  
  .multiselect.medium {
    min-height: 2.75rem;
  }
  
  .multiselect.large {
    min-height: 3.25rem;
  }
  
  .multiselect:hover:not(.disabled) {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }
  
  .multiselect:focus:not(.disabled) {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 2px rgba(var(--color-accent-rgb), 0.2);
  }
  
  .multiselect.open {
    border-color: var(--color-accent);
  }
  
  .multiselect.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.02);
  }
  
  .multiselect-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    min-height: inherit;
    box-sizing: border-box;
  }
  
  .multiselect.small .multiselect-display {
    padding: 0.5rem 0.75rem;
  }
  
  .multiselect.large .multiselect-display {
    padding: 1rem 1.25rem;
  }
  
  .multiselect-text {
    color: var(--color-text-primary);
    font-size: 0.875rem;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }
  
  .multiselect-text.placeholder {
    color: var(--color-text-secondary);
  }
  
  .multiselect-arrow {
    color: var(--color-text-secondary);
    font-size: 0.75rem;
    transition: transform var(--transition-fast);
    margin-left: 0.5rem;
    flex-shrink: 0;
  }
  
  .multiselect-arrow.rotated {
    transform: rotate(180deg);
  }
  
  .multiselect-dropdown {
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
  
  .multiselect-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: background-color var(--transition-fast);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .multiselect-option:last-child {
    border-bottom: none;
  }
  
  .multiselect-option:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .multiselect-option.selected {
    background: rgba(var(--color-accent-rgb), 0.1);
  }
  
  .multiselect-option.selected:hover {
    background: rgba(var(--color-accent-rgb), 0.2);
  }
  
  .option-checkbox {
    width: 1rem;
    height: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: var(--color-accent);
    background: rgba(255, 255, 255, 0.05);
    flex-shrink: 0;
  }
  
  .multiselect-option.selected .option-checkbox {
    background: var(--color-accent);
    color: var(--color-bg-primary);
    border-color: var(--color-accent);
  }
  
  .option-label {
    color: var(--color-text-primary);
    font-size: 0.875rem;
    flex: 1;
  }
  
  .multiselect-option.selected .option-label {
    color: var(--color-accent);
    font-weight: 500;
  }
  
  .multiselect-empty {
    padding: 1rem;
    text-align: center;
    color: var(--color-text-secondary);
    font-size: 0.875rem;
  }
  
  @media (max-width: 768px) {
    .multiselect-dropdown {
      max-height: 150px;
    }
    
    .multiselect-option {
      padding: 0.625rem 0.75rem;
    }
  }
</style>
