import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame, useLoader } from '@react-three/fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import * as THREE from 'three';
import { ResourcePlacer } from './ResourcePlacer';
import { ModelInteractor } from './ModelInteractor';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { LUTPass } from 'three/examples/jsm/postprocessing/LUTPass'; // Ensure you have the LUTPass in your three.js examples
import { LUTCubeLoader } from 'three/addons/loaders/LUTCubeLoader.js';
import { ColorCorrectionShader } from 'three/examples/jsm/shaders/ColorCorrectionShader';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';


const resources = [
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
        content: "blablabla very nice article",
      },
      isInteractable: true
    } 
  },
];

function ResourceHandler({selectedObjects, setSelectedObjects, setLoaded, setLoadingProgress}) {
  const { scene, camera, gl } = useThree();
  const composerRef = useRef();
  const outlinePassRef = useRef();

  const [selectionTimer, setSelectionTimer] = useState(null);
  const deselectTime = 1000; 

  const modelInteractor = useRef(null);


  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
  }, [gl]);

  useEffect(() => {
    // Clear existing timer when selectedObjects updates
    if (selectionTimer) {
      clearTimeout(selectionTimer);
    }

    // Start a new timer whenever selectedObjects is updated
    const timer = setTimeout(() => {
      // Deselect objects after the timer expires
      setSelectedObjects([]);
      modelInteractor.current.hideTooltip();
    }, deselectTime);

    // Update the timer state
    setSelectionTimer(timer);

    // Cleanup function to clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [selectedObjects, setSelectedObjects, deselectTime]);

  useEffect(() => {
    
    // Setup composer and passes
    const composer = new EffectComposer(gl);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    // Configure outline parameters
    outlinePass.edgeStrength = 3;
    outlinePass.edgeGlow = 0.7;
    outlinePass.edgeThickness = 5;
    outlinePass.pulsePeriod = 0;
    outlinePass.usePatternTexture = false;
    outlinePass.visibleEdgeColor.set('#f2903f');
    outlinePass.hiddenEdgeColor.set('#190a05');

    composer.addPass(outlinePass);

    const afterimagePass = new AfterimagePass();
    afterimagePass.uniforms['damp'] = { value: 0.5 };
    composer.addPass(afterimagePass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.4, // bloom strength
      0.2, // bloom radius
      0.85 // bloom threshold
    );

    composer.addPass(bloomPass);
    composerRef.current = composer;
    outlinePassRef.current = outlinePass;

    const smaaPass = new SMAAPass(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
    composer.addPass(smaaPass);

    const outputPass = new OutputPass();
    composer.addPass( outputPass );

    const vignettePass = new ShaderPass(VignetteShader);
    vignettePass.uniforms['offset'].value = 0.95;
    vignettePass.uniforms['darkness'].value = 1.3;
    composer.addPass(vignettePass);

    const colorCorrectionPass = new ShaderPass(ColorCorrectionShader);
    colorCorrectionPass.uniforms['powRGB'].value.set(0.7, 1, 0.8); // Replace with your own values
    composer.addPass(colorCorrectionPass);

    // Cleanup
    return () => {
      composer.dispose();
    };
  }, [scene, camera, gl]);

  useEffect(() => {
    // Create an instance of LoadingManager
    const manager = new THREE.LoadingManager();
  
    // Set up the loading manager's onLoad, onProgress, and onError callbacks
    manager.onStart = (url, itemsLoaded, itemsTotal) => {
      setLoadingProgress(0); // Reset progress on start
    };
  
    manager.onLoad = () => {
      setLoadingProgress(100); // Set progress to 100% when everything is loaded
      setLoaded(true); // Indicate that loading is complete
      console.log('All resources loaded');
    };
  
    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = (itemsLoaded / itemsTotal) * 100;
      setLoadingProgress(progress);
      console.log('Loading progress:', progress);
    };
  
    manager.onError = (url) => {
      console.log('There was an error loading ' + url);
    };
  
    // Pass this manager to your loaders
    const resourcePlacer = new ResourcePlacer(scene, resources, manager);
    resourcePlacer.addResourcesToScene().then(() => {
      console.log('Resources placed in the scene.');
    });
  
    const updateSelectedObjects = (objects) => {
      setSelectedObjects(objects);
    };
  
    // Make sure your ModelInteractor and ResourcePlacer properly use the manager
    modelInteractor.current = new ModelInteractor(camera, scene, gl, updateSelectedObjects, manager);
  }, [scene, camera, gl, setSelectedObjects]);

  // Update selected objects for the outline effect dynamically
  useEffect(() => {
    if (outlinePassRef.current) {
      outlinePassRef.current.selectedObjects = selectedObjects;
    }
  }, [selectedObjects]);

  useFrame(() => {
    if (composerRef.current) {
      composerRef.current.render();
    }
  }, 1);

  return null;
}

export default ResourceHandler;