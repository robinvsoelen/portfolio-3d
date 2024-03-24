// src/components/scenes/MainScene.js
import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useThree, useFrame  } from '@react-three/fiber';
import { Stars, Sky } from '@react-three/drei';
import { Car } from '../3D/car'; // Adjust the import path according to your project structure
import { Scene } from '../3D/scene'; // Adjust the import path according to your project structure
import ResourceHandler from './ResourceHandler'; // Import the ResourceHandler component
import * as THREE from 'three';

const tracks = [
  {
    name: "main",
    cameraMin: -500,
    cameraMax: 10,
    direction: new THREE.Vector3(0, 0, -1),
    rotation: 0 // Moving directly along the Z-axis
  },
  {
    name: "work",
    cameraMin: -160,
    cameraMax: -65,
    direction: new THREE.Vector3(-1, 0, -1).normalize(), // Moving at a 45-degree angle
    rotation: Math.PI / 4 // Moving at a 45-degree angle
  },
];

  let rotationYoffset = 0;

  function CameraController({ currentTrack, setCurrentTrack, directionalLightRef }) {
    const { camera, gl } = useThree();
    const mouse = useRef({ x: 0, y: 0 });
    const positionZ = useRef(0); // Use this ref to track the simulated scroll position
    const currentTrackRef = useRef(currentTrack);


    useEffect(() => {
      if (currentTrack.name !== "main") {
        let offsetZ = 6 * Math.cos(currentTrack.rotation);
        let offsetX = 6 * Math.sin(currentTrack.rotation);
        camera.position.z = currentTrack.cameraMax - offsetZ
        camera.position.x = -offsetX
        positionZ.current = currentTrack.cameraMax - offsetZ
        rotationYoffset =  currentTrack.rotation
        console.log(offsetZ)
      }
      else {
        camera.position.x = 0
        positionZ.current = camera.position.z + 10
        rotationYoffset =  currentTrack.rotation
      }
      currentTrackRef.current = currentTrack;

      console.log(currentTrack.cameraMax)

    }, [currentTrack]); 

    useFrame(({ camera }) => {
      // Example logic to adjust light intensity based on camera's Z position
      if (directionalLightRef.current) {
        const zPosition = camera.position.z*-1 + 10;
        const baseIntensity = 1; // Base intensity of the light
        const intensityFactor = -0.001; // Factor to scale intensity adjustment
        const maxIntensity = 5; // Maximum intensity to clamp to
        // Adjust the intensity. This example decreases intensity as the camera moves further along the Z-axis.
        directionalLightRef.current.intensity = Math.max(Math.min(baseIntensity + (zPosition * intensityFactor  * -1), maxIntensity), 0);
      }
    });
  
    useEffect(() => {
      let frameId = null;
      let speed = 0; // Current speed, updated when scrolling
      const friction = 0.85; // Friction factor, controls how quickly the speed decelerates
    
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
        speed -= delta; // Update speed based on the wheel movement
        if (!frameId) {
          frameId = requestAnimationFrame(updatePosition);
        }
      };
    
      const updatePosition = () => {
        speed *= friction; // Apply friction to speed to simulate deceleration
        positionZ.current -= speed; // Update the camera's position based on the current speed
        positionZ.current = Math.min(Math.max(positionZ.current, currentTrackRef.current.cameraMin), currentTrackRef.current.cameraMax);
        
        if (Math.abs(speed) > 0.001) {
          frameId = requestAnimationFrame(updatePosition);
        } else {
          frameId = null;
        }

        if (positionZ.current  >= currentTrackRef.current.cameraMax && currentTrackRef.current.name != "main")
        {
          setCurrentTrack(tracks[0])
        }
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      gl.domElement.addEventListener('wheel', handleWheel, { passive: true });
    
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        gl.domElement.removeEventListener('wheel', handleWheel);
        if (frameId) {
          cancelAnimationFrame(frameId);
        }
      };
    }, [gl.domElement]);
  
    useFrame(() => {
  // Variables for maximum rotation
  const maxRotationX = Math.PI / 10;
  const maxRotationY = Math.PI / 10;

  // Calculate desired rotation based on mouse position
  const desiredRotationX = -mouse.current.y * maxRotationX - Math.PI / 20;
  // Add Math.PI to desiredRotationY to turn the camera 180 degrees around the Y axis
  const desiredRotationY = (-mouse.current.x * maxRotationY) + Math.PI;

  // Calculate a target position for the camera to look at based on desired rotation
  const lookAtPosition = new THREE.Vector3(
    camera.position.x + Math.sin(desiredRotationY + rotationYoffset), // Adjust for desired Y rotation, including the 180 degree turn
    camera.position.y + Math.sin(desiredRotationX), // Adjust for desired X rotation
    camera.position.z + Math.cos(desiredRotationY + rotationYoffset) // Ensure the camera rotates around itself
  );

  // Make the camera look at the calculated position
  camera.lookAt(lookAtPosition);

  // Handle camera movement along the track
  let distanceToMove = camera.position.z - positionZ.current;
  if (distanceToMove) {
    let movementVector = currentTrack.direction.clone().multiplyScalar(distanceToMove);
    camera.position.add(movementVector);
  }

  camera.position.y = 3; // Keep the camera's height constant
    });

    camera.near = 1;
    camera.far = 100000;  
    camera.updateProjectionMatrix(); // Call this to update the camera after changing its properties

    return null;
  }

  function CarPositionUpdater({ carRef, currentTrack, setUseCarLights }) {
    // Use a ref to keep track of the previous position of the camera
    const prevCameraZRef = useRef(null);
    // Use a ref to store the direction the camera is moving (1 for forward, -1 for backward)
    const cameraDirectionRef = useRef(0);
  
    useEffect(() => {
      // Set initial rotation based on the track's direction
      if (currentTrack.name !== "main") {
        carRef.current.rotation.y = currentTrack.rotation + Math.PI;
      } else {
        carRef.current.rotation.y = 0;
      }
    }, [currentTrack]);
  
    useFrame(({ camera }) => {
      if (carRef.current) {
        let offsetZ = 6 * Math.cos(currentTrack.rotation);
        let offsetX = 6 * Math.sin(currentTrack.rotation);
        carRef.current.position.z = camera.position.z - offsetZ;
        carRef.current.position.x = camera.position.x - offsetX;
  
        if (prevCameraZRef.current !== null) {
          const currentDirection = camera.position.z > prevCameraZRef.current ? 1 : -1;
  
          // If the direction has changed, update the car's rotation to face the new direction
          if (cameraDirectionRef.current !== currentDirection) {
            // Forward movement
            if (currentDirection === 1) {
              // Rotate to match the current track's direction
              carRef.current.rotation.y = currentTrack.rotation;
            } else {
              // Backward movement
              // Rotate to inverse direction (180 degrees from the track's direction)
              carRef.current.rotation.y = currentTrack.rotation + Math.PI;
            }
  
            // Update the camera direction ref to the new direction
            cameraDirectionRef.current = currentDirection;
          }
        }
  
        // Update the previous camera position for the next frame
        prevCameraZRef.current = camera.position.z;
  
        // Toggle car lights based on the camera's Z position
        // if (camera.position.z < -150) setUseCarLights(true);
        // else setUseCarLights(false);
      }
    });
  }


  const ClickHandler = ({ selectedObjects, setSelectedObjects, setCurrentTrack }) => {
    const { gl } = useThree();
  
    useEffect(() => {
      const handleMouseClick = (event) => {
        if (selectedObjects.length === 1) {
          // Logic for handling the single selected object
          if (selectedObjects[0].userData.click.changeDirection){
            setCurrentTrack(() => {
              const foundTrack = tracks.find(track => track.name === selectedObjects[0].userData.click.changeDirection);
              return foundTrack;
            });          
          } 
        }
      };
  
      const canvas = gl.domElement;
      canvas.addEventListener('click', handleMouseClick);
  
      return () => {
        canvas.removeEventListener('click', handleMouseClick);
      };
    }, [selectedObjects]); // Depend on selectedObjects to ensure updated state is used
  
    return null; // This component does not render anything
  };

