import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import CreativeBackground from "@/components/cosplay/CreativeBackground";

interface LoaderProps {
  ready: boolean;
  onComplete: () => void;
}

const Loader3D: React.FC<LoaderProps> = ({ ready, onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const facesRef = useRef<(HTMLDivElement | null)[]>([]);
  const readyRef = useRef(ready);

  // Sync ready ref
  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);

  useEffect(() => {
    if (!cubeRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });

      const checkExit = () => {
        if (readyRef.current) {
          tl.pause();

          const currentRot = gsap.getProperty(
            cubeRef.current,
            "rotationY",
          ) as number;

          // Determine next rotation target for exit (Right to Left = negative rotation)
          const targetRot = currentRot - 90;

          // Map target rotation to a face index (0, 1, 2, 3...)
          // Face 1 is 0. Face 2 is -90. Face 3 (Deleted) is -180.
          // Use absolute value to get index: 0, 1, 2, 3
          const targetIdx = Math.abs(Math.round(targetRot / 90)) % 4;

          // If the target face exists in refs (Index 0 or 1), make it transparent.
          if (facesRef.current[targetIdx]) {
            gsap.set(facesRef.current[targetIdx], { opacity: 0 });
          }

          gsap.to(cubeRef.current, {
            rotationY: targetRot,
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: () => {
              gsap.set(containerRef.current, { display: "none" });
              onComplete();
            },
          });
        }
      };

      // FACE 1 (0deg) - Wait
      tl.to({}, { duration: 0.6 });

      // Rotate to FACE 2 (-90deg) - Right to Left
      tl.to(cubeRef.current, {
        rotationY: -90,
        duration: 0.8,
        ease: "power3.inOut",
      });

      // FACE 2 (-90deg) - Wait
      tl.to({}, { duration: 0.8 });

      // CHECK POINT (At -90)
      tl.call(checkExit);

      // Rotate back to FACE 1 (0deg) - Oscillate
      tl.to(cubeRef.current, {
        rotationY: 0,
        duration: 0.8,
        ease: "power3.inOut",
      });

      // CHECK POINT (At 0)
      tl.call(checkExit);
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 text-white perspective-[200vw]"
    >
      <div
        ref={cubeRef}
        className="preserve-3d relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FACE 1: Front (0 deg) */}
        <div
          ref={(el) => {
            facesRef.current[0] = el;
          }}
          className="absolute inset-0 backface-hidden"
          style={{
            transform: "rotateY(0deg) translateZ(50vw)",
          }}
        >
          <div className="bg-grid flex h-full w-full items-center justify-center overflow-hidden text-gray-800">
            <h1 className="font-orbitron mx-auto max-w-48 text-center text-2xl font-bold text-wrap sm:max-w-none sm:text-4xl md:text-6xl">
              CHARLÉLISE FOUASSE
            </h1>
          </div>
        </div>

        {/* FACE 2: Right (+90 deg in DOM matches -90 rotation) */}
        <div
          ref={(el) => {
            facesRef.current[1] = el;
          }}
          className="absolute inset-0 backface-hidden"
          style={{
            transform: "rotateY(90deg) translateZ(50vw)",
          }}
        >
          <div className="flex h-full w-full items-center justify-center overflow-hidden bg-slate-950">
            <CreativeBackground />

            <h1 className="font-bowlby bg-linear-to-br from-cyan-400 to-purple-600 bg-clip-text text-center text-2xl text-transparent opacity-80 sm:text-5xl md:text-8xl">
              ACCIOCASTIEL
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader3D;
