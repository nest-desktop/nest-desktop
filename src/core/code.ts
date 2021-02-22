export class Code {
  constructor() {}

  _(n: number = 1): string {
    return '\n' + '  '.repeat(n);
  }

  end(): string {
    return '\n';
  }

  format(value: any): any {
    if (Number.isInteger(value)) {
      return parseFloat(value).toFixed(1);
    } else if (Array.isArray(value)) {
      return `[${String(value.map((v: any) => this.format(v)))}]`;
    } else {
      return value;
    }
  }
}
