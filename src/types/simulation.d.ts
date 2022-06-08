type Simulation = {
  arguments: ArgumentsMap;
  datasets: SimulationDataset[] | null;
  id: number;
  template: SimulationTemplate | null;
};

type SimulationInsertInput = {
  arguments: ArgumentsMap;
  plan_id: number;
  simulation_template_id: number | null;
};

type SimulationTemplate = {
  arguments: ArgumentsMap;
  description: string;
  id: number;
};

type Resource = {
  name: string;
  schema: ValueSchema;
  startTime: string;
  values: ResourceValue[];
};

type ResourceType = {
  name: string;
  schema: ValueSchema;
};

type ResourceValue = {
  x: number;
  y: number | string;
};

type SimulationDataset = {
  id: number;
};

type SimulationResponseViolation = Omit<ConstraintViolation, 'constraint'>;

type SimulationStatus = 'complete' | 'failed' | 'incomplete' | 'pending';

type SimulationResponse = {
  results?: {
    constraints: Record<string, SimulationResponseViolation[]>;
    start: string;
  };
  status: SimulationStatus;
};
