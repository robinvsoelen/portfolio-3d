import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isMobile, isTablet } from 'react-device-detect';

let rotationYoffset = 0;

export default function CameraController({ currentTrack, setCurrentTrack, directionalLightRef, tracks }) {
  const { camera, gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const positionZ = useRef(0); 
  const currentTrackRef = useRef(currentTrack);

  const rotationY = useRef(0);
  const touchStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isMobile || isTablet)
    {
        const baseRotation = currentTrack.rotation;
        rotationY.current = baseRotation;
        camera.rotation.y = baseRotation;    
    }
    else 
    {
        camera.rotation.y = Math.PI - currentTrack.rotation
        rotationYoffset = currentTrack.rotation
    }
    if (currentTrack.name !== "main") {
      let offsetZ = 6 * Math.cos(currentTrack.rotation);
      let offsetX = 6 * Math.sin(currentTrack.rotation);
      camera.position.z = currentTrack.cameraMax - offsetZ;
      camera.position.x = -offsetX;
      positionZ.current = currentTrack.cameraMax - offsetZ;
    } else {
      camera.position.x = 0;
      positionZ.current = Math.min(camera.position.z + 10, 10);
    }
  
    currentTrackRef.current = currentTrack;
  }, [currentTrack, camera]);

  useFrame(({ camera }) => {
    if (directionalLightRef.current) {
      const zPosition = camera.position.z * -1 + 10;
      const baseIntensity = 1; 
      const intensityFactor = -0.001; 
      const maxIntensity = 5; 
      directionalLightRef.current.intensity = Math.max(Math.min(baseIntensity + (zPosition * intensityFactor * -1), maxIntensity), 0);
    }
  });

  useEffect(() => {
    let frameId = null;
    let speed = 0; 
    const friction = 0.9; 
    const handleTouchStart = (event) => {
      if (event.touches.length > 0) {
        const { clientX, clientY } = event.touches[0];
        touchStart.current = { x: clientX, y: clientY };
      }
    };

    const updatePosition = () => {
      speed *= friction; 
      positionZ.current -= speed; 
      positionZ.current = Math.min(Math.max(positionZ.current, currentTrackRef.current.cameraMin), currentTrackRef.current.cameraMax);

      if (Math.abs(speed) > 0.001) {
        frameId = requestAnimationFrame(updatePosition);
      } else {
        frameId = null;
      }

      if (positionZ.current >= currentTrackRef.current.cameraMax && currentTrackRef.current.name != "main") {
        setCurrentTrack(tracks[0])
      }
    };

    const handleTouchMove = (event) => {
      if (event.touches.length > 0) {
        const { clientX, clientY } = event.touches[0];
        let deltaX = touchStart.current.x - clientX;
        let deltaY = touchStart.current.y - clientY;

        if (Math.abs(deltaX) < Math.abs(deltaY)) deltaX = 0;
        if (Math.abs(deltaY) < Math.abs(deltaX)) deltaY = 0;

        if (isMobile || isTablet) {
          rotationY.current -= deltaX * 0.01;
        }

        touchStart.current = { x: clientX, y: clientY };

        speed -= (deltaY * 0.03); 
        if (!frameId) {
          frameId = requestAnimationFrame(updatePosition);
        }
      }
    };

    if (isMobile || isTablet) {
      gl.domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
      gl.domElement.addEventListener('touchmove', handleTouchMove, { passive: true });
    }

    return () => {
      if (isMobile || isTablet) {
        gl.domElement.removeEventListener('touchstart', handleTouchStart);
        gl.domElement.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [gl.domElement]);

  useEffect(() => {
    let frameId = null;
    let speed = 0;
    const friction = 0.85; 

    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const width = window.innerWidth;
      const height = window.innerHeight;

      const x = (clientX / width) * 2 - 1;
      const y = -(clientY / height) * 2 + 1;

      mouse.current = { x, y };
    };

    const handleWheel = (event) => {
      const delta = event.deltaY * -0.01; 
      speed -= delta; 
      if (!frameId) {
        frameId = requestAnimationFrame(updatePosition);
      }
    };

    const updatePosition = () => {
      speed *= friction; 
      positionZ.current += speed; 
      positionZ.current = Math.min(Math.max(positionZ.current, currentTrackRef.current.cameraMin), currentTrackRef.current.cameraMax);

      if (Math.abs(speed) > 0.001) {
        frameId = requestAnimationFrame(updatePosition);
      } else {
        frameId = null;
      }

      if (positionZ.current >= currentTrackRef.current.cameraMax && currentTrackRef.current.name != "main") {
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
    let desiredRotationX = 0
    let desiredRotationY = 0

    const maxRotationX = Math.PI / 30;
    const maxRotationY = Math.PI / 10;

    if (isMobile || isTablet) {
      desiredRotationY = camera.rotation.y + (rotationY.current * 0.02) + Math.PI;
      desiredRotationY = Math.max(Math.min(desiredRotationY, maxRotationY + Math.PI + currentTrack.rotation), -maxRotationY + Math.PI  + currentTrack.rotation)
      rotationY.current *= 0.9; 
    } else {
      desiredRotationX = -mouse.current.y * maxRotationX - Math.PI / 20;
      desiredRotationY = (-mouse.current.x * maxRotationY) + Math.PI;
    }

    const lookAtPosition = new THREE.Vector3(
      camera.position.x + Math.sin(desiredRotationY + rotationYoffset), 
      camera.position.y + Math.sin(desiredRotationX),
      camera.position.z + Math.cos(desiredRotationY + rotationYoffset) 
    );
    camera.lookAt(lookAtPosition);

    let distanceToMove = camera.position.z - positionZ.current;
    if (distanceToMove) {
      let movementVector = currentTrack.direction.clone().multiplyScalar(distanceToMove);
      camera.position.add(movementVector);
    }

    camera.position.y = 3; 
  });

  camera.near = 1;
  camera.far = 100000;
  camera.updateProjectionMatrix(); 

  return null;
}
