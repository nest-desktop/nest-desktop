import axios, { AxiosInstance } from 'axios';
import combineURLs from 'axios/lib/helpers/combineURLs';
import { reactive, UnwrapRef } from '@vue/composition-api';

import { Config } from './config';

export class Backend extends Config {
  private _state: UnwrapRef<any>;
  private _instance: AxiosInstance;

  constructor(name: string, seek = { path: '', port: 0, versionPath: '' }) {
    super(name);
    this._state = reactive({
      enabled: false,
      ready: false,
      seek,
      version: {},
    });

    this._instance = axios.create({ baseURL: this.url });
  }

  get enabled(): boolean {
    this._state.enabled = this.config.enabled;
    return this._state.enabled;
  }

  set enabled(value: boolean) {
    this._state.enabled = value;
    this.updateConfig({ enabled: value });
  }

  get host(): string {
    return combineURLs(
      this.hostname + (this.port ? ':' + this.port : ''),
      this.path
    );
  }

  get hostname(): string {
    return this.config.hostname || window.location.hostname || 'localhost';
  }

  get instance(): AxiosInstance {
    return this._instance;
  }

  get path(): string {
    return this.config.path || '';
  }

  get port(): string {
    return this.config.port;
  }

  get protocol(): string {
    return this.config.protocol || window.location.protocol;
  }

  get state(): any {
    return this._state;
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
      this.protocol !== '' &&
      this.host !== ''
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
    let hostname: string = '';
    let path: string = '/';
    let port: string = '';
    let protocol: string = '';

    if (value != null && value !== '') {
      const values: string[] = value.split('//');
      if (values.length > 1) {
        const paths: string[] = values[1].split('/');
        const host: string[] = paths[0].split(':');

        hostname = host[0];
        path = paths.length > 1 ? paths.slice(1).join('/') : '/';
        port = host.length > 1 ? host[1] : '';
        protocol = values[0];
      }
    }

    this.updateConfig({ hostname, path, port, protocol });
    this._instance.defaults.baseURL = value;
  }

  /**
   * Reset state of the backend.
   */
  resetState(): void {
    this.state.ready = false;
    this.state.version = {};
  }

  /**
   * Check if the backend is serving.
   */
  async check(): Promise<void> {
    this.resetState();
    if (this.config.enabled === false) return;

    // Check if the hostname does not already exist in the config.
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
    const protocol: string = window.location.protocol;
    const hostname: string = window.location.hostname || 'localhost';
    const hosts: string[] = [
      combineURLs(hostname + ':' + this._state.seek.port),
      combineURLs(hostname, this._state.seek.path),
    ];
    const hostPromises: any[] = hosts.map((host: string) =>
      this.ping(protocol + '//' + host)
    );
    return axios.all(hostPromises);
  }

  /**
   * Ping the server of the backend.
   * @param url The URL which should be pinged.
   */
  async ping(url: string): Promise<any> {
    return this.instance
      .get(combineURLs(url, this.state.seek.versionPath))
      .then((response: any) => {
        switch (response.status) {
          case 0:
            // See https://fetch.spec.whatwg.org/#concept-network-error
            break;
          case 200:
            this.url = url;
            this.state.ready = true;
            this.state.version = response.data;
            break;
          default:
            this.state.ready = false;
            break;
        }
      })
      .catch(() => {
        this.state.ready = false;
      });
  }

  /**
   * Update URL.
   * @param config The configuration to update URL in local config.
   */
  updateURL(config: any = {}): void {
    if (config.url != null && config.url !== '') {
      this.url = config.url;
    } else {
      const newConfig = {};
      if (config.path != null && config.path !== '') {
        newConfig['path'] = config.path;
      }
      if (config.port != null && config.port !== '') {
        newConfig['port'] = config.port;
      }

      if (Object.keys(newConfig).length > 0) {
        // Update local config.
        this.updateConfig(newConfig);

        // Update current url to set hostname.
        this.url = this.url;
      }
    }
  }
}
