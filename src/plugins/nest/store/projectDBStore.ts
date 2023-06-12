// projectDBStore.ts
import { defineStore } from "pinia";

import { ProjectDB } from "../core/project/projectDB";
import { Project } from "../core/project/project";

export const useProjectDBStore = defineStore("project-db", {
  state: () => ({
    db: new ProjectDB(),
    numLoaded: 0,
    projectAssets: [
      "spatial-neurons",
      "spatial-spike-activity",
      "spike-activity",
      "spike-input",
      "current-input",
    ],
    projects: [] as (Project | any)[],
    searchTerm: "",
  }),
  getters: {
    filteredProjects(): Project[] {
      if (this.searchTerm === "" || this.searchTerm == null) {
        return this.projects;
      } else {
        return this.projects.filter(
          (project: Project) =>
            project.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >
            -1
        );
      }
    },
  },
  actions: {
    /**
     * Create a project in the database.
     */
    async createProject(data: any): Promise<any> {
      // console.log("Add project: " + data.name);
      return this.db.create(data);
    },
    /**
     * Create multiple projects in the database.
     */
    async createProjects(data: any[]): Promise<any> {
      // console.log("Add projects");
      const projects: any[] = data.map(
        (project: any) =>
          new Promise<any>((resolve) => {
            this.createProject(project).then(() => {
              resolve(project);
            });
          })
      );
      return Promise.all(projects);
    },
    /**
     * Get project from the list.
     */
    getProject(projectId: string = ""): Project {
      let project;
      if (projectId) {
        this.loadProject(projectId);
        project = this.projects.find(
          (project: Project | any) => project.id === projectId
        );
      }
      if (project == undefined) {
        project = new Project();
        this.projects.unshift(project);
      }
      return project;
    },
    /**
     * Import the project in the database.
     */
    async importProject(project: Project): Promise<any> {
      // console.log("Import project: " + project.name);
      project.clean();

      return project.docId
        ? this.db.update(project.toJSON())
        : this.db.create(project.toJSON());
    },
    /**
     * Import projects the update list.
     */
    importProjects(projects: any[]): void {
      // console.log("Import projects");
      this.createProjects(projects).then(() => this.updateList());
    },
    /**
     * Import multiple projects from assets and add them to the database.
     */
    async importProjectsFromAssets(): Promise<any> {
      // console.log("Import projects from assets");
      let promise: Promise<any> = Promise.resolve();
      this.projectAssets.forEach(async (file: string) => {
        const response = await fetch("/assets/nest/projects/" + file + ".json");
        const data = await response.json();
        promise = promise.then(() => this.createProject(data));
      });
      return promise;
    },
    /**
     * Initialize projects db.
     */
    async init(): Promise<any> {
      // console.log("Initialize project DB store");
      return this.db.count().then(async (count: number) => {
        console.debug("Projects in db: " + count);
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
    loadProject(projectId: string): void {
      // console.log("Load project:", projectId);
      // this.project.insite.cancelAllIntervals();

      let project = this.projects.find(
        (project: any) => project._id === projectId
      );

      if (project == undefined) {
        return;
      }

      if (project.doc == undefined) {
        const projectIds = this.projects.map((project: any) => project._id);
        const projectIdx = projectIds.indexOf(projectId);

        if (projectIdx === -1) {
          return;
        }

        project = new Project(project);
        project.init();

        this.projects[projectIdx] = project;
        this.numLoaded += 1;
      }
    },
    /*
    * Save project from the list.
    */
    async saveProject(projectId: string): Promise<any> {
      const project = this.projects.find((project) => project._id === projectId);
      return this.importProject(project)
    },
    /**
     * Unload the project in the list.
     * @param project string
     */
    unloadProject(projectId: string): void {
      // console.debug("Unload project");

      const project: Project = this.projects.find(
        (project: any) => project.id === projectId
      );

      if (project != undefined) {
        const projectIdx: number = this.projects
          .map((p: Project) => p.id)
          .indexOf(project.id);

        this.projects[projectIdx] = project.doc;
        this.numLoaded -= 1;
      }
    },
    /**
     * Update project list from the database.
     */
    async updateList(): Promise<any> {
      // console.log("Update project list");
      this.projects = [];
      return this.db.list("createdAt", true).then((projects: any[]) => {
        this.projects = projects;

        // if (this.projects.length === 0) {
        //   this._view.redirect();
        // }

        // Redirect if project id from the current route is provided in the list.
        // const currentRoute = this._app.vueSetupContext.root.$router.currentRoute;

        // if (currentRoute.name === 'projectId') {
        //   this.project =
        //     this.getProject(currentRoute.params.id) ||
        //     this.getProject(this.recentProjectId);
        //   this._view.redirect(this._view.state.projectId);
        // }
      });
    },
  },
});
