import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ResourceManager {
  constructor() {
    this.loader = new GLTFLoader();
    this.resources = new Map();
  }

  // Load a single GLB file with userData
  loadGLB(name, path, userData = {}) {
    return new Promise((resolve, reject) => {
      this.loader.load(path, (gltf) => {
        // Assign userData to the root object of the loaded GLB
        gltf.scene.userData = userData;

        // Store the modified glTF asset
        this.resources.set(name, gltf);
        resolve(gltf);
      }, undefined, reject);
    });
  }

  // Get a loaded resource
  get(name) {
    return this.resources.get(name);
  }

  // Load multiple GLB files, each with optional userData
  loadMultipleGLBs(resources) {
    const promises = resources.map(resource => 
      this.loadGLB(resource.name, resource.path, resource.userData)
    );
    return Promise.all(promises);
  }
}
