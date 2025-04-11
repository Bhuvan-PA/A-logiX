import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PresentationControls } from '@react-three/drei';
import { cn } from '@/lib/utils';

// Simple spinning mesh component
const SpinningMesh = ({ color = '#4158D0', position = [0, 0, 0], scale = 1, speed = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2 * speed;
      meshRef.current.rotation.y += delta * 0.4 * speed;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
    </mesh>
  );
};

// Fancy shape component
const FancyShape = ({ color = '#C850C0', position = [0, 0, 0], scale = 1, speed = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3 * speed;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <torusKnotGeometry args={[0.8, 0.25, 128, 64]} />
      <meshPhysicalMaterial 
        color={color} 
        roughness={0.1} 
        metalness={0.8}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
};

// Health Icon component (abstract representation)
const HealthIcon = ({ color = '#4158D0', position = [0, 0, 0], scale = 1, speed = 1 }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2 * speed;
    }
  });
  
  return (
    <group ref={meshRef} position={position} scale={scale}>
      {/* Cross shape */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 1.5, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.5, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
      </mesh>
      
      {/* Circle around the cross */}
      <mesh position={[0, 0, -0.1]}>
        <torusGeometry args={[1.2, 0.2, 16, 32]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
};

// Water Glass component
const WaterGlass = ({ fillLevel = 0.6, position = [0, 0, 0], scale = 1, speed = 1 }) => {
  const glassMeshRef = useRef<THREE.Mesh>(null);
  const waterMeshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (glassMeshRef.current) {
      glassMeshRef.current.rotation.y += delta * 0.2 * speed;
    }
    if (waterMeshRef.current) {
      // Make the water wobble slightly
      waterMeshRef.current.position.y = -0.5 + (fillLevel * 1) + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });
  
  return (
    <group position={position} scale={scale}>
      {/* Glass */}
      <mesh ref={glassMeshRef}>
        <cylinderGeometry args={[0.8, 0.6, 2, 32, 1, true]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transparent={true} 
          opacity={0.2} 
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Bottom of the glass */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.1, 32]} />
        <meshStandardMaterial color="#ffffff" transparent={true} opacity={0.3} />
      </mesh>
      
      {/* Water */}
      <mesh ref={waterMeshRef} position={[0, -0.5 + (fillLevel * 1), 0]}>
        <cylinderGeometry args={[0.79, 0.59, fillLevel * 2, 32]} />
        <meshPhysicalMaterial 
          color="#4fc3f7" 
          transparent={true} 
          opacity={0.7}
          roughness={0}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

// Scene container with different model types
interface ThreeSceneProps {
  className?: string;
  modelType?: 'sphere' | 'fancy' | 'health' | 'water';
  modelColor?: string;
  modelScale?: number;
  rotationSpeed?: number;
  waterFillLevel?: number;
  autoRotate?: boolean;
  enableZoom?: boolean;
  ambientLightIntensity?: number;
  backgroundColor?: string;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({
  className,
  modelType = 'sphere',
  modelColor = '#4158D0',
  modelScale = 1,
  rotationSpeed = 1,
  waterFillLevel = 0.6,
  autoRotate = true,
  enableZoom = false,
  ambientLightIntensity = 0.5,
  backgroundColor = 'transparent'
}) => {
  return (
    <div className={cn("w-full h-full min-h-[200px]", className)}>
      <Canvas
        style={{ background: backgroundColor }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <ambientLight intensity={ambientLightIntensity} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 300 }}
        >
          {modelType === 'sphere' && (
            <SpinningMesh 
              color={modelColor} 
              scale={modelScale} 
              speed={rotationSpeed} 
            />
          )}
          
          {modelType === 'fancy' && (
            <FancyShape
              color={modelColor}
              scale={modelScale}
              speed={rotationSpeed}
            />
          )}
          
          {modelType === 'health' && (
            <HealthIcon
              color={modelColor}
              scale={modelScale}
              speed={rotationSpeed}
            />
          )}
          
          {modelType === 'water' && (
            <WaterGlass
              fillLevel={waterFillLevel}
              scale={modelScale}
              speed={rotationSpeed}
            />
          )}
        </PresentationControls>
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={enableZoom} 
          autoRotate={autoRotate}
          autoRotateSpeed={rotationSpeed}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default ThreeScene;