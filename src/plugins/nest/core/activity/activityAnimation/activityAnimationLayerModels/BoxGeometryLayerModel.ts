import * as THREE from 'three';

import { ActivityAnimationLayer } from '../activityAnimationLayer';
import { ActivityAnimationLayerModel } from '../activityAnimationLayerModel';

export class BoxGeometryLayerModel extends ActivityAnimationLayerModel {
  constructor(layer: ActivityAnimationLayer) {
    super(layer);
  }

  /**
   * Add graph for box geometry model.
   */
  override addGraph(): void {
    const scale = 0.01;
    const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(
      scale,
      scale,
      scale
    );

    this.layer.state.positions.forEach((position: any) => {
      const material: THREE.MeshBasicMaterial = new THREE.MeshLambertMaterial({
        color: this.layer.activity.recorder.view.color,
        transparent: true,
      });
      const mesh: THREE.Mesh = new THREE.Mesh(geometry, material);
      mesh.userData.position = position;
      mesh.position.set(position.x, position.y, position.z);
      mesh.scale.set(scale, scale, scale);
      mesh.layers.set(this.layer.activity.idx + 1);
      this.graphGroup.add(mesh);
    });
  }

  /**
   * Update mesh object.
   */
  override updateMesh(mesh: THREE.Mesh, options: any = {}): void {
    // @ts-ignore
    mesh.material.color.set(options.color);
    // @ts-ignore
    mesh.material.opacity = options.opacity;
    mesh.scale.set(options.scale, options.scale, options.scale);
    mesh.position.setY(mesh.userData.position.y);
    if (this.layer.config.object.flatHeight) {
      mesh.scale.setY(0.5);
      if (this.layer.config.object.flyingBoxes) {
        mesh.position.setY(options.height * 0.01);
      }
    } else {
      if (this.layer.activity.recorder.model.isAnalogRecorder) {
        mesh.scale.setY(options.height);
      }
      mesh.position.setY(mesh.userData.position.y + options.height / 200);
    }
  }
}
