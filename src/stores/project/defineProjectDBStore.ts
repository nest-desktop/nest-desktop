// defineProjectDBStore.ts

import { Store, defineStore } from "pinia";
import { nextTick, reactive } from "vue";

import { BaseProject } from "@/helpers/project/project";
import { BaseProjectDB } from "@/helpers/project/projectDB";
import { TProject, TProjectDB, TProjectProps } from "@/types";
import { download } from "@/utils/download";
import { loadJSON } from "@/utils/fetch";
import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";

interface IProjectDBStoreState {
  initialized: Boolean;
  numLoaded: number;
  projects: (TProject | TProjectProps)[];
  searchTerm: string;
  tryImports: number;
}

type Class<T> = new (...props: any) => T;

export type TProjectDBStore = Store<string, any>;

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
): TProjectDBStore {
  const logger = mainLogger.getSubLogger({
    minLevel: props.loggerMinLevel || 3,
    name: props.simulator + " project DB store",
  });

  const db = new props.ProjectDB();
  // @ts-ignore - Cannot find namespace 'props'.
  type Project = props.Project;

  return defineStore(props.simulator + "-project-db", () => {
    const state = reactive<IProjectDBStoreState>({
      initialized: false,
      numLoaded: 0,
      projects: [] as (Project | TProjectProps)[],
      searchTerm: "",
      tryImports: 3,
    });

    /**
     * Add project to the list.
     * @param project project object or props
     */
    const _addToList = (project: TProject | TProjectProps): void => {
      state.projects.push(project);
    };

    /**
     * Add this new project to the list.
     * @param projectProps project props
     *
     * @remarks
     * It pushes new project to the first line of the list.
     */
    const addProject = (projectProps?: TProjectProps): Project => {
      logger.trace("add project:", truncate(projectProps?.id));

      const project = newProject(projectProps);
      _addToList(project);
      return project;
    };

    /**
     * Delete project in database and then update the list.
     * @param project project object or props
     */
    const deleteProject = (project: Project | TProjectProps): void => {
      logger.trace("delete project:", truncate(project.id));

      db.deleteProject(project).then(() => removeFromList(project));
    };

    /**
     * Delete projects and then update the list.
     * @param projects project objects or props
     */
    const deleteProjects = (projects: (Project | TProjectProps)[]): void => {
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
    const duplicateProject = (project: Project): Project => {
      logger.trace("duplicate project", truncate(project.id));

      const projectDoc = project.doc ? project.toJSON() : project;
      projectDoc.id = undefined;
      return addProject(projectDoc);
    };

    /**
     * Export project from the list.
     * @param projectId project ID
     */
    const exportProject = (
      project: Project | TProjectProps,
      withActivities: boolean = false
    ): void => {
      logger.trace("export project:", truncate(project.id));

      if (project.doc && withActivities) {
        project.activities = project.activities.toJSON();
      }

      download(JSON.stringify(project), "project");
    };

    /**
     * Find project from the list.
     * @param projectId project ID
     * @returns project object or props
     */
    const findProject = (
      projectId: string
    ): Project | TProjectProps | undefined => {
      logger.trace("find project:", truncate(projectId));

      return state.projects.find(
        (project: Project | TProjectProps) => project.id === projectId
      );
    };

    /**
     * Get filtered projects.
     * @returns project list.
     */
    const filteredProjects = (): (Project | TProjectProps)[] => {
      if (state.searchTerm === "" || state.searchTerm == null) {
        return state.projects;
      } else {
        return state.projects.filter((project: Project | TProjectProps) => {
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
    const getProject = (projectId: string = ""): Project => {
      logger.trace("get project:", truncate(projectId));

      let project: Project | TProjectProps | undefined;

      if (!projectId || !hasProjectId(projectId)) {
        project = addProject();
        project.state.state.editMode = true;
      } else {
        project = findProject(projectId);

        if (project && !isProjectLoaded(project)) {
          loadProject(project);
          project = findProject(projectId) as Project;
        }
      }
      return project;
    };

    const getProjectIds = (): (string | undefined)[] =>
      state.projects.map((project: Project | TProjectProps) => project.id);

    const getProjectIdx = (project: TProject | TProjectProps): number =>
      state.projects.indexOf(project);

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
          return loadJSON(
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

    /**
     * Check if the project is loaded.
     * @param project project object or props
     * @returns boolean
     */
    const isProjectLoaded = (project: Project | TProjectProps): boolean => {
      return project instanceof BaseProject;
    };

    /**
     * Load a project in the list.
     * @param project project object or props
     * @returns
     */
    const loadProject = (
      project: Project | TProjectProps
    ): Project | undefined => {
      logger.trace("load project:", truncate(project.id));

      if (!project.docId) {
        const projectIds = getProjectIds();
        const projectIdx = projectIds.indexOf(project.id);

        if (projectIdx === -1) return;

        project = newProject(project);
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
    const newProject = (projectsProps?: TProjectProps): Project =>
      new props.Project(projectsProps) as Project;

    /**
     * Reload the project in the list.
     * @param projectId project object or props
     */
    const reloadProject = (project: Project | TProjectProps): void => {
      logger.trace("reload project:", truncate(project.id));

      unloadProject(project);
      nextTick(() => loadProject(project));
    };

    /**
     * Remove project from the list.
     * @param projectId project object or props
     */
    const removeFromList = (project: Project | TProjectProps): void => {
      logger.trace("remove project from the list:", truncate(project.id));

      const projectIds = getProjectIds();
      const projectIdx: number = projectIds.indexOf(project.id);

      if (projectIdx !== -1) {
        // Remove project from the project list.
        state.projects.splice(projectIdx, 1);
      }
    };

    /**
     * Save project from the list.
     * @param project project object
     */
    const saveProject = (project: Project): void => {
      logger.trace("save project:", truncate(project.id));

      db.importProject(project).then(() => {
        project.doc.hash = project.hash;
        project.state.checkChanges();
        // removeFromList(project);
        // _addToList(project);
      });
    };

    /**
     * Unload the project in the list.
     * @param project project object or props
     */
    const unloadProject = (project: Project | TProjectProps): void => {
      logger.trace("unload project:", truncate(project.id));

      if (isProjectLoaded(project) && project != undefined) {
        const projectIdx: number = getProjectIds().indexOf(project.id);
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
      return db
        .list("updatedAt", false)
        .then((projectsProps: TProjectProps[]) => {
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
        new props.Project(projectProps);
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
      getProjectIdx,
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
