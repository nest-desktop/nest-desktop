// modelTypes.ts

import { BaseModel } from "@/helpers/model/model";
import { NESTModel } from "@/simulators/nest/helpers/model/model";
import { NorseModel } from "@/simulators/norse/helpers/model/model";
import { PyNNModel } from "@/simulators/pynn/helpers/model/model";

export type TModel = BaseModel | NESTModel | NorseModel | PyNNModel;

// for components
export const TModelProps = [BaseModel, NESTModel, NorseModel, PyNNModel];
