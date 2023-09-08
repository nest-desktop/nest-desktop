// nestProjectDBStore.ts

import { defineStore } from "pinia";

import { download } from "@/utils/download";
import { logger as mainLogger } from "@/helpers/logger";
import { truncate } from "@/utils/truncate";

import {
  NESTProject,
  NESTProjectProps,
} from "@nest/helpers/project/nestProject";
import { NESTProjectDB } from "./nestProjectDB";

const logger = mainLogger.getSubLogger({
  name: "project DB store",
});

const projectAssets = [
  "spatial-neurons",
  "spatial-spike-activity",
  "spike-activity",
  "spike-input",
  "current-input",
];

const db = new NESTProjectDB();

export const useNESTProjectDBStore = defineStore("nest-project-db", {
  state: () => ({
    numLoaded: 0,
    projects: [] as (NESTProject | NESTProjectProps | any)[], // TODO: any should be removed.
    searchTerm: "",
    ready: false,
  }),
  getters: {
    filteredProjects(): NESTProject[] {
      if (this.searchTerm === "" || this.searchTerm == null) {
        return this.projects;
      } else {
        return this.projects.filter(
          (project: NESTProject) =>
            project.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >
            -1
        );
      }
    },
    projectIds(): (string | undefined)[] {
      return this.projects.map((p: NESTProject | NESTProjectProps) => p.id);
    },
  },
  actions: {
    /**
     * add project to the list.
     *
     * @remarks
     * It pushes new project to the first line of the list.
     */
    addProject(data?: NESTProjectProps): NESTProject {
      logger.trace("add project", truncate(data?.id));
      const project = new NESTProject(data);
      this.projects.unshift(project);
      return project;
    },
    /**
     * Export project from the list.
     */
    exportProject(projectId: string, withActivities: boolean = false): void {
      logger.trace("export project:", truncate(projectId));
      const project: NESTProject = this.projects.find(
        (p: NESTProject) => p.id === projectId
      );

      const projectData: any = project.toJSON();
      if (withActivities) {
        projectData.activities = project.activities.toJSON();
      }
      download(JSON.stringify(projectData), "project");
    },
    /**
     * Find project from the list.
     */
    findProject(projectId: string): NESTProject | NESTProjectProps | undefined {
      logger.trace("find project:", truncate(projectId));

      return this.projects.find(
        (project: NESTProject | NESTProjectProps | any) =>
          project.id === projectId
      );
    },

    /**
     * Get project from the list.
     */
    getProject(projectId?: string): NESTProject {
      logger.trace("get project:", truncate(projectId));

      let project;
      if (!projectId || !this.hasProjectId(projectId)) {
        project = this.addProject();
      } else {
        project = this.findProject(projectId);

        if (!this.isProjectLoaded(project)) {
          this.loadProject(projectId);
          project = this.findProject(projectId) as NESTProject;
        }
      }

      return project as NESTProject;
    },
    hasProjectId(projectId: string): boolean {
      return this.projectIds.includes(projectId);
    },
    /**
     * Import the project to the database.
     *
     * @remarks
     * It updates project list.
     */
    async importProject(project: NESTProjectProps): Promise<any> {
      logger.trace("import project:", truncate(project.id));
      db.create(project).then(() => this.updateList());
    },
    /**
     * Import projects to the database.
     *
     * @remarks
     * It updates project list.
     */
    async importProjects(data: NESTProjectProps[]): Promise<any> {
      logger.trace("import projects");
      let promise: Promise<any> = Promise.resolve();
      data.forEach((project: NESTProjectProps) => {
        promise = promise.then(() => db.create(project));
      });
      return promise.then(() => this.updateList());
    },
    /**
     * Import multiple projects from assets and add them to the database.
     */
    async importProjectsFromAssets(): Promise<any> {
      logger.trace("import projects from assets");
      let promise = Promise.resolve();
      projectAssets.forEach(async (file: string) => {
        const response = await fetch("assets/nest/projects/" + file + ".json");
        const data: NESTProjectProps = await response.json();
        promise = promise.then(() => db.create(data));
      });
      return promise.then(() => this.updateList());
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
    /**
     * Load a project in the list.
     * @param projectId string
     */
    loadProject(projectId: string): void {
      logger.trace("load project:", truncate(projectId));
      // this.project.insite.cancelAllIntervals();

      const projectIdx = this.projectIds.indexOf(projectId);
      if (projectIdx === -1) return;

      let project = this.findProject(projectId);
      if (project == undefined || this.isProjectLoaded(project)) return;

      project = new NESTProject(project as NESTProjectProps);
      project.init();

      this.projects[projectIdx] = project;
      this.numLoaded += 1;
    },
    isProjectLoaded(project: NESTProject | NESTProjectProps | undefined) {
      return project instanceof NESTProject;
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
        .map((p: NESTProject) => p.id)
        .indexOf(projectId);

      if (idx !== -1) {
        // Remove project from the project list.
        this.projects.splice(idx, 1);
      }
    },
    /**
     * Delete project in database and then update the list.
     */
    removeProject(project: NESTProject | NESTProjectProps): void {
      if (!project) return;
      logger.trace("delete project:", truncate(project.id));

      // @ts-ignore
      const docId = project.docId || (project._id as string);
      const projectId = project.id as string;
      console.log(project, docId, projectId);
      db.delete(docId).then(() => {
        this.removeFromList(projectId);
      });
    },

    /**
     * Delete projects and then update the list.
     * @param projects List of project objects.
     */
    removeProjects(projects: (NESTProject | NESTProjectProps)[]): void {
      if (projects.length === 0) return;
      logger.trace("delete projects");
      db.deleteProjects(projects).then(() => this.updateList());
    },
    /*
     * Save project.
     */
    async saveProject(project: NESTProject): Promise<any> {
      if (!project) return;
      logger.trace("save project:", truncate(project.id));
      project.docId ? db.updateProject(project) : db.createProject(project);
    },
    /**
     * Unload the project in the list.
     * @param project string
     */
    unloadProject(projectId: string): void {
      logger.trace("unload project:", truncate(projectId));
      const projectIdx: number = this.projectIds.indexOf(projectId);

      if (projectIdx === -1) return;

      const project = this.projects.find(
        (project: any) => project.id === projectId
      );
      this.projects[projectIdx] = project.doc;
      this.numLoaded -= 1;
    },
    /**
     * Update project list from the database.
     */
    updateList(): Promise<any> {
      logger.trace("update project list");
      this.projects = [];
      return db.list("createdAt", true).then((projects: NESTProjectProps[]) => {
        this.projects = projects;
        this.ready = true;
      });
    },
  },
});
