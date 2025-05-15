// getPosition.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "nest/GetPositions",
  title: "get position",
  codeTemplate: () => "def pos(n): return dict(zip(n.global_id, nest.GetPosition(n)))",
});