function MainScene() {
    const carRef = useRef();
    const [useCarLights, setUseCarLights] = useState(true); // Converted to state
    const spotlightRef = useRef();

    const directionalLightRef = useRef(); // Ref for the light

    const [selectedObjects, setSelectedObjects] = useState([]);
    const [currentTrack, setCurrentTrack] = useState(tracks[0]); // Default to the first track

  return (
    <div style={{ height: "100vh" }}>
        <div
        id={"tooltip"}
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            padding: '5px',
            border: '1px solid black',
            pointerEvents: 'none', // Ignore mouse events
            zIndex:'100',
          }}
        >
        </div>

      <Canvas shadows
       gammafactor={2.2} 
       antialias                 
       onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
        }}>

      <ambientLight intensity={0.3} />

      <ClickHandler selectedObjects={selectedObjects} setCurrentTrack={setCurrentTrack} />

        <Sky
          turbidity={10}
          rayleigh={3}
          mieCoefficient={0.005}
          mieDirectionalG={0.7}
          elevation={0}
          azimuth={180}
        />
        <Scene />
        <Car ref={carRef} lightsOn={useCarLights} /> {/*          <Stars /> Include the Car component in your scene */}
        <CameraController spotlightRef={spotlightRef} currentTrack={currentTrack} setCurrentTrack={setCurrentTrack} directionalLightRef={directionalLightRef} /> {/* Include the camera controller in your scene */}
        <CarPositionUpdater carRef={carRef} currentTrack={currentTrack} setCurrentTrack={setCurrentTrack} setUseCarLights={setUseCarLights} />
        <directionalLight
          ref={directionalLightRef}
          castShadow // Enables shadow casting
          position={[0, 100, 0]} // Position of the sun at midday
          intensity={3} // Brightness of the sun
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
      <ResourceHandler selectedObjects={selectedObjects} setSelectedObjects={setSelectedObjects} />

      </Canvas>
    </div>
  );
}

export default MainScene;