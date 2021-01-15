import { Config } from '../config';

export class ColorSchemes extends Config {
  constructor() {
    super('ColorSchemes');
  }

  list(): string[] {
    return Object.keys(this.config);
  }
}
