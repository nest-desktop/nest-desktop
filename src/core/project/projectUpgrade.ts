import { App } from '../app';

import { upgradeProject_25_to_30 } from '../upgrades/upgrade_25_to_30';
import { upgradeProject_30_to_31 } from '../upgrades/upgrade_30_to_31';
import { upgradeProject_31_to_32 } from '../upgrades/upgrade_31_to_32';

/**

 * Upgrades projects to be compatible with the latest release.
 * It also checks if projects are valid and corrects some problems.
 * @param app NEST Desktop app
 * @param project Project which should be transformed
 * @returns project
 */
export function upgradeProject(app: App, project: any): any {
  if (Object.keys(project).length === 0) {
    return {};
  }

  if (!project.hasOwnProperty('version')) {
    return project;
  }

  project = upgradeProject_25_to_30(app, project);
  project = upgradeProject_30_to_31(project);
  project = upgradeProject_31_to_32(project);

  return project;
}
