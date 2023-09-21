// boolean.ts

export function getBoolean(value: string | number | boolean): boolean {
  switch (value) {
    case "1":
    case "ON":
    case "On":
    case "TRUE":
    case "True":
    case "Y":
    case "YES":
    case "Yes":
    case "on":
    case "true":
    case "y":
    case "yes":
    case 1:
    case true:
      return true;
    default:
      return false;
  }
}
