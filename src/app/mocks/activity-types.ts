import { CActivityTypeMap } from '../types';

export const cActivityTypeMap: CActivityTypeMap = {
  peelBanana: {
    name: 'peelBanana',
    parameters: [
      { default: 'fromStem', name: 'peelDirection', type: 'string' },
    ],
  },
};
