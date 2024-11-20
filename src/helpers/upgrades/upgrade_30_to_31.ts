// upgrade_30_to_31.ts

const validateVersion = (version: string) =>
  /^3\.0(\.\d+)?(\w+)?$/.test(version);

export function upgradeProject_30_to_31(projectProps: any): any {
  if (!validateVersion(projectProps.version)) {
    return projectProps;
  }

  projectProps.version = "3.1";
  return projectProps;
}
