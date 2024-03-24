import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame, useLoader } from '@react-three/fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import * as THREE from 'three';
import { ResourcePlacer } from '../3D/ResourcePlacer';
import { ModelInteractor } from '../3D/ModelInteractor';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { LUTPass } from 'three/examples/jsm/postprocessing/LUTPass'; // Ensure you have the LUTPass in your three.js examples
import { LUTCubeLoader } from 'three/addons/loaders/LUTCubeLoader.js';
import { ColorCorrectionShader } from 'three/examples/jsm/shaders/ColorCorrectionShader';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

const resources = [
  { 
    name: 'model1', 
    path: 'assets/models/direction sign.glb', 
    userData: { 
      text: 'Go here!!',
      position: { x: -4, y: 1.3, z: -75 },
      scale: { x: 0.1, y: 0.1, z: 0.1 },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 }, // Euler angles in radians
      click: {
        changeDirection: "work",
      }
    } 
  },
  { 
    name: 'UT', 
    path: 'assets/models/UT.glb', 
    userData: { 
      text: 'University of Twente',
      position: { x: -20, y: 0, z: -100 },
      scale: { x: 3, y: 3, z: 3 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 }, // Euler angles in radians
      click: {
        changeDirection: "work",
      }
    } 
  },
];

function ResourceHandler({selectedObjects, setSelectedObjects}) {
  const { scene, camera, gl } = useThree();
  const composerRef = useRef();
  const outlinePassRef = useRef();
  const lutTexture = useLoader(LUTCubeLoader, '/assets/LUTs/Cubicle 99.CUBE'); // Replace with the path to your LUT file
  const lutPassRef = useRef();

  const [isLutLoaded, setIsLutLoaded] = useState(false);

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
  }, [gl]);

  useEffect(() => {
    if (lutTexture) {
      setIsLutLoaded(true);
      console.log("textureloadsed")
    }
  }, [lutTexture]);

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

    // const lutPass = new LUTPass();
    // lutPass.lut = lutTexture; // Use the loaded LUT texture
    // lutPass.intensity = 1; // Set the intensity of the effect
    // composer.addPass(lutPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.4, // bloom strength
      0.4, // bloom radius
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
    colorCorrectionPass.uniforms['powRGB'].value.set(0.8, 1, 0.9); // Replace with your own values
    composer.addPass(colorCorrectionPass);


    // Cleanup
    return () => {
      composer.dispose();
    };
  }, [scene, camera, gl]);

  useEffect(() => {
    const resourcePlacer = new ResourcePlacer(scene, resources);
    resourcePlacer.addResourcesToScene().then(() => {
      console.log('Resources placed in the scene.');
    });

    const updateSelectedObjects = (objects) => {
      setSelectedObjects(objects);
    };

    // Instantiate your ModelInteractor or interaction management class with a callback
    new ModelInteractor(camera, scene, gl, updateSelectedObjects);
  }, [scene, camera, gl]);

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