import { Connection } from '../connection/connection';
import { ModelParameter } from '../parameter/modelParameter';
import { Node } from './node';

export class NodeView {
  private _color: any; // color of node
  private _label: string;
  private _node: Node; // parent
  private _position: any = { x: 0, y: 0 };
  private _positions: number[][] = [];
  private _visible: boolean = true;

  constructor(node: Node, view: any) {
    this._node = node;
    this._color = view.color;
    this._position = view.position;
    this._visible = view.visible || true;
  }

  get color(): string {
    if (typeof this._color === 'string') {
      return this._color;
    } else if (this._node.model.elementType === 'recorder') {
      const connections: Connection[] = this._node.network.connections.filter(
        (connection: Connection) =>
          connection.sourceIdx === this._node.idx ||
          connection.targetIdx === this._node.idx
      );
      if (
        connections.length === 1 &&
        connections[0].sourceIdx !== connections[0].targetIdx
      ) {
        const connection: Connection = connections[0];
        const node: Node =
          connection.sourceIdx === this._node.idx
            ? connection.target
            : connection.source;
        return node.view.color;
      }
    }
    return this._node.network.view.getNodeColor(this._node.idx);
  }

  set color(value: string) {
    this._color = value === 'none' ? undefined : value;
    this._node.network.clean();
  }

  get label(): string {
    if (this._label) {
      return this._label;
    }

    let idx: number;
    const elementType: string = this._node.model.elementType;
    switch (elementType) {
      case undefined:
        idx = this._node.network.nodes.indexOf(this._node);
        return 'n' + (idx + 1);
      // case 'stimulator':
      //   idx = this._node.network.stimulators.indexOf(this._node);
      //   const varname: string = this._node.modelId.slice(
      //     0,
      //     this._node.modelId.length - 10
      //   );
      //   return varname + (idx + 1);
      case 'neuron':
        idx = this._node.network.neurons.indexOf(this._node);
        return 'n' + (idx + 1);
      default:
        const nodes: Node[] = this._node.network.nodes.filter(
          (node: Node) => node.modelId === this._node.modelId
        );
        idx = nodes.indexOf(this._node);
        const label: string =
          this._node.model.abbreviation ||
          this._node.modelId
            .split('_')
            .map((d: string) => d[0])
            .join('');
        return label + (idx + 1);
    }
  }

  get node(): Node {
    return this._node;
  }

  get position(): any {
    return this._position;
  }

  get positions(): number[][] {
    return this._positions;
  }

  set positions(value: number[][]) {
    this._positions = value;
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
  }

  /**
   * Get term based on synapse weight.
   */
  get weight(): string {
    if (this._node.model.elementType === 'recorder') {
      return '';
    }
    const connections: Connection[] = this._node.network.connections.filter(
      (connection: Connection) =>
        connection.source.idx === this._node.idx &&
        connection.target.model.elementType !== 'recorder'
    );
    if (connections.length > 0) {
      const weights: number[] = connections.map(
        (connection: Connection) => connection.synapse.weight
      );
      if (weights.every((weight: number) => weight > 0)) {
        return 'excitatory';
      }
      if (weights.every((weight: number) => weight < 0)) {
        return 'inhibitory';
      }
      return 'mixed';
    }
    return '';
  }

  /**
   * Get ids of visible parameter.
   */
  paramsVisible(): string[] {
    return this._node.params
      .filter((param: ModelParameter) => param.visible)
      .map(param => param.id);
  }

  /**
   * Clean node.
   */
  clean(): void {}

  /**
   * Focus node.
   */
  focus(): void {
    this._node.network.view.focusedNode = this._node;
  }

  /**
   * Check if this node is focused.
   */
  isFocused(): boolean {
    return this._node.network.view.isNodeFocused(this._node);
  }

  /**
   * Select node.
   */
  select(): void {
    this._node.network.view.selectedNode = this._node;
  }

  /**
   * Check if this node is selected.
   */
  isSelected(unselected: boolean = false): boolean {
    return this._node.network.view.isNodeSelected(this._node, unselected);
  }

  /**
   * Serialize for JSON.
   * @return node view object
   */
  toJSON(): any {
    const nodeView: any = {
      color: this._color,
      position: this._position,
      visible: this._visible,
    };
    return nodeView;
  }
}
