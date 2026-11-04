export const Detail = [
  'MINIMAL',
  'FULL',
] as const;

export type Detail =
  (typeof Detail)[number];
