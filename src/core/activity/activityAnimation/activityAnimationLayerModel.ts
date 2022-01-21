import * as THREE from 'three';

import { ActivityAnimationLayer } from './activityAnimationLayer';

export class ActivityAnimationLayerModel {
  private _graphGroup: THREE.Group;
  private _layer: ActivityAnimationLayer;

  constructor(layer: ActivityAnimationLayer) {
    this._layer = layer;
    this.initGraph();
  }

  get graphGroup(): THREE.Group {
    return this._graphGroup;
  }

  set graphGroup(value: THREE.Group) {
    this._graphGroup = value;
  }

  get layer(): ActivityAnimationLayer {
    return this._layer;
  }

  /**
   * Initialize graph for layer model.
   */
  initGraph(): void {
    this._graphGroup = new THREE.Group();
    this.addGraph();
  }

  /**
   * Add graph for layer model.
   */
  addGraph(): void {}

  /**
   * Render layer model.
   */
  render(frame: any): void {
    this.resetObjects();
    if (frame.senders == null) return;
    if (this._layer.activity.hasSpikeData()) {
      this.renderTrails();
    }
    if (frame.senders.length === 0) return;
    this.updateObjects(frame);
  }

  /**
   * Render trails.
   */
  renderTrails(): void {
    if (this.layer.trail.length > 0) {
      for (let trailIdx = this.layer.trail.length; trailIdx > 0; trailIdx--) {
        const frame: any =
          this.layer.frames[this.layer.graph.state.frameIdx - trailIdx];
        if (frame) {
          this.updateObjects(frame, trailIdx);
        }
      }
    }
  }

  /**
   * Reset graph objects
   */
  resetObjects(): void {
    const scale: number = this._layer.object.size;
    this._graphGroup.children.forEach((mesh: THREE.Mesh) => {
      // @ts-ignore
      mesh.material.opacity = 0;
      const position = mesh.userData.position;
      mesh.position.set(position.x, position.y, position.z);
      mesh.scale.set(scale, scale, scale);
    });
  }

  /**
   * Update graph objects.
   */
  updateObjects(frame: any, trailIdx: number = null): void {
    // console.log('Update objects');
    const trail: any = this.layer.trail;
    const ratio: number = trailIdx != null ? trailIdx / (trail.length + 1) : 0;
    const opacity: number =
      trailIdx != null
        ? trail.fading
          ? 1 - ratio
          : 1
        : this.layer.object.opacity;

    const size: number = this.layer.object.size;
    let scale: number;
    switch (trail.mode) {
      case 'growing':
        scale = (1 + ratio) * size;
        break;
      case 'shrinking':
        scale = (1 - ratio) * size;
        break;
      default:
        scale = size;
    }

    const record = this.layer.state.record;
    const values =
      record != null && frame.hasOwnProperty(record.id) ? frame[record.id] : [];
    frame.senders.forEach((sender: number, senderIdx: number) => {
      let color: string;
      let height: number;
      if (values.length === frame.senders.length) {
        const valueNormed = record.normalize(values[senderIdx]);
        color = record.valueColor(valueNormed);
        height = valueNormed * size;
      } else {
        color = this.layer.node.color;
        height = size;
      }

      // @ts-ignore
      const mesh: THREE.Mesh = this._graphGroup.children[sender];
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
  updateMesh(mesh: THREE.Mesh, options: any = {}): void {
    // @ts-ignore
    mesh.material.color.set(options.color);
    // @ts-ignore
    mesh.material.opacity = options.opacity;
    mesh.scale.set(options.scale, options.scale, options.scale);
  }
}
