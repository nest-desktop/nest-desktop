// model.ts

import { BaseModel, type IModelState } from "@/model";

export class NorseModel extends BaseModel {
  constructor(modelState: IModelState) {
    super(modelState, { name: "NorseModel", workspace: "norse" });
  }

  // /**
  //  * Save norse model to state.
  //  * @returns norse model state
  //  */
  // override save(): IModelState {
  //   const modelState: IModelState = {
  //     abbreviation: this.abbreviation,
  //     elementType: this.elementType,
  //     id: this.id,
  //     label: this.state.label,
  //     params: this.params.save(),
  //     version: process.env.APP_VERSION,
  //   };

  //   // Add the states if provided.
  //   if (this.states.length > 0) modelState.states = this.states.map((state: IModelRecordState) => state.id);

  //   // if (this.codeTemplate) modelState.codeTemplate = this.codeTemplate;

  //   return modelState;
  // }
}
