// upgrade_40_to_41.ts

const validateVersion = (version: string) => /^4\.0(\.\d+)?(\w+)?$/.test(version);

export function upgradeProject_40_to_41(projectState: any): any {
  if (!validateVersion(projectState.version)) return projectState;

  projectState.version = "4.1";
  return projectState;
}
