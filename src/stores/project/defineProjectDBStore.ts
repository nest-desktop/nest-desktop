// defineProjectDBStore.ts

import { defineStore } from "pinia";
import { nextTick, reactive } from "vue";

import { BaseProject, IBaseProjectProps } from "@/helpers/project/project";
import { BaseProjectDB } from "@/helpers/project/projectDB";
import { Class, TProjectDB } from "@/types";
import { IActivityProps } from "@/helpers/activity/activity";
import { IDoc, IRes } from "@/helpers/common/database";
import { download } from "@/utils/download";
import { loadJSON } from "@/utils/fetch";
import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";

interface IProjectDBStoreState<
  TProject extends BaseProject = BaseProject,
  TProjectProps extends IBaseProjectProps = IBaseProjectProps,
> {
  initialized: boolean;
  projects: (TProject | TProjectProps)[];
  searchTerm: string;
  tryImports: number;
}

export function defineProjectDBStore<
  TProject extends BaseProject = BaseProject,
  TProjectProps extends IBaseProjectProps = IBaseProjectProps,
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
    const state = reactive<IProjectDBStoreState<TProject | BaseProject, TProjectProps | IBaseProjectProps>>({
      initialized: false,
      projects: [] as (TProject | TProjectProps)[],
      searchTerm: "",
      tryImports: 3,
    });

    /**
     * Add project to the list.
     * @param project project object or props
     */
    const addToList = (project: TProject | TProjectProps): void => {
      if (project instanceof props.Project) {
        state.projects.push(project as TProject);
      } else {
        state.projects.push(project);
      }
    };

    /**
     * Add this new project to the list.
     * @param projectProps project props
     *
     * @remarks
     * It pushes new project to the first line of the list.
     */
    const addProject = (projectProps?: TProjectProps): TProject => {
      logger.trace("add project:", truncate(projectProps?.id));

      const project = new props.Project(projectProps) as TProject;
      addToList(project);
      return project;
    };

    // /**
    //  * Create new project
    //  * @returns param object
    //  */
    // const createNewProject = (): Project => {
    //   logger.trace("new project:");

    //   const project = Project();
    //   addToList(project);
    //   return project;
    // };

    /**
     * Delete project in database and then update the list.
     * @param project project object or props
     */
    const deleteProject = (project: TProject | TProjectProps): void => {
      logger.trace("delete project:", truncate(project.id));

      db.deleteProject(project).then(() => removeFromList(project));
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
    const duplicateProject = (project: TProject): TProject => {
      logger.trace("duplicate project", project.shortId);

      const projectDoc = (project.doc ? project.toJSON() : project) as TProjectProps;
      projectDoc.id = undefined;
      return addProject(projectDoc);
    };

    /**
     * Export project from the list.
     * @param project project object or props
     * @param withActivities boolean if exported data includes activities
     */
    const exportProject = (project: TProject | TProjectProps, withActivities: boolean = false): void => {
      logger.trace("export project:", truncate(project.id));
      if (!project) return;

      // @ts-expect-error Interface 'IProjectExportProps' incorrectly extends interface 'TProjectProps'.
      interface IProjectExportProps extends TProjectProps {
        activities?: IActivityProps[];
      }

      const projectDoc = (project.doc ? project.toJSON() : project) as IProjectExportProps;
      if (withActivities) projectDoc.activities = project.activities.toJSON();

      download(JSON.stringify(projectDoc), "project");
    };

    /**
     * Find project from the list.
     * @param projectId project ID
     * @returns project object or props
     */
    const findProject = (projectId: string): TProject | TProjectProps | undefined => {
      logger.trace("find project:", truncate(projectId));

      return state.projects.find((project: TProject | TProjectProps) => project.id === projectId) as
        | TProject
        | TProjectProps
        | undefined;
    };

    /**
     * Get filtered projects.
     * @returns list of project object or props
     */
    const filteredProjects = (): (TProject | TProjectProps)[] => {
      if (state.searchTerm === "" || state.searchTerm == null) {
        return state.projects as (TProject | TProjectProps)[];
      } else {
        return state.projects.filter((project: TProject | TProjectProps) => {
          if (project.name) return project.name.toLowerCase().indexOf(state.searchTerm.toLowerCase()) !== -1;
        }) as (TProject | TProjectProps)[];
      }
    };

    /**
     * Get project from the list.
     * @param projectId project ID
     * @returns project object
     */
    const getProject = (projectId: string = ""): TProject | undefined => {
      logger.trace("get project:", truncate(projectId));

      let project: TProject | TProjectProps | undefined;

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
      state.projects.map((project: TProject | TProjectProps) => project.id) as string[];

    const getProjectIdx = (project: TProject | TProjectProps): number => state.projects.indexOf(project);

    /**
     * Check if the store has project.
     * @param projectId project ID
     * @returns boolean
     */
    const hasProjectId = (projectId: string): boolean => getProjectIds().includes(projectId);

    /**
     * Import projects the update list.
     * @param projectProps project props
     */
    const importProjects = (projectsProps: TProjectProps[]): void => {
      logger.trace("import projects");

      projectsProps.forEach((projectProps: TProjectProps) => {
        delete projectProps._id;
        delete projectProps._rev;
      });

      db.createProjects(projectsProps).then(() => updateList());
    };

    /**
     * Import multiple projects from assets and add them to the database.
     */
    const importProjectsFromAssets = async (): Promise<(TProjectProps | IRes)[]> => {
      logger.trace("import projects from assets");

      let promises: Promise<TProjectProps | IRes>[] = [];
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
     * @param project project object or props
     * @returns boolean
     */
    const isProjectLoaded = (project: TProject | BaseProject | TProjectProps): boolean => {
      return project instanceof BaseProject;
    };

    /**
     * Load a project in the list.
     * @param project project object or props
     * @returns project object
     */
    const loadProject = (project: TProject | TProjectProps): TProject | undefined => {
      logger.trace("load project:", truncate(project.id));
      if (isProjectLoaded(project)) return project as TProject;

      const projectIds = getProjectIds();
      const projectIdx = projectIds.indexOf(project.id as string);

      if (projectIdx === -1) return;

      project = new props.Project(project) as TProject;
      state.projects[projectIdx] = project;

      return project;
    };

    /**
     * Create new project.
     * @param projectProps project props
     *
     * @remarks
     * It pushes new project to the first line of the list.
     */
    const newProject = (projectProps?: TProjectProps): TProject => {
      logger.trace("new project");

      const project = addProject(projectProps);
      return project;
    };

    /**
     * Reload the project in the list.
     * @param projectId project object or props
     */
    const reloadProject = (project: TProject | TProjectProps): void => {
      logger.trace("reload project:", truncate(project.id));

      unloadProject(project);
      nextTick(() => loadProject(project));
    };

    /**
     * Remove project from the list.
     * @param projectId project object or props
     */
    const removeFromList = (project: TProject | TProjectProps): void => {
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
     * @param project project object
     */
    const saveProject = (project: TProject): void => {
      logger.trace("save project:", project.shortId);

      db.importProject(project).then(() => {
        project.doc.hash = project.hash;
        project.state.checkChanges();
        // removeFromList(project);
        const projectIds = getProjectIds();
        if (!projectIds.includes(project.id)) addToList(project);
      });
    };

    /**
     * Unload the project in the list.
     * @param project project object or props
     */
    const unloadProject = (project: TProject | TProjectProps): void => {
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
      return db.list("updatedAt", false).then((projectsProps: IDoc[]) => {
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
