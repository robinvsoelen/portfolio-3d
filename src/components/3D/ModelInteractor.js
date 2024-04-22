
import * as THREE from 'three';

export class ModelInteractor {
  constructor(camera, scene, gl, onSelectedObjectsChange) {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.camera = camera;
    this.scene = scene;
    this.domElement = gl.domElement;
    this.onSelectedObjectsChange = onSelectedObjectsChange; // Callback function

    this.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.selectedObjects = [];
  }

  onMouseMove(event) {
    event.preventDefault();

    this.mouse.x = (event.clientX / this.domElement.clientWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / this.domElement.clientHeight) * 2 + 1;

    this.checkIntersections();
  }

  toScreenPosition(obj, camera) {
    const vector = new THREE.Vector3();

    // Object's position in world space
    obj.updateWorldMatrix(true, false);
    obj.getWorldPosition(vector);

    // Convert to normalized device coordinate (NDC) space
    vector.project(camera);

    // Convert to screen space, taking the size of the canvas into account directly
    vector.x = Math.round((vector.x + 1) / 2 * this.domElement.clientWidth);
    vector.y = Math.round((-vector.y + 1) / 2 * this.domElement.clientHeight);

    // Adjusting position to consider the actual size and position of the canvas on the screen
    const rect = this.domElement.getBoundingClientRect();
    vector.x += rect.left;
    vector.y += rect.top;

    return { x: vector.x, y: vector.y };
}

  checkIntersections() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    let foundIntersection = false
    if (intersects.length > 0) {
      let object = intersects[0].object;
      // Find the parent with userData.text, if necessary
      while (object && !object.userData.text) {
        object = object.parent;
      }

      if (object && object.userData.text && object.userData.isInteractable) {
        // Use the callback to update the selected objects in React's state
        this.selectedObjects = [object];
        this.onSelectedObjectsChange(this.selectedObjects); // Notify React component

        // Update the tooltip
        this.updateTooltip(object.userData.text, this.toScreenPosition(object, this.camera));
        foundIntersection = true
        this.domElement.style.cursor = 'pointer';

      }
    }
    if (this.selectedObjects.length > 0 && !foundIntersection) {
      this.selectedObjects = [];
      this.onSelectedObjectsChange(this.selectedObjects); 
      this.hideTooltip(); 
      this.domElement.style.cursor = 'default';
    }
  }

  isObjectStillSelected(object) {
    return this.selectedObjects.includes(object);
}

  updateTooltip(text, position) {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
      tooltip.style.display = 'block';
      tooltip.innerText = text;
      tooltip.style.left = position.x + 'px'; 
      tooltip.style.top = position.y + 'px';
    }
  }

  hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  }
}