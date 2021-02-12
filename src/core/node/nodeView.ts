import { Connection } from '../connection/connection';
import { Node } from './node';
import { Parameter } from '../parameter';

export class NodeView {
  private _color: any; // color of node
  private _label: string;
  private _node: Node; // parent
  private _position: any = { x: 0, y: 0 };
  private _positions: number[][] = [];

  constructor(node: Node, view: any) {
    this._node = node;
    this._color =
      view.color || this._node.network.view.getNodeColor(this._node.idx);
    this._position = view.position;
  }

  get color(): string {
    if (this._node.model.elementType === 'recorder') {
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

    if (typeof this._color === 'string') {
      return this._color;
    } else {
      return this._node.network.view.getNodeColor(this._node.idx);
    }
  }

  set color(value: string) {
    this._color = value === 'none' ? undefined : value;
    this._node.network.clean();
  }

  get label(): string {
    if (this._label) {
      return this._label;
    }

    const elementType: string = this._node.model.elementType;
    if (elementType === undefined) {
      const idx: number = this._node.network.nodes.indexOf(this._node);
      return 'n' + (idx + 1);
    } else if (elementType === 'neuron') {
      const idx: number = this._node.network.neurons.indexOf(this._node);
      return 'n' + (idx + 1);
    } else {
      const nodes: Node[] = this._node.network.nodes.filter(
        (node: Node) => node.modelId === this._node.modelId
      );
      const idx: number = nodes.indexOf(this._node);
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

  get backgroundImage(): string {
    const bg = '#fafafa';
    const color: string = this.color;
    const gradient: string = ['90deg', color, color, bg].join(', ');
    return 'linear-gradient(' + gradient + ')';
  }

  paramsVisible(): string[] {
    return this._node.params
      .filter((param: Parameter) => param.visible)
      .map(param => param.id);
  }

  setLevel(level: number): void {
    this._node.params.map(
      (param: Parameter) => (param.visible = param.options.level <= level)
    );
  }

  hideAllParams(): void {
    this._node.params.map((param: Parameter) => (param.visible = false));
  }

  showAllParams(): void {
    this._node.params.map((param: Parameter) => (param.visible = true));
  }

  clean(): void {}

  select(): void {
    this._node.network.view.selectedNode = this._node;
  }

  focus(): void {
    this._node.network.view.focusedNode = this._node;
  }

  isSelected(unselected: boolean = false): boolean {
    return this._node.network.view.isNodeSelected(this._node, unselected);
  }

  isFocused(): boolean {
    return this._node.network.view.isNodeFocused(this._node);
  }

  toJSON(): any {
    const nodeView: any = {
      color: this._color,
      position: this._position,
    };
    return nodeView;
  }
}
