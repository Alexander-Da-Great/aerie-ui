<svelte:options accessors={true} immutable={true} />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { useActions, type ActionArray } from '../../utilities/useActions';

  export let use: ActionArray = [];

  export let disabled: boolean = false;
  export let selected: boolean = false;

  const dispatch = createEventDispatcher();

  function onClick(event: MouseEvent) {
    if (disabled) {
      event.stopPropagation();
    } else {
      event.preventDefault();
      dispatch('click', event);
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-interactive-supports-focus -->
<div class="menu-item" class:disabled class:selected role="menuitem" use:useActions={use} on:click={onClick}>
  <slot />
</div>

<style>
  .menu-item {
    align-items: center;
    display: grid;
    font-size: var(--aerie-menu-item-font-size, 13px);
    gap: var(--aerie-menu-item-gap, 0.5rem);
    grid-template-columns: var(--aerie-menu-item-template-columns, 1rem auto);
    justify-content: flex-start;
    line-height: var(--aerie-menu-item-line-height, 24px);
    overflow: hidden;
    padding: var(--aerie-menu-item-padding, 8px);
    text-overflow: ellipsis;
    user-select: none;
    white-space: nowrap;
    width: 100%;
  }

  .menu-item:hover {
    background: var(--st-gray-20);
  }

  .menu-item.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .menu-item.selected {
    background: var(--st-gray-20);
  }
</style>
