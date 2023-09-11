// pynnProjectStore.ts

import { defineStore } from "pinia";

import { logger as mainLogger } from "@/helpers/common/logger";
import router from "@/router";

import { PyNNProject } from "../../helpers/project/project";

import { usePyNNProjectDBStore } from "./projectDBStore";

const logger = mainLogger.getSubLogger({ name: "pynn project store" });

export const usePyNNProjectStore = defineStore("pynn-project-view", {
  state: () => ({
    bottomOpen: false,
    controllerOpen: false,
    controllerView: "",
    // @ts-ignore
    project: undefined as PyNNProject,
    projectId: "",
    simulateAfterCheckout: false,
    view: "edit",
    controllerWidth: 480,
    bottomNavHeight: 200,
    controllerItems: [
      { id: "network", icon: "network:network", title: "Edit network" },
      { id: "kernel", icon: "mdi-engine-outline", title: "Edit kernel" },
      { id: "raw", icon: "mdi-code-json" },
      { id: "code", icon: "mdi-xml" },
      { id: "activity", icon: "mdi-border-style" },
      { id: "stats", icon: "mdi-table-large" },
    ],
    code: "print('hello world!')",
  }),
  actions: {
    /**
     * Load current project from store.
     * @param projectId
     */
    loadProject(projectId: string = ""): void {
      logger.trace("load project:", projectId?.slice(0, 6));
      const projectDBStore = usePyNNProjectDBStore();
      this.project = projectDBStore.getProject(projectId);
      this.projectId = this.project.id;

      // this.project.activityGraph.init();

      // const activityGraphStore = useActivityGraphStore();
      // activityGraphStore.init(this.project as Project);
      // activityGraphStore.update();
    },
    /**
     * Start simulation of the current project.
     */
    startSimulation(): void {
      logger.trace("start PyNN simulation:", this.projectId?.slice(0, 6));
      router.push({
        name: "pynnActivityExplorer",
        params: { projectId: this.projectId },
      });
      this.project.startSimulation();
    },
    /**
     * Reload the project in the list.
     */
    reloadProject(project: PyNNProject): void {
      logger.trace("reload project:", project.id.slice(0, 6));
      const projectDBStore = usePyNNProjectDBStore();
      projectDBStore.unloadProject(project.id);
      this.project = projectDBStore.getProject(project.id);
    },
    /**
     * Save current project.
     */
    saveCurrentProject() {
      logger.trace("save project:", this.projectId?.slice(0, 6));
      const projectDBStore = usePyNNProjectDBStore();
      projectDBStore.saveProject(this.projectId);
    },
    /**
     * Toggle navigation drawer.
     * @param item
     */
    toggleController(item?: any) {
      logger.trace("toggle controller:", item.id);
      if (!this.controllerOpen || this.controllerView === item.id) {
        this.controllerOpen = !this.controllerOpen;
      }
      this.controllerView = this.controllerOpen ? item.id : "";
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 400);
    },
  },
});