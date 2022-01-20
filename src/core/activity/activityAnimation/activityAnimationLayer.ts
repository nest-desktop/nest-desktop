import * as d3 from 'd3';
import * as math from 'mathjs';
import * as THREE from 'three';

import { Activity } from '../activity';
import { ActivityAnimationGraph } from './activityAnimationGraph';
import { ActivityAnimationLayerModel } from './activityAnimationLayerModel';
import { BoxGeometryLayerModel } from './activityAnimationLayerModels/BoxGeometryLayerModel';
import { SphereGeometryLayerModel } from './activityAnimationLayerModels/SphereGeometryLayerModel';

export class ActivityAnimationLayer {
  private _activity: Activity;
  private _colorMap: any = {
    min: -70,
    max: -55,
    reverse: false,
    scale: 'Spectral',
  };
  private _frames: any[];
  private _graph: ActivityAnimationGraph;
  private _graphGroup: THREE.Group;
  private _layout = {
    extent: [
      [-1, 0],
      [-0.5, 0.5],
      [0.5, -0.5],
    ],
  };
  private _ndim: number = -1;
  private _node: any = {
    color: 'black',
    positions: [],
  };
  private _model: ActivityAnimationLayerModel;
  private _models: any[] = [
    {
      component: BoxGeometryLayerModel,
      id: 'BoxGeometryLayerModel',
      label: 'box geometry',
    },
    {
      component: SphereGeometryLayerModel,
      id: 'SphereGeometryLayerModel',
      label: 'sphere geometry',
    },
  ];
  private _object: any = {
    size: 4,
    opacity: 1,
    flatHeight: false,
    flyingBoxes: false,
  };
  private _offset: any = { x: 0, y: 0, z: 0 };
  private _record = 'V_m';
  private _state: any = {
    modelSelected: null,
  };
  private _trail: any = {
    mode: 'off',
    length: 0,
    fading: false,
  };

  constructor(graph: ActivityAnimationGraph, activity: Activity) {
    this._graph = graph;
    this._activity = activity;
  }

  get activity(): Activity {
    return this._activity;
  }

  get bins(): number {
    return this._graph.config.grid.divisions;
  }

  get color(): string {
    return this._node.color;
  }

  get colorMap(): string {
    return this._colorMap;
  }

  get frame(): any {
    return this.frames[this._graph.state.frameIdx] || {};
  }

  get frames(): any[] {
    return this._frames;
  }

  get graph(): ActivityAnimationGraph {
    return this._graph;
  }

  get graphGroup(): THREE.Group {
    return this._graphGroup;
  }

  get layout(): any {
    return this._layout;
  }

  get model(): ActivityAnimationLayerModel {
    return this._model;
  }

  get modelSelected(): any {
    return this._state.modelSelected;
  }

  set modelSelected(value: any) {
    this._state.modelSelected = value;
    this.init();
    this._graph.updateScene();
  }

  get models(): any[] {
    return this._models;
  }

  get node(): any {
    return this._node;
  }

  get ndim(): number {
    return this._ndim;
  }

  get object(): any {
    return this._object;
  }

  get offset(): any[] {
    return this._offset;
  }

  get positions(): any[] {
    return this._node.positions;
  }

  get record(): string {
    return this._record;
  }

  /**
   * get binned positions for histogram.
   */
  get positionsBinned(): any[] {
    const X: number[] = this.interval(-0.5, 0.5, this.bins);
    const Z: number[] = this.interval(-0.5, 0.5, this.bins);
    const positions: any[] = [];
    X.forEach((x: number) => {
      Z.forEach((z: number) => {
        positions.push({ x, z });
      });
    });
    return positions;
  }

  get trail(): any {
    return this._trail;
  }

  /**
   * Initialize layer for activity animation.
   */
  init(): void {
    this._node.color = this._activity.recorder.view.color;
    if (this._activity.nodePositions.length > 0) {
      this._ndim = this._activity.nodePositions[0].length;
      this._node.positions = this._activity.nodePositions.map(
        (pos: number[]) => ({
          x: pos[0],
          y: pos.length === 3 ? pos[1] : 0,
          z: pos.length === 3 ? pos[2] : pos[1],
        })
      );
    }

    this.initFrames();
    this.initModel();
    this.initGraph();
  }

