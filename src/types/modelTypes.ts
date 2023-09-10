// modelTypes.ts

import { BaseModel } from "@/helpers/model/baseModel";
import { NorseModel } from "@/simulators/norse/helpers/model/norseModel";
import { NESTModel } from "@/simulators/nest/helpers/model/nestModel";

export type Model = BaseModel | NESTModel | NorseModel;

// for model bar
export const ModelPropTypes = [BaseModel, NESTModel, NorseModel];