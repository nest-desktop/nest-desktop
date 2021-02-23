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
      return this.toFixed(value);
    } else if (Array.isArray(value)) {
      return `[${String(value.map((v: any) => this.format(v)))}]`;
    } else {
      return value;
    }
  }

  toFixed(value: number): string {
    const valString: string = JSON.stringify(value);
    const valList: string[] = valString.split('.');
    return value.toFixed(valList.length === 2 ? valList[1].length : 1);
  }
}
