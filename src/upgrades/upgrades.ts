// upgrades.ts

import { truncate } from "@/utils/truncate";

import { upgradeProject_30_to_31 } from "./upgrade_30_to_31";
import { upgradeProject_31_to_32 } from "./upgrade_31_to_32";
import { upgradeProject_32_to_33 } from "./upgrade_32_to_33";
import { upgradeProject_33_to_40 } from "./upgrade_33_to_40";
import { upgradeProject_40_to_41 } from "./upgrade_40_to_41";
import { upgradeProject_41_to_42 } from "./upgrade_41_to_42";
import { upgradeModel_42_to_50, upgradeProject_42_to_50 } from "./upgrade_42_to_50";

const currentVersion = process.env.APP_VERSION as string;

const projectUpgrades = [
  upgradeProject_30_to_31,
  upgradeProject_31_to_32,
  upgradeProject_32_to_33,
  upgradeProject_33_to_40,
  upgradeProject_40_to_41,
  upgradeProject_41_to_42,
  upgradeProject_42_to_50,
];

/**
 * Upgrades project to be compatible with the latest release.
 * It also checks if projects are valid and corrects some problems.
 * @param projectState project state which should be transformed
 * @returns project state
 */

export function upgradeProject(projectState: any): any {
  if (Object.keys(projectState).length === 0) return {};

  if (!("version" in projectState)) return projectState;

  const oldVersion = projectState.version;

  for (const upgrade of projectUpgrades) {
    projectState = upgrade(projectState);

    if (currentVersion.startsWith(projectState.version)) break;
  }

  if (oldVersion !== projectState.version) {
    const projectId = projectState.id;
    if (projectId) {
      console.log(`Upgrade project (${truncate(projectState.id)}): ${oldVersion} -> ${projectState.version}`);
    }
  }

  return projectState;
}

const modelUpgrades = [upgradeModel_42_to_50];

export function upgradeModel(modelState: any): any {
  if (!("version" in modelState)) modelState.version = "4.2";

  const oldVersion = modelState.version;

  for (const upgrade of modelUpgrades) {
    modelState = upgrade(modelState);

    if (currentVersion.startsWith(modelState.version)) break;
  }

  if (oldVersion !== modelState.version) {
    const modelId = modelState.id;
    if (modelId) {
      console.log(`Upgrade model (${modelState.id}): ${oldVersion} -> ${modelState.version}`);
    }
  }

  return modelState;
}
