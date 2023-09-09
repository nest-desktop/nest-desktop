// projectDBStore.ts

import { defineStore } from "pinia";
import { download } from "@/utils/download";
import { logger as mainLogger } from "@/helpers/logger";

import { Project } from "@/types/projectTypes";
import { BaseProjectDB } from "@/helpers/project/baseProjectDB";
import { BaseProject, ProjectProps } from "@/helpers/project/baseProject";
import { truncate } from "@/utils/truncate";

const logger = mainLogger.getSubLogger({ name: "project DB store" });

const projectAssets: any[] = [];
const db = new BaseProjectDB();

export const useProjectDBStore = defineStore("project-db", {
  state: () => ({
    numLoaded: 0,
    projects: [] as (Project | ProjectProps | any)[], // TODO: any should be removed.
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
    projectIds(): (string | undefined)[] {
      return this.projects.map((p: Project | ProjectProps) => p.id);
    },
  },
  actions: {
    /**
     * Add this new project to the list.
     *
     * @remarks
     * It pushes new project to the first line of the list.
     */
    addProject(data?: ProjectProps): Project {
      logger.trace("add project", truncate(data?.id));
      const project = this.newProject(data);
      this.projects.unshift(project);
      return project;
    },
    /**
     * Delete project in database and then update the list.
     */
    deleteProject(project: Project | ProjectProps | any): void {
      // TODO: any should be removed.
      logger.trace("delete project:", truncate(project.id));
      db.deleteProject(project).then(() => {
        this.removeFromList(project.id);
      });
    },
    /**
     * Delete projects and then update the list.
     */
    deleteProjects(projects: (Project | ProjectProps)[]): void {
      if (projects.length === 0) return;
      logger.trace("delete projects");
      db.deleteProjects(projects).then(() => this.updateList());
    },
    /**
     * Export project from the list.
     */
    exportProject(projectId: string, withActivities: boolean = false): void {
      logger.trace("export project:", truncate(projectId));
      const project = this.findProject(projectId) as Project;
      const projectData: any = project.toJSON();
      if (withActivities) {
        projectData.activities = project.activities.toJSON();
      }
      download(JSON.stringify(projectData), "project");
    },
    /**
     * Find project from the list.
     */
    findProject(projectId: string): Project | ProjectProps | undefined {
      logger.trace("find project:", truncate(projectId));
      return this.projects.find(
        (project: Project | ProjectProps | any) => project.id === projectId
      );
    },
    /**
     * Get project from the list.
     */
    getProject(projectId: string = ""): Project {
      logger.trace("get project:", truncate(projectId));
      let project;
      if (!projectId || !this.hasProjectId(projectId)) {
        project = this.addProject();
      } else {
        project = this.findProject(projectId);

        if (!this.isProjectLoaded(project)) {
          this.loadProject(projectId);
          project = this.findProject(projectId) as Project;
        }
      }
      return project as Project;
    },
    hasProjectId(projectId: string): boolean {
      return this.projectIds.includes(projectId);
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
        const response = await fetch("assets/norse/projects/" + file + ".json");
        const data = await response.json();
        promise = promise.then(() => db.createProject(data));
      });
      return promise;
    },
    /**
     * Initialize projects DB.
     */
    async init(): Promise<any> {
      logger.trace("init project db store");
      return db.count().then(async (count: number) => {
        logger.debug("projects in DB:", count);
        if (count === 0) {
          return this.importProjectsFromAssets().then(() => this.updateList());
        } else {
          return this.updateList();
        }
      });
    },
    isProjectLoaded(project: Project | ProjectProps | any) {
      return project.doc != undefined;
    },
    /**
     * Load a project in the list.
     */
    loadProject(projectId: string): Project | undefined {
      logger.trace("load project:", truncate(projectId));

      let project = this.findProject(projectId);
      if (project == undefined) {
        return;
      }

      if (!project.docId) {
        const projectIds = this.projects.map((project: any) => project.id);
        const projectIdx = projectIds.indexOf(projectId);

        if (projectIdx === -1) {
          return;
        }

        project = new BaseProject(project);
        project.init();

        this.projects[projectIdx] = project;
        this.numLoaded += 1;
      }

      return project;
    },
    newProject(data?: ProjectProps): BaseProject {
      return new BaseProject(data);
    },
    /**
     * Reload the project in the list.
     */
    reloadProject(projectId: string): void {
      logger.trace("reload project:", truncate(projectId));
      this.unloadProject(projectId);
      this.loadProject(projectId);
    },
    /**
     * Remove project from the list.
     */
    removeFromList(projectId: string): void {
      logger.trace("remove project from the list:", truncate(projectId));
      const idx: number = this.projects
        .map((p: Project) => p.id)
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
      logger.trace("save project:", truncate(projectId));
      const project = this.findProject(projectId) as Project;
      return db.importProject(project);
    },
    /**
     * Unload the project in the list.
     */
    unloadProject(projectId: string): void {
      logger.trace("Unload project:", projectId);

      const project = this.findProject(projectId) as Project;
      if (this.isProjectLoaded(project) && project != undefined) {
        const projectIdx: number = this.projectIds.indexOf(projectId);
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
