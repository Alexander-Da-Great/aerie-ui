import { CActivityInstanceParameter } from './activity-instance-parameter';
import { StringTMap } from './string-t-map';

export interface CActivityInstance {
  id: string;
  parameters: StringTMap<CActivityInstanceParameter>;
  startTimestamp: string;
  type: string;
}
export type CActivityInstanceMap = StringTMap<CActivityInstance>;

export interface SActivityInstance {
  parameters: StringTMap<any>;
  startTimestamp: string;
  type: string;
}
export type SActivityInstanceMap = StringTMap<SActivityInstance>;
