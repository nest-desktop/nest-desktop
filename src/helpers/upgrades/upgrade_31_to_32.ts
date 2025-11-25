// upgrade_31_to_32.ts

const validateVersion = (version: string) => /^3\.1(\.\d+)?(\w+)?$/.test(version);

export function upgradeProject_31_to_32(projectState: any): any {
  if (!validateVersion(projectState.version)) return projectState;

  if (projectState.activityGraph && projectState.activityGraph.panels) {
    projectState.activityGraph = {
      chart: {
        panels: projectState.activityGraph.panels,
      },
    };
  }

  projectState.version = "3.2";
  return projectState;
}
