import React, { useState, useEffect, forwardRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Car = forwardRef(({ lightsOn }, ref) => {
    const [carModel, setCarModel] = useState(null);

    useEffect(() => {
        const loader = new GLTFLoader();
        loader.setPath("assets/models/car/");

        loader.load(
            "car.glb",
            function (gltf) {
                setCarModel(gltf.scene);
                toggleLights(gltf.scene, lightsOn); // Use the lightsOn prop
            },
            undefined,
            function (error) {
                console.error(error);
            }
        );
    }, [lightsOn]); // Add lightsOn as a dependency

    // Function to toggle lights
    const toggleLights = (object, status) => {
        object.traverse((child) => {
            if (child.isLight) {
                child.visible = status;
            }
        });
    };

    // useEffect to handle lightsOn prop changes
    useEffect(() => {
        if (carModel) {
            toggleLights(carModel, lightsOn);
        }
    }, [lightsOn, carModel]);

    return (
        <group ref={ref}>
            {carModel && (
                <primitive
                    object={carModel}
                    position={[0, 0.5, 0]}
                    rotation={[0, Math.PI / 2, 0]}
                    scale={1}
                />
            )}
        </group>
    );
});

export { Car };
