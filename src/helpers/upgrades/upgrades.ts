// upgrades.ts

import { truncate } from "@/utils/truncate";
import { upgradeProject_30_to_31 } from "./upgrade_30_to_31";
import { upgradeProject_31_to_32 } from "./upgrade_31_to_32";
import { upgradeProject_32_to_33 } from "./upgrade_32_to_33";
import { upgradeProject_33_to_40 } from "./upgrade_33_to_40";

const currentVersion = process.env.APP_VERSION as string;

const projectUpgrades = [
  upgradeProject_30_to_31,
  upgradeProject_31_to_32,
  upgradeProject_32_to_33,
  upgradeProject_33_to_40,
];

/**
 * Upgrades project to be compatible with the latest release.
 * It also checks if projects are valid and corrects some problems.
 * @param projectProps project props which should be transformed
 * @returns project props
 */

export function upgradeProject(projectProps: any): any {
  if (Object.keys(projectProps).length === 0) {
    return {};
  }

  if (!("version" in projectProps)) return projectProps;

  const oldVersion = projectProps.version;

  for (const upgrade of projectUpgrades) {
    projectProps = upgrade(projectProps);

    if (currentVersion.startsWith(projectProps.version)) break;
  }

  if (oldVersion != projectProps.version) {
    const projectId = projectProps.id;
    if (projectId) {
      console.log(
        `Upgrade project (${truncate(projectProps.id)}): ${oldVersion} -> ${
          projectProps.version
        }`
      );
    }
  }

  return projectProps;
}
