// upgradeProject.ts

import { truncate } from "@/utils/truncate";
import { TProjectProps } from "@/types";

import projectUpgrades from "../upgrades";

const currentVersion = process.env.APP_VERSION as string;

/**
 * Upgrades project to be compatible with the latest release.
 * It also checks if projects are valid and corrects some problems.
 * @param projectProps project props which should be transformed
 * @returns project props
 */

export function upgradeProject(projectProps: any): TProjectProps {
  if (Object.keys(projectProps).length === 0) return {};
  if (!("version" in projectProps)) return projectProps;

  const oldVersion = projectProps.version;

  for (const upgrade of Object.values(projectUpgrades)) {
    if (projectProps.version.startsWith(upgrade.currentVersion)) {
      projectProps = upgrade.upgradeProject(projectProps);
      projectProps.version = upgrade.newVersion;
    }
    if (projectProps.version.startsWith(currentVersion)) break;
  }

  if (oldVersion != projectProps.version && projectProps.id)
    console.log(`Upgrade project (${truncate(projectProps.id)}): ${oldVersion} -> ${projectProps.version}`);

  return projectProps;
}
