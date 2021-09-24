import { Backend } from './backend';

export class NESTSimulator extends Backend {
  private _state: any = {
    serverReady: false,
    simulatorReady: false,
    nestVersion: '',
  };

  constructor() {
    super('NESTSimulator');
  }

  get state(): any {
    return this._state;
  }

  /**
   * Check if the NEST Simulator is serving.
   */
  check(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // console.log('Check NEST Simulator')
      if (this.config.hostname) {
        this.ping(
          this.url,
          () => reject(),
          () => resolve()
        );
      } else {
        this.seek()
          .then(() => resolve())
          .catch(() => reject());
      }
    });
  }

  /**
   * Seek the server URL of NEST Simulator.
   */
  seek(): Promise<any> {
    // console.log('seek the server of NEST Simulator');
    const protocol: string = window.location.protocol;
    const hostname: string = window.location.hostname || 'localhost';
    const port: string = this.port || '5000';
    const hosts: string[] = [hostname + ':' + port, hostname + '/nest'];
    const hostPromises: any[] = hosts.map(
      (host: string) =>
        new Promise<void>((resolve, reject) => {
          const url: string = protocol + '//' + host;
          this.ping(
            url,
            () => reject(),
            () => resolve()
          );
        })
    );
    return Promise.all(hostPromises);
  }

  /**
   * Ping the server of NEST Simulator.
   * @param url The URL which should be pinged.
   * @param callbackFail Function to execute in case of ping failure
   * @param callbackSucc Function to execute in case of ping success
   */
  ping(
    url: string,
    callbackFail: any = false,
    callbackSucc: any = false
  ): void {
    // console.log('ping the server of NEST Simulator');
    this._state.serverReady = false;

    this.httpClient.ping(url, (req: any) => {
      let resp: any;
      switch (req.status) {
        case 0:
          // see https://fetch.spec.whatwg.org/#concept-network-error
          this._state.serverReady = false;
          this._state.simulatorReady = '';
          this._state.simulatorVersion = '';
          if (callbackFail) {
            callbackFail();
          }
          break;
        case 200:
          this.url = url;
          resp = JSON.parse(req.responseText);
          this._state.serverReady = true;
          this._state.simulatorReady = 'nest' in resp;
          this._state.simulatorVersion = resp.nest;
          if (callbackSucc) {
            callbackSucc();
          }
          break;
        case 502:
          console.log(req);
          break;
      }
    });
  }
}
