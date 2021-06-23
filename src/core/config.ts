import { environment } from '../environments/environment';

export class Config {
  private _configName: string;

  constructor(name: string) {
    this._configName = name;
    if (!this.isConfigValid()) {
      this.upgradeConfig();
    }
  }

  get assetConfig(): any {
    return require(`../assets/config/${this._configName}.json`);
  }

  get config(): any {
    // check if item is existed in localstorage
    if (localStorage.hasOwnProperty(this.configItemName)) {
      const dataJSON: string | null = localStorage.getItem(this.configItemName);
      if (dataJSON) {
        return JSON.parse(dataJSON);
      }
    }
    this.config = this.assetConfig; // create item in localstorage
    return this.config; // recursive call after item created in localstorage
  }

  set config(value: any) {
    value.version = environment.VERSION; // update version of config in localstorage
    const dataJSON = JSON.stringify(value); // convert object to string
    localStorage.setItem(this.configItemName, dataJSON); // save item in localstorage
  }

  get configItemName(): string {
    return 'nest-desktop-' + this._configName;
  }

  copy(item: any): any {
    return JSON.parse(JSON.stringify(item));
  }

  isConfigReady(): boolean {
    return true;
  }

  isConfigValid(): boolean {
    const appVersion: string[] = environment.VERSION.split('.');
    const configVersion: string[] = this.config.version.split('.');
    return (
      appVersion[0] === configVersion[0] && appVersion[1] === configVersion[1]
    );
  }

  resetConfig(): void {
    localStorage.removeItem(this.configItemName);
  }

  updateConfig(value: any): void {
    const data: any = this.config;
    Object.entries(value).forEach((v: any) => (data[v[0]] = v[1]));
    this.config = data;
  }

  upgradeConfig(): void {
    const assetData: any = this.assetConfig;
    const storageData: any = this.config;
    Object.entries(assetData).forEach((entry: any) => {
      if (!storageData.hasOwnProperty(entry[0])) {
        storageData[entry[0]] = entry[1];
      }
    });
    this.config = storageData;
  }
}
