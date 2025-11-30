// colorSchemes.ts

import { BaseObj } from "./baseObject";

export class ColorSchemes extends BaseObj {
  constructor() {
    super({
      config: { name: "ColorSchemes" },
    });
  }

  /**
   * Get a list of color schemes from config.
   */
  list(): string[] {
    return Object.keys(this.config?.localStorage);
  }
}
