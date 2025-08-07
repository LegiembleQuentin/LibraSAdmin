<script lang="ts">
  export let variant: 'primary' | 'secondary' = 'primary';
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
</script>

<button
  {type}
  {disabled}
  class="btn"
  class:btn-secondary={variant === 'secondary'}
  class:loading={loading}
  on:click
>
  {#if loading}
    <div class="spinner"></div>
  {:else}
    <slot />
  {/if}
</button>

<style>
  .loading {
    pointer-events: none;
  }
</style>
