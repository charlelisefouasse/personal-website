import { useRef, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import ProfessionalLayer from "../ProfessionalLayer";
import CreativeLayer from "../CreativeLayer";

// Import shaders
import heroVert from "./shaders/hero.vert?raw";
import heroFrag from "./shaders/hero.frag?raw";

const SceneContent = () => {
  const { size, gl } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);

  // Load textures
  const [creativeTexture, proTexture] = useTexture([
    "/cosplay.jpg",
    "/normal.jpg",
  ]);

  // Refs for animation state
  const lastMouseTime = useRef<number>(0);
  const blobStrength = useRef<number>(0);
  // Current mouse position for interpolation
  const currentMouse = useRef<[number, number]>([0.5, 0.5]);
  // Target mouse position (from pointer or event)
  const targetMouse = useRef<[number, number]>([0.5, 0.5]);

  // Uniforms - Stable reference
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolutionWidth: { value: size.width }, // Initial value
      uResolutionHeight: { value: size.height }, // Initial value
      uBlobStrength: { value: 0 },
      creativeTexture: { value: creativeTexture },
      proTexture: { value: proTexture },
    }),
    [creativeTexture, proTexture], // Only recreate if textures change
  );

  // Update uniforms on resize
  useEffect(() => {
    uniforms.uResolutionWidth.value = size.width;
    uniforms.uResolutionHeight.value = size.height;
  }, [size, uniforms]);

  // Handle Mouse Move globally to match original logic (window-based)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Disable on touch logic handled by just not firing mousemove usually, but let's be safe
      if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

      lastMouseTime.current = Date.now();

      // Calculate normalized mouse (0..1)
      // WebGL 0,0 is bottom-left usually, but our logic in shader expects:
      // In Curtains implementation:
      // x = (e.clientX - left) / width
      // y = 1.0 - (e.clientY - top) / height  <-- Inverted Y

      // Since Canvas covers the whole div, we can use e.target or just window if fullscreen sections
      // The hero is a section. Let's use window values relative to the section if possible.
      // But 'pointer' from useThree is normalized -1..1.
      // Let's stick to the event listener for exact parity with previous behavior.
      const canvas = gl.domElement;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        // Ensure we don't divide by zero
        if (rect.width > 0 && rect.height > 0) {
          const x = (e.clientX - rect.left) / rect.width;
          const y = 1.0 - (e.clientY - rect.top) / rect.height;
          targetMouse.current = [x, y];
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const material = meshRef.current.material as THREE.ShaderMaterial;

    // Time
    material.uniforms.uTime.value += 0.01;

    // Idle detection
    const timeNow = Date.now();
    const timeSinceMove = timeNow - lastMouseTime.current;
    const isIdle = timeSinceMove > 1000;

    const targetStrength = isIdle ? 0.0 : 1.0;
    const speed = 0.05;

    blobStrength.current += (targetStrength - blobStrength.current) * speed;

    // Clamp
    if (blobStrength.current < 0.001) blobStrength.current = 0;
    if (blobStrength.current > 0.999) blobStrength.current = 1;

    material.uniforms.uBlobStrength.value = blobStrength.current;

    // Mouse Lerp
    // 0.12 speed from previous code
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

const WebGLHero = () => {
  return (
    <div className="relative h-full w-full bg-slate-950" id="canvas-container">
      <div className="absolute inset-0">
        <Canvas
          id="hero-canvas"
          style={{ pointerEvents: "none" }} // Ensure touches pass through for scrolling
          dpr={[1, 1.5]}
          flat // Disable tone mapping to match raw WebGL colors
          gl={{
            alpha: true,
            antialias: true,
          }}
          // Orthographic camera helper to ensure plane does not look perspective distorted?
          // Default is perspective.
          // But we use fullscreen quad shader: gl_Position = vec4(position, 1.0)
          // So camera matrices are IGNORED by our vertex shader.
          // We can leave default camera.
        >
          <Suspense fallback={null}>
            <SceneContent />
          </Suspense>
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10">
        {/* Professional UI (Bottom-Right) */}
        <div className="absolute inset-0">
          <ProfessionalLayer hideImage={true} />
        </div>

        {/* Creative UI (Top-Left) */}
        <div className="absolute inset-0">
          <CreativeLayer hideImage={true} />
        </div>
      </div>
    </div>
  );
};

export default WebGLHero;
