// projectStore.ts
import { defineStore } from "pinia";

import { Project } from "../core/project/project";
import { useProjectDBStore } from "../store/projectDBStore";

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
    toggle(item: any = null) {
      if (!this.controllerOpen || this.controllerView === item.id) {
        this.controllerOpen = !this.controllerOpen;
      }
      this.controllerView = this.controllerOpen ? item.id : "";
      window.dispatchEvent(new Event('resize'));
    },
    loadProject(projectId: string = "") {
      // console.log("Load project:", projectId);
      const projectDBStore = useProjectDBStore();
      this.project = projectDBStore.getProject(projectId);
      this.projectId = this.project.id;
    },
    saveCurrentProject() {
      const projectDBStore = useProjectDBStore();
      projectDBStore.saveProject(this.projectId);
    },
  },
});
