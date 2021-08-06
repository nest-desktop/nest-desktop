import { Config } from '../config';
import { HttpClient } from './httpClient';

export class Backend extends Config {
  private _httpClient: HttpClient;

  constructor(name: string) {
    super(name);
    this._httpClient = new HttpClient();
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

  get httpClient(): HttpClient {
    return this._httpClient;
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

  /**
   * The url variable stores the NEST Server URL by splitting it into hostname
   * and protocol. Beware: A correct URL has to contain a '//' delimiter,
   * otherwise the empty string is used.
   *
   * @returns NEST Server URL (or empty string if undefined)
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
   * The url variable stores the NEST Server URL by splitting it into hostname
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
}
