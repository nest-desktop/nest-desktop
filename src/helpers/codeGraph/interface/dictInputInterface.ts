import { markRaw } from "vue";
import { NodeInterface, setType } from "baklavajs";

import DictInputComponent from "@/components/codeGraph/DictInputComponent.vue";
import { dictType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export class DictInputInterface extends NodeInterface {
  constructor(name: string, value: Record<string, any>) {
    super(name, value);
    this.setComponent(markRaw(DictInputComponent));
    this.use(setType, dictType);
  }
}