  /**
   * Initialize geometry model for activity layer.
   */
  initModel(): void {
    if (this._state.modelSelected == null) {
      this._state.modelSelected = this._models[0];
    }
    this._model = new this._state.modelSelected.component(this);
  }

  /**
   * Initialize graph.
   */
  initGraph(): void {
    this._graphGroup = new THREE.Group();
    this._graphGroup.userData.layer = this;
    this._graphGroup.add(this.createGrids(this.bins));
    this._graphGroup.add(this._model.graphGroup);
  }

  /**
   * Create grids.
   *
   * @remarks
   * returns a group of GridHelber
   */
  createGrids(divisions: number = 2): THREE.Group {
    const grid: THREE.Group = new THREE.Group();
    const scale: any = { x: 1, y: 1, z: 1 };

    if (this.ndim === 3) {
      const gridX: THREE.GridHelper = new THREE.GridHelper(1, divisions);
      gridX.geometry.rotateZ(Math.PI / 2);
      gridX.position.x = -scale.x / 2;
      grid.add(gridX);
    }

    const gridY: THREE.GridHelper = new THREE.GridHelper(1, divisions);
    gridY.position.y = this.ndim === 2 ? 0 : -scale.y / 2;
    grid.add(gridY);

    if (this.ndim === 3) {
      const gridZ: THREE.GridHelper = new THREE.GridHelper(1, divisions);
      gridZ.geometry.rotateX(Math.PI / 2);
      gridZ.position.z = -scale.z / 2;
      grid.add(gridZ);
    }
    return grid;
  }

  /**
   * Calculate interval for bins.
   */
  interval(min: number, max: number, size: number): number[] {
    const step: number = (max - min) / size / 2;
    const range: any = math.range(min, max, step);
    return range._data.filter((_: number, i: number) => i % 2 === 1);
  }

  /**
   * Normalize value for color or height.
   */
  normalize(value: number): number {
    const min: number = this._colorMap.min;
    const max: number = this._colorMap.max;
    return (value - min) / (max - min);
  }

  /**
   * RGB color for a value in range [0 - 1].
   */
  valueColor(value: number): string {
    const colorScale: any = d3['interpolate' + this._colorMap.scale];
    return colorScale(this._colorMap.reverse ? 1 - value : value);
  }

  /**
   * Initialize frames.
   */
  initFrames() {
    this.addEmptyFrames();
    this.updateFrames();
  }

  /**
   * Add empty frames.
   */
  addEmptyFrames(): void {
    // Add empty frames if not existed
    this._frames = [];
    for (let i = 0; i < this._graph.state.nSamples; i++) {
      this._frames.push({});
    }
  }

  /**
   * Update frames.
   *
   * @remarks
   * It requires activity events.
   */
  updateFrames(): void {
    const events: any = Object.assign({}, this._activity.events);
    if (events.senders == undefined) {
      return;
    }

    // Collect senders based on events.
    events.senders = events.senders.map((sender: number) =>
      this._activity.nodeIds.indexOf(sender)
    );

    // Add empty data (from individual recorder) in each frame
    this._frames.forEach((frame: any) => {
      Object.keys(events).forEach((eventKey: string) => {
        frame[eventKey] = [];
      });
    });

    // Push values in data frames
    const sampleRate: number = this._graph.config.frames.sampleRate;
    events.times.forEach((time: number, idx: number) => {
      const frameIdx: number = Math.floor(time * sampleRate);
      const frame: any = this._frames[frameIdx - 1];
      if (frame == undefined) {
        return;
      }

      Object.keys(events).forEach((eventKey: string) => {
        frame[eventKey].push(events[eventKey][idx]);
      });
      this._frames[frameIdx - 1] = frame;
    });
  }

  /**
   * Render frame of activity.
   */
  renderFrame(): void {
    this._model.render(this.frame);
  }
}
