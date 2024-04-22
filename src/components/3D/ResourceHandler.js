import React, { useRef, useEffect, useState, useMemo  } from 'react';
import { useThree, useFrame} from '@react-three/fiber';
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
import {objects} from '../objects'


function ResourceHandler({selectedObjects, setSelectedObjects, setLoaded, setLoadingProgress, foundRadio, foundGuitar, foundSurfboard}) {
  const { scene, camera, gl } = useThree();
  scene.fog = new THREE.FogExp2(0xaaaaaa, 0.001);

  const composerRef = useRef();
  const outlinePassRef = useRef();

  const [selectionTimer, setSelectionTimer] = useState(null);
  const deselectTime = 1000; 

  const modelInteractor = useRef(null);
  const resourcePlacer = useRef(null);

  const removeObjectByName = (name) => {
    const selectedObject = scene.getObjectByName(name);

    if (selectedObject) {
      scene.remove(selectedObject);
    }
  };

  useEffect(() => {
    if (foundRadio) removeObjectByName('Radio')
  }, [foundRadio]);

  useEffect(() => {
    if (foundGuitar) removeObjectByName('Guitarr')
  }, [foundGuitar]);

  useEffect(() => {
    if (foundSurfboard) removeObjectByName('surfboard')
  }, [foundSurfboard]);


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
    afterimagePass.uniforms['damp'] = { value: 0.3 };
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
    resourcePlacer.current = new ResourcePlacer(scene, objects, manager);
    resourcePlacer.current.addResourcesToScene().then(() => {
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

    if (modelInteractor.current){
      resourcePlacer.current.resourceManager.update();

    }

  }, 1);


  function checkIfObjectStillSelected(selectedObject) {
    if (modelInteractor.current && selectedObject) {
         return modelInteractor.current.isObjectStillSelected(selectedObject);
    }
  }

  return null
}

export default ResourceHandler;