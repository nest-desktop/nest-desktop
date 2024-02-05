// defineProjectDBStore.ts

import { defineStore } from "pinia";

import { BaseProject, ProjectProps } from "@/helpers/project/project";
import { BaseProjectDB } from "@/helpers/project/projectDB";
import { Project } from "@/types/projectTypes";
import { ProjectDB } from "@/types/projectDBTypes";
import { download } from "@/helpers/common/download";
import { getRuntimeConfig } from "@/utils/fetch";
import { logger as mainLogger } from "@/helpers/common/logger";
import { truncate } from "@/utils/truncate";

type Class<T> = new (...args: any) => T;

export function defineProjectDBStore(
  args: {
    Project: Class<Project>;
    ProjectDB: Class<ProjectDB>;
    loggerMinLevel?: number;
    projectAssets?: string[];
    simulator: string;
  } = {
    Project: BaseProject,
    ProjectDB: BaseProjectDB,
    simulator: "base",
  }
) {
  const logger = mainLogger.getSubLogger({
    name: args.simulator + " project DB store",
    minLevel: args.loggerMinLevel || 3,
  });

  const db = new args.ProjectDB();

  return defineStore(args.simulator + "-project-db", {
    state: () => ({
      tryImports: 3,
      initialized: true,
      numLoaded: 0,
      projects: [] as (Project | any)[], // TODO: any should be removed.
      searchTerm: "",
    }),
    getters: {
      db: () => db,
      filteredProjects(): Project[] {
        if (this.searchTerm === "" || this.searchTerm == null) {
          return this.projects;
        } else {
          return this.projects.filter(
            (project: Project) =>
              project.name
                .toLowerCase()
                .indexOf(this.searchTerm.toLowerCase()) > -1
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
        let promises = [];
        if (args.projectAssets) {
          promises = args.projectAssets.map(async (file: string) => {
            const data = getRuntimeConfig(
              `assets/simulators/${args.simulator}/projects/${file}.json`
            );
            return db.create(data);
          }) as any[];
        }
        return Promise.all(promises);
      },
      /**
       * Initialize projects DB.
       */
      async init(): Promise<void> {
        logger.trace("init project db store");
        return db.count().then(async (count: number) => {
          logger.debug("projects in DB:", count);
          if (count === 0 && this.tryImports > 0) {
            this.tryImports -= 1;
            this.importProjectsFromAssets().then(() => this.init());
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

        // @ts-ignore
        if (!project.docId) {
          const projectIds = this.projects.map((project: any) => project.id);
          const projectIdx = projectIds.indexOf(projectId);

          if (projectIdx === -1) {
            return;
          }

          project = new args.Project(project);
          project.initStore();
          project.init();

          this.projects[projectIdx] = project;
          this.numLoaded += 1;
        }

        // @ts-ignore
        return project;
      },
      newProject(data?: ProjectProps): Project {
        return new args.Project(data);
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
      async saveProject(projectId: string): Promise<void> {
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
      async updateList(): Promise<void> {
        logger.trace("update list");

        this.projects = [];
        return db.list("", true).then((projects: any[]) => {
          this.projects = projects;
          this.initialized = true;
        });
      },
    },
  });
}
