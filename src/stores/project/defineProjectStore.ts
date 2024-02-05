// defineProjectStore.ts

import { computed, reactive } from "vue";
import { defineStore } from "pinia";

import { logger as mainLogger } from "@/helpers/common/logger";
import router from "@/router";

import { BaseProject } from "@/helpers/project/project";
import { Project } from "@/types/projectTypes";

import { useProjectDBStore } from "./projectDBStore";

type Class<T> = new (...args: any) => T;

export function defineProjectStore(
  args: {
    simulator: string;
    useProjectDBStore: any;
    Project: Class<Project>;
    loggerMinLevel?: number;
  } = {
    simulator: "base",
    useProjectDBStore,
    Project: BaseProject,
  }
) {
  const logger = mainLogger.getSubLogger({
    name: args.simulator + " project store",
    minLevel: args.loggerMinLevel || 3,
  });

  return defineStore(args.simulator + "-project-view", () => {
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
      simulateAfterCheckout: false,
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
      logger.trace("load project:", projectId?.slice(0, 6));
      state.project = projectDBStore.getProject(projectId);
      state.projectId = state.project.id;

      // state.project.activityGraph.init();

      // const activityGraphStore = useActivityGraphStore();
      // activityGraphStore.init(state.project as Project);
      // activityGraphStore.update();
    };

    const project = computed(() => state.project as Project);

    /**
     * Reload the project in the list.
     */
    const reloadProject = (project: Project) => {
      logger.trace("reload project:", project.id.slice(0, 6));
      projectDBStore.unloadProject(project.id);
      state.project = projectDBStore.getProject(project.id);
    };

    /**
     * Save current project.
     */
    const saveCurrentProject = () => {
      logger.trace("save project:", state.projectId?.slice(0, 6));
      projectDBStore.saveProject(state.projectId);
    };

    /**
     * Start simulation of the current project.
     */
    const startSimulation = () => {
      logger.trace("start simulation:", state.projectId?.slice(0, 6));
      router.push({
        name: args.simulator + "ActivityExplorer",
        params: { projectId: state.projectId },
      });
      state.project.startSimulation();
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
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 400);
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
