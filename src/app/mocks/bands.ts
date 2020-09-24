import { SimulationResponse } from '../types';

export const simulationResponse: SimulationResponse = {
  activities: [],
  results: [
    {
      name: 'a',
      start: '2020-001T00:00:00',
      values: [
        { x: 10000000, y: 0 },
        { x: 15000000, y: 1 },
        { x: 30000000, y: 2 },
        { x: 45000000, y: 3 },
        { x: 55000000, y: 4 },
      ],
    },
    {
      name: 'b',
      start: '2020-001T00:00:00',
      values: [
        { x: 10000000, y: 1 },
        { x: 15000000, y: 1 },
        { x: 30000000, y: 2 },
        { x: 45000000, y: 2 },
        { x: 55000000, y: 2 },
      ],
    },
    {
      name: 'c',
      start: '2020-001T00:00:00',
      values: [
        { x: 10000000, y: 2 },
        { x: 15000000, y: 2 },
        { x: 30000000, y: 2 },
        { x: 45000000, y: 1 },
        { x: 55000000, y: 1 },
      ],
    },
    {
      name: 'd',
      start: '2020-001T00:00:00',
      values: [
        { x: 10000000, y: 1 },
        { x: 15000000, y: 3 },
        { x: 30000000, y: 1 },
        { x: 45000000, y: 3 },
        { x: 55000000, y: 1 },
      ],
    },
    {
      name: 'e',
      start: '2020-001T00:00:00',
      values: [
        { x: 10000000, y: 4 },
        { x: 15000000, y: 2 },
        { x: 30000000, y: 3 },
        { x: 45000000, y: 1 },
        { x: 55000000, y: 0 },
      ],
    },
  ],
  success: true,
  violations: [],
};
