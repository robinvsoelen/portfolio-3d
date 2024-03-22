import { ResourceManager } from './ResourceManager';
import * as THREE from 'three';

export class ResourcePlacer {
  constructor(scene, resources) {
    this.scene = scene;
    this.resourceManager = new ResourceManager();
    this.resources = resources;
  }

  async addResourcesToScene() {
    await this.resourceManager.loadMultipleGLBs(this.resources);
    this.resources.forEach(resource => {
      const model = this.resourceManager.get(resource.name);
      if (model) {
        const { position, scale, rotation, text, click } = resource.userData;

        // Apply position
        model.scene.position.set(position.x, position.y, position.z);

        // Apply scale
        model.scene.scale.set(scale.x, scale.y, scale.z);

        // Apply rotation
        model.scene.rotation.set(rotation.x, rotation.y, rotation.z);

        // Store custom data, like text for hover, in userData
        model.scene.userData.text = text;

        model.scene.userData.click = click;

        this.scene.add(model.scene);
      }
    });
  }
}