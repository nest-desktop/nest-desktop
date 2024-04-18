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

export class ActivityAnimationLayerModel {
  private _graphGroup: Group<any>;
  private _layer: ActivityAnimationLayer;

  constructor(layer: ActivityAnimationLayer) {
    this._layer = layer;
    this._graphGroup = new Group();

    this.initGraph();
  }

  get graphGroup(): Group<any> {
    return this._graphGroup;
  }

  set graphGroup(value: Group<any>) {
    this._graphGroup = value;
  }

  get layer(): ActivityAnimationLayer {
    return this._layer;
  }

  /**
   * Initialize graph for layer model.
   */
  initGraph(): void {
    this.addGraph();
  }

  /**
   * Add graph for layer model.
   */
  addGraph(): void {}

  /**
   * Render layer model.
   */
  render(frame: IActivityAnimationLayerFrame): void {
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
    if (this._graphGroup == undefined) {
      return;
    }

    const scale: number = this._layer.config.object.size;
    this._graphGroup.children.forEach((child: Object3D<Object3DEventMap>) => {
      const mesh: Mesh<any, MeshBasicMaterial | MeshLambertMaterial, any> =
        child as Mesh<any, MeshBasicMaterial | MeshLambertMaterial, any>;
      mesh.material.opacity = 0;
      const position = mesh.userData.position;
      mesh.position.set(position.x, -1, position.z);
      mesh.scale.set(scale, scale, scale);
    });
    this._layer.state.reset = true;
  }

  /**
   * Update graph objects.
   */
  updateObjects(frame: IActivityAnimationLayerFrame, trailIdx?: number): void {
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
    if (!record) return;

    const values = record != null && record.id in frame ? frame[record.id] : [];
    frame.senders?.forEach((sender: number, senderIdx: number) => {
      let color: string;
      let height: number;
      if (values.length === frame.senders?.length) {
        const valueNormed = record.normalize(values[senderIdx]);
        color = record.valueColor(valueNormed);
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

      this.updateMesh(mesh, {
        color,
        height,
        opacity,
        scale,
      });
    });
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
    mesh.material.color.set(options?.color || "000000");
    mesh.material.opacity = options?.opacity || 1;
    const position = mesh.userData.position;
    mesh.position.set(position.x, position.y, position.z);
    mesh.scale.set(
      options?.scale || 1,
      options?.scale || 1,
      options?.scale || 1
    );
  }
}
