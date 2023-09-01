// backend.ts

import { ILogObj, Logger } from "tslog";

import axios from "axios";
import { reactive, UnwrapRef } from "vue";

import { logger as mainLogger } from "@/utils/logger";
import { Config } from "./config";
import combineURLs from "@/utils/combineURLs";

interface BackendState {
  enabled: boolean;
  ready: boolean;
  seek: SeekProps;
  response: any;
}

interface SeekProps {
  path: string;
  port: number;
  protocol: string;
  versionPath: string;
}

export class Backend extends Config {
  private _name: string;
  private _logger: Logger<ILogObj>;
  private _state: UnwrapRef<BackendState>;

  constructor(
    name: string,
    seek: SeekProps = { path: "", port: 0, protocol: "", versionPath: "" }
  ) {
    super(`Backend${name}`);
    this._name = name;
    this._state = reactive({
      enabled: false,
      ready: false,
      seek,
      response: {},
    });

    this._logger = mainLogger.getSubLogger({ name: `[${name}] backend`, minLevel: 0 });
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
      this.hostname + (this.port ? ":" + this.port : ""),
      this.path
    );
  }

  get hostname(): string {
    return this.config.hostname || window.location.hostname || "localhost";
  }

  get instance(): any {
    return axios.create({ baseURL: this.url });
  }

  get name(): string {
    return this._name;
  }

  get path(): string {
    return this.config.path || "";
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
      this.protocol !== "" &&
      this.host !== ""
    )
      return this.protocol + "//" + this.host;
    return "";
  }

  /**
   * The url variable stores the URL of the backend by splitting it into hostname
   * and protocol. Beware: A correct URL has to contain a '//' delimiter,
   * otherwise the empty string is used.
   *
   * @param value URL to save as hostname and protocol
   */
  set url(value: string) {
    let hostname: string = "";
    let path: string = "/";
    let port: string = "";
    let protocol: string = "";

    if (value != null && value !== "") {
      const values: string[] = value.split("//");
      if (values.length > 1) {
        const paths: string[] = values[1].split("/");
        const host: string[] = paths[0].split(":");

        hostname = host[0];
        path = paths.length > 1 ? paths.slice(1).join("/") : "/";
        port = host.length > 1 ? host[1] : "";
        protocol = values[0];
      }
    }

    // this.updateConfig({ hostname, path, port, protocol });
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
    this._logger.trace("check");
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
    this._logger.trace("seek");
    const protocol: string =
      this._state.seek.protocol || window.location.protocol;
    const hostname: string = window.location.hostname || "localhost";
    const hosts: string[] = [
      combineURLs(hostname + ":" + this._state.seek.port),
      combineURLs(hostname, this._state.seek.path),
    ];
    const hostPromises: any[] = hosts.map((host: string) =>
      this.ping(protocol + "//" + host)
    );
    return axios.all(hostPromises);
  }

  /**
   * Ping the server of the backend.
   * @param url The URL which should be pinged.
   */
  async ping(url: string): Promise<any> {
    this._logger.trace("ping:", url);
    return axios
      .get(combineURLs(url, this.state.seek.versionPath))
      .then((response: any) => {
        switch (response.status) {
          case 0:
            // See https://fetch.spec.whatwg.org/#concept-network-error
            break;
          case 200:
            this.url = url;
            this.state.ready = true;
            this.state.response = response;
            break;
          default:
            this.state.ready = false;
            break;
        }
      })
      .catch((response: any) => {
        this.state.ready = false;
        this.state.response = response;
      });
  }

  /**
   * Update URL.
   * @param config The configuration to update URL in local config.
   */
  updateURL(config: any = {}): void {
    if (config.url != null && config.url !== "") {
      this.url = config.url;
    } else {
      const newConfig: { [key: string]: string } = {};
      if (config.path != null && config.path !== "") {
        newConfig["path"] = config.path;
      }
      if (config.port != null && config.port !== "") {
        newConfig["port"] = config.port;
      }

      if (Object.keys(newConfig).length > 0) {
        // Update local config.
        this.updateConfig(newConfig);

        // Update current url to set hostname.
        // @ts-ignore
        this.url = this.url;
      }
    }
  }
}
