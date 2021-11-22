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
}
