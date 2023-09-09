// modelTypes.ts

import { BaseModel } from "@/helpers/model/baseModel";
import { NorseModel } from "@norse/helpers/model/norseModel";
import { NESTModel } from "@nest/helpers/model/nestModel";

export type Model = BaseModel | NESTModel | NorseModel;

// for model bar
export const ModelPropTypes = [BaseModel, NESTModel, NorseModel];