<svelte:options immutable={true} />

<script lang="ts">
  import Split, { type SplitInstance } from 'split-grid';
  import { createEventDispatcher, onMount, tick } from 'svelte';

  export { className as class };
  export let padding: string = '0';
  export let columns: string = 'none';
  export let gap: string = '0';
  export let rows: string = 'none';

  const dispatch = createEventDispatcher();

  let className: string = '';
  let div: HTMLDivElement;
  let split: SplitInstance;

  $: if (columns || rows) {
    setSplit();
  }

  onMount(() => {
    if (div) {
      setSplit();
    }
  });

  function onDragEnd(): void {
    if (div) {
      if (columns !== 'none') {
        const newSizes = div.style['grid-template-columns' as keyof CSSStyleDeclaration];
        dispatch('changeColumnSizes', newSizes);
        columns = `${newSizes}`;
      } else if (rows !== 'none') {
        const newSizes = div.style['grid-template-rows' as keyof CSSStyleDeclaration];
        rows = `${newSizes}`;
        dispatch('changeRowSizes', newSizes);
      }
    }
  }

  async function setSplit() {
    await tick();

    if (split) {
      split.destroy();
    }
    split = Split({ onDragEnd });

    if (div) {
      const columnGutters = div.querySelectorAll<HTMLDivElement>(':scope > .css-grid-gutter.column');
      const rowGutters = div.querySelectorAll<HTMLDivElement>(':scope > .css-grid-gutter.row');

      for (const columnGutter of Array.from(columnGutters)) {
        const track = columnGutter.getAttribute('data-track');
        if (track !== null) {
          const trackAsNumber = parseFloat(track);
          split.addColumnGutter(columnGutter, trackAsNumber);
        }
      }

      for (const rowGutter of Array.from(rowGutters)) {
        const track = rowGutter.getAttribute('data-track');
        if (track !== null) {
          const trackAsNumber = parseFloat(track);
          split.addRowGutter(rowGutter, trackAsNumber);
        }
      }
    }
  }
</script>

<div
  bind:this={div}
  class={className}
  style="gap: {gap}; grid-template-columns: {columns}; grid-template-rows: {rows}; padding: {padding}"
>
  <slot />
</div>

<style>
  div {
    display: grid;
  }
</style>
