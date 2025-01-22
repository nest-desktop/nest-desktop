// upgrade_30_to_31.ts

const validateVersion = (version: string) => /^3\.0(\.\d+)?(\w+)?$/.test(version);

function upgradeProject(projectProps: any): any {
  if (!validateVersion(projectProps.version)) return projectProps;

  return projectProps;
}

export default {
  currentVersion: "3.0",
  newVersion: "3.1",
  upgradeProject,
};
