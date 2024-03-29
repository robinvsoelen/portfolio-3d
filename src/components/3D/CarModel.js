import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Car = forwardRef(({ lightsOn, LoadManager }, ref) => {
    const [carModel, setCarModel] = useState(null);
    const mixerRef = useRef(null); // Ref to hold the animation mixer
    const [animations, setAnimations] = useState([]);

    useEffect(() => {
        const loader = new GLTFLoader(LoadManager);
        loader.setPath("assets/models/car/");
        loader.load("car.glb", (gltf) => {
            setCarModel(gltf.scene);
            mixerRef.current = new THREE.AnimationMixer(gltf.scene);
            setAnimations(gltf.animations);
            const radio = gltf.scene.getObjectByName('car-radio');
            if (radio) radio.visible = false;

            const guitar = gltf.scene.getObjectByName('guitar');
            if (guitar) guitar.visible = false;

            const mixer = new THREE.AnimationMixer(gltf.scene);
            mixerRef.current = mixer;
            setAnimations(gltf.animations);
            gltf.scene.rotation.set(0, Math.PI / 2, 0); // Assuming the initial state is facing along the Y-axis

            // Play the 'idle' animation after ensuring the mixer and animations are set
            const idleAnimation = gltf.animations.find(a => a.name === 'idle');
            if (idleAnimation) {
                const action = mixer.clipAction(idleAnimation);
                action.play();
            }
            playAnimation('idle'); // Make sure this function is defined before you call it
            toggleLights(gltf.scene, lightsOn);
        }, undefined, (error) => console.error(error));
    }, [lightsOn, LoadManager]);

    const playAnimation = (name, loopOnce = false) => {
        const animation = animations.find(a => a.name === name);
        if (animation && mixerRef.current) {
            const action = mixerRef.current.clipAction(animation);
            action.reset().play();
            if (loopOnce) {
                action.setLoop(THREE.LoopOnce, 1);
                action.clampWhenFinished = true;
            }
        }
    };

    useImperativeHandle(ref, () => ({
        get model() {
            return carModel;
        },
        set position({ x, y, z }) {
            if (carModel) {
                carModel.position.set(x, y, z);
            }
        },
        get position() {
            return carModel ? carModel.position : new THREE.Vector3();
        },
        set rotation({ x, y, z }) {
            if (carModel) {
                carModel.rotation.set(x, y, z);
            }
        },
        get rotation() {
            return carModel ? carModel.rotation : new THREE.Euler();
        },
        playAnimation,
        foundRadio: () => {
            const radio = carModel.getObjectByName('car-radio');
            if (radio) {
                radio.visible = true;
                playAnimation('vibing');
            }
        },
        foundGuitar: () => {
            const guitar = carModel.getObjectByName('guitar');
            if (guitar) guitar.visible = true;
        },
        onHonk: () => {
            playAnimation('honk', true);
        }
    }));

    useFrame((_, delta) => mixerRef.current?.update(delta));

    const toggleLights = (object, status) => {
        object.traverse(child => {
            if (child.isLight) child.visible = status;
        });
    };

    return (
        <group ref={ref}>
            {carModel && (
                <primitive object={carModel} position={[0, 0.5, 0]} rotation={[0, -Math.PI / 2, 0]} scale={1} />
            )}
        </group>
    );
});

export { Car };
