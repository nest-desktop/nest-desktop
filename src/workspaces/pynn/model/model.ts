// model.ts

import { BaseModel, type IModelState } from "@/model";

export class PyNNModel extends BaseModel {
  constructor(modelState: IModelState) {
    super(modelState, { name: "PyNNModel", workspace: "pynn" });
  }

  // /**
  //  * Save pynn model to state.
  //  * @returns pynn model state
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

  //   return modelState;
  // }
}
