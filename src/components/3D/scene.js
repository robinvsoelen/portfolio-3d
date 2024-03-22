import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Scene = forwardRef((props, ref) => {
    const [sceneModel, setSceneModel] = useState(null);
  
    useEffect(() => {
        const loader = new GLTFLoader();

        loader.setPath("assets/models/scene/")
    
        loader.load(
            "scene.glb",
            function (gltf) {
                setSceneModel(gltf.scene);
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
                {sceneModel && (
                    <primitive
                        object={sceneModel}
                        position={[0, 0.5, 0]} // Adjust Y position to align with the road surface
                        rotation={[0, - Math.PI / 2, 0]} // Rotate 90 degrees around the y-axis
                        scale={1} // Adjust scale according to the size of your model
                    />
                )}
            </group>
        </>
    );
});

export { Scene };