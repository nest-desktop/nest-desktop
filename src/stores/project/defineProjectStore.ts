// defineProjectStore.ts

import { defineStore } from "pinia";
import { reactive, watch } from "vue";

import router from "@/router";
import { BaseProject } from "@/helpers/project/project";
import { Class, TNetworkProject, TRoute, TStore } from "@/types";
import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";

import { useAppStore } from "../appStore";
import { useProjectDBStore } from "./projectDBStore";

interface IProjectStoreState<TProject extends BaseProject = BaseProject> {
  project: TProject | null;
  projectId: string;
}

export function defineProjectStore<TProject extends BaseProject = BaseProject>(
  props: {
    Project: Class<TProject | BaseProject>;
    useProjectDBStore: TStore;
    workspace: string;
  } = {
    Project: BaseProject,
    useProjectDBStore,
    workspace: "base",
  },
) {
  const logger = mainLogger.getSubLogger({ name: props.workspace + " project store" });

  return defineStore(props.workspace + "-project", () => {
    const state = reactive<IProjectStoreState<TProject | BaseProject>>({
      project: null,
      projectId: "",
    });

    const projectDBStore = props.useProjectDBStore();

    /**
     * Initialize project store.
     */
    const init = (): void => {
      logger.trace("init");

      if (projectDBStore.state.initialized) {
        if (state.projectId) {
          loadProject(state.projectId);
        } else {
          loadFirstProject();
        }
      }

      watch(
        () => projectDBStore.state.initialized,
        () => {
          logger.trace("watch", state.projectId);

          if (state.projectId) {
            loadProject(state.projectId);
          } else {
            loadFirstProject();
          }
        },
      );
    };

    /**
     * Check if the project is selected.
     * @param projectId project ID
     * @returns boolean
     */
    const isProjectSelected = (projectId: string): boolean => state.projectId === projectId;

    /**
     * Load first project
     */
    const loadFirstProject = (): void => {
      logger.trace("load first project");

      const firstProject = projectDBStore.state.projects[0];
      if (!firstProject) return;
      state.projectId = firstProject.id;
      state.project = projectDBStore.getProject(firstProject.id);
    };

    /**
     * Load current project from store.
     * @param projectId project ID
     */
    const loadProject = (projectId: string = ""): void => {
      logger.trace("load project:", truncate(projectId));

      if (projectDBStore.hasProjectId(projectId)) {
        state.project = projectDBStore.getProject(projectId);
        state.projectId = state.project ? state.project.id : "";
      }

      // state.project.activityGraph.init();

      // const activityGraphStore = useActivityGraphStore();
      // activityGraphStore.init(state.project as Project);
      // activityGraphStore.update();
      // const projectViewStore = useProjectViewStore();

      if (state.project) {
        state.project.code.graph.load();

        const appStore = useAppStore();
        const projectViewStore = appStore.currentWorkspace.views.project;
        if (projectViewStore.state.simulationEvents.onLoad && projectViewStore.state.views.main === "explore") {
          startSimulation();
        }
      }
    };

    /**
     * Create new project.
     */
    const newProject = (): void => {
      logger.trace("new project");

      state.project = new props.Project();
      state.projectId = state.project.id;

      state.project.code.graph.clear();
      state.project.code.graph.save();
    };

    /**
     * Reload the project in the list.
     * @param project project object
     */
    const reloadProject = (project: TProject): void => {
      logger.trace("reload project:", project.shortId);

      projectDBStore.unloadProject(project.id);
      state.project = projectDBStore.getProject(project.id);
    };

    /**
     * Get route path of current model.
     * @returns
     */
    const routeTo = (): TRoute => {
      const appStore = useAppStore();
      const projectViewStore = appStore.currentWorkspace.views.project;

      return {
        path: "/" + props.workspace + "/project/" + state.projectId + "/" + projectViewStore.state.views.main,
      };
    };

    /**
     * Save current project.
     */
    const saveCurrentProject = (): void => {
      logger.trace("save project:", truncate(state.projectId));

      projectDBStore.saveProject(state.projectId);
    };

    /**
     * Start analysis of the current project.
     */
    const startAnalysis = (): void => {
      logger.trace("start analysis:", truncate(state.projectId));

      router
        .push({
          name: props.workspace + "ActivityExplorer",
          params: { projectId: state.projectId },
        })
        .then(() => {
          const project = state.project as TProject;
          // TODO: nextTick doesn't work.
          setTimeout(() => project.startAnalysis(), 100);
        });
    };

    /**
     * Start simulation of the current project.
     */
    const startSimulation = (): void => {
      logger.trace("start simulation:", truncate(state.projectId));

      router
        .push({
          name: props.workspace + "ActivityExplorer",
          params: { projectId: state.projectId },
        })
        .then(() => {
          const project = state.project as TNetworkProject;
          // TODO: nextTick doesn't work.
          setTimeout(() => project.startSimulation(), 100);
        });
    };

    return {
      init,
      isProjectSelected,
      loadProject,
      newProject,
      props,
      reloadProject,
      routeTo,
      saveCurrentProject,
      startAnalysis,
      startSimulation,
      state,
    };
  });
}
