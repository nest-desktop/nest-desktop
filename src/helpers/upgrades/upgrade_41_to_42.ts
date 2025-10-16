// upgrade_41_to_42.ts

const validateVersion = (version: string) => /^4\.1(\.\d+)?(\w+)?$/.test(version);

export function upgradeProject_41_to_42(projectProps: any): any {
  if (!validateVersion(projectProps.version)) return projectProps;

  projectProps.version = "4.2";
  return projectProps;
}
