// projectDBStore.ts

import { defineStore } from "pinia";
import { download } from "@/utils/download";
import { logger as mainLogger } from "@/helpers/common/logger";

import { PyNNProject, PyNNProjectProps } from "../../helpers/project/project";
import { PyNNProjectDB } from "../../helpers/project/projectDB";

const logger = mainLogger.getSubLogger({ name: "pynn project DB store" });

const projectAssets = ["spike-activity", "spike-input", "current-input"];
const db = new PyNNProjectDB();

export const usePyNNProjectDBStore = defineStore("pynn-project-db", {
  state: () => ({
    numLoaded: 0,
    projects: [] as (PyNNProject | PyNNProjectProps | any)[], // TODO: any should be removed.
    searchTerm: "",
  }),
  getters: {
    filteredProjects(): PyNNProject[] {
      if (this.searchTerm === "" || this.searchTerm == null) {
        return this.projects;
      } else {
        return this.projects.filter(
          (project: PyNNProject) =>
            project.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >
            -1
        );
      }
    },
  },
  actions: {
    /**
     * Clone this current project and add it to the list.
     *
     * @remarks
     * It pushes new project to the first line of the list.
     */
    addProject(project: PyNNProject): void {
      this.projects.unshift(project);
    },
    /**
     * Create a project in the database.
     */
    async createProject(data: PyNNProjectProps): Promise<any> {
      logger.trace("add project", data.id?.slice(0, 6));
      return db.create(data);
    },
    /**
     * Create multiple projects in the database.
     */
    async createProjects(
      data: PyNNProjectProps[]
    ): Promise<PyNNProjectProps[]> {
      logger.trace("create projects");
      const projects: Promise<PyNNProjectProps>[] = data.map(
        (project: PyNNProjectProps) =>
          new Promise<PyNNProjectProps>((resolve) => {
            this.createProject(project).then(() => {
              resolve(project);
            });
          })
      );
      return Promise.all(projects);
    },
    /**
     * Delete project in database and then update the list.
     */
    deleteProject(project: PyNNProject | PyNNProjectProps | any): void {
      // TODO: any should be removed.
      logger.trace("delete project:", project.id.slice(0, 6));
      const projectId: string = project.docId || project.id;
      db.delete(projectId).finally(() => {
        this.removeFromList(projectId);
      });
    },

    /**
     * Delete projects and then update the list.
     * @param projects List of project objects.
     */
    deleteProjects(projects: (PyNNProject | PyNNProjectProps)[]): void {
      logger.trace("delete projects");
      if (projects.length === 0) return;
      const projectDocIds: string[] = projects.map(
        (
          project: PyNNProject | PyNNProjectProps | any // TODO: any should be removed.
        ) => project.docId || project.id
      );
      db.deleteBulk(projectDocIds).then(() => this.updateList());
    },
    /**
     * Export project from the list.
     */
    exportProject(projectId: string, withActivities: boolean = false): void {
      logger.trace("export project:", projectId.slice(0, 6));
      const project: PyNNProject = this.projects.find(
        (p: PyNNProject) => p.id === projectId
      );

      const projectData: any = project.toJSON();
      if (withActivities) {
        projectData.activities = project.activities.toJSON();
      }
      download(JSON.stringify(projectData), "project");
    },

    /**
     * Get project from the list.
     */
    getProject(projectId: string = ""): PyNNProject {
      logger.trace("get project:", projectId.slice(0, 6));
      let project;
      if (projectId) {
        project = this.loadProject(projectId);
      }
      if (project == undefined) {
        project = new PyNNProject();
        this.projects.unshift(project);
      }
      return project;
    },
    /**
     * Import the project in the database.
     */
    async importProject(project: PyNNProject): Promise<any> {
      logger.trace("import project:", project.id.slice(0, 6));
      project.clean();

      return project.docId
        ? db.updateProject(project)
        : db.createProject(project);
    },
    /**
     * Import projects the update list.
     */
    importProjects(projects: any[]): void {
      logger.trace("import projects");
      db.createProjects(projects).then(() => this.updateList());
    },
    /**
     * Import multiple projects from assets and add them to the database.
     */
    async importProjectsFromAssets(): Promise<any> {
      logger.trace("import projects from assets");
      let promise: Promise<any> = Promise.resolve();
      projectAssets.forEach(async (file: string) => {
        const response = await fetch("assets/pynn/projects/" + file + ".json");
        const data = await response.json();
        promise = promise.then(() => this.createProject(data));
      });
      return promise;
    },
    /**
     * Initialize projects DB.
     */
    async init(): Promise<any> {
      logger.trace("init");
      return db.count().then(async (count: number) => {
        logger.debug("projects in DB:", count);
        if (count === 0) {
          return this.importProjectsFromAssets().then(() => this.updateList());
        } else {
          return this.updateList();
        }
      });
    },
    /**
     * Load a project in the list.
     * @param projectId string
     */
    loadProject(projectId: string): PyNNProject | undefined {
      logger.trace("load project:", projectId.slice(0, 6));
      // this.project.insite.cancelAllIntervals();

      let project = this.projects.find(
        (project: PyNNProjectProps | PyNNProject | any) =>
          project.id === projectId
      );

      if (project == undefined) {
        return;
      }

      if (project.doc == undefined) {
        const projectIds = this.projects.map(
          (project: PyNNProjectProps | PyNNProject | any) => project.id
        );
        const projectIdx = projectIds.indexOf(projectId);

        if (projectIdx === -1) {
          return;
        }

        project = new PyNNProject(project);
        project.init();

        this.projects[projectIdx] = project;
        this.numLoaded += 1;
      }

      return project;
    },
    /**
     * Reload the project in the list.
     */
    reloadProject(projectId: string): void {
      logger.trace("reload project:", projectId.slice(0, 6));

      this.unloadProject(projectId);
      this.loadProject(projectId);
    },
    /**
     * Remove project from the list.
     */
    removeFromList(projectId: string): void {
      logger.trace("remove project from the list:", projectId.slice(0, 6));
      const idx: number = this.projects
        .map((p: PyNNProject) => p.id)
        .indexOf(projectId);

      if (idx !== -1) {
        // Remove project from the project list.
        this.projects.splice(idx, 1);
      }
    },
    /*
     * Save project from the list.
     */
    async saveProject(projectId: string): Promise<any> {
      logger.trace("save project:", projectId.slice(0, 6));
      const project = this.projects.find((project) => project.id === projectId);
      return this.importProject(project);
    },
    /**
     * Unload the project in the list.
     * @param project string
     */
    unloadProject(projectId: string): void {
      logger.trace("unload project:", projectId);

      const project: PyNNProject = this.projects.find(
        (project: any) => project.id === projectId
      );

      if (project != undefined) {
        const projectIdx: number = this.projects
          .map((p: PyNNProject) => p.id)
          .indexOf(project.id);

        this.projects[projectIdx] = project.doc;
        this.numLoaded -= 1;
      }
    },
    /**
     * Update project list from the database.
     */
    async updateList(): Promise<any> {
      logger.trace("update list");
      this.projects = [];
      return db.list("createdAt", true).then((projects: any[]) => {
        this.projects = projects;
      });
    },
  },
});
