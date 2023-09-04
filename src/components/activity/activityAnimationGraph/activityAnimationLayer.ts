// activityAnimationLayer.ts

import { GridHelper, Group } from "three";

import { range } from "@/helpers/array";
import { NodeRecord } from "@/components/node/nodeRecord";

import { Activity } from "../activity";
import { ActivityAnimationGraph } from "./activityAnimationGraph";
import { ActivityAnimationLayerModel } from "./activityAnimationLayerModel";
import { BoxGeometryLayerModel } from "./activityAnimationLayerModels/BoxGeometryLayerModel";
import { SphereGeometryLayerModel } from "./activityAnimationLayerModels/SphereGeometryLayerModel";

export class ActivityAnimationLayer {
  private _activity: Activity;
  private _config: any = {
    object: {
      flatHeight: false,
      flyingBoxes: false,
      opacity: 1,
      size: 4,
    },
    trail: {
      fading: false,
      length: 0,
      mode: "off",
    },
  };
  private _frames: any[] = [];
  private _graph: ActivityAnimationGraph;
  private _graphGroup?: Group;
  private _model?: ActivityAnimationLayerModel;
  private _models: any[] = [
    {
      component: BoxGeometryLayerModel,
      id: "BoxGeometryLayerModel",
      label: "box geometry",
    },
    {
      component: SphereGeometryLayerModel,
      id: "SphereGeometryLayerModel",
      label: "sphere geometry",
    },
  ];
  private _offset: any = { x: 0, y: 0, z: 0 };
  private _state: any = {
    layout: {
      extent: [
        [-1, 0],
        [-0.5, 0.5],
        [0.5, -0.5],
      ],
    },
    modelSelected: undefined,
    ndim: -1,
    positions: [],
    record: undefined,
    records: [],
    reset: false,
    visible: true,
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

  get config(): any {
    return this._config;
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

  get graphGroup(): Group | undefined {
    return this._graphGroup;
  }

  get model(): ActivityAnimationLayerModel | undefined {
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

  get offset(): any[] {
    return this._offset;
  }

  get state(): any {
    return this._state;
  }

  /**
   * Get binned positions for histogram.
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

  /**
   * Initialize layer for activity animation.
   */
  init(): void {
    if (this._activity.nodePositions.length > 0) {
      this._state.ndim = this._activity.nodePositions[0].length;
      this._state.positions = this._activity.nodePositions.map(
        (pos: number[]) => ({
          x: pos[0],
          y: pos.length === 3 ? pos[1] : 0,
          z: pos.length === 3 ? pos[2] : pos[1],
        })
      );
    }

    this.initAnalogRecords();
    this.initFrames();
    this.initModel();
    this.initGraph();
  }

  /**
   * Initialize records from analog activities.
   */
  initAnalogRecords(): void {
    if (!this._activity.recorder.model.isAnalogRecorder) return;

    this._state.records = [];
    if (this._activity.recorder.records == null) return;
    this._activity.recorder.records.forEach((record: NodeRecord) => {
      record.activity = this._activity;
      this._state.records.push(record);
    });
    if (this._state.record == null) {
      const record = this._state.records.find(
        (record: NodeRecord) => record.id === "V_m"
      );
      this._state.record = record != null ? record : this._state.records[0];
    }
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
    this._graphGroup = new Group();
    this._graphGroup.userData.layer = this;
    this._graphGroup.add(this.createGrids(this.bins));
    if (this._model) {
      // @ts-ignore
      this._graphGroup.add(this._model.graphGroup);
    }
  }

  /**
   * Create grids.
   *
   * @remarks
   * returns a group of GridHelpers
   */
  createGrids(divisions: number = 2): Group {
    const grid: Group = new Group();
    const scale: any = { x: 1, y: 1, z: 1 };

    if (this._state.ndim === 3) {
      const gridX: GridHelper = new GridHelper(1, divisions);
      gridX.geometry.rotateZ(Math.PI / 2);
      gridX.position.x = -scale.x / 2;
      grid.add(gridX);
    }

    const gridY: GridHelper = new GridHelper(1, divisions);
    gridY.position.y = this._state.ndim === 2 ? 0 : -scale.y / 2;
    grid.add(gridY);

    if (this._state.ndim === 3) {
      const gridZ: GridHelper = new GridHelper(1, divisions);
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
    const rangeData: number[] = range(min, max, step);
    return rangeData.filter((_: number, i: number) => i % 2 === 1);
  }

  /**
   * Initialize frames.
   */
  initFrames(): void {
    this.addEmptyFrames();
    this.updateFrames();
  }

  /**
   * Add empty frames.
   */
  addEmptyFrames(): void {
    // Add empty frames if not existed.
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
    if (events.senders == null) {
      return;
    }

    // Update records of analog signals.
    if (this._activity.recorder.model.isAnalogRecorder) {
      this._state.records.forEach((record: NodeRecord) => record.update());
    }

    // Collect senders based on events.
    events.senders = events.senders.map((sender: number) =>
      this._activity.nodeIds.indexOf(sender)
    );

    // Add empty data (from individual recorder) in each frame.
    this._frames.forEach((frame: any) => {
      Object.keys(events).forEach((eventKey: string) => {
        frame[eventKey] = [];
      });
    });

    // Push values in data frames.
    const sampleRate: number = this._graph.config.frames.sampleRate;
    events.times.forEach((time: number, idx: number) => {
      const frameIdx: number = Math.floor(time * sampleRate);
      const frame: any = this._frames[frameIdx - 1];
      if (frame == null) {
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
    if (this._model == undefined) {
      return;
    }

    if (this._state.visible) {
      this._model.render(this.frame);
    } else if (!this._state.reset) {
      this._model.resetObjects();
    }
  }
}
