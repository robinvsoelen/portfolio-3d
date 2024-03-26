
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
      
        // object's position in world space
        obj.updateWorldMatrix(true, false);
        obj.getWorldPosition(vector);
      
        // convert to normalized device coordinate (NDC) space
        vector.project(camera);
      
        // convert to screen space
        vector.x = Math.round((0.5 + vector.x / 2) * (window.innerWidth / window.devicePixelRatio));
        vector.y = Math.round((0.5 - vector.y / 2) * (window.innerHeight / window.devicePixelRatio));
      
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
                this.onSelectedObjectsChange(this.selectedObjects); // Clear selected objects
                this.hideTooltip(); // Hide the tooltip if no objects are selected
                this.domElement.style.cursor = 'default';

            }
        }
    
    updateTooltip(text, position) {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.style.display = 'block';
            tooltip.innerText = text;
        }
    }
    
    hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }
  }