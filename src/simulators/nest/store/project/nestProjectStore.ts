// nestProjectStore.ts

import { defineStore } from "pinia";

import router from "@/router";
import { logger as mainLogger } from "@/helpers/common/logger";
import { truncate } from "@/utils/truncate";

import { NESTProject } from "@nest/helpers/project/nestProject";

import { useNESTProjectDBStore } from "./nestProjectDBStore";

const logger = mainLogger.getSubLogger({ name: "project store" });

export const useNESTProjectStore = defineStore("nest-project-view", {
  state: () => ({
    bottomOpen: false,
    controllerOpen: false,
    controllerView: "",
    // @ts-ignore
    project: undefined as NESTProject,
    projectId: "",
    simulateAfterCheckout: false,
    view: "edit",
    controllerWidth: 480,
    bottomNavHeight: 200,
    code: "import nest\n\nnest.ResetKernel()\n\nn1 = nest.Create('iaf_psc_alpha')\ndc1 = nest.Create('dc_generator')\nvm1 = nest.Create('voltmeter')\n\nnest.Connect(dc1, n1)\nnest.Connect(vm1, n1)\n\nnest.Simulate(1000)",
  }),
  actions: {
    /**
     * Load current project from store.
     * @param projectId
     */
    loadProject(projectId?: string): void {
      logger.trace("load project:", truncate(projectId));
      const projectDBStore = useNESTProjectDBStore();
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
      logger.trace("start nest simulation:", truncate(this.projectId));
      router.push({
        name: "nestActivityExplorer",
        params: { projectId: this.projectId },
      });
      this.project.startSimulation();
    },
    /**
     * Reload the project in the list.
     */
    reloadProject(project: NESTProject): void {
      logger.trace("reload project:", truncate(project.id));
      const projectDBStore = useNESTProjectDBStore();
      projectDBStore.reloadProject(project.id);
    },
    /**
     * Save current project.
     */
    saveCurrentProject() {
      logger.trace("save project:", truncate(this.projectId));
      const projectDBStore = useNESTProjectDBStore();
      projectDBStore.saveProject(this.project as NESTProject);
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
