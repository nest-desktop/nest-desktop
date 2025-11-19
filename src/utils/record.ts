// object.ts

export const updateRecords = <T>(rec1: Record<string, T>, rec2: Record<string, T>): Record<string, T> => {
  return Object.fromEntries(Object.entries(rec1).map(([k, v]) => [k, { ...v, ...rec2[k] }]));
};
