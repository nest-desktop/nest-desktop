// upgrade_31_to_32.ts

const validateVersion = (version: string) =>
  /^3\.1(\.\d+)?(\w+)?$/.test(version);

export function upgradeProject_31_to_32(project: any): any {
  if (!validateVersion(project.version)) {
    return project;
  }

  if (project.activityGraph && project.activityGraph.panels) {
    project.activityGraph = {
      chart: {
        panels: project.activityGraph.panels,
      },
    };
  }

  project.version = '3.2';
  return project;
}
