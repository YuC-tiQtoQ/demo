export const DataSpec = [
  '1.1.0',
] as const;

export type DataSpec =
  (typeof DataSpec)[number];
