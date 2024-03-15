// modelDBTypes.ts

import { BaseModelDB } from "@/helpers/model/modelDB";
import { NESTModelDB } from "@/simulators/nest/helpers/model/modelDB";
import { NorseModelDB } from "@/simulators/norse/helpers/model/modelDB";
import { PyNNModelDB } from "@/simulators/pynn/helpers/model/modelDB";

export type TModelDB = BaseModelDB | NESTModelDB | NorseModelDB | PyNNModelDB;
