import axios from 'axios';

import { Config } from './config';

export class Backend extends Config {
  private _state: any = {
    ready: false,
    version: {},
    config: {
      path: '',
      port: 5000,
      versionPath: '',
    },
  };

  constructor(
    name: string,
    config = { path: '', port: 5000, versionPath: '' }
  ) {
    super(name);
    this._state.config = config;

    // Check the backend.
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

  set state(value: any) {
    this._state = value;
  }

  /**
   * The url variable stores the URL of the backend by splitting it into hostname
   * and protocol. Beware: A correct URL has to contain a '//' delimiter,
   * otherwise the empty string is used.
   *
   * @returns the URL of the backend (or empty string if undefined)
   */
  get url(): string {
    if (
      this.protocol != undefined &&
      this.host != undefined &&
      this.protocol != '' &&
      this.host != ''
    )
      return this.protocol + '//' + this.host;
    return '';
  }

  /**
   * The url variable stores the URL of the backend by splitting it into hostname
   * and protocol. Beware: A correct URL has to contain a '//' delimiter,
   * otherwise the empty string is used.
   *
   * @param value URL to save as hostname and protocol
   */
  set url(value: string) {
    if (value != undefined && value != '') {
      const values: string[] = value.split('//');
      if (values.length > 1) {
        this.protocol = values[0];
        this.host = values[1];
        return;
      }
    }
    this.protocol = '';
    this.host = '';
  }

  get(path: string = ''): Promise<any> {
    return axios.get([this.url, path].join('/'));
  }

  post(path: string = '', data: any = {}): Promise<any> {
    return axios.post([this.url, path].join('/'), data);
  }

  /**
   * Reset state of the backend.
   */
  resetState() {
    this.state.ready = false;
    this.state.version = {};
  }

  /**
   * Check if the backend is serving.
   */
  async check(): Promise<void> {
    // console.log('Check the backend');
    this.resetState();
    if (this.config.hostname) {
      return this.ping(this.url);
    } else {
      return this.seek();
    }
  }

  /**
   * Seek the server URL of the backend.
   */
  async seek(): Promise<any> {
    // console.log('Seek the backend');
    const protocol: string = window.location.protocol;
    const hostname: string = window.location.hostname || 'localhost';
    const port: string = this.port || this._state.config.port;
    const hosts: string[] = [
      hostname + ':' + port,
      hostname + this._state.config.path,
    ];
    const hostPromises: any[] = hosts.map((host: string) =>
      this.ping(protocol + '//' + host)
    );
    return Promise.all(hostPromises);
  }

  /**
   * Ping the server of the backend.
   * @param url The URL which should be pinged.
   */
  async ping(url: string): Promise<any> {
    // console.log('Ping the backend');

    return axios
      .get(url + this.state.config.versionPath)
      .then((response: any) => {
        switch (response.status) {
          case 0:
            // see https://fetch.spec.whatwg.org/#concept-network-error
            break;
          case 200:
            this.url = url;
            this.state.ready = true;
            this.state.version = response.data;
            break;
          case 502:
            console.log(response.data);
            break;
        }
      });
  }
}
