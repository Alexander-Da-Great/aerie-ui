<svelte:options immutable={true} />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { planReadOnly } from '../../stores/plan';
  import { gqlSubscribable } from '../../stores/subscribable';
  import type { ActivityPreset } from '../../types/activity';
  import type { User } from '../../types/app';
  import type { DropdownOptions, SelectedDropdownOptionValue } from '../../types/dropdown';
  import type { FormParameter } from '../../types/parameter';
  import type { Plan } from '../../types/plan';
  import type { GqlSubscribable } from '../../types/subscribable';
  import gql from '../../utilities/gql';
  import { featurePermissions } from '../../utilities/permissions';
  import { tooltip } from '../../utilities/tooltip';
  import Highlight from '../ui/Highlight.svelte';
  import SearchableDropdown from '../ui/SearchableDropdown.svelte';

  export let formParameter: FormParameter;
  export let disabled: boolean = false;
  export let highlightKeysMap: Record<string, boolean> = {};
  export let modelId: number;
  export let plan: Plan | null;
  export let user: User | null;
  export let selectedOptionValue: SelectedDropdownOptionValue | undefined = undefined;

  $: if (formParameter.errors) {
    console.log('error with activity based formParameter');
    console.log(formParameter);
  }

  const dispatch = createEventDispatcher();
  let activityPresets: GqlSubscribable<ActivityPreset[]> = gqlSubscribable<ActivityPreset[]>(
    gql.SUB_ACTIVITY_PRESETS,
    { activityTypeName: formParameter.schema.metadata?.activity?.value, modelId },
    [],
    user,
  );

  let hasAssignPermission: boolean = false;
  let options: DropdownOptions = [];

  $: if (formParameter.schema.metadata?.activity != null) {
    activityPresets.setVariables({ activityTypeName: formParameter.schema.metadata?.activity?.value, modelId });
  }

  $: if (user !== null && plan !== null) {
    options = $activityPresets.map((activityPreset: ActivityPreset) => ({
      display: activityPreset.name,
      hasSelectPermission: featurePermissions.activityPresets.canAssign(
        user,
        plan as Plan,
        (plan as Plan).model,
        activityPreset,
      ),
      value: activityPreset.id,
    }));
    hasAssignPermission = featurePermissions.activityPresets.canUnassign(user, plan) && !$planReadOnly;
  }

  function onSelectPreset(event: CustomEvent<SelectedDropdownOptionValue>) {
    const { detail: activityPresetId } = event;
    const selectedActivityPreset = $activityPresets.find(activityPreset => activityPreset.id === activityPresetId);
    selectedOptionValue = selectedActivityPreset?.id;
    // apply the preset to the parameter and update the preset field
    dispatch('applyPreset', selectedActivityPreset ?? null);
  }
</script>

<Highlight highlight={highlightKeysMap.activity_preset}>
  <div class="activity-preset-input-container">
    <div class="preset-input-container st-input w-100">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label" use:tooltip={{ content: 'Choose activity preset', placement: 'top' }}> Preset </label>
      <SearchableDropdown
        {disabled}
        {options}
        placeholder="None"
        planReadOnly={$planReadOnly}
        {selectedOptionValue}
        showPlaceholderOption={hasAssignPermission}
        on:selectOption={onSelectPreset}
      />
    </div>
  </div>
</Highlight>

<style>
  .activity-preset-input-container {
    --aerie-menu-item-template-columns: 1fr;
    align-items: center;
    display: grid;
  }

  .preset-input-container {
    display: grid;
    grid-template-rows: repeat(2, min-content);
    position: relative;
    row-gap: 4px;
  }
</style>
