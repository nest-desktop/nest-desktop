// modelTypes.ts

import { BaseModel, IModelProps } from "@/helpers/model/model";
import {
  INESTModelProps,
  NESTModel,
} from "@/simulators/nest/helpers/model/model";
import {
  INorseModelProps,
  NorseModel,
} from "@/simulators/norse/helpers/model/model";
import {
  IPyNNModelProps,
  PyNNModel,
} from "@/simulators/pynn/helpers/model/model";

export type TModel = BaseModel | NESTModel | NorseModel | PyNNModel;
export type TModelProps =
  | IModelProps
  | INESTModelProps
  | INorseModelProps
  | IPyNNModelProps;
