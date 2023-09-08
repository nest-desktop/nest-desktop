// nestProjectDB.ts

import { logger as mainLogger } from "@/helpers/logger";
import { DatabaseService } from "@/helpers/database";

import {
  NESTProject,
  NESTProjectProps,
} from "@nest/helpers/project/nestProject";
import { truncate } from "@/utils/truncate";

const logger = mainLogger.getSubLogger({
  name: "project DB store",
  minLevel: 1,
});

export class NESTProjectDB extends DatabaseService {
  constructor() {
    super("NEST_PROJECT_STORE");
  }

  /**
   * Add project to the database.
   */
  async addProject(data: any): Promise<any> {
    this.logger.trace("add project:", data.name);
    // const project: Project = new Project(data);
    // return this.create(project);
  }

  /**
   * Add projects to the database.
   */
  async addProjects(data: any[]): Promise<any> {
    this.logger.trace("add projects");
    const projects: any[] = data.map(
      (project: any) =>
        new Promise<any>((resolve) => {
          this.addProject(project).then(() => {
            resolve(project);
          });
        })
    );
    return Promise.all(projects);
  }

  /**
   * Create a project in the database.
   */
  async createProject(project: NESTProject): Promise<any> {
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
  async createProjects(data: NESTProjectProps[]): Promise<NESTProjectProps[]> {
    logger.trace("create projects");
    const projects: Promise<NESTProjectProps>[] = data.map(
      (project: NESTProjectProps) =>
        new Promise<NESTProjectProps>((resolve) => {
          this.create(project).then(() => {
            resolve(project);
          });
        })
    );
    return Promise.all(projects);
  }

  /**
   * Delete projects and then update the list.
   * @param projects List of project objects.
   */
  async deleteProjects(
    projects: (NESTProject | NESTProjectProps)[]
  ): Promise<any> {
    logger.trace("delete projects");
    const projectDocIds: string[] = projects.map(
      (
        project: NESTProject | NESTProjectProps | any // TODO: any should be removed.
      ) => project.docId || project.id
    );
    return this.deleteBulk(projectDocIds);
  }
  /**
   * Import projects from assets to the database.
   */
  async importProjectsFromAssets(): Promise<any> {
    this.logger.trace("import projects from assets");
    const promise: Promise<any> = Promise.resolve();
    // this.app.config.projects.forEach((file: string) => {
    //   const data: any = require('@/assets/projects/' + file + '.json');
    //   promise = promise.then(() => this.addProject(data));
    // });
    return promise;
  }

  /**
   * Update a project in the database.
   */
  async updateProject(project: NESTProject): Promise<any> {
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
