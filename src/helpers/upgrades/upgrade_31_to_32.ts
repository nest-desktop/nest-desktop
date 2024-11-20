// upgrade_31_to_32.ts

const validateVersion = (version: string) =>
  /^3\.1(\.\d+)?(\w+)?$/.test(version);

export function upgradeProject_31_to_32(projectProps: any): any {
  if (!validateVersion(projectProps.version)) return projectProps;

  if (projectProps.activityGraph && projectProps.activityGraph.panels) {
    projectProps.activityGraph = {
      chart: {
        panels: projectProps.activityGraph.panels,
      },
    };
  }

  projectProps.version = "3.2";
  return projectProps;
}
