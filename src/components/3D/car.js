import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Car = forwardRef((props, ref) => {
    const [carModel, setCarModel] = useState(null);
  
    useEffect(() => {
        const loader = new GLTFLoader();
    
        loader.load(
            "assets/models/me/untitled.glb",
            function (gltf) {
                setCarModel(gltf.scene);
            },
            undefined,
            function (error) {
                console.error(error);
            }
        );
    }, []);
  
    return (
        <>
            <group ref={ref}>
                {carModel && (
                    <primitive
                        object={carModel}
                        position={[0, 0.5, 0]} // Adjust Y position to align with the road surface
                        rotation={[0, Math.PI / 2, 0]} // Rotate 90 degrees around the y-axis
                        scale={1} // Adjust scale according to the size of your model
                    />
                )}
            </group>
        </>
    );
});

export { Car };