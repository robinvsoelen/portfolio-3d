import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { LoadingManager, AnimationMixer, Clock } from 'three';

export class ResourceManager {
  constructor(manager = new LoadingManager()) {
    this.manager = manager;
    this.loader = new GLTFLoader(this.manager); // Pass the LoadingManager to the GLTFLoader
    this.resources = new Map();
    this.mixers = []; // To keep track of AnimationMixers if necessary
    this.clock = new Clock(); // Only if you're handling animations within ResourceManager
  }

  loadGLB(name, path, userData = {}) {
    return new Promise((resolve, reject) => {
      this.loader.load(path, (gltf) => {
        // Assign userData to the root object of the loaded GLB
        gltf.scene.userData = userData;
        
        console.log(gltf.animations)
        if (userData.hasAnimation && gltf.animations.length > 0) {
          // Assume the first animation is the one we want to play
          const mixer = new AnimationMixer(gltf.scene);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();

          // Store the mixer to update it on each frame
          this.mixers.push(mixer);
        }

        // Store the modified glTF asset
        this.resources.set(name, gltf);
        resolve(gltf);
      }, undefined, reject);
    });
  }

  update() {
    const delta = this.clock.getDelta();
    for (const mixer of this.mixers) {
      mixer.update(delta);
    }
  }

  // Get a loaded resource
  get(name) {
    console.log(name)
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