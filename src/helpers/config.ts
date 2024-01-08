// config.ts

import { getRuntimeConfig } from "@/utils/fetch";

export class Config {
  private _configName: string;
  private _simulator: string;

  constructor(name: string, simulator: string = "") {
    this._configName = name;
    this._simulator = simulator;

    if (!this.isConfigValid) {
      this.upgradeConfig();
    }
  }

  get config(): any {
    return this.localStorage;
  }

  get configItemName(): string {
    return "nest-desktop-" + this._configName;
  }

  get configName(): string {
    return this._configName;
  }

  get isConfigValid(): boolean {
    const storedData = this.localStorage;
    if (process.env.APP_VERSION == undefined || storedData == undefined) {
      return false;
    }
    const appVersion: string[] = process.env.APP_VERSION.split(".");
    const configVersion: string[] = storedData.version.split(".");
    return (
      appVersion[0] === configVersion[0] && appVersion[1] === configVersion[1]
    );
  }

  get localStorage(): any {
    // Check if item is existed in localStorage.
    if (this.configItemName in localStorage) {
      const dataJSON: string | null = localStorage.getItem(this.configItemName);
      if (dataJSON) {
        return JSON.parse(dataJSON);
      }
    }
  }

  set localStorage(value: any) {
    value.version = process.env.APP_VERSION; // Update version of config in localStorage.
    const dataJSON = JSON.stringify(value); // Convert object to string.
    localStorage.setItem(this.configItemName, dataJSON); // Save item in localsStorage.
  }

  copy(item: any): any {
    return { ...item };
  }

  async importConfig(): Promise<any> {
    const path = this._simulator
      ? `assets/simulators/${this._simulator}/config/${this._configName}`
      : `assets/config/${this._configName}`;
    return getRuntimeConfig(path + ".json");
  }

  resetConfig(): void {
    localStorage.removeItem(this.configItemName);
  }

  updateConfig(value: any): void {
    const storedData: any = this.localStorage;
    Object.entries(value).forEach((v: any) => (storedData[v[0]] = v[1]));
    this.localStorage = storedData;
  }

  upgradeConfig(): void {
    this.importConfig().then((importedData) => {
      const storedData: any = this.localStorage || {};
      Object.entries(importedData).forEach((entry: any) => {
        if (!(entry[0] in storedData)) {
          storedData[entry[0]] = entry[1];
        }
      });
      this.localStorage = storedData;
    });
  }
}
