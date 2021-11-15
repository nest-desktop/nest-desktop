import * as THREE from 'three';

import { Activity } from '../../activity';
import { ActivityAnimationGraph } from '../activityAnimationGraph';
import { ActivityAnimationScene } from '../activityAnimationScene';

export class ActivityAnimationSceneBox extends ActivityAnimationScene {
  constructor(graph: ActivityAnimationGraph) {
    super('box', graph);
  }

  /**
   * Create layer group in update.
   */
  override createLayerGroup(layer: any, activity: Activity): THREE.Group {
    // console.log('Create activity layer');
    const layerGroup: THREE.Group = new THREE.Group();
    const activityLayerGroup: THREE.Group = new THREE.Group();

    const scale = 0.01;
    const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(
      scale,
      scale,
      scale
    );

    const positions: any[] = layer.positions;
    positions.forEach((position: any) => {
      const material: THREE.MeshBasicMaterial = new THREE.MeshLambertMaterial({
        color: layer.color,
        transparent: true,
      });
      const object: THREE.Mesh = new THREE.Mesh(geometry, material);
      object.userData.position = position;
      object.position.set(position.x, position.y, position.z);
      object.layers.set(activity.idx + 1);
      activityLayerGroup.add(object);
    });

    layerGroup.add(this.grids(layer.ndim));
    layerGroup.add(activityLayerGroup);
    return layerGroup;
  }

  /**
   * Render scene.
   */
  override render(): void {
    if (this.graph.frame) {
      const scale: number = this.graph.config.objectSize;
      this.graph.frame.data.forEach((data: any, idx: number) => {
        // @ts-ignore
        const layerGroup: THREE.Group = this.activityLayers.children[idx];
        // @ts-ignore
        const activityLayerGroup: THREE.Group = layerGroup.children[1];
        activityLayerGroup.children.forEach((object: THREE.Mesh) => {
          // @ts-ignore
          object.material.opacity = 0;
          object.scale.set(scale, scale, scale);
        });

        this.renderTrails(activityLayerGroup, idx);
        this.renderObjects(activityLayerGroup, data);
      });
    }
  }

  /**
   * Render trails.
   */
  renderTrails(activityLayerGroup: THREE.Group, idx: number): void {
    const trail: any = this.graph.config.trail;
    if (trail.length > 0) {
      for (let trailIdx = trail.length; trailIdx > 0; trailIdx--) {
        const frame: any = this.graph.frames[this.graph.frameIdx - trailIdx];
        if (frame) {
          const trailData: any = frame.data[idx];
          this.renderObjects(activityLayerGroup, trailData, trailIdx);
        }
      }
    }
  }

  /**
   * Render objects.
   */
  renderObjects(
    activityLayerGroup: THREE.Group,
    data: any,
    trailIdx: number = null
  ): void {
    const trail: any = this.graph.config.trail;
    const size: number = this.graph.config.objectSize;
    const ratio: number = trailIdx !== null ? trailIdx / (trail.length + 1) : 0;
    const opacity: number =
      trailIdx !== null
        ? trail.fading
          ? 1 - ratio
          : 1
        : this.graph.config.opacity;
    let colorRGB: string = activityLayerGroup.userData.color;
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

    data.senders.forEach((sender: number, senderIdx: number) => {
      // @ts-ignore
      const object: THREE.Mesh = activityLayerGroup.children[sender];
      let value: number;
      if (data.hasOwnProperty(this.graph.records)) {
        value = this.graph.normalize(data[this.graph.records][senderIdx]);
        colorRGB = this.graph.colorRGB(value);
      }
      // @ts-ignore
      object.material.color.set(colorRGB);
      // @ts-ignore
      object.material.opacity = opacity;
      object.scale.set(scale, value !== undefined ? 0.5 : scale, scale);
      object.position.setY(object.userData.position.y);
      if (value !== undefined && !this.graph.config.flatHeight) {
        const height: number = value * size;
        object.position.setY(object.userData.position.y + height / 200);
        if (!this.graph.config.flyingBoxes) {
          object.scale.setY(height);
        }
      }
      // const pos: any = object.userData.position;
      // if (trailIdx == null) {
      //   object.position.setY(pos.y);
      // } else {
      //   object.position.setY(pos.y - ratio / 2);
      // }
    });
  }
}
