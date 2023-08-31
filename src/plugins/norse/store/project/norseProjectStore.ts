// norseProjectStore.ts

import { defineStore } from "pinia";

import { logger as mainLogger } from "@/utils/logger";
import router from "@/router";

import { NorseProject } from "@norse/components/project/norseProject";

import { useNorseProjectDBStore } from "./norseProjectDBStore";
// import { useActivityGraphStore } from "../graph/activityGraphStore";

const logger = mainLogger.getSubLogger({ name: "norse project store" });

export const useNorseProjectStore = defineStore("norse-project-view", {
  state: () => ({
    bottomOpen: false,
    controllerOpen: false,
    controllerView: "",
    project: new NorseProject(),
    projectId: "",
    simulateAfterCheckout: false,
    view: "edit",
    controllerWidth: 480,
    bottomNavHeight: 200,
    controllerItems: [
      { id: "network", icon: "nest:network", title: "Edit network" },
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
      const projectDBStore = useNorseProjectDBStore();
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
      logger.trace("start Norse simulation:", this.projectId?.slice(0, 6));
      router.push({
        name: "NorseActivityExplorer",
        params: { projectId: this.projectId },
      });
      this.project.startSimulation();
    },
    /**
     * Reload the project in the list.
     */
    reloadProject(project: NorseProject): void {
      logger.trace("reload project:", project.id.slice(0, 6));
      const projectDBStore = useNorseProjectDBStore();
      projectDBStore.unloadProject(project.id);
      this.project = projectDBStore.getProject(project.id);
    },
    /**
     * Save current project.
     */
    saveCurrentProject() {
      logger.trace("save project:", this.projectId?.slice(0, 6));
      const projectDBStore = useNorseProjectDBStore();
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
