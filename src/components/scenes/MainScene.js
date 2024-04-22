import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { Car } from '../3D/CarModel'; 
import CameraController from '../3D/CameraHandler'; 
import ResourceHandler from '../3D/ResourceHandler';
import * as THREE from 'three';
import Taskbar from '../UI/TaskBar';
import { v4 as uuidv4 } from 'uuid';
import { isMobile } from 'react-device-detect';
import LoadingScreen from '../UI/LoadingScreen';

const tracks = [
  {
    name: "main",
    cameraMin: -480,
    cameraMax: 10,
    direction: new THREE.Vector3(0, 0, -1),
    rotation: 0 
  },
  {
    name: "cv",
    cameraMin: -160,
    cameraMax: -65,
    direction: new THREE.Vector3(-1, 0, -1).normalize(), 
    rotation: Math.PI / 4 
  },
  {
    name: "projects",
    cameraMin: -280,
    cameraMax: -180,
    direction: new THREE.Vector3(1, 0, -1).normalize(), 
    rotation: -Math.PI / 4 
  },
  {
    name: "music",
    cameraMin: -410,
    cameraMax: -315,
    direction: new THREE.Vector3(-1, 0, -1).normalize(),
    rotation: Math.PI / 4 
  },
];

function CarPositionUpdater({ carRef, currentTrack, setUseCarLights }) {
  const prevCameraZRef = useRef(null);
  const cameraDirectionRef = useRef(0);

  useEffect(() => {
    // Set initial rotation based on the track's direction
    if (currentTrack.name !== "main") {
      carRef.current.rotation.y = currentTrack.rotation + Math.PI + Math.PI / 2;
    } else {
      carRef.current.rotation.y =  Math.PI / 2;
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

        if (cameraDirectionRef.current !== currentDirection) {
          if (currentDirection === 1) {
            carRef.current.rotation.y = currentTrack.rotation + Math.PI / 2;
          } else {

            carRef.current.rotation.y = currentTrack.rotation + Math.PI * 1.5;
          }

          cameraDirectionRef.current = currentDirection;
        }
      }

      prevCameraZRef.current = camera.position.z;


    }
  });
}

const ClickHandler = ({ selectedObjects, setCurrentTrack, setOpenWindows, openWindows, foundRadio, setFoundRadio, carRef, foundGuitar, setFoundGuitar, foundSurfboard, setFoundSurfboard }) => {
  const { gl } = useThree();

  useEffect(() => {
    const handleMouseClick = (event) => {
      if (selectedObjects.length === 1) {
        if (selectedObjects[0].userData.click.changeDirection) {
          setCurrentTrack(() => {
            const foundTrack = tracks.find(track => track.name === selectedObjects[0].userData.click.changeDirection);
            return foundTrack;
          });
        }
        if (selectedObjects[0].userData.click.contentBrowser) {
          const threshold = isMobile ? 0 : 3;
          let newOpenWindows = [...openWindows];
        
          if (newOpenWindows.length > threshold) {
            newOpenWindows = newOpenWindows.slice(1);
          }
        
          const windowWithId = { ...selectedObjects[0].userData, id: uuidv4() };
          newOpenWindows.push(windowWithId);

          setOpenWindows(newOpenWindows);
        }
        if (selectedObjects[0].userData.click.isRadio && !foundRadio) {
          setFoundRadio(true);
          carRef.current.foundRadio();
        }
        if (selectedObjects[0].userData.click.isGuitar && !foundGuitar) {
          setFoundGuitar(true);
        }
        if (selectedObjects[0].userData.click.isSurfboard && !foundSurfboard) {
          setFoundSurfboard(true);
        }
        if (selectedObjects[0].userData.click.isExternalLink) {
          window.open(selectedObjects[0].userData.click.link, "_blank");
        }


        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
          tooltip.style.display = 'none';
        }
      }
    };


    const canvas = gl.domElement;
    canvas.addEventListener('click', handleMouseClick);

    return () => {
      canvas.removeEventListener('click', handleMouseClick);
    };
  }, [selectedObjects]); 

  return null; 
};

function MainScene() {
  const carRef = useRef();
  const [useCarLights, setUseCarLights] = useState(true); 
  const spotlightRef = useRef();

  const directionalLightRef = useRef(); 

  const [selectedObjects, setSelectedObjects] = useState([]);

  const [currentTrack, setCurrentTrack] = useState(tracks[0]); 

  const [loaded, setLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [openWindows, setOpenWindows] = useState([]);

  const [foundRadio, setFoundRadio] = useState(false);
  const [foundGuitar, setFoundGuitar] = useState(false);
  const [foundSurfboard, setFoundSurfboard] = useState(false);

  const [userReady, setUserReady] = useState(false);


  return (
    <div style={{ height: "100%", position: 'absolute', width: '100%' }}>

      {!userReady && <LoadingScreen loaded={loaded} loadingProgress={loadingProgress} setUserReady={setUserReady} userReady={userReady} />}


      <Canvas shadows
        gammafactor={2.2}
        antialias
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
        }}>

        <ambientLight intensity={0.3} />

        <ClickHandler selectedObjects={selectedObjects} setCurrentTrack={setCurrentTrack} setOpenWindows={setOpenWindows} openWindows={openWindows} foundRadio={foundRadio} setFoundRadio={setFoundRadio} carRef={carRef} foundGuitar={foundGuitar} setFoundGuitar={setFoundGuitar} foundSurfboard={foundSurfboard} setFoundSurfboard={setFoundSurfboard} />

        <Sky
          turbidity={10}
          rayleigh={3}
          mieCoefficient={0.005}
          mieDirectionalG={0.7}
          elevation={0}
          azimuth={180}
        />
        <Car ref={carRef} lightsOn={useCarLights} /> {/*          <Stars /> Include the Car component in your scene */}
        <CameraController tracks={tracks} spotlightRef={spotlightRef} currentTrack={currentTrack} setCurrentTrack={setCurrentTrack} directionalLightRef={directionalLightRef} /> {/* Include the camera controller in your scene */}
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
        <ResourceHandler selectedObjects={selectedObjects} setSelectedObjects={setSelectedObjects} setLoaded={setLoaded} setLoadingProgress={setLoadingProgress} foundRadio={foundRadio} foundGuitar={foundGuitar} foundSurfboard={foundSurfboard} />

      </Canvas>

      {userReady && <Taskbar openWindows={openWindows} setOpenWindows={setOpenWindows} foundRadio={foundRadio} setFoundRadio={setFoundRadio} carRef={carRef} foundGuitar={foundGuitar} foundSurfboard={foundSurfboard} />}


    </div>
  );
}

export default MainScene;