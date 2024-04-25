// activityAnimationLayerModel.ts

import {
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  Object3DEventMap,
} from "three";

import {
  ActivityAnimationLayer,
  IActivityAnimationLayerConfig,
  IActivityAnimationLayerFrame,
} from "./activityAnimationLayer";
import { BaseObj } from "@/helpers/common/base";

export class ActivityAnimationLayerModel extends BaseObj {
  private _graphGroup: Group<Object3DEventMap>;
  private _layer: ActivityAnimationLayer;

  constructor(layer: ActivityAnimationLayer) {
    super({
      logger: {
        settings: {
          minLevel: 3,
        },
      },
    });

    this._layer = layer;
    this._graphGroup = new Group();

    this.initGraph();
  }

  get graphGroup(): Group<Object3DEventMap> {
    return this._graphGroup;
  }

  set graphGroup(value: Group<Object3DEventMap>) {
    this._graphGroup = value;
  }

  get layer(): ActivityAnimationLayer {
    return this._layer;
  }

  /**
   * Add graph for layer model.
   */
  addGraph(): void {}

  /**
   * Initialize graph for layer model.
   */
  initGraph(): void {
    this.addGraph();
  }

  /**
   * Render layer model.
   */
  render(frame: IActivityAnimationLayerFrame): void {
    this.logger.trace("render");

    this.resetObjects();

    if (frame.senders == null) return;

    if (this._layer.activity.recorder.model.isSpikeRecorder) {
      this.renderTrails();
    }

    if (frame.senders.length === 0) return;
    this.updateObjects(frame);
  }

  /**
   * Render trails.
   */
  renderTrails(): void {
    const trail = this.layer.config.trail;
    if (trail.length > 0) {
      for (let trailIdx = trail.length; trailIdx > 0; trailIdx--) {
        const frame: IActivityAnimationLayerFrame =
          this.layer.frames[this.layer.graph.state.frameIdx - trailIdx];
        if (frame) {
          this.updateObjects(frame, trailIdx);
        }
      }
    }
  }

  /**
   * Reset graph objects.
   */
  resetObjects(): void {
    if (this._graphGroup == undefined) return;

    const scale: number = this._layer.config.object.size;
    this._graphGroup.children.forEach((child: Object3D<Object3DEventMap>) => {
      const mesh: Mesh<any, MeshBasicMaterial | MeshLambertMaterial, any> =
        child as Mesh<any, MeshBasicMaterial | MeshLambertMaterial, any>;

      mesh.material.opacity = 0.0;
      const position = mesh.userData.position;
      mesh.position.set(position.x, -1, position.z);
      mesh.scale.set(scale, scale, scale);
    });
    this._layer.state.reset = true;
  }

  /**
   * Update mesh objects.
   */
  updateMesh(
    mesh: Mesh<any, MeshBasicMaterial | MeshLambertMaterial, any>,
    options?: {
      color?: string;
      height?: number;
      opacity?: number;
      scale?: number;
    }
  ): void {
    this.logger.trace("update mesh");

    const color = options?.color || "0x000000";
    const opacity = options?.opacity || 1;
    const scale = options?.scale || 0.01;
    const position = mesh.userData.position;

    mesh.material.color.set(color);
    mesh.material.opacity = opacity;
    mesh.position.set(position.x, position.y, position.z);
    mesh.scale.set(scale, scale, scale);
  }

  /**
   * Update graph objects.
   */
  updateObjects(frame: IActivityAnimationLayerFrame, trailIdx?: number): void {
    this.logger.trace("update objects");

    this._layer.state.reset = false;
    const config: IActivityAnimationLayerConfig = this.layer.config;

    const ratio: number =
      trailIdx != null ? trailIdx / (config.trail.length + 1) : 0;
    const opacity: number =
      trailIdx != null
        ? config.trail.fading
          ? 1 - ratio
          : 1
        : config.object.opacity;

    const size: number = config.object.size;
    let scale: number;
    switch (config.trail.mode) {
      case "growing":
        scale = (1 + ratio) * size;
        break;
      case "shrinking":
        scale = (1 - ratio) * size;
        break;
      default:
        scale = size;
    }

    const record = this.layer.state.record;
    const values = record != null && record.id in frame ? frame[record.id] : [];
    frame.senders?.forEach((sender: number, senderIdx: number) => {
      let color: string;
      let height: number;
      if (record && values.length === frame.senders?.length) {
        const valueNormed = record.normalize(values[senderIdx]);
        color = record?.valueColor(valueNormed);
        height = valueNormed * size;
      } else {
        color = this.layer.activity.recorder.view.color;
        height = size;
      }

      const mesh: Mesh<any, MeshBasicMaterial | MeshLambertMaterial, any> = this
        ._graphGroup.children[sender] as Mesh<
        any,
        MeshBasicMaterial | MeshLambertMaterial,
        any
      >;

      const options = {
        color,
        height,
        opacity,
        scale,
      };

      this.updateMesh(mesh, options);
    });
  }
}