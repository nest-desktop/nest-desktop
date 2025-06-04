// upgrade_41_to_50.ts

import { useAppStore } from "@/stores/appStore";
import { NESTCodeGraph } from "@/workspaces/nest/helpers/codeGraph/codeGraph";
import { CodeGraph } from "../codeGraph/codeGraph";

const validateVersion = (version: string) => /^4\.1(\.\d+)?(\w+)?$/.test(version);

function upgradeProject(projectProps: any): any {
  if (!validateVersion(projectProps.version)) return projectProps;

  const appStore = useAppStore();

  let codeGraph;
  if (appStore.currentWorkspace.id == "nest") {
    codeGraph = new NESTCodeGraph(projectProps);
  } else {
    codeGraph = new CodeGraph(null);
  }

  const newProjectProps: Record<string, unknown> = {
    code: { graph: codeGraph.save() },
    createdAt: projectProps.createdAt,
    id: projectProps.id,
    name: projectProps.name,
    version: "5.0",
  };

  if (projectProps.activityGraph) newProjectProps["activityGraph"] = projectProps.activityGraph;
  if (projectProps.description) newProjectProps["description"] = projectProps.description;
  if (projectProps.updatedAt) newProjectProps["updatedAt"] = projectProps.updatedAt;
  if (projectProps._id) newProjectProps["_id"] = projectProps._id;
  if (projectProps._rev) newProjectProps["_rev"] = projectProps._rev;

  return newProjectProps;
}

export default {
  currentVersion: "4.1",
  newVersion: "5.0",
  upgradeProject,
};
