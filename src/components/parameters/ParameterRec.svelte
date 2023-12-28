<svelte:options immutable={true} />

<script lang="ts">
  import type { User } from '../../types/app';
  import type { FormParameter, ParameterType } from '../../types/parameter';
  import type { ActionArray } from '../../utilities/useActions';

  export let disabled: boolean = false;
  export let expanded: boolean = false;
  export let formParameter: FormParameter;
  export let hideRightAdornments: boolean = false;
  export let labelColumnWidth: number = 200;
  export let level: number = 0;
  export let levelPadding: number = 20;
  export let parameterType: ParameterType = 'activity';
  export let use: ActionArray = [];
  export let user: User | null;

  let component: any;

  $: loadComponent(formParameter);

  async function loadComponent(formParameter: FormParameter) {
    if (formParameter.schema.type === 'series') {
      component = (await import('./ParameterRecSeries.svelte')).default;
    } else if (formParameter.schema.type === 'struct') {
      if (formParameter.schema.metadata?.activity) {
        component = (await import('./ParameterRecActivity.svelte')).default;
      } else {
        component = (await import('./ParameterRecStruct.svelte')).default;
      }
    }
  }
</script>

<svelte:component
  this={component}
  {disabled}
  {expanded}
  {formParameter}
  {user}
  {hideRightAdornments}
  {labelColumnWidth}
  {level}
  {levelPadding}
  {parameterType}
  {use}
  on:change
  on:reset
/>
