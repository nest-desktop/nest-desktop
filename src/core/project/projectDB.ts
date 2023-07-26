import { consoleLog } from '../common/logger';

import { App } from '../app';
import { DatabaseService } from '../common/database';
import { Project } from './project';

export class ProjectDB extends DatabaseService {
  constructor(app: App) {
    super(app, 'PROJECT_STORE');
  }

  consoleLog(text: string): void {
    consoleLog(this, text, 3);
  }

  /**
   * Add projects to the database.
   */
  async addProjects(data: any[]): Promise<any> {
    this.consoleLog('Add projects');
    const projects: any[] = data.map(
      (project: any) =>
        new Promise<any>(resolve => {
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
    this.consoleLog('Import projects from assets');
    let promise: Promise<any> = Promise.resolve();
    this.app.config.projects.forEach((file: string) => {
      const data: any = require('@/assets/projects/' + file + '.json');
      promise = promise.then(() => this.addProject(data));
    });
    return promise;
  }

  /**
   * Add project to the database.
   */
  async addProject(data: any): Promise<any> {
    this.consoleLog('Add project: ' + data.name);
    const project: Project = new Project(this.app, data);
    return this.create(project);
  }
}
