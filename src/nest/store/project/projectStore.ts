// projectStore.ts

import { defineStore } from "pinia";

import { Project } from "@nest/core/project/project";
import { useProjectDBStore } from "./projectDBStore";
import router from "@/router";

export const useProjectStore = defineStore("project-view", {
  state: () => ({
    bottomOpen: false,
    controllerOpen: false,
    controllerView: "",
    project: new Project(),
    projectId: "",
    simulateAfterCheckout: false,
    view: "edit",
    controllerWidth: 480,
    bottomNavHeight: 200,
    controllerItems: [
      { id: "network", icon: "nest:network", title: "Edit network" },
      { id: "kernel", icon: "mdi-engine-outline", title: "Edit kernel" },
      { id: "code", icon: "mdi-xml" },
      { id: "activity", icon: "mdi-border-style" },
      { id: "stats", icon: "mdi-table-large" },
    ],
    code: "import nest\n\nnest.ResetKernel()\n\nn1 = nest.Create('iaf_psc_alpha')\ndc1 = nest.Create('dc_generator')\nvm1 = nest.Create('voltmeter')\n\nnest.Connect(dc1, n1)\nnest.Connect(vm1, n1)\n\nnest.Simulate(1000)",
  }),
  actions: {
    /**
     * Load current project from store.
     * @param projectId
     */
    loadProject(projectId: string = ""): void {
      // console.log("Load project:", projectId);
      const projectDBStore = useProjectDBStore();
      this.project = projectDBStore.getProject(projectId);
      this.projectId = this.project.id;
    },
    /**
     * Start simulation of the current project.
     */
    startSimulation(): void {
      router.push({
        name: "ActivityExplorer",
        params: { projectId: this.projectId },
      });
      this.project.startSimulation();
    },
    /**
     * Reload the project in the list.
     */
    reloadProject(project: Project): void {
      console.log("Reload project");
      const projectDBStore = useProjectDBStore();
      projectDBStore.unloadProject(project.id);
      this.project = projectDBStore.getProject(project.id);
    },
    /**
     * Save current project.
     */
    saveCurrentProject() {
      const projectDBStore = useProjectDBStore();
      projectDBStore.saveProject(this.projectId);
    },
    /**
     * Toggle navigation drawer.
     * @param item
     */
    toggleController(item?: any) {
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
