
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
        position: { x: -4, y: 1, z: -75 },
        scale: { x: 0.6, y: 0.6, z: 0.6 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 }, 
        click: {
          changeDirection: "cv",
        },
        isInteractable: true,
        hasAnimation: true
      } 
    },
    { 
      name: 'gotoprojects', 
      path: 'assets/models/direction sign.glb', 
      userData: { 
        text: 'View my projects',
        position: { x: 4, y: 1, z: -190 },
        scale: { x: 0.6, y: 0.6, z: 0.6 },
        rotation: { x: Math.PI / 2, y: Math.PI / 2, z:  Math.PI /2} ,
        click: {
          changeDirection: "projects",
        },
        isInteractable: true,
        hasAnimation: true
      } 
    },
    { 
      name: 'gotomusic', 
      path: 'assets/models/direction sign.glb', 
      userData: { 
        text: 'Check out my music',
        position: { x: -4, y: 1, z: -325 },
        scale: { x: 0.6, y: 0.6, z: 0.6 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        click: {
          changeDirection: "music",
        },
        isInteractable: true,
        hasAnimation: true
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
    { 
      name: 'Leia', 
      path: 'assets/models/leia.glb', 
      userData: { 
        text: 'Dimenco / Leia',
        position: { x: -50, y: 0.1, z: -125 },
        scale: { x: 0.7, y: 0.7, z: 0.7 },
        rotation: { x: 0, y: 0, z: 0 }, 
        click: {
          contentBrowser: true,
          articleFilename: "leia.html",
        },
        isInteractable: true,
        hasAnimation: true
      } 
    },
    { 
      name: 'Accenture', 
      path: 'assets/models/accenture.glb', 
      userData: { 
        text: 'Accenture',
        position: { x: -100, y: 1, z: -140 },
        scale: { x: 3, y: 3, z: 3},
        rotation: { x: 0, y: - Math.PI /4 - Math.PI / 2, z: 0 }, 
        click: {
          contentBrowser: true,
          articleFilename: "accenture.html",
        },
        isInteractable: true,
      } 
    },
    { 
      name: 'Soundlab', 
      path: 'assets/models/soundlab.glb', 
      userData: { 
        text: 'Soundlab internship',
        position: { x: -60, y: 4, z: -110 },
        scale: { x: 40, y: 40, z: 40},
        rotation: { x: - Math.PI / 2, y:  Math.PI - Math.PI / 8 , z: 0 }, 
        click: {
          contentBrowser: true,
          articleFilename: "accenture.html",
        },
        isInteractable: true,
      } 
    },
    { 
      name: 'Thesis', 
      path: 'assets/models/thesis.glb', 
      userData: { 
        text: 'Master thesis',
        position: { x: 60, y: 0, z: -260 },
        scale: { x: 5, y: 5, z: 5},
        rotation: { x: 0, y:  0 , z: 0 }, 
        click: {
          contentBrowser: true,
          articleFilename: "thesis.html",
        },
        isInteractable: true,
        hasAnimation: true,
      } 
    },
    { 
      name: 'Radio', 
      path: 'assets/models/radio.glb', 
      userData: { 
        text: 'A radio!',
        position: { x: -60, y: 0.5, z: -390 },
        scale: { x: 0.8, y: 0.8, z: 0.8},
        rotation: { x: 0, y:  0 , z: 0 }, 
        click: {
          isRadio: true,
        },
        isInteractable: true,
        hasAnimation: true,
      } 
    },
  ];