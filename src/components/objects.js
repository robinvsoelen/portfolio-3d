
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
          articleFilename: "soundlab.html",
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
      } 
    },
    { 
      name: 'Guitarr', 
      path: 'assets/models/guitar.glb', 
      userData: { 
        text: 'A guitar!',
        position: { x: 5, y: 0.5, z: -90 },
        scale: { x: 0.5, y: 0.5, z: 0.5},
        rotation: { x: 0, y:  -Math.PI / 4 , z: 0 }, 
        click: {
          isGuitar: true,
        },
        isInteractable: true,
      } 
    },
    { 
      name: 'Instagram', 
      path: 'assets/models/instagram.glb', 
      userData: { 
        text: 'Instagram',
        position: { x: 3.5, y: 0.5, z: -500 },
        scale: { x: 50, y: 50, z: 50},
        rotation: { x: Math.PI / 2, y:  0 , z: 0 }, 
        click: {
          isExternalLink: true,
          link: 'https://www.instagram.com/robovs.music/',
        },
        isInteractable: true,
      } 
    },
    { 
      name: 'LinkedIn', 
      path: 'assets/models/linkedin.glb', 
      userData: { 
        text: 'LinkedIn',
        position: { x: -1.5, y: 0.5, z: -500 },
        scale: { x: 500, y: 500, z: 500},
        rotation: { x: Math.PI / 2, y:  0 , z: 0 }, 
        click: {
          isExternalLink: true,
          link: 'https://www.linkedin.com/in/robin-van-soelen-08332274/',
        },
        isInteractable: true,
      } 
    },
    { 
      name: 'Spotify', 
      path: 'assets/models/spotify.glb', 
      userData: { 
        text: 'Spotify',
        position: { x: -6.5, y: 4, z: -500 },
        scale: { x: 500, y: 500, z: 500},
        rotation: { x: Math.PI / 2, y:  0 , z: 0 }, 
        click: {
          isExternalLink: true,
          link: 'https://open.spotify.com/artist/516xhWaAHvGv7PWbhCzkEW',
        },
        isInteractable: true,
      } 
    },
    { 
      name: 'Website car', 
      path: 'assets/models/website car.glb', 
      userData: { 
        text: 'This website!',
        position: { x: 40, y: 1, z: -235 },
        scale: { x: 2, y: 2, z: 2},
        rotation: { x: 0, y:  Math.PI /2 , z: 0 }, 
        click: {
          contentBrowser: true,
          articleFilename: "website.html",
        },
        isInteractable: true,
        hasAnimation: true,
        animationName: 'waving'
      } 
    },
    { 
      name: 'Loading', 
      path: 'assets/models/loading.glb', 
      userData: { 
        text: 'Loading...',
        position: { x: -60, y: 0.5, z: -360 },
        scale: { x: 0.8, y: 0.8, z: 0.8},
        rotation: { x: Math.PI /2, y:  0, z: -Math.PI / 4  }, 
        click: {
          contentBrowser: true,
          articleFilename: "loading.html",
        },
        isInteractable: true,
        hasAnimation: true,
      } 
    },
    { 
      name: 'robovs', 
      path: 'assets/models/robovs.glb', 
      userData: { 
        text: 'robovs',
        position: { x: -30, y: 0, z: -365 },
        scale: { x: 0.5, y: 0.5, z: 0.5},
        rotation: { x: 0, y:  -Math.PI / 2, z: 0  }, 
        click: {
          contentBrowser: true,
          articleFilename: "robovs.html",
        },
        isInteractable: true,
      } 
    },
    { 
      name: 'blandaband', 
      path: 'assets/models/blandaband.glb', 
      userData: { 
        text: 'BlandaBand',
        position: { x: 80, y: 1.5, z: -245 },
        scale: { x: 1, y: 1, z: 1},
        rotation: { x: 0, y:  Math.PI  , z: 0 }, 
        click: {
          contentBrowser: true,
          articleFilename: "blandaband.html",
        },
        isInteractable: true,
      } 
    },
    { 
      name: 'surfboard', 
      path: 'assets/models/surf.glb', 
      userData: { 
        text: 'A surfboard!',
        position: { x: -5, y: 0, z: -200 },
        scale: { x: 1, y: 1, z: 1},
        rotation: { x: 0, y:  Math.PI  , z: 0 }, 
        click: {
          isSurfboard: true,
        },
        isInteractable: true,
      } 
    },
    { 
      name: 'ai', 
      path: 'assets/models/ai.glb', 
      userData: { 
        text: 'AI',
        position: { x: 40, y: 0, z: -210 },
        scale: { x: 4, y: 4, z: 4},
        rotation: { x: 0, y:  - Math.PI / 2 , z: 0 }, 
        click: {
          contentBrowser: true,
          articleFilename: "ai.html",
        },
        isInteractable: true,
        hasAnimation: true
      } 
    },
    { 
      name: 'artworkCreator', 
      path: 'assets/models/artworkCreator.glb', 
      userData: { 
        text: 'Create some art!',
        position: { x: -10, y: 0, z: -410 },
        scale: { x: 4, y: 4, z: 4},
        rotation: { x: 0, y:   Math.PI / 4 , z: 0 }, 
        click: {
          contentBrowser: true,
          isArtworkCreator: true,
        },
        isInteractable: true,
        hasAnimation: true
      } 
    },
    { 
      name: 'artworkShower', 
      path: 'assets/models/bulletin.glb', 
      userData: { 
        text: 'Look at some art!',
        position: { x: 7, y: 0, z: -410 },
        scale: { x: 2, y: 2, z: 2},
        rotation: { x: 0, y:   -Math.PI / 4 , z: 0 }, 
        click: {
          contentBrowser: true,
          isArtworkShower: true,
        },
        isInteractable: true,
        hasAnimation: true
      } 
    },
  ];