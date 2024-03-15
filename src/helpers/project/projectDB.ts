// projectDB.ts

import { DatabaseService } from "../common/database";
import { TProject } from "@/types/projectTypes";
import { IProjectProps } from "./project";
import { truncate } from "@/utils/truncate";

export class BaseProjectDB extends DatabaseService {
  constructor(name: string = "PROJECT_STORE") {
    super(name, undefined, { minLevel: 3 });
  }

  /**
   * Create a project in the database.
   */
  async createProject(project: TProject): Promise<TProject> {
    this.logger.trace("create project:", truncate(project.id));
    const data = project.toJSON();
    return this.create(data).then((res: any) => {
      if (res.ok) {
        project.doc._id = res.id;
        project.doc._rev = res.rev;
      }
    });
  }

  /**
   * Create multiple projects in the database.
   */
  async createProjects(
    projectsProps: IProjectProps[]
  ): Promise<IProjectProps[]> {
    this.logger.trace("create projects");
    const projects: Promise<IProjectProps>[] = projectsProps.map(
      (projectProps: IProjectProps) =>
        new Promise<IProjectProps>((resolve) => {
          this.create(projectProps).then(() => {
            resolve(projectProps);
          });
        })
    );
    return Promise.all(projects);
  }

  /**
   * Delete a project in the database.
   */
  deleteProject(project: TProject | IProjectProps | any): Promise<any> {
    this.logger.trace("delete project:", truncate(project.id));
    const projectId: string = project.docId || project._id;
    return this.delete(projectId);
  }

  /**
   * Delete multiple projects.
   */
  async deleteProjects(projects: (TProject | IProjectProps)[]): Promise<any> {
    this.logger.trace("delete projects");
    const projectDocIds: string[] = projects.map(
      (
        project: TProject | IProjectProps | any // TODO: any should be removed.
      ) => project.docId || project.id
    );
    return this.deleteBulk(projectDocIds);
  }

  /**
   * Import the project in the database.
   */
  async importProject(project: TProject | IProjectProps | any): Promise<any> {
    this.logger.trace("import project:", truncate(project.id));
    return project.docId
      ? this.updateProject(project)
      : this.createProject(project);
  }

  /**
   * Update a project in the database.
   */
  async updateProject(project: TProject): Promise<TProject | undefined> {
    if (!project.docId) return;
    this.logger.trace("update project:", truncate(project.id));
    const data = project.toJSON();
    return this.update(project.docId, data).then((res: any) => {
      if (res.ok) {
        project.doc._id = res.id;
        project.doc._rev = res.rev;
      }
    });
  }
}
