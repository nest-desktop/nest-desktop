// boolean.ts

export function getBoolean(value: string | number | boolean): boolean {
  switch (typeof value) {
    case "number":
      return value === 1;
    case "string":
      return ["1", "on", "true", "y", "yes"].includes(value.toLowerCase());
    default:
      return value;
  }
}
