// projectCode.ts

import type { IEditorState } from "@baklavajs/core";
import { PythonCode } from "@babsey/code-graph";

import type { TProject } from "@/types";

export interface ICodeProps {
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

  toJSON(): ICodeProps {
    return {
      editor: this.viewModel.editor.save(),
    };
  }
}
