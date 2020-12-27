import { Config } from '../config';
import { HttpClient } from './httpClient';

import { environment } from '../../environments/environment';


export class NESTServer extends Config {
  private _http: HttpClient;
  private _state: any = {
    serverReady: false,
    serverValid: false,
    serverVersion: '',
    simulatorReady: false,
    simulatorValid: false,
    simulatorVersion: '',
  };

  constructor() {
    super('NESTServer');
    this._http = new HttpClient();
    // this.check();
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
      this._http.get(this.url)
        .then((req: any) => {
          switch (req.status) {
            case 200:
              const resp: any = JSON.parse(req.responseText);
              this.checkVersion(resp);
              break;
            default:
              console.log(req);
              this.oidcLoginFailed(req);
              break;
          }
        })
        .catch((req: any) => {
          console.log(req);
        });
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
    const hostPromises: any[] = hosts.map((host: string) =>
      new Promise((resolve, reject) => {
        const url: string = protocol + '//' + host;
        this._http.ping(url, (req: any) => {
          switch (req.status) {
            case 200:
              this.url = url;
              const resp: any = JSON.parse(req.responseText);
              this.checkVersion(resp);
              resolve();
              break;
            case 502:
              this.oidcLoginFailed(req);
              break;
          }
        });
      })
    );
    Promise.all(hostPromises);
  }

  checkVersion(resp: any): void {
    // console.log('Fetch info', info)
    const appVersion: string[] = environment.VERSION.split('.');

    if (resp.hasOwnProperty('server')) {
      this._state.serverReady = true;
      this._state.serverVersion = resp.server.version;
      const serverVersion: string[] = this._state.serverVersion.split('.');
      this._state.serverValid =
        appVersion[0] === serverVersion[0] &&
        appVersion[1] === serverVersion[1];
    }

    if (resp.hasOwnProperty('simulator')) {
      this._state.simulatorReady = true;
      this._state.simulatorVersion = resp.simulator.version;
      const simulatorVersion: string[] = this._state.simulatorVersion.split('.');
      if (simulatorVersion.length === 3) {
        this._state.simulatorValid =
          simulatorVersion[0] === '2' &&
          simulatorVersion[1] >= '18';
      }
    }
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
