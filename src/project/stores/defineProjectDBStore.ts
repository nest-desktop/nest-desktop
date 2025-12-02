// defineProjectDBStore.ts

import { defineStore } from "pinia";
import { nextTick, reactive } from "vue";

import type { Class, TProjectDB } from "@/types";
import type { IActivityState } from "@/activity";
import type { IDoc, IRes } from "@/core";
import { BaseProject, type IProjectState } from "@/project";
import { download, loadJSON, logger as mainLogger, truncate } from "@/utils";
import { upgradeProject } from "@/upgrades";

import { BaseProjectDB } from "./projectDB";

interface IProjectDBStoreState<
  TProject extends BaseProject = BaseProject,
  TProjectState extends IProjectState = IProjectState,
> {
  initialized: boolean;
  projects: (TProject | TProjectState)[];
  searchTerm: string;
  tryImports: number;
}

export function defineProjectDBStore<
  TProject extends BaseProject = BaseProject,
  TProjectState extends IProjectState = IProjectState,
>(
  props: {
    Project: Class<TProject | BaseProject>;
    ProjectDB: Class<TProjectDB>;
    projectAssets?: string[];
    workspace: string;
  } = {
    Project: BaseProject,
    ProjectDB: BaseProjectDB,
    workspace: "base",
  },
) {
  const logger = mainLogger.getSubLogger({ name: props.workspace + " project DB store" });

  const db = new props.ProjectDB();

  return defineStore(props.workspace + "-project-db", () => {
    const state = reactive<IProjectDBStoreState<TProject | BaseProject, TProjectState | IBaseProjectState>>({
      initialized: false,
      projects: [] as (TProject | TProjectState)[],
      searchTerm: "",
      tryImports: 3,
    });

    /**
     * Add project to the list.
     * @param project project instance or state
     */
    const addToList = (project: TProject | TProjectState): void => {
      if (project instanceof props.Project) {
        state.projects.push(project as TProject);
      } else {
        state.projects.push(project);
      }
    };

    /**
     * Add this new project to the list.
     * @param projectState project state
     *
     * @remarks
     * It pushes new project to the first line of the list.
     */
    const addProject = (projectState?: TProjectState): TProject => {
      logger.trace("add project:", truncate(projectState?.id));

      // const projectStateUpgraded = upgradeProject(projectState);

      const project = new props.Project(projectState) as TProject;
      addToList(project);
      return project;
    };

    // /**
    //  * Create new project
    //  * @returns param instance
    //  */
    // const createNewProject = (): Project => {
    //   logger.trace("new project:");

    //   const project = Project();
    //   addToList(project);
    //   return project;
    // };

    /**
     * Delete project in database and then update the list.
     * @param project project instance or state
     */
    const deleteProject = (project: TProject | TProjectState): void => {
      logger.trace("delete project:", truncate(project.id));

      db.deleteProject(project).then(() => removeFromList(project));
    };

    /**
     * Delete projects and then update the list.
     * @param projects project instancea or states
     */
    const deleteProjects = (projects: (TProject | TProjectState)[]): void => {
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
    const duplicateProject = (project: TProject): TProject => {
      logger.trace("duplicate project", project.shortId);

      const projectDoc = (project.doc ? project.save() : project) as TProjectState;
      projectDoc.id = undefined;
      return addProject(projectDoc);
    };

    /**
     * Export project from the list.
     * @param project project instance or state
     * @param withActivities boolean if exported data includes activities
     */
    const exportProject = (project: TProject | TProjectState, withActivities: boolean = false): void => {
      logger.trace("export project:", truncate(project.id));
      if (!project) return;

      // @ts-expect-error Interface 'IProjectExportState' incorrectly extends interface 'TProjectState'.
      interface IProjectExportState extends TProjectState {
        activities?: IActivityState[];
      }

      const projectDoc = (project.doc ? project.save() : project) as IProjectExportState;
      if (withActivities) projectDoc.activities = project.activities.save();

      download(JSON.stringify(projectDoc), "project");
    };

    /**
     * Find project from the list.
     * @param projectId project ID
     * @returns project instance or state
     */
    const findProject = (projectId: string): TProject | TProjectState | undefined => {
      logger.trace("find project:", truncate(projectId));

      return state.projects.find((project: TProject | TProjectState) => project.id === projectId) as
        | TProject
        | TProjectState
        | undefined;
    };

    /**
     * Get filtered projects.
     * @returns list of project instance or state
     */
    const filteredProjects = (): (TProject | TProjectState)[] => {
      if (state.searchTerm === "" || state.searchTerm == null) {
        return state.projects as (TProject | TProjectState)[];
      } else {
        return state.projects.filter((project: TProject | TProjectState) => {
          if (project.name) return project.name.toLowerCase().indexOf(state.searchTerm.toLowerCase()) !== -1;
        }) as (TProject | TProjectState)[];
      }
    };

    /**
     * Get project from the list.
     * @param projectId project ID
     * @returns project instance
     */
    const getProject = (projectId: string = ""): TProject | undefined => {
      logger.trace("get project:", truncate(projectId));

      let project: TProject | TProjectState | undefined;

      if (projectId && hasProjectId(projectId)) {
        project = findProject(projectId);

        if (project && !isProjectLoaded(project)) {
          loadProject(project);
          project = findProject(projectId) as TProject;
        }

        return project as TProject;
      }
    };

    const getProjectIds = (): string[] =>
      state.projects.map((project: TProject | TProjectState) => project.id) as string[];

    const getProjectIdx = (project: TProject | TProjectState): number => state.projects.indexOf(project);

    /**
     * Check if the store has project.
     * @param projectId project ID
     * @returns boolean
     */
    const hasProjectId = (projectId: string): boolean => getProjectIds().includes(projectId);

    /**
     * Import projects the update list.
     * @param projectState project state
     */
    const importProjects = (projectStates: TProjectState[]): void => {
      logger.trace("import projects");

      projectStates.forEach((projectState: TProjectState) => {
        delete projectState._id;
        delete projectState._rev;
      });

      db.createProjects(projectStates).then(() => updateList());
    };

    /**
     * Import multiple projects from assets and add them to the database.
     */
    const importProjectsFromAssets = async (): Promise<(TProjectState | IRes)[]> => {
      logger.trace("import projects from assets");

      let promises: Promise<TProjectState | IRes>[] = [];
      if (props.projectAssets) {
        promises = props.projectAssets.map(async (file: string) => {
          return loadJSON(`assets/workspaces/${props.workspace}/projects/${file}.json`).then((data) => db.create(data));
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
     * @param project project instance or state
     * @returns boolean
     */
    const isProjectLoaded = (project: TProject | BaseProject | TProjectState): boolean => {
      return project instanceof BaseProject;
    };

    /**
     * Load a project in the list.
     * @param project project instance or state
     */
    const loadProject = (project: TProject | TProjectState): void => {
      logger.trace("load project:", truncate(project.id));
      if (isProjectLoaded(project)) return;

      const projectIds = getProjectIds();
      const projectIdx = projectIds.indexOf(project.id as string);

      if (projectIdx === -1) return;

      // Upgrade project state.
      const projectState = upgradeProject(project);

      const newProject = new props.Project(projectState);
      newProject.load(projectState);
      state.projects[projectIdx] = newProject;

      newProject.init();
      nextTick(() => newProject.code.engine.runOnce());
    };

    /**
     * Create new project.
     * @param projectState project state
     *
     * @remarks
     * It pushes new project to the first line of the list.
     */
    const newProject = (projectState?: TProjectState): TProject => {
      logger.trace("new project");

      const project = addProject(projectState);
      return project;
    };

    /**
     * Reload the project in the list.
     * @param projectId project instance or state
     */
    const reloadProject = (project: TProject | TProjectState): void => {
      logger.trace("reload project:", truncate(project.id));

      unloadProject(project);
      nextTick(() => loadProject(project));
    };

    /**
     * Remove project from the list.
     * @param projectId project instance or state
     */
    const removeFromList = (project: TProject | TProjectState): void => {
      logger.trace("remove project from the list:", truncate(project.id));

      const projectIds = getProjectIds();
      const projectIdx: number = projectIds.indexOf(project.id as string);

      if (projectIdx !== -1) {
        // Remove project from the project list.
        state.projects.splice(projectIdx, 1);
      }
    };

    /**
     * Save project from the list.
     * @param project project instance
     */
    const saveProject = (project: TProject): void => {
      logger.trace("save project:", project.shortId);

      db.importProject(project).then(() => {
        // project.doc.hash = project.hash;
        project.state.checkChanges();
        // removeFromList(project);
        const projectIds = getProjectIds();
        if (!projectIds.includes(project.id)) addToList(project);
      });
    };

    /**
     * Unload the project in the list.
     * @param project project instance or state
     */
    const unloadProject = (project: TProject | TProjectState): void => {
      logger.trace("unload project:", truncate(project.id));

      if (project && isProjectLoaded(project)) {
        const projectIdx: number = getProjectIds().indexOf(project.id as string);
        state.projects[projectIdx] = project.doc;
      }
    };

    /**
     * Update project list from the database.
     */
    const updateList = async (): Promise<void> => {
      logger.trace("update list");

      state.projects = [];
      return db.list("updatedAt", false).then((projectStates: IDoc[]) => {
        state.projects = projectStates as TProjectState[];
        state.initialized = true;
      });
    };

    /**
     * Validate project state
     * @param projectState project state
     */
    const validateProject = (projectState: TProjectState): boolean => {
      try {
        new props.Project(projectState);
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
      hasProjectId,
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
