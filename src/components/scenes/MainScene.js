// src/components/scenes/MainScene.js
import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Stars, Sky } from '@react-three/drei';
import { Car } from '../3D/CarModel'; // Adjust the import path according to your project structure
import CameraController from '../3D/CameraHandler'; // Adjust the import path according to your project structure
import ResourceHandler from '../3D/ResourceHandler'; // Import the ResourceHandler component
import * as THREE from 'three';
import '../styles.css'
import MainContentBrowser from '../UI/MainContentBrowser';

const tracks = [
  {
    name: "main",
    cameraMin: -480,
    cameraMax: 10,
    direction: new THREE.Vector3(0, 0, -1),
    rotation: 0 // Moving directly along the Z-axis
  },
  {
    name: "cv",
    cameraMin: -160,
    cameraMax: -65,
    direction: new THREE.Vector3(-1, 0, -1).normalize(), // Moving at a 45-degree angle
    rotation: Math.PI / 4 // Moving at a 45-degree angle
  },
  {
    name: "projects",
    cameraMin: -280,
    cameraMax: -180,
    direction: new THREE.Vector3(1, 0, -1).normalize(), // Moving at a 45-degree angle
    rotation: -Math.PI / 4 // Moving at a 45-degree angle
  },
  {
    name: "music",
    cameraMin: -410,
    cameraMax: -315,
    direction: new THREE.Vector3(-1, 0, -1).normalize(), // Moving at a 45-degree angle
    rotation: Math.PI / 4 // Moving at a 45-degree angle
  },
];

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



const ClickHandler = ({ selectedObjects, setSelectedObjects, setCurrentTrack, setShowContent, setSelectedContent }) => {
  const { gl } = useThree();

  useEffect(() => {
    const handleMouseClick = (event) => {
      if (selectedObjects.length === 1) {
        // Logic for handling the single selected object
        if (selectedObjects[0].userData.click.changeDirection) {
          setCurrentTrack(() => {
            const foundTrack = tracks.find(track => track.name === selectedObjects[0].userData.click.changeDirection);
            return foundTrack;
          });
        }
        if (selectedObjects[0].userData.click.contentBrowser) {
          setShowContent(true);
          setSelectedContent(selectedObjects[0].userData)
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

  const [showContent, setShowContent] = useState(false);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [selectedContent, setSelectedContent] = useState([]);

  const [currentTrack, setCurrentTrack] = useState(tracks[0]); // Default to the first track


  const [loaded, setLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  return (
    <div style={{ height: "100vh", position: 'relative' }}>
      <div id={"tooltip"} ></div>

      {!loaded && (
        <div className={`LoadingContainer ${loaded ? 'fadeOut' : ''}`}>
          <div className='MyName'>
            Robin van Soelen
          </div>
          <div className="lds-dual-ring">
            <div className='LoadingText'>{loadingProgress.toFixed(0)}%</div>
          </div>
        </div>
      )}

      {showContent &&
        <MainContentBrowser title={selectedContent.text} setShowContent={setShowContent}>
          {selectedContent.click.content}
        </MainContentBrowser>}

      <Canvas shadows
        gammafactor={2.2}
        antialias
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
        }}>

        <ambientLight intensity={0.3} />

        <ClickHandler selectedObjects={selectedObjects} setCurrentTrack={setCurrentTrack} setShowContent={setShowContent} setSelectedContent={setSelectedContent}/>

        <Sky
          turbidity={10}
          rayleigh={3}
          mieCoefficient={0.005}
          mieDirectionalG={0.7}
          elevation={0}
          azimuth={180}
        />
        <Car ref={carRef} lightsOn={useCarLights} /> {/*          <Stars /> Include the Car component in your scene */}
        <CameraController tracks={tracks} spotlightRef={spotlightRef} currentTrack={currentTrack} setCurrentTrack={setCurrentTrack} directionalLightRef={directionalLightRef} showContent={showContent} /> {/* Include the camera controller in your scene */}
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
        <ResourceHandler selectedObjects={selectedObjects} setSelectedObjects={setSelectedObjects} setLoaded={setLoaded} setLoadingProgress={setLoadingProgress} />

      </Canvas>


    </div>
  );
}

export default MainScene;