// src/components/scenes/MainScene.js
import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useThree, useFrame  } from '@react-three/fiber';
import { Stars, Sky } from '@react-three/drei';
import { Car } from '../3D/car'; // Adjust the import path according to your project structure
import { Scene } from '../3D/scene'; // Adjust the import path according to your project structure

import * as THREE from 'three';

  function CameraController({ spotlightRef }) {
    const { camera, gl } = useThree();
    const mouse = useRef({ x: 0, y: 0 });
    const positionZ = useRef(0); // Use this ref to track the simulated scroll position
  
    useEffect(() => {
      const handleMouseMove = (event) => {
        const { clientX, clientY } = event;
        const width = window.innerWidth;
        const height = window.innerHeight;
  
        // Convert mouse position to normalized values (-1 to 1)
        const x = (clientX / width) * 2 - 1;
        const y = -(clientY / height) * 2 + 1;
  
        mouse.current = { x, y };
      };
  
      const handleWheel = (event) => {
        const delta = event.deltaY * -0.01; // Adjust the multiplier as needed for sensitivity
        positionZ.current -= delta; // Update the camera's position based on the wheel movement
      };
  
      window.addEventListener('mousemove', handleMouseMove);
      gl.domElement.addEventListener('wheel', handleWheel, { passive: true });
  
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        gl.domElement.removeEventListener('wheel', handleWheel);
      };
    }, [gl.domElement]);
  
    useFrame(() => {

      if (spotlightRef.current) {
        spotlightRef.current.position.copy(camera.position); // Spotlight follows the camera position
        spotlightRef.current.target.position.set(0,0, positionZ.current -10); // Adjust target position if needed
        spotlightRef.current.target.updateMatrixWorld();
      }
      // Adjust camera rotation based on mouse movement
      const maxRotation = Math.PI / 10; // Max rotation angle
      camera.rotation.x = -mouse.current.y * maxRotation - Math.PI / 20;
      camera.rotation.y = -mouse.current.x * maxRotation;
  
      // Adjust camera position based on the simulated "scroll" position
      camera.position.z = positionZ.current;
      camera.position.y = 3;

    });

    camera.near = 1;
    camera.far = 100000;  
    camera.updateProjectionMatrix(); // Call this to update the camera after changing its properties

    return null;
  }

  function CarPositionUpdater({ carRef }) {
    // Use a ref to keep track of the previous position of the camera
    const prevCameraZRef = useRef(null);
    // Use a ref to store the direction the camera is moving (1 for forward, -1 for backward)
    const cameraDirectionRef = useRef(0);
    // Counter to ensure direction change is consistent
    const directionChangeCounterRef = useRef(0);
    // Threshold for how many frames to wait before confirming direction change
    const directionChangeThreshold = 10;
  
    useFrame(({ camera }) => {
      if (carRef.current) {
        carRef.current.position.z = camera.position.z - 6;
  
        if (prevCameraZRef.current !== null) {
          const currentDirection = camera.position.z > prevCameraZRef.current ? 1 : -1;
  
          // Check if the direction has changed from the previous frame
          if (cameraDirectionRef.current !== currentDirection) {
            directionChangeCounterRef.current += 1;
  
            // Confirm the direction change if it has been consistent for enough frames
            if (directionChangeCounterRef.current >= directionChangeThreshold) {
              // Rotate the car by 180 degrees around the y-axis once the direction change is confirmed
              carRef.current.rotation.y += Math.PI;
              // Update the camera direction ref to the new direction
              cameraDirectionRef.current = currentDirection;
              // Reset the counter
              directionChangeCounterRef.current = 0;
            }
          } else {
            // Reset the counter if the direction is consistent with the last known direction
            directionChangeCounterRef.current = 0;
          }
        }
  
        // Update the previous camera position for the next frame
        prevCameraZRef.current = camera.position.z;
      }
    });
  }


function MainScene() {
    const carRef = useRef();
    const spotlightRef = useRef();
  return (
    <div style={{ height: "100vh" }}>
      <Canvas shadows gammafactor={2.2}>
      <ambientLight intensity={0.3} />

        <Sky
          distance={450000}
          exposure={0}
          elevation={90}
        />
        <Scene />
        <Car ref={carRef} lightsOn={true} /> {/*          <Stars /> Include the Car component in your scene */}
        <CameraController spotlightRef={spotlightRef} /> {/* Include the camera controller in your scene */}
        <CarPositionUpdater carRef={carRef} />
        <directionalLight
          castShadow // Enables shadow casting
          position={[0, 100, 0]} // Position of the sun at midday
          intensity={0} // Brightness of the sun
          color={0xffffff} // Color of sunlight at noon
          shadow-mapSize-width={2048} // Width of the shadow map
          shadow-mapSize-height={2048} // Height of the shadow map
          shadow-camera-near={0.5} // Near plane of the shadow camera
          shadow-camera-far={500} // Far plane of the shadow camera
          shadow-camera-left={-100} // Left plane of the shadow camera
          shadow-camera-right={100} // Right plane of the shadow camera
          shadow-camera-top={100} // Top plane of the shadow camera
          shadow-camera-bottom={-100} // Bottom plane of the shadow camera
          shadow-bias={-0.0001} // Reduces shadow acne
      />
      </Canvas>
    </div>
  );
}

export default MainScene;