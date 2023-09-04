// nestSimulatorStore.ts

import axios from "axios";
import { defineStore } from "pinia";

import combineURLs from "@/utils/combineURLs";

export const useNESTSimulatorStore = defineStore("nest-simulator-backend", {
  state: () => ({
    enabled: false,
    url: "http://localhost:52425",
    response: {
      status: 0,
      data: {},
    },
    error: "",
  }),
  getters: {
    URL(): URL {
      return new URL(this.url);
    },
    default(): { path: string; port: string; protocol: string } {
      return {
        path: "nest",
        port: "52425",
        protocol: "",
      };
    },
    instance(): any {
      return axios.create({ baseURL: this.url });
    },
    isOK(): boolean {
      return this.response.status === 200;
    },
    isValid(): boolean {
      return "nest" in this.response.data;
    },
    versions(): [string, unknown][] {
      return Object.entries(this.response.data);
    },
  },
  actions: {
    reset(): void {
      this.response = {
        status: 0,
        data: {},
      };
      this.error = "";
    },
    async check(): Promise<void> {
      if (this.enabled === false) return;

      // Check if the hostname does not already exist in the config.
      return this.URL.hostname ? this.ping() : this.seek();
    },
    /**
     * Seek the server URL of the backend.
     */
    async seek(): Promise<any> {
      const protocol: string =
        this.default.protocol || window.location.protocol;
      const hostname: string = window.location.hostname || "localhost";
      const hosts: string[] = [
        combineURLs(hostname + ":" + this.default.port),
        combineURLs(hostname, this.default.path),
      ];
      const hostPromises: any[] = hosts.map((host: string) =>
        this.ping(protocol + "//" + host)
      );
      return axios.all(hostPromises);
    },
    /**
     * Ping the server of the backend.
     * @param url The URL which should be pinged.
     */
    async ping(url?: string): Promise<any> {
      this.reset();

      return axios
        .get(url || this.url)
        .then((response: any) => {
          this.response = response;
          switch (response.status) {
            case 0:
              // See https://fetch.spec.whatwg.org/#concept-network-error
              this.error = response.data;
              break;
            case 200:
              if (url) {
                this.url = url;
              }
              break;
            default:
              break;
          }
        })
        .catch((error: any) => {
          this.error = error;
        });
    },
  },
  persist: true,
});
