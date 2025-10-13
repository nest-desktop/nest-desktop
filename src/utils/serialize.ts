// serialize

import yaml from "js-yaml";

export const parseJSON = (text: string): unknown => JSON.parse(text);
export const parseYAML = (text: string): unknown => yaml.load(text);

export const dumpJSON = (data: unknown): string => JSON.stringify(data);
export const dumpYAML = (data: unknown): string => yaml.dump(data);
