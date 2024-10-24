// defineProjectStore.ts

import { Store, defineStore } from "pinia";
import { reactive, watch } from "vue";

import { BaseProject } from "@/helpers/project/project";
import router from "@/router";
import { TProject } from "@/types";
import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";

import { TProjectDBStore } from "./defineProjectDBStore";
import { useProjectDBStore } from "./projectDBStore";
import { useProjectViewStore } from "./projectViewStore";

interface IProjectStoreState {
  bottomNav: {
    height: number;
    active: boolean;
  };
  code: string;
  controller: {
    open: boolean;
    view: string;
    width: number;
  };
  project: TProject;
  projectId: string;
  tab: {
    activityView: string;
    view: string;
  };
}

type Class<T> = new (...props: any) => T;

export type TProjectStore = Store<string, any>;

export function defineProjectStore(
  props: {
    Project: Class<TProject>;
    loggerMinLevel?: number;
    simulator: string;
    useProjectDBStore: TProjectDBStore;
  } = {
    Project: BaseProject,
    simulator: "base",
    useProjectDBStore,
  }
): TProjectStore {
  const logger = mainLogger.getSubLogger({
    minLevel: props.loggerMinLevel || 1,
    name: props.simulator + " project store",
  });

  return defineStore(props.simulator + "-project", () => {
    const state = reactive<IProjectStoreState>({
      bottomNav: {
        height: 200,
        active: false,
      },
      code: "print('hello world!')",
      controller: {
        open: false,
        view: "",
        width: 480,
      },
      project: new props.Project() as TProject,
      projectId: "",
      tab: {
        activityView: "abstract",
        view: "edit",
      },
    });

    const projectDBStore: TProjectDBStore = props.useProjectDBStore();

    /**
     * Initialize project store.
     */
    const init = (): void => {
      logger.trace("init");

      if (projectDBStore.state.initialized) {
        state.projectId ? loadProject(state.projectId) : loadFirstProject();
      }

      watch(
        () => projectDBStore.state.initialized,
        () => {
          logger.trace("watch", state.projectId);

          state.projectId ? loadProject(state.projectId) : loadFirstProject();
        }
      );
    };

    /**
     * Check if the project is selected.
     * @param projectId project ID
     * @returns boolean
     */
    const isProjectSelected = (projectId: string): boolean =>
      state.projectId === projectId;

    /**
     * Load first project
     */
    const loadFirstProject = (): void => {
      const firstProject = projectDBStore.state.projects[0];
      state.projectId = firstProject.id;
      state.project = projectDBStore.getProject(firstProject.id);
    };

    /**
     * Load current project from store.
     * @param projectId project ID
     */
    const loadProject = (projectId: string = ""): void => {
      logger.trace("load project:", truncate(projectId));

      if (!projectDBStore.hasProjectId(projectId)) return;

      state.project = projectDBStore.getProject(projectId);
      state.projectId = state.project.id;

      // state.project.activityGraph.init();

      // const activityGraphStore = useActivityGraphStore();
      // activityGraphStore.init(state.project as Project);
      // activityGraphStore.update();

      const projectViewStore = useProjectViewStore();
      if (
        projectViewStore.state.simulateAfterLoad.value &&
        state.tab.view === "explore"
      ) {
        startSimulation();
      }
    };

    /**
     * Create new project.
     */
    const newProject = (): void => {
      logger.trace("new project:");

      // const projectDBStore: TProjectStore = props.useProjectDBStore();
      state.project = new props.Project();
      // state.project = projectDBStore.newProject();
      state.projectId = state.project.id;
      state.project.state.state.editMode = true;
    };

    /**
     * Reload the project in the list.
     * @param project project object
     */
    const reloadProject = (project: TProject): void => {
      logger.trace("reload project:", truncate(project.id));

      projectDBStore.unloadProject(project.id);
      state.project = projectDBStore.getProject(project.id);
    };

    /**
     * Get route path of current model.
     * @returns
     */
    const routeTo = (): { path: string } => ({
      path:
        "/" +
        props.simulator +
        "/project/" +
        state.projectId +
        "/" +
        state.tab.view,
    });

    /**
     * Save current project.
     */
    const saveCurrentProject = (): void => {
      logger.trace("save project:", truncate(state.projectId));

      projectDBStore.saveProject(state.projectId);
    };

    /**
     * Start simulation of the current project.
     */
    const startSimulation = (): void => {
      logger.trace("start simulation:", truncate(state.projectId));

      router
        .push({
          name: props.simulator + "ActivityExplorer",
          params: { projectId: state.projectId },
        })
        .then(() => {
          // TODO: nextTick doesn't work.
          setTimeout(() => state.project.startSimulation(), 100);
        });
    };

    /**
     * Toggle navigation drawer.
     * @param item
     */
    const toggleController = (item: { id: string }): void => {
      logger.trace("toggle controller:", item.id);

      if (!state.controller.open || state.controller.view === item.id) {
        state.controller.open = !state.controller.open;
      }
      state.controller.view = state.controller.open ? item.id : "";
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
      startSimulation,
      state,
      toggleController,
    };
  });
}
