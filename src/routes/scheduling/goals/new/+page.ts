import { SearchParameters } from '../../../../enums/searchParameters';
import effects from '../../../../utilities/effects';
import { parseFloatOrNull } from '../../../../utilities/generic';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url }) => {
  const { user } = await parent();

  const { models = [], plans = [] } = await effects.getPlansAndModelsForScheduling(user);

  const modelId: string | null = url.searchParams.get(SearchParameters.MODEL_ID);
  const specId: string | null = url.searchParams.get(SearchParameters.SPEC_ID);
  const initialModelId: number | null = parseFloatOrNull(modelId);
  const initialSpecId: number | null = parseFloatOrNull(specId);

  return {
    initialModelId,
    initialSpecId,
    models,
    plans,
    user,
  };
};
