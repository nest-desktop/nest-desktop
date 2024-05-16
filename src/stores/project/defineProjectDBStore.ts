// defineProjectDBStore.ts

import { defineStore } from "pinia";
import { reactive } from "vue";

import { download } from "@/helpers/common/download";
import { logger as mainLogger } from "@/helpers/common/logger";
import { BaseProject } from "@/helpers/project/project";
import { BaseProjectDB } from "@/helpers/project/projectDB";
import { TProject, TProjectDB, TProjectProps } from "@/types";
import { getRuntimeConfig } from "@/utils/fetch";
import { truncate } from "@/utils/truncate";

type Class<T> = new (...props: any) => T;

export function defineProjectDBStore(
  props: {
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
    minLevel: props.loggerMinLevel || 3,
    name: props.simulator + " project DB store",
  });

  const db = new props.ProjectDB();
  const Project = props.Project;

  // @ts-ignore - Cannot find namespace 'props'.
  type TProject = props.Project;

  return defineStore(props.simulator + "-project-db", () => {
    const state = reactive({
      tryImports: 3,
      initialized: false,
      numLoaded: 0,
      projects: [] as (TProject | TProjectProps)[],
      searchTerm: "",
    });

    /**
     * Add this new project to the list.
     * @param projectProps project props
     *
     * @remarks
     * It pushes new project to the first line of the list.
     */
    const addProject = (projectProps?: TProjectProps): TProject => {
      logger.trace("add project:", truncate(projectProps?.id || ""));

      const project = newProject(projectProps);
      state.projects.unshift(project);
      return project;
    };

    /**
     * Delete project in database and then update the list.
     * @param project project object
     */
    const deleteProject = (project: TProject): void => {
      logger.trace("delete project:", truncate(project.id));

      db.deleteProject(project).then(() => {
        removeFromList(project.id);
      });
    };

    /**
     * Delete projects and then update the list.
     * @param projects project objects or props
     */
    const deleteProjects = (projects: (TProject | TProjectProps)[]): void => {
      if (projects.length === 0) return;
      logger.trace("delete projects");

      db.deleteProjects(projects).then(() => updateList());
    };

    /**
     * Clone this current project and add it to the list.
     *
     * @remarks
     * It pushes new project to the first line of the list.
     */
    const duplicateProject = (project: TProject): void => {
      logger.trace("duplicate project");

      addProject(project.toJSON());
    };

    /**
     * Export project from the list.
     * @param projectId project ID
     */
    const exportProject = (
      projectId: string,
      withActivities: boolean = false
    ): void => {
      logger.trace("export project:", truncate(projectId));

      const project = findProject(projectId) as TProject;
      const projectData: TProjectProps = project.toJSON();
      if (withActivities) {
        projectData.activities = project.activities.toJSON();
      }
      download(JSON.stringify(projectData), "project");
    };

    /**
     * Find project from the list.
     * @param projectId project ID
     */
    const findProject = (
      projectId: string
    ): TProject | TProjectProps | undefined => {
      logger.trace("find project:", truncate(projectId));

      return state.projects.find(
        (project: TProject | TProjectProps) => project.id === projectId
      );
    };

    /**
     * Get filtered projects.
     * @returns project list.
     */
    const filteredProjects = (): (TProject | TProjectProps)[] => {
      if (state.searchTerm === "" || state.searchTerm == null) {
        return state.projects;
      } else {
        return state.projects.filter((project: TProject | TProjectProps) => {
          if (project.name) {
            return (
              project.name
                .toLowerCase()
                .indexOf(state.searchTerm.toLowerCase()) !== -1
            );
          }
        });
      }
    };

    /**
     * Get project from the list.
     * @param projectId project ID
     * @returns project object
     */
    const getProject = (projectId: string = ""): TProject => {
      logger.trace("get project:", truncate(projectId));

      let project: TProject | TProjectProps | undefined;

      if (!projectId || !hasProjectId(projectId)) {
        project = addProject();
      } else {
        project = findProject(projectId);

        if (project && !isProjectLoaded(project)) {
          loadProject(projectId);
          project = findProject(projectId) as TProject;
        }
      }
      return project;
    };

    const getProjectIds = (): (string | undefined)[] =>
      state.projects.map((project: TProject | TProjectProps) => project.id);

    /**
     * Check if the store has project.
     * @param projectId project ID
     * @returns boolean
     */
    const hasProjectId = (projectId: string): boolean =>
      getProjectIds().includes(projectId);

    /**
     * Import projects the update list.
     * @param projectProps project props
     */
    const importProjects = (projectsProps: TProjectProps[]): void => {
      logger.trace("import projects");

      db.createProjects(projectsProps).then(() => updateList());
    };

    /**
     * Import multiple projects from assets and add them to the database.
     */
    const importProjectsFromAssets = async (): Promise<TProjectProps[]> => {
      logger.trace("import projects from assets");

      let promises: Promise<TProjectProps>[] = [];
      if (props.projectAssets) {
        promises = props.projectAssets.map(async (file: string) => {
          return getRuntimeConfig(
            `assets/simulators/${props.simulator}/projects/${file}.json`
          ).then((data) => db.create(data));
        });
      }
      return Promise.all(promises);
    };

    /**
     * Initialize projects DB.
     */
    const init = (): void => {
      logger.trace("init project db store");

      db.count().then(async (count: number) => {
        logger.debug("projects in DB:", count);
        if (count === 0 && state.tryImports > 0) {
          state.tryImports -= 1;
          importProjectsFromAssets().then(() => init());
        } else {
          return updateList();
        }
      });
    };

    const isProjectLoaded = (project: TProject | TProjectProps): boolean => {
      return project instanceof BaseProject;
    };

    /**
     * Load a project in the list.
     * @param projectId project ID
     * @returns
     */
    const loadProject = (projectId: string): TProject | undefined => {
      logger.trace("load project:", truncate(projectId));

      let project = findProject(projectId);
      if (project == undefined) return;

      if (!project.docId) {
        const projectIds = state.projects.map(
          (project: TProject | TProjectProps) => project.id
        );
        const projectIdx = projectIds.indexOf(projectId);

        if (projectIdx === -1) return;

        project = new Project(project);
        state.projects[projectIdx] = project;
        state.numLoaded += 1;
      }

      return project;
    };

    /**
     * Create new project.
     * @param projectsProps project props
     * @returns project object
     */
    const newProject = (projectsProps?: TProjectProps): TProject =>
      new Project(projectsProps);

    /**
     * Reload the project in the list.
     * @param projectId project ID
     */
    const reloadProject = (projectId: string): void => {
      logger.trace("reload project:", truncate(projectId));

      unloadProject(projectId);
      loadProject(projectId);
    };

    /**
     * Remove project from the list.
     * @param projectId project ID
     */
    const removeFromList = (projectId: string): void => {
      logger.trace("remove project from the list:", truncate(projectId));

      const idx: number = state.projects
        .map((project: TProject | TProjectProps) => project.id)
        .indexOf(projectId);

      if (idx !== -1) {
        // Remove project from the project list.
        state.projects.splice(idx, 1);
      }
    };

    /**
     * Save project from the list.
     * @param projectId project ID
     */
    const saveProject = (projectId: string): void => {
      logger.trace("save project:", truncate(projectId));

      const project = findProject(projectId) as TProject;
      db.importProject(project);
    };

    /**
     * Unload the project in the list.
     * @param projectId project ID
     */
    const unloadProject = (projectId: string): void => {
      logger.trace("Unload project:", projectId);

      const project = findProject(projectId) as TProject;
      if (isProjectLoaded(project) && project != undefined) {
        const projectIdx: number = getProjectIds().indexOf(projectId);
        state.projects[projectIdx] = project.doc;
        state.numLoaded -= 1;
      }
    };

    /**
     * Update project list from the database.
     */
    const updateList = async (): Promise<void> => {
      logger.trace("update list");

      state.projects = [];
      return db.list("", true).then((projectsProps: TProjectProps[]) => {
        state.projects = projectsProps as TProjectProps[];
        state.initialized = true;
      });
    };

    /**
     * Validate project props.
     * @param projectProps project props
     */
    const validateProject = (projectProps: TProjectProps): boolean => {
      try {
        new Project(projectProps);
        return true;
      } catch (e) {
        logger.error(e);
        return false;
      }
    };

    return {
      addProject,
      deleteProject,
      deleteProjects,
      duplicateProject,
      exportProject,
      filteredProjects,
      findProject,
      getProject,
      getProjectIds,
      importProjects,
      importProjectsFromAssets,
      init,
      isProjectLoaded,
      loadProject,
      newProject,
      reloadProject,
      removeFromList,
      saveProject,
      state,
      unloadProject,
      updateList,
      validateProject,
    };
  });
}
