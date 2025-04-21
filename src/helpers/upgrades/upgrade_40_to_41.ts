// upgrade_40_to_41.ts

const validateVersion = (version: string) => /^4\.0(\.\d+)?(\w+)?$/.test(version);

export function upgradeProject_40_to_41(projectProps: any): any {
  if (!validateVersion(projectProps.version)) return projectProps;

  projectProps.version = "4.1";
  return projectProps;
}
