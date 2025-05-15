// upgrade_40_to_41.ts

const validateVersion = (version: string) => /^4\.0(\.\d+)?(\w+)?$/.test(version);

function upgradeProject(projectProps: any): any {
  if (!validateVersion(projectProps.version)) return projectProps;

  return projectProps;
}

export default {
  currentVersion: "4.0",
  newVersion: "4.1",
  upgradeProject,
};
