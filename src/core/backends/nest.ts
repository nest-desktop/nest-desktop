import { Backend } from './backend';

export class NESTServer extends Backend {
  private _state: any = {
    serverReady: false,
    simulatorReady: false,
    nestVersion: '',
  };

  constructor() {
    super('NESTServer');
  }

  get state(): any {
    return this._state;
  }

  /**
   * Check if the nest backend is served.
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
   * Seek the url of NEST Server.
   */
  seek(): Promise<any> {
    // console.log('seek nest server');
    const protocol: string = window.location.protocol;
    const hostname: string = window.location.hostname || 'localhost';
    const hosts: string[] = [hostname + ':5000', hostname + '/nest'];
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
   * Ping NEST Server.
   */
  ping(url: string, callback: any = false): void {
    // console.log('ping nest server');
    this._state.serverReady = false;
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
