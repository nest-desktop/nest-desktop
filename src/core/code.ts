export class Code {
  constructor() {}

  /**
   * Indent code.
   */
  _(n: number = 1): string {
    return '\n' + '  '.repeat(n);
  }

  /**
   * New line.
   */
  end(): string {
    return '\n';
  }

  /**
   * Format float value or array.
   */
  format(value: any): any {
    if (Number.isInteger(value)) {
      return this.floatToFixed(value);
    } else if (Array.isArray(value)) {
      return `[${String(value.map((v: any) => this.format(v)))}]`;
    } else {
      return value;
    }
  }

  /**
   * Fixed float value with correct amount of decimals.
   */
  floatToFixed(value: number): string {
    const valString: string = JSON.stringify(value);
    const valList: string[] = valString.split('.');
    return value.toFixed(
      valList.length === 2 ? Math.min(valList[1].length, 20) : 1
    );
  }
}
