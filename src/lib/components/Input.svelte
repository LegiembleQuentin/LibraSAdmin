<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let type: string = 'text';
  export let placeholder: string = '';
  export let value: string = '';
  export let label: string = '';
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let error: string = '';
  
  // Forward events
  function createEventForwarder() {
    return function(event: Event) {
      dispatch(event.type, event);
    };
  }
  
  const dispatch = createEventDispatcher();
</script>

<div class="form-group">
  {#if label}
    <label for="{label.toLowerCase()}" class="form-label">
      {label}
    </label>
  {/if}
  
  <input
    {type}
    {placeholder}
    bind:value
    {required}
    {disabled}
    id="{label.toLowerCase()}"
    class="input"
    class:error={error}
    on:input={createEventForwarder()}
    on:change={createEventForwarder()}
    on:focus={createEventForwarder()}
    on:blur={createEventForwarder()}
    on:keypress={createEventForwarder()}
  />
  
  {#if error}
    <div class="error-message">{error}</div>
  {/if}
</div>
  
  <style>
    .error {
      border-color: #ff6b6b !important;
    }
  </style>