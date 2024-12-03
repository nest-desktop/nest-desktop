// fetch.ts

import { dumpYAML } from "./serialize";

/**
 * Load data from file.
 * @param path string
 * @returns string or any
 */
export const load = async (path: string): Promise<string | any> => {
  const pathList = path.split(".");
  const extension = pathList[pathList.length - 1];
  switch (extension) {
    case "json":
      return loadJSON(path);
    case "yaml":
      return loadYAML(path);
    default:
      return loadText(path);
  }
};

/**
 * Load data from json file.
 * @param path string
 * @returns any
 */
export const loadJSON = async (path: string): Promise<any> => fetch(path).then((res: Response) => res.json());

/**
 * Load text from file.
 * @param path string
 * @returns string
 */
export const loadText = async (path: string): Promise<string> =>
  fetch(path)
    .then((res: Response) => res.blob())
    .then((blob: Blob) => blob.text());

/**
 * Load data from yaml file.
 * @param path
 * @returns any
 */
export const loadYAML = async (path: string): Promise<any> => loadText(path).then((text: string) => dumpYAML(text));
