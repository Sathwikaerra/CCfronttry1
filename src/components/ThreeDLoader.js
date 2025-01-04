import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const Loader = () => {
  return (
    <mesh>
      {/* Create a torus (donut shape) for the loading effect */}
      <torusGeometry args={[1, 0.2, 16, 100]} />
      <meshStandardMaterial color="lightblue" />
    </mesh>
  );
};

const ThreeDLoader = () => {
  return (
    <Canvas>
      {/* Add lighting for better visibility */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 5]} />
      <Loader />
      {/* Allow user to interact with rotation */}
      <OrbitControls />
    </Canvas>
  );
};

export default ThreeDLoader;
