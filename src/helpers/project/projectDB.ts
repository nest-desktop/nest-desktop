// projectDB.ts

import type { TProject, TProjectState } from "@/types";
import { truncate } from "@/utils/truncate";

import { DatabaseService, type IDoc, type IRes } from "../common";
import { BaseProject } from "./project";

export class BaseProjectDB extends DatabaseService {
  constructor(name: string = "PROJECT_STORE") {
    super(name, undefined);
  }

  /**
   * Create a project in the database.
   * @param project project instance or state
   */
  async createProject(project: TProject | TProjectState): Promise<void> {
    this.logger.trace("create project:", truncate(project.id));

    const data = project.doc ? project.save() : project;
    return this.create(data as IDoc).then((res: IRes) => {
      if (res.ok) {
        project.doc._id = res.id;
        project.doc._rev = res.rev;
      }
    });
  }

  /**
   * Create multiple projects in the database.
   * @param project project states
   */
  async createProjects(projectStates: TProjectState[]): Promise<boolean> {
    this.logger.trace("create projects");

    const projects: Promise<TProjectState>[] = projectStates.map(
      (projectState: TProjectState) =>
        new Promise<TProjectState>((resolve) => {
          this.create(projectState as IDoc).then(() => resolve(projectState));
        }),
    );
    return Promise.all(projects)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Delete a project in the database.
   * @param project project instance or state
   */
  async deleteProject(project: TProject | TProjectState): Promise<IRes> {
    this.logger.trace("delete project:", truncate(project.id as string));

    const projectId: string = (project instanceof BaseProject ? project.docId : project._id) as string;
    return this.delete(projectId);
  }

  /**
   * Delete multiple projects.
   */
  async deleteProjects(projects: (TProject | TProjectState)[]): Promise<IDoc[]> {
    this.logger.trace("delete projects");

    const projectDocIds: string[] = projects.map(
      (project: TProject | TProjectState) => (project instanceof BaseProject ? project.docId : project._id) as string,
    );
    return this.deleteBulk(projectDocIds);
  }

  /**
   * Import the project in the database.
   */
  async importProject(project: TProject): Promise<void> {
    this.logger.trace("import project:", project.shortId);

    return project.docId ? this.updateProject(project) : this.createProject(project);
  }

  /**
   * Update a project in the database.
   */
  async updateProject(project: TProject | TProjectState): Promise<void> {
    this.logger.trace("update project:", truncate(project.id));
    const docId = (project instanceof BaseProject ? project.docId : project._id) as string;

    const data: TProjectState = project instanceof BaseProject ? project.save() : project;
    return this.update(docId, data as IDoc).then((res: IRes) => {
      if (res.ok) {
        project.doc._id = res.id;
        project.doc._rev = res.rev;
      }
    });
  }
}
