<svelte:options immutable={true} />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { modelId, plan } from '../../stores/plan';
  import type { ActivityPreset } from '../../types/activity';
  import type { User } from '../../types/app';
  import type { FormParameter, ParameterType } from '../../types/parameter';
  import type { ValueSchemaStruct } from '../../types/schema';
  import { isRecParameter } from '../../utilities/parameters';
  import type { ActionArray } from '../../utilities/useActions';
  import Collapse from '../Collapse.svelte';
  import ActivityParameterPresetInput from './ActivityParameterPresetInput.svelte';
  import ParameterBase from './ParameterBase.svelte';
  import ParameterBaseRightAdornments from './ParameterBaseRightAdornments.svelte';
  import ParameterName from './ParameterName.svelte';
  import ParameterRec from './ParameterRec.svelte';
  import ParameterUnits from './ParameterUnits.svelte';

  export let use: ActionArray = [];
  export let disabled: boolean = false;
  export let expanded: boolean = false;
  export let user: User | null;
  export let formParameter: FormParameter<ValueSchemaStruct>;
  export let hideRightAdornments: boolean = false;
  export let labelColumnWidth: number = 200;
  export let level: number = 0;
  export let levelPadding: number = 20;
  export let parameterType: ParameterType = 'activity';

  const dispatch = createEventDispatcher();
  $: subFormParameters = getSubFormParameters(formParameter);
  function getSubFormParameters(formParameter: FormParameter<ValueSchemaStruct>): FormParameter[] {
    const { schema, value = [] } = formParameter;
    const { items: keys } = schema;
    const structKeys = Object.keys(keys).sort();

    const subFormParameters = structKeys.map((key, index) => {
      const subFormParameter: FormParameter = {
        errors: null,
        key,
        name: key,
        order: index,
        schema: schema.items[key],
        value: value !== null ? value[key] : null,
        valueSource: formParameter.valueSource,
      };

      return subFormParameter;
    });

    return subFormParameters;
  }

  function onChange(event: CustomEvent<FormParameter>) {
    const { detail: subFormParameter } = event;
    const value = {
      ...formParameter.value,
      [subFormParameter.key as keyof FormParameter]: subFormParameter.value,
    };
    dispatch('change', { ...formParameter, value });
  }

  function onResetStruct() {
    dispatch('reset', formParameter);
  }
  async function onApplyPresetToActivityParameter(event: CustomEvent<ActivityPreset | null>) {
    const { detail: selectedPreset } = event;
    await ApplyPresetToActivityParameter(selectedPreset);
  }
  async function ApplyPresetToActivityParameter(activityPreset: ActivityPreset | null) {
    if (activityPreset !== null && $plan !== null) {
      let value = activityPreset.arguments;
      dispatch('change', { ...formParameter, value });
    }
  }
</script>

<div class="parameter-rec-struct">
  <Collapse defaultExpanded={expanded}>
    <div slot="left">
      <ParameterName {formParameter} />
    </div>
    <div class="activity-preset">
      <ActivityParameterPresetInput
        {formParameter}
        selectedOptionValue={null}
        modelId={$modelId}
        {user}
        plan={$plan}
        on:applyPreset={onApplyPresetToActivityParameter}
      />
    </div>
    <div class="right" slot="right">
      <ParameterUnits unit={formParameter.schema?.metadata?.unit?.value} />
      <ParameterBaseRightAdornments
        {disabled}
        hidden={hideRightAdornments}
        {formParameter}
        {parameterType}
        {use}
        on:reset={onResetStruct}
      />
    </div>
    <ul style="padding-inline-start: {levelPadding}px">
      {#each subFormParameters as subFormParameter (subFormParameter.name)}
        <li>
          {#if isRecParameter(subFormParameter)}
            <ParameterRec
              {disabled}
              {hideRightAdornments}
              formParameter={subFormParameter}
              {labelColumnWidth}
              level={++level}
              {levelPadding}
              {parameterType}
              {user}
              {use}
              on:change={onChange}
              on:reset={onResetStruct}
            />
          {:else}
            <ParameterBase
              {disabled}
              {hideRightAdornments}
              formParameter={subFormParameter}
              {labelColumnWidth}
              level={++level}
              {levelPadding}
              {parameterType}
              {use}
              on:change={onChange}
              on:reset={onResetStruct}
            />
          {/if}
        </li>
      {/each}
    </ul>
  </Collapse>
</div>

<style>
  ul {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 0;
  }

  li {
    list-style: none;
    padding: 4px 0px;
  }

  .parameter-rec-struct {
    align-items: center;
    cursor: pointer;
    display: flex;
    gap: 8px;
  }

  .parameter-rec-struct :global(.form-parameter-name .name) {
    cursor: pointer;
  }

  .parameter-rec-struct :global(.collapse > .collapse-header) {
    gap: 8px;
    height: 24px;
  }

  .parameter-rec-struct :global(.collapse > .content) {
    margin-left: 0%;
  }

  .right {
    display: inline-flex;
    margin-right: 6px;
  }
</style>
