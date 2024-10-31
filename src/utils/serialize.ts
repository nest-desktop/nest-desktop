// serialize

import yaml from "js-yaml";

export const parseJSON = (text: string): unknown => JSON.parse(text);
export const parseYAML = (text: string): unknown => yaml.load(text);

export const dumpJSON = (data: any): string => JSON.stringify(data);
export const dumpYAML = (data: any): string => yaml.dump(data);
