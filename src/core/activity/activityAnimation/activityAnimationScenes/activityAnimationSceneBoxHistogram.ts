import * as math from 'mathjs';
import * as THREE from 'three';

import { Activity } from '../../activity';
import { ActivityAnimationGraph } from '../activityAnimationGraph';
import { ActivityAnimationScene } from '../activityAnimationScene';

export class ActivityAnimationSceneBoxHistogram extends ActivityAnimationScene {
  constructor(graph: ActivityAnimationGraph) {
    super('box histogram', graph);
  }

  /**
   * Create layer group in update.
   */
  createLayerGroup(layer: any, activity: Activity): THREE.Group {
    // console.log('Create activity layer');
    const layerGroup: THREE.Group = new THREE.Group();
    const activityLayerGroup: THREE.Group = new THREE.Group();

    const scale = 0.01;
    const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(
      scale,
      scale,
      scale
    );

    const bins = this.graph.config.grid.divisions;
    const positions: any[] = this.generatePositions(bins, bins);
    positions.forEach((position: any) => {
      const material: THREE.MeshBasicMaterial = new THREE.MeshLambertMaterial({
        color: layer.color,
        transparent: true,
      });
      const object: THREE.Mesh = new THREE.Mesh(geometry, material);
      object.userData.position = position;
      object.userData.frames = this.graph.createEmptyFrames();
      object.position.set(position.x, 0, position.z);
      object.scale.set(100 / bins, 0, 100 / bins);
      object.layers.set(activity.idx + 1);
      activityLayerGroup.add(object);
    });
    this.updateFrameData(activityLayerGroup, activity);

    layerGroup.add(this.grids(2));
    layerGroup.add(activityLayerGroup);
    return layerGroup;
  }

  /**
   * Generate positions for bins.
   */
  generatePositions(xSize: number = 1, zSize: number = 1): any[] {
    const X: number[] = this.interval(-0.5, 0.5, xSize);
    const Z: number[] = this.interval(-0.5, 0.5, zSize);
    const positions: any[] = [];
    X.forEach((x: number) => {
      Z.forEach((z: number) => {
        positions.push({ x, z });
      });
    });
    return positions;
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
   * update data frame.
   */
  updateFrameData(activityLayerGroup: THREE.Group, activity: Activity): void {
    const events: any = activity.events;
    const eventKeys: string[] = Object.keys(events);
    const sampleRate: number = this.graph.config.frames.sampleRate;

    const bins = this.graph.config.grid.divisions;
    // Push values in data frames
    events.times.forEach((time: number, idx: number) => {
      const data: any = {};
      eventKeys.forEach((eventKey: string) => {
        data[eventKey] = events[eventKey][idx];
      });

      const senderIdx: number = activity.nodeIds.indexOf(data.senders);
      const position: number[] = activity.nodePositions[senderIdx];
      const x: number = Math.floor((position[0] + 0.5) * bins);
      const y: number = Math.floor((position[1] + 0.5) * bins);
      const binIdx: number = x * bins + y;
      // @ts-ignore
      const object: THREE.Mesh = activityLayerGroup.children[binIdx];
      const frameIdx: number = Math.floor(time * sampleRate);
      const frame: any = object.userData.frames[frameIdx - 1];
      frame.data.push(data);
    });
  }

  /**
   * Render scene.
   */
  render(): void {
    if (this.graph.frame) {
      const size = 10;
      const opacity: number = this.graph.config.opacity;
      const trail: any = this.graph.config.trail;
      const grid: number = this.graph.config.grid.divisions;
      this.graph.frame.data.forEach((_: any, idx: number) => {
        // @ts-ignore
        const layerGroup: THREE.Group = this.activityLayers.children[idx];
        // @ts-ignore
        const activityLayerGroup: THREE.Group = layerGroup.children[1];
        activityLayerGroup.children.forEach((object: THREE.Mesh) => {
          const idx: number = this.graph.frameIdx;
          let value: number;
          if (trail.length > 0) {
            const frames: any[] = object.userData.frames.slice(
              idx,
              idx + trail.length
            );
            const values: number[] = frames.map(
              (frame: any) => frame.data.length
            );
            value =
              values.length > 0
                ? math.sum(values) / math.sqrt(trail.length)
                : 0;
          } else {
            value = object.userData.frames[idx].data.length;
          }
          // @ts-ignore
          object.material.opacity = value > 0 ? opacity : 0;
          object.position.setY(0);
          object.scale.setY(1);
          if (!this.graph.config.flatHeight) {
            const height: number = ((value * size) / grid) * 10;
            object.position.setY(height / 100 / 2);
            if (!this.graph.config.flyingBoxes) {
              object.scale.setY(height);
            }
          }
        });
      });
    }
  }
}
