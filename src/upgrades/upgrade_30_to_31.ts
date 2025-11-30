// upgrade_30_to_31.ts

const validateVersion = (version: string) => /^3\.0(\.\d+)?(\w+)?$/.test(version);

export function upgradeProject_30_to_31(projectState: any): any {
  if (!validateVersion(projectState.version)) return projectState;

  projectState.version = "3.1";
  return projectState;
}
