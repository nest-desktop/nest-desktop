// upgrade_31_to_32.ts

const validateVersion = (version: string) => /^3\.1(\.\d+)?(\w+)?$/.test(version);

function upgradeProject(projectProps: any): any {
  if (!validateVersion(projectProps.version)) return projectProps;

  if (projectProps.activityGraph && projectProps.activityGraph.panels) {
    projectProps.activityGraph = {
      chart: {
        panels: projectProps.activityGraph.panels,
      },
    };
  }

  return projectProps;
}

export default {
  currentVersion: "3.1",
  newVersion: "3.2",
  upgradeProject,
};
