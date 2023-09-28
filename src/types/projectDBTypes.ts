// projectDBTypes.ts

import { BaseProjectDB } from "@/helpers/project/projectDB";
import { NESTProjectDB } from "@/simulators/nest/helpers/project/projectDB";
import { NorseProjectDB } from "@/simulators/norse/helpers/project/projectDB";
import { PyNNProjectDB } from "@/simulators/pynn/helpers/project/projectDB";

export type ProjectDB = BaseProjectDB | NESTProjectDB | NorseProjectDB | PyNNProjectDB;
