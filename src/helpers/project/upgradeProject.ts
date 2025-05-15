// upgradeProject.ts

import { TProjectProps } from "@/types";

import projectUpgrades from "../upgrades";
import { notifyInfo } from "../common/notification";

const currentVersion = process.env.APP_VERSION as string;

/**
 * Upgrades project to be compatible with the latest release.
 * It also checks if projects are valid and corrects some problems.
 * @param projectProps project props which should be migrated
 * @returns project props
 */

export function upgradeProject(projectProps: any): TProjectProps {
  if (Object.keys(projectProps).length === 0) return {};
  if (!("version" in projectProps)) return projectProps;
  if (!projectProps.code?.graph && projectProps.version.startsWith("5.")) projectProps.version = "4.1";

  const oldVersion = projectProps.version;

  for (const upgrade of Object.values(projectUpgrades)) {
    if (projectProps.version.startsWith(upgrade.currentVersion)) {
      projectProps = upgrade.upgradeProject(projectProps);
      projectProps.version = upgrade.newVersion;
    }
    if (projectProps.version.startsWith(currentVersion)) break;
  }

  if (oldVersion != projectProps.version && projectProps.id)
    notifyInfo(`Project ${projectProps.name} upgraded: ${oldVersion} &#10142; ${projectProps.version}`);

  return projectProps;
}
