import { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import ProfessionalLayer from "../ProfessionalLayer";
import CreativeLayer from "../CreativeLayer";

// Import shaders
import heroVert from "./shaders/hero.vert?raw";
import heroFrag from "./shaders/hero.frag?raw";

useTexture.preload(["/cosplay.jpg", "/normal.jpg"]);

const SceneContent = ({ onReady }: { onReady: () => void }) => {
  const { size, gl } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);

  // Load textures
  const [creativeTexture, proTexture] = useTexture([
    "/cosplay.jpg",
    "/normal.jpg",
  ]);
  creativeTexture.generateMipmaps = false;
  creativeTexture.minFilter = THREE.LinearFilter;

  proTexture.generateMipmaps = false;
  proTexture.minFilter = THREE.LinearFilter;

  // Refs for animation state
  const lastMouseTime = useRef<number>(0);
  const blobStrength = useRef<number>(0);
  const currentMouse = useRef<[number, number]>([0.5, 0.5]);
  const targetMouse = useRef<[number, number]>([0.5, 0.5]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolutionWidth: { value: size.width },
      uResolutionHeight: { value: size.height },
      uBlobStrength: { value: 0 },
      creativeTexture: { value: creativeTexture },
      proTexture: { value: proTexture },
    }),
    [creativeTexture, proTexture],
  );

  useEffect(() => {
    uniforms.uResolutionWidth.value = size.width;
    uniforms.uResolutionHeight.value = size.height;
  }, [size, uniforms]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;
      lastMouseTime.current = Date.now();

      const canvas = gl.domElement;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const x = (e.clientX - rect.left) / rect.width;
          const y = 1.0 - (e.clientY - rect.top) / rect.height;
          targetMouse.current = [x, y];
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [gl.domElement]);

  useFrame(() => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;

    material.uniforms.uTime.value += 0.01;

    const timeNow = Date.now();
    const timeSinceMove = timeNow - lastMouseTime.current;
    const isIdle = timeSinceMove > 1000;
    const targetStrength = isIdle ? 0.0 : 1.0;
    const speed = 0.05;

    blobStrength.current += (targetStrength - blobStrength.current) * speed;
    if (blobStrength.current < 0.001) blobStrength.current = 0;
    if (blobStrength.current > 0.999) blobStrength.current = 1;

    material.uniforms.uBlobStrength.value = blobStrength.current;

    const lerpSpeed = 0.12;
    currentMouse.current[0] +=
      (targetMouse.current[0] - currentMouse.current[0]) * lerpSpeed;
    currentMouse.current[1] +=
      (targetMouse.current[1] - currentMouse.current[1]) * lerpSpeed;

    material.uniforms.uMouse.value.set(
      currentMouse.current[0],
      currentMouse.current[1],
    );
  });
  useEffect(() => onReady(), []);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={heroVert}
        fragmentShader={heroFrag}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
};

interface WebGLHeroProps {
  onReady?: () => void;
}

const WebGLHero: React.FC<WebGLHeroProps> = ({ onReady }) => {
  // State to track if WebGL is ready
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready && onReady) {
      onReady();
    }
  }, [ready, onReady]);

  return (
    <div className="relative h-full w-full bg-slate-950" id="canvas-container">
      <div className="absolute inset-0">
        <Canvas
          id="hero-canvas"
          style={{ pointerEvents: "none" }}
          dpr={[1, 1.5]}
          flat
          gl={{ alpha: true, antialias: true }}
        >
          <SceneContent onReady={() => setReady(true)} />
        </Canvas>
      </div>

      <div className={"pointer-events-none absolute inset-0 z-10"}>
        <div className="absolute inset-0">
          <ProfessionalLayer hideImage={true} />
        </div>

        <div className="absolute inset-0">
          <CreativeLayer hideImage={true} />
        </div>
      </div>
    </div>
  );
};

export default WebGLHero;
