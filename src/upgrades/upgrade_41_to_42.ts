// upgrade_41_to_42.ts

const validateVersion = (version: string) => /^4\.1(\.\d+)?(\w+)?$/.test(version);

export function upgradeProject_41_to_42(projectState: any): any {
  if (!validateVersion(projectState.version)) return projectState;

  projectState.version = "4.2";
  return projectState;
}
