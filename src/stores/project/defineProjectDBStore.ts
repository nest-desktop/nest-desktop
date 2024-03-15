// defineProjectDBStore.ts

import { defineStore } from "pinia";

import { BaseProject, IProjectProps } from "@/helpers/project/project";
import { BaseProjectDB } from "@/helpers/project/projectDB";
import { TProject } from "@/types/projectTypes";
import { TProjectDB } from "@/types/projectDBTypes";
import { download } from "@/helpers/common/download";
import { getRuntimeConfig } from "@/utils/fetch";
import { logger as mainLogger } from "@/helpers/common/logger";
import { truncate } from "@/utils/truncate";

type Class<T> = new (...args: any) => T;

export function defineProjectDBStore(
  args: {
    Project: Class<TProject>;
    ProjectDB: Class<TProjectDB>;
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
    minLevel: args.loggerMinLevel || 3,
    name: args.simulator + " project DB store",
  });

  const db = new args.ProjectDB();

  return defineStore(args.simulator + "-project-db", {
    state: () => ({
      tryImports: 3,
      initialized: true,
      numLoaded: 0,
      projects: [] as (TProject | any)[], // TODO: any should be removed.
      searchTerm: "",
    }),
    getters: {
      db: () => db,
      filteredProjects(): TProject[] {
        if (this.searchTerm === "" || this.searchTerm == null) {
          return this.projects;
        } else {
          return this.projects.filter(
            (project: TProject) =>
              project.name
                .toLowerCase()
                .indexOf(this.searchTerm.toLowerCase()) > -1
          );
        }
      },
      projectIds(): (string | undefined)[] {
        return this.projects.map(
          (projects: TProject | IProjectProps) => projects.id
        );
      },
    },
    actions: {
      /**
       * Add this new project to the list.
       *
       * @remarks
       * It pushes new project to the first line of the list.
       */
      addProject(projectProps?: IProjectProps): TProject {
        logger.trace("add project:", truncate(projectProps?.id || ""));
        const project = this.newProject(projectProps);
        this.projects.unshift(project);
        return project;
      },
      /**
       * Delete project in database and then update the list.
       */
      deleteProject(projects: TProject | IProjectProps | any): void {
        // TODO: any should be removed.
        logger.trace("delete project:", truncate(projects.id));
        db.deleteProject(projects).then(() => {
          this.removeFromList(projects.id);
        });
      },
      /**
       * Delete projects and then update the list.
       */
      deleteProjects(projects: (TProject | IProjectProps)[]): void {
        if (projects.length === 0) return;
        logger.trace("delete projects");
        db.deleteProjects(projects).then(() => this.updateList());
      },
      /**
       * Export project from the list.
       */
      exportProject(projectId: string, withActivities: boolean = false): void {
        logger.trace("export project:", truncate(projectId));
        const project = this.findProject(projectId) as TProject;
        const projectData: any = project.toJSON();
        if (withActivities) {
          projectData.activities = project.activities.toJSON();
        }
        download(JSON.stringify(projectData), "project");
      },
      /**
       * Find project from the list.
       */
      findProject(projectId: string): TProject | IProjectProps | undefined {
        logger.trace("find project:", truncate(projectId));
        return this.projects.find(
          (project: TProject | IProjectProps | any) => project.id === projectId
        );
      },
      /**
       * Get project from the list.
       */
      getProject(projectId: string = ""): TProject {
        logger.trace("get project:", truncate(projectId));
        let project;
        if (!projectId || !this.hasProjectId(projectId)) {
          project = this.addProject();
        } else {
          project = this.findProject(projectId);

          if (!this.isProjectLoaded(project)) {
            this.loadProject(projectId);
            project = this.findProject(projectId) as TProject;
          }
        }
        return project as TProject;
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
            return getRuntimeConfig(
              `assets/simulators/${args.simulator}/projects/${file}.json`
            ).then((data) => db.create(data));
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
      isProjectLoaded(project: TProject | IProjectProps | any) {
        return project.doc != undefined;
      },
      /**
       * Load a project in the list.
       */
      loadProject(projectId: string): TProject | undefined {
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
          this.projects[projectIdx] = project;
          this.numLoaded += 1;
        }

        // @ts-ignore
        return project;
      },
      newProject(projsProps?: IProjectProps): TProject {
        return new args.Project(projsProps);
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
          .map((project: TProject | IProjectProps) => project.id)
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

        const project = this.findProject(projectId) as TProject;
        return db.importProject(project);
      },
      /**
       * Unload the project in the list.
       */
      unloadProject(projectId: string): void {
        logger.trace("Unload project:", projectId);

        const project = this.findProject(projectId) as TProject;
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
