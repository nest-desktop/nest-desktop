// defineProjectStore.ts

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

  return defineStore(args.simulator + "-project-view", {
    state: () => ({
      bottomOpen: false,
      controllerOpen: false,
      controllerView: "",
      project: new args.Project(),
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
      init(): void {
        logger.trace("init");
        const projectDBStore = args.useProjectDBStore();
        if (projectDBStore.projects.length > 0) {
          const firstProject = projectDBStore.projects[0];
          this.project = firstProject;
          this.projectId = firstProject.id;
        }
      },
      /**
       * Load current project from store.
       * @param projectId
       */
      loadProject(projectId: string = ""): void {
        logger.trace("load project:", projectId?.slice(0, 6));
        const projectDBStore = args.useProjectDBStore();
        this.project = projectDBStore.getProject(projectId);
        this.projectId = this.project.id;

        // this.project.activityGraph.init();

        // const activityGraphStore = useActivityGraphStore();
        // activityGraphStore.init(this.project as Project);
        // activityGraphStore.update();
      },
      /**
       * Reload the project in the list.
       */
      reloadProject(project: Project): void {
        logger.trace("reload project:", project.id.slice(0, 6));
        const projectDBStore = args.useProjectDBStore();
        projectDBStore.unloadProject(project.id);
        this.project = projectDBStore.getProject(project.id);
      },
      /**
       * Save current project.
       */
      saveCurrentProject() {
        logger.trace("save project:", this.projectId?.slice(0, 6));
        const projectDBStore = args.useProjectDBStore();
        projectDBStore.saveProject(this.projectId);
      },
      /**
       * Start simulation of the current project.
       */
      startSimulation(): void {
        logger.trace("start simulation:", this.projectId?.slice(0, 6));
        router.push({
          name: args.simulator + "ActivityExplorer",
          params: { projectId: this.projectId },
        });
        this.project.startSimulation();
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
}
