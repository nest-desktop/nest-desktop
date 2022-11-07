import { App } from '../app';

const validateVersion = (version: string) =>
  /^3\.1(\.\d+)?(\w+)?$/.test(version);

export function upgradeProject_31_to_32(app: App, project: any): any {
  if (!validateVersion(project.version)) {
    return project;
  }

  if (project.activityGraph) {
    project.activityGraph = {
      chart: {
        panels: project.activityGraph.panels,
      },
    };
  }

  project.version = '3.2';
  return project;
}
