// baseProjectDB.ts

import { DatabaseService } from "@/helpers/database";
import { Project } from "@/types/projectTypes";
import { logger as mainLogger } from "@/helpers/logger";
import { truncate } from "@/utils/truncate";
import { ProjectProps } from "@/helpers/project/baseProject";

const logger = mainLogger.getSubLogger({
  name: "project DB",
  minLevel: 1,
});

export class BaseProjectDB extends DatabaseService {
  constructor(name: string = "PROJECT_STORE") {
    super(name);
  }

  /**
   * Create a project in the database.
   */
  async createProject(project: Project): Promise<Project> {
    logger.trace("create project", truncate(project.id));
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
  async createProjects(data: ProjectProps[]): Promise<ProjectProps[]> {
    logger.trace("create projects");
    const projects: Promise<ProjectProps>[] = data.map(
      (project: ProjectProps) =>
        new Promise<ProjectProps>((resolve) => {
          this.create(project).then(() => {
            resolve(project);
          });
        })
    );
    return Promise.all(projects);
  }

  /**
   * Delete a project in the database.
   */
  deleteProject(project: Project | ProjectProps | any): Promise<any> {
    logger.trace("delete project:", truncate(project.id));
    const projectId: string = project.docId || project._id;
    return this.delete(projectId);
  }

  /**
   * Delete multiple projects.
   */
  async deleteProjects(projects: (Project | ProjectProps)[]): Promise<any> {
    logger.trace("delete projects");
    const projectDocIds: string[] = projects.map(
      (
        project: Project | ProjectProps | any // TODO: any should be removed.
      ) => project.docId || project.id
    );
    return this.deleteBulk(projectDocIds);
  }

  /**
   * Import the project in the database.
   */
  async importProject(project: Project | ProjectProps | any): Promise<any> {
    logger.trace("import project:", truncate(project.id));
    return project.docId
      ? this.updateProject(project)
      : this.createProject(project);
  }

  /**
   * Update a project in the database.
   */
  async updateProject(project: Project): Promise<Project | undefined> {
    if (!project.docId) return;
    logger.trace("update project:", truncate(project.id));
    const data = project.toJSON();
    return this.update(project.docId, data).then((res: any) => {
      if (res.ok) {
        project.doc._id = res.id;
        project.doc._rev = res.rev;
      }
    });
  }
}
