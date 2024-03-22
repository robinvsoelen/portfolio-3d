import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import * as THREE from 'three';
import { ResourcePlacer } from '../3D/ResourcePlacer';
import { ModelInteractor } from '../3D/ModelInteractor';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

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
];

function ResourceHandler({selectedObjects, setSelectedObjects}) {
  const { scene, camera, gl } = useThree();
  const composerRef = useRef();
  const outlinePassRef = useRef();

  useEffect(() => {
    // Setup composer and passes
    const composer = new EffectComposer(gl);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    // Configure outline parameters
    outlinePass.edgeStrength = 3;
    outlinePass.edgeGlow = 0.7;
    outlinePass.edgeThickness = 2.8;
    outlinePass.pulsePeriod = 0;
    outlinePass.usePatternTexture = false;
    outlinePass.visibleEdgeColor.set('#ffffff');
    outlinePass.hiddenEdgeColor.set('#190a05');

    composer.addPass(outlinePass);

    composerRef.current = composer;
    outlinePassRef.current = outlinePass;

    const outputPass = new OutputPass();
    composer.addPass( outputPass );

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