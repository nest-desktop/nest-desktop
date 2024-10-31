// sphereGeometryLayerModel.ts

import { Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from "three";

import { ActivityAnimationLayer } from "../activityAnimationLayer";
import { ActivityAnimationLayerModel } from "../activityAnimationLayerModel";

export class SphereGeometryLayerModel extends ActivityAnimationLayerModel {
  constructor(layer: ActivityAnimationLayer) {
    super(layer);
  }

  /**
   * Add graph for sphere geometry model.
   */
  override addGraph(): void {
    const scale = 0.01;
    const geometry: SphereGeometry = new SphereGeometry(scale / 2);

    this.layer.state.positions.forEach((position: Vector3) => {
      const material: MeshBasicMaterial = new MeshBasicMaterial({
        color: this.layer.activity.recorder.view.color,
        transparent: true,
      });
      const mesh: Mesh<any, MeshBasicMaterial, any> = new Mesh(
        geometry,
        material
      );
      mesh.userData.position = position;
      mesh.position.set(position.x, position.y, position.z);
      mesh.scale.set(scale, scale, scale);
      mesh.layers.set(this.layer.activity.idx + 1);

      if (this.graphGroup) {
        this.graphGroup.add(mesh);
      }
    });
  }
}
