export function upgradeProject_30_to_31(project: any): any {
  if (!/^[0-3]\.[0]+(.\d+)?$/.test(project.version)) {
    return project;
  }

  project.version = '3.1.0';
  return project;
}
