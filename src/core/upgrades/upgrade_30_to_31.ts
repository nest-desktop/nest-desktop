import { App } from '../app';

const validateVersion = (version: string) =>
  /^3\.0(\.\d+)?(\w+)?$/.test(version);

export function upgradeProject_30_to_31(app: App, project: any): any {
  if (!validateVersion(project.version)) {
    return project;
  }

  project.version = '3.1';
  return project;
}
