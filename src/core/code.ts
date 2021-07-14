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
   * Format value or array to string.
   */
  format(value: any): string {
    if (Array.isArray(value)) {
      return `[${String(value.map((v: any) => this.format(v)))}]`;
    } else {
      return JSON.stringify(value);
    }
  }

}
