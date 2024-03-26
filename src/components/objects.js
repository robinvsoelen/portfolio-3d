
export const objects = [
    {
      name: 'mainScene', 
      path: 'assets/models/scene/scene.glb', 
      userData: { 
        text: '',
        position: { x: 0, y: 0.5, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 }, 
        click: {
          changeDirection: "cv",
        },
        isInteractable: false
      }
    },
    { 
      name: 'gotocv', 
      path: 'assets/models/direction sign.glb', 
      userData: { 
        text: 'Go to my CV',
        position: { x: -4, y: 1.3, z: -75 },
        scale: { x: 0.1, y: 0.1, z: 0.1 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 }, 
        click: {
          changeDirection: "cv",
        },
        isInteractable: true
      } 
    },
    { 
      name: 'gotoprojects', 
      path: 'assets/models/direction sign.glb', 
      userData: { 
        text: 'View my projects',
        position: { x: 4, y: 1.3, z: -190 },
        scale: { x: 0.1, y: 0.1, z: 0.1 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 }, 
        click: {
          changeDirection: "projects",
        },
        isInteractable: true
      } 
    },
    { 
      name: 'gotomusic', 
      path: 'assets/models/direction sign.glb', 
      userData: { 
        text: 'Check out my music',
        position: { x: -4, y: 1.3, z: -325 },
        scale: { x: 0.1, y: 0.1, z: 0.1 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        click: {
          changeDirection: "music",
        },
        isInteractable: true
      } 
    },
    { 
      name: 'UT', 
      path: 'assets/models/UT.glb', 
      userData: { 
        text: 'University of Twente',
        position: { x: -20, y: 0, z: -100 },
        scale: { x: 3, y: 3, z: 3 },
        rotation: { x: Math.PI / 2, y: 0, z: 0 }, 
        click: {
          contentBrowser: true,
          articleFilename: "university.html",
        },
        isInteractable: true
      } 
    },
  ];