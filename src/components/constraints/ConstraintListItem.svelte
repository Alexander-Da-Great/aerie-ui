<svelte:options immutable={true} />

<script lang="ts">
  import { base } from '$app/paths';
  import CheckmarkIcon from '@nasa-jpl/stellar/icons/check.svg?component';
  import FilterIcon from '@nasa-jpl/stellar/icons/filter.svg?component';
  import VisibleHideIcon from '@nasa-jpl/stellar/icons/visible_hide.svg?component';
  import VisibleShowIcon from '@nasa-jpl/stellar/icons/visible_show.svg?component';
  import WarningIcon from '@nasa-jpl/stellar/icons/warning.svg?component';
  import { createEventDispatcher } from 'svelte';
  import type { User } from '../../types/app';
  import type { Constraint, ConstraintResponse } from '../../types/constraint';
  import type { Plan } from '../../types/plan';
  import effects from '../../utilities/effects';
  import { permissionHandler } from '../../utilities/permissionHandler';
  import { pluralize } from '../../utilities/text';
  import { tooltip } from '../../utilities/tooltip';
  import Collapse from '../Collapse.svelte';
  import ContextMenuHeader from '../context-menu/ContextMenuHeader.svelte';
  import ContextMenuItem from '../context-menu/ContextMenuItem.svelte';
  import ConstraintViolationButton from './ConstraintViolationButton.svelte';

  export let constraint: Constraint;
  export let constraintResponse: ConstraintResponse;
  export let hasDeletePermission: boolean = false;
  export let hasEditPermission: boolean = false;
  export let plan: Plan | null;
  export let totalViolationCount: number = 0;
  export let user: User | null;
  export let visible: boolean = true;

  const dispatch = createEventDispatcher();

  $: violationCount = constraintResponse?.results?.violations?.length;
  $: success = constraintResponse?.success;
</script>

<div class="constraint-list-item">
  <Collapse title={constraint.name} tooltipContent={constraint.name} defaultExpanded={false}>
    <svelte:fragment slot="right">
      <div class="right-content">
        {#if violationCount}
          <div
            class="st-badge violation-badge"
            use:tooltip={{ content: `${violationCount} Violation${pluralize(violationCount)}`, placement: 'top' }}
          >
            {#if totalViolationCount !== violationCount}
              <FilterIcon /> {violationCount} of {totalViolationCount}
            {:else}
              {violationCount}
            {/if}
          </div>
        {:else if constraintResponse && !success}
          <div class="violations-error" use:tooltip={{ content: 'Compile Errors', placement: 'top' }}>
            <WarningIcon />
          </div>
        {:else if constraintResponse && success}
          <div class="no-violations" use:tooltip={{ content: 'No Violations', placement: 'top' }}>
            <CheckmarkIcon />
          </div>
        {/if}
        <button
          use:tooltip={{ content: visible ? 'Hide' : 'Show', placement: 'top' }}
          class="st-button icon"
          on:click|stopPropagation={() => dispatch('toggleVisibility', { id: constraint.id, visible: !visible })}
        >
          {#if visible}
            <VisibleShowIcon />
          {:else}
            <VisibleHideIcon />
          {/if}
        </button>
      </div>
    </svelte:fragment>

    <Collapse title="Description" defaultExpanded={false}>
      <div class="st-typography-label">
        {#if constraint.description}
          {constraint.description}
        {:else}
          No description
        {/if}
      </div>
    </Collapse>

    <Collapse title="Violations" defaultExpanded={false}>
      {#if constraintResponse?.results?.violations?.length}
        <div class="violations">
          {#each constraintResponse?.results?.violations as violation}
            {#each violation.windows as window}
              <ConstraintViolationButton {window} />
            {/each}
          {/each}
        </div>
      {:else}
        <div class="st-typography-label">No Violations</div>
      {/if}
    </Collapse>

    <svelte:fragment slot="contextMenuContent">
      <ContextMenuHeader>Actions</ContextMenuHeader>
      <ContextMenuItem
        on:click={() => window.open(`${base}/constraints/edit/${constraint.id}`, '_blank')}
        use={[
          [
            permissionHandler,
            {
              hasPermission: hasEditPermission,
              permissionError: 'You do not have permission to edit this constraint',
            },
          ],
        ]}
      >
        Edit Constraint
      </ContextMenuItem>
      <ContextMenuHeader>Modify</ContextMenuHeader>
      <ContextMenuItem
        on:click={() => plan && effects.deleteConstraint(constraint, plan, user)}
        use={[
          [
            permissionHandler,
            {
              hasPermission: hasDeletePermission,
              permissionError: 'You do not have permission to delete this constraint',
            },
          ],
        ]}
      >
        Delete Constraint
      </ContextMenuItem>
    </svelte:fragment>
  </Collapse>
</div>

<style>
  .right-content {
    align-items: center;
    display: flex;
    flex-direction: row;
    gap: 4px;
  }

  .constraint-list-item .st-badge {
    align-items: center;
    background: #fbb7ac;
    border-radius: 4px;
    gap: 4px;
    height: 20px;
    padding: 0px 6px;
  }

  .violations {
    display: flex;
    flex-direction: column;
  }

  .no-violations {
    align-items: center;
    color: var(--st-success-green);
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    width: 20px;
  }

  .violations-error {
    align-items: center;
    color: var(--st-error-red);
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    width: 20px;
  }
</style>
