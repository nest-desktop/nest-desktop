import { Backend } from './backend';

export class NESTServer extends Backend {
  private _state: any = {
    serverReady: false,
    simulatorReady: false,
    nestVersion: '',
  };

  constructor() {
    super('NESTServer');
    this.check().then(() => this.setUrlIFrame());
  }

  get state(): any {
    return this._state;
  }

  /**
   * It pings nest server if hostname provided, else it seeks the url.
   */
  check(): Promise<void> {
    return new Promise<void>(resolve => {
      // console.log('Check backend')
      if (this.config.hostname) {
        this.ping(this.url, () => resolve());
      } else {
        this.seek().then(() => resolve());
      }
    });
  }

  /**
   * It seeks the url of NEST Server.
   */
  seek(): Promise<any> {
    const protocol: string = window.location.protocol;
    const hostname: string = window.location.hostname || 'localhost';
    const hosts: string[] = [
      hostname + '/nest',
      hostname + ':' + (this.port || '5000'),
    ];
    const hostPromises: any[] = hosts.map(
      (host: string) =>
        new Promise<void>(resolve => {
          const url: string = protocol + '//' + host;
          this.ping(url, () => resolve());
        })
    );
    return Promise.all(hostPromises);
  }

  /**
   * It pings NEST Server.
   */
  ping(url: string, callback: any = false): void {
    this._state.serverReady = false;
    this.reloadIFrame();
    return this.httpClient.ping(url, (req: any) => {
      let resp: any;
      switch (req.status) {
        case 200:
          this.url = url;
          resp = JSON.parse(req.responseText);
          this._state.serverReady = true;
          this._state.simulatorReady = 'nest' in resp;
          this._state.simulatorVersion = resp.nest;
          if (callback) {
            callback();
          }
          break;
        case 502:
          console.log(req);
          break;
      }
    });
  }
}
