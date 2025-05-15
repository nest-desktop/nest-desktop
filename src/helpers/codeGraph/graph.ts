import { AbstractNode, Editor, Graph, GraphTemplate } from "baklavajs";
import { TCode } from "@/types";

export class CodeGraph extends Graph {
  private _code: TCode;

  constructor(code: TCode, editor: Editor, template?: GraphTemplate) {
    super(editor, template);
    this._code = code;
  }

  get code(): TCode {
    return this._code;
  }

  addNode<T extends AbstractNode>(node: T): T | undefined {
    node.code = this.code;
    super.addNode(node);
    return node;
  }
}
