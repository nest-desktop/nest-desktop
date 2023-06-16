// upgrade_30_to_31.ts

const validateVersion = (version: string) =>
  /^3\.0(\.\d+)?(\w+)?$/.test(version);

export function upgradeProject_30_to_31(project: any): any {
  if (!validateVersion(project.version)) {
    return project;
  }

  project.version = '3.1';
  return project;
}
