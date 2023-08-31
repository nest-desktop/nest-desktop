// norseProjectDB.ts

import { DatabaseService } from "@/helpers/database";

export class NorseProjectDB extends DatabaseService {
  constructor() {
    super("NORSE_PROJECT_STORE");
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
}
