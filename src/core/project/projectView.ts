import { AppView } from '../appView';
import { Project } from './project';


export class ProjectView {
  private _project: Project;                           // parent

  constructor(project: Project) {
    this._project = project;
  }

}
