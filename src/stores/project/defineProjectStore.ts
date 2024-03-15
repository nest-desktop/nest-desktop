// defineProjectStore.ts

import { computed, reactive } from "vue";
import { defineStore } from "pinia";

import router from "@/router";
import { BaseProject } from "@/helpers/project/project";
import { TProject } from "@/types/projectTypes";
import { logger as mainLogger } from "@/helpers/common/logger";
import { truncate } from "@/utils/truncate";

import { useProjectDBStore } from "./projectDBStore";
import { useProjectViewStore } from "./projectViewStore";

type Class<T> = new (...args: any) => T;

export function defineProjectStore(
  args: {
    Project: Class<TProject>;
    loggerMinLevel?: number;
    simulator: string;
    useProjectDBStore: any;
  } = {
    Project: BaseProject,
    simulator: "base",
    useProjectDBStore,
  }
) {
  const logger = mainLogger.getSubLogger({
    minLevel: args.loggerMinLevel || 3,
    name: args.simulator + " project store",
  });

  return defineStore(args.simulator + "-project", () => {
    const state = reactive({
      bottomNavHeight: 200,
      bottomOpen: false,
      code: "print('hello world!')",
      controllerItems: [
        { id: "network", icon: "nest:network", title: "Edit network" },
        { id: "kernel", icon: "mdi-engine-outline", title: "Edit kernel" },
        { id: "raw", icon: "mdi-code-json" },
        { id: "code", icon: "mdi-xml" },
        { id: "activity", icon: "mdi-border-style" },
        { id: "stats", icon: "mdi-table-large" },
      ],
      controllerOpen: false,
      controllerView: "",
      controllerWidth: 480,
      project: new args.Project(),
      projectId: "",
      view: "edit",
    });

    const projectDBStore = args.useProjectDBStore();

    const init = () => {
      logger.trace("init");
      if (projectDBStore.projects.length > 0) {
        const firstProject = projectDBStore.projects[0];
        state.projectId = firstProject.id;
        state.project = projectDBStore.getProject(firstProject.id);
      }
    };

    /**
     * Load current project from store.
     * @param projectId
     */
    const loadProject = (projectId: string = "") => {
      logger.trace("load project:", truncate(projectId || ""));
      state.projectId = projectId;
      state.project = projectDBStore.getProject(projectId);
      state.projectId = state.project.id;

      // state.project.activityGraph.init();

      // const activityGraphStore = useActivityGraphStore();
      // activityGraphStore.init(state.project as Project);
      // activityGraphStore.update();

      const projectViewStore = useProjectViewStore();
      if (
        projectViewStore.state.simulateAfterLoad.value &&
        state.view === "explore" &&
        state.project.activityGraph.state.codeHash === ""
      ) {
        startSimulation();
      }
    };

    const project = computed(() => state.project as TProject);

    /**
     * Reload the project in the list.
     */
    const reloadProject = (project: TProject) => {
      logger.trace("reload project:", truncate(project.id));
      projectDBStore.unloadProject(project.id);
      state.project = projectDBStore.getProject(project.id);
    };

    /**
     * Save current project.
     */
    const saveCurrentProject = () => {
      logger.trace("save project:", truncate(state.projectId || ""));
      projectDBStore.saveProject(state.projectId);
    };

    /**
     * Start simulation of the current project.
     */
    const startSimulation = () => {
      logger.trace("start simulation:", truncate(state.projectId || ""));
      router
        .push({
          name: args.simulator + "ActivityExplorer",
          params: { projectId: state.projectId },
        })
        .then(() => {
          setTimeout(() => state.project.startSimulation(), 100); // TODO: nextTick doesn't work.
        });
    };

    /**
     * Toggle navigation drawer.
     * @param item
     */
    const toggleController = (item?: any) => {
      logger.trace("toggle controller:", item.id);
      if (!state.controllerOpen || state.controllerView === item.id) {
        state.controllerOpen = !state.controllerOpen;
      }
      state.controllerView = state.controllerOpen ? item.id : "";

      setTimeout(() => window.dispatchEvent(new Event("resize")), 400); // TODO: nextTick doesn't work.
    };

    return {
      init,
      loadProject,
      project,
      reloadProject,
      saveCurrentProject,
      startSimulation,
      state,
      toggleController,
    };
  });
}
