// projectDB.ts

import { TProject, TProjectProps } from "@/types";
import { truncate } from "@/utils/truncate";

import { DatabaseService, IDoc, IRes } from "../common/database";
import { BaseProject } from "./project";

export class BaseProjectDB extends DatabaseService {
  constructor(name: string = "PROJECT_STORE") {
    super(name, undefined, { minLevel: 3 });
  }

  /**
   * Create a project in the database.
   */
  async createProject(project: TProject): Promise<void> {
    this.logger.trace("create project:", truncate(project.id));

    const data = project.toJSON();
    return this.create(data as IDoc).then((res: IRes) => {
      if (res.ok) {
        project.doc._id = res.id;
        project.doc._rev = res.rev;
      }
    });
  }

  /**
   * Create multiple projects in the database.
   */
  async createProjects(projectsProps: TProjectProps[]): Promise<boolean> {
    this.logger.trace("create projects");

    const projects: Promise<TProjectProps>[] = projectsProps.map(
      (projectProps: TProjectProps) =>
        new Promise<TProjectProps>((resolve) => {
          this.create(projectProps as IDoc).then(() => {
            resolve(projectProps);
          });
        })
    );
    return Promise.all(projects)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Delete a project in the database.
   */
  deleteProject(project: TProject | TProjectProps): Promise<IRes> {
    this.logger.trace("delete project:", truncate(project.id as string));

    const projectId: string = (
      project instanceof BaseProject ? project.docId : project._id
    ) as string;
    return this.delete(projectId);
  }

  /**
   * Delete multiple projects.
   */
  async deleteProjects(
    projects: (TProject | TProjectProps)[]
  ): Promise<IDoc[]> {
    this.logger.trace("delete projects");

    const projectDocIds: string[] = projects.map(
      (project: TProject | TProjectProps) =>
        (project instanceof BaseProject ? project.docId : project._id) as string
    );
    return this.deleteBulk(projectDocIds);
  }

  /**
   * Import the project in the database.
   */
  importProject(project: TProject): void {
    this.logger.trace("import project:", truncate(project.id as string));

    project.docId ? this.updateProject(project) : this.createProject(project);
  }

  /**
   * Update a project in the database.
   */
  updateProject(project: TProject): void {
    if (!project.docId) return;
    this.logger.trace("update project:", truncate(project.id));

    const data: TProjectProps = project.toJSON();
    this.update(project.docId, data as IDoc).then((res: IRes) => {
      if (res.ok) {
        project.doc._id = res.id;
        project.doc._rev = res.rev;
      }
    });
  }
}
