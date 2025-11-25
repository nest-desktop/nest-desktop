// projectCode.ts

import type { IEditorState } from "@baklavajs/core";
import { PythonCode } from "@babsey/code-graph";

import type { TProject } from "@/types";

export interface IProjectCodeState {
  editor: IEditorState;
}

export class ProjectCode extends PythonCode {
  private _project: TProject;

  constructor(project: TProject) {
    super();

    this._project = project;
  }

  get project(): TProject {
    return this._project;
  }

  /**
   * Load project code  from state
   * @param state code state
   */
  load(state: IProjectCodeState) {
    this.viewModel.loadEditor(state.editor);
  }

  /**
   * Save project code to state.
   * @returns project code state.
   */
  override save(): IProjectCodeState {
    return {
      editor: this.viewModel.editor.save(),
    };
  }
}
