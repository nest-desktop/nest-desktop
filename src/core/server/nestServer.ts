import { Config } from '../config';
import { HttpClient } from './httpClient';

import { environment } from '../../environments/environment';

export class NESTServer extends Config {
  private _http: HttpClient;
  private _state: any = {
    serverReady: false,
    simulatorReady: false,
    nestVersion: '',
  };

  constructor() {
    super('NESTServer');
    this._http = new HttpClient();
    this.check();
  }

  get host(): string {
    return this.hostname + (this.port ? ':' + this.port : '');
  }

  set host(value: string) {
    const values: string[] = value.split(':');
    this.hostname = values[0];
    this.port = values[1] || '';
  }

  get hostname(): string {
    return this.config.hostname || window.location.hostname || 'localhost';
  }

  set hostname(value: string) {
    this.updateConfig({ hostname: value });
  }

  get http(): HttpClient {
    return this._http;
  }

  get port(): string {
    return this.config.port;
  }

  set port(value: string) {
    this.updateConfig({ port: value });
  }

  get protocol(): string {
    return this.config.protocol || window.location.protocol;
  }

  set protocol(value: string) {
    this.updateConfig({ protocol: value });
  }

  get state(): any {
    return this._state;
  }

  get url(): string {
    return this.protocol + '//' + this.host;
  }

  set url(value: string) {
    const values: string[] = value.split('//');
    this.protocol = values[0];
    this.host = values[1];
  }

  check(): void {
    // console.log('Check server')
    if (this.config.hostname) {
      this.ping(this.url);
    } else {
      this.seek();
    }
  }

  seek(): void {
    const protocol: string = window.location.protocol;
    const hostname: string = window.location.hostname || 'localhost';
    const hosts: string[] = [
      hostname + '/server',
      hostname + ':' + (this.port || '5000'),
    ];
    const hostPromises: any[] = hosts.map(
      (host: string) =>
        new Promise((resolve, reject) => {
          const url: string = protocol + '//' + host;
          this.ping(url, () => resolve());
        })
    );
    Promise.all(hostPromises);
  }

  ping(url: String, callback: any = false): void {
    this.serverReady = false;
    this._http.ping(url, (req: any) => {
      let resp: any;
      switch (req.status) {
        case 200:
          this.url = url;
          resp = JSON.parse(req.responseText);
          console.log(resp)
          this.serverReady = true;
          this.simulatorReady = 'nest' in resp;
          this.simulatorVersion = resp.nest;
          if (callback) {
            callback();
          }
          break;
        case 502:
          this.oidcLoginFailed(req);
          break;
      }
    });
  }

  // TODO: not a permament solution
  oidcLoginFailed(req: any): void {
    if (
      req.ok === false &&
      req.url === 'https://services.humanbrainproject.eu/oidc/login'
    ) {
      window.location.reload();
    }
  }
}
