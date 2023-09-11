// modelTypes.ts

import { BaseModel } from "@/helpers/model/model";
import { NESTModel } from "@/simulators/nest/helpers/model/model";
import { NorseModel } from "@/simulators/norse/helpers/model/model";
import { PyNNModel } from "@/simulators/pynn/helpers/model/model";

export type Model = BaseModel | NESTModel | NorseModel | PyNNModel;

// for model bar
export const ModelPropTypes = [BaseModel, NESTModel, NorseModel, PyNNModel];
