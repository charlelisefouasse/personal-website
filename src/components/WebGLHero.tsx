import { useEffect, useRef } from "react";
import { Curtains, Plane } from "curtainsjs";
import ProfessionalLayer from "./ProfessionalLayer";
import CreativeLayer from "./CreativeLayer";

const WebGLHero = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const lastMouseTime = useRef<number>(0);
  const blobStrength = useRef<number>(0);
  const targetMouse = useRef<[number, number]>([0.5, 0.5]);
  const currentMouse = useRef<[number, number]>([0.5, 0.5]);

  const vs = `
        precision mediump float;

        attribute vec3 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat4 uMVMatrix;
        uniform mat4 uPMatrix;

        varying vec2 vTextureCoord;

        void main() {
            gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
            vTextureCoord = aTextureCoord;
        }
    `;

  const fs = `
        precision mediump float;

        varying vec2 vTextureCoord;

        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uResolutionWidth;
        uniform float uResolutionHeight;
        uniform float uBlobStrength;

        uniform sampler2D chaosTexture;
        uniform sampler2D proTexture;

        // Simplex 2D noise
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

        float snoise(vec2 v){
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                   -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
            dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 a0 = x - floor(x + 0.5);
          vec3 g = a0 * vec3(x0.x,x12.xz) + h * vec3(x0.y,x12.yw);
          vec3 l = 1.79284291400159 - 0.85373472095314 * ( g*g + h*h );
          vec3 q = g * l.xyz + h * l.xyz;
          return 130.0 * dot(m, q);
        }

        // Smooth Minimum for Liquid Melt
        float smin(float a, float b, float k) {
            float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
            return mix(b, a, h) - k * h * (1.0 - h);
        }

        // Rounded box SDF
        float sdRoundedBox(vec2 p, vec2 b, float r) {
            vec2 q = abs(p) - b + r;
            return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
        }

        vec4 getLayerColor(sampler2D tex, vec2 uv, vec4 bgColor, float resW, float resH, bool isChaos, float radiusPx) {
            float imgAspect = 1.0; // square
            float planeAspect = resW / resH;
            
            // Responsive width
            float scale = 0.85; // Mobile default
            if (resW > 2000.0) {
                scale = 1350.0 / resW;
            } else if (resW > 1024.0) {
                scale = 1100.0 / resW;
            }
            
            vec2 size;
            if (planeAspect > imgAspect) {
                size = vec2(imgAspect / planeAspect, 1.0) * scale;
            } else {
                size = vec2(1.0, planeAspect / imgAspect) * scale;
            }
            
            // Offset calculation still in UV space for texture sampling
            vec2 offset = (1.0 - size) * 0.5;
            vec2 imgUV = (uv - offset) / size;
            
            // SDF in Pixel Space for uniform rounded corners
            vec2 pPixels = (uv - 0.5) * vec2(resW, resH);
            vec2 bPixels = (size * 0.5) * vec2(resW, resH);
            
            // Subtract radius from box size for "inner" radius, or keep it standard?
            // Standard rounded box: sdRoundedBox(p, b, r) where b is half-bounds.
            // If we want the box to be EXACTLY bPixels size, we use bPixels - radius.
            // If radius is 0, we can just pass 0.
            
            // Safe clamp for radius
            float r = min(radiusPx, min(bPixels.x, bPixels.y));
            
            // Pass bPixels directly. The SDF logic rounds "inward" from the box corners,
            // so the bounding box remains 2*bPixels.
            float d = sdRoundedBox(pPixels, bPixels, r);
            
            // Soft edge (AA) - 1.0 pixel blur
            float edge = 1.0 - smoothstep(-1.0, 1.0, d);
            
            // Final background for this layer
            vec4 finalBg = bgColor;
            if (isChaos) {
                // EXACT Match for CreativeBackground.tsx
                // Logic:
                // Parent: opacity-30 (0.3 intensity)
                // Mobile (<768px): w-250px h-250px, blur-80px
                // Desktop (>=768px): w-400px h-500px, blur-180px
                
                bool isDesktop = resW >= 768.0;
                vec2 size = isDesktop ? vec2(400.0, 500.0) : vec2(250.0, 250.0);
                float blurPx = isDesktop ? 180.0 : 80.0;
                
                vec2 radius = size * 0.5;
                vec2 currentPixel = uv * vec2(resW, resH);

                // Gaussian Sigma approximation for CSS filter: blur(Npx)
                // CSS blur uses a Gaussian with standard deviation ~ N/2 or so, but visually
                // the "spread" feels larger. We'll use sigma = blurPx.
                float sigma = blurPx; 
                float twoSigmaSq = 2.0 * sigma * sigma;

                // ---------------------------------------------------------
                // Blob 1: Blue (bg-blue-600)
                // CSS: Top-1/4, Left-1/4 (Defining Top-Left corner of element)
                // Top-1/4 = 25% from top = 75% height in GL.
                // Left-1/4 = 25% from left = 25% width in GL.
                // Center X = 0.25*W + radius.x
                // Center Y = 0.75*H - radius.y
                vec2 center1 = vec2(resW * 0.25 + radius.x, resH * 0.75 - radius.y);
                float dist1 = distance(currentPixel, center1);
                
                // Box-aware distance for non-square blobs? 
                // Using simple distance for now as CSS rounded-full on rectangle makes an oval.
                // Actually rounded-full on 400x500 rounded-full IS an ellipse.
                // So we should normalize the distance by the radius dimensions.
                
                vec2 diff1 = (currentPixel - center1);
                // Implicit ellipse equation: (dx/rx)^2 + (dy/ry)^2
                float distSq1 = dot( (diff1/radius)*(diff1/radius), vec2(1.0) );
                
                // We want the 'edge' of the ellipse to be where the solid color ends and blur begins?
                // CSS blur extends OUTWARD from the element.
                // So effectively, the element is the core.
                // Distance to the edge of the ellipse = sqrt(distSq1) - 1.0 (in normalized space)
                // But simplified: we just want a soft falloff scaling with the blur size.
                // Let's stick to world-space gaussian but masked by the ellipse? 
                // Simpler: Just render a gaussian blob of roughly that size + blur.
                // Effective radius ~ radius + blur.
                
                // Let's stick to the visual approximation:
                // Normalized distance:
                float nd1 = length(diff1 / (radius + vec2(blurPx))); 
                float val1 = exp(-2.0 * nd1 * nd1); // Bell curve
                
                // ---------------------------------------------------------
                // Blob 2: Purple (bg-purple-600)
                // CSS: Bottom-1/4, Right-1/4 (Defining Bottom-Right corner)
                // Bottom-1/4 = 25% height in GL.
                // Right-1/4 = 75% width in GL.
                // Center X = 0.75*W - radius.x
                // Center Y = 0.25*H + radius.y
                vec2 center2 = vec2(resW * 0.75 - radius.x, resH * 0.25 + radius.y);
                vec2 diff2 = (currentPixel - center2);
                float nd2 = length(diff2 / (radius + vec2(blurPx)));
                float val2 = exp(-2.0 * nd2 * nd2);

                // Opacity 30% -> 0.3 intensity
                finalBg.rgb += vec3(0.145, 0.388, 0.922) * val1 * 0.3; 
                finalBg.rgb += vec3(0.576, 0.200, 0.918) * val2 * 0.3;
                
                // Neon Glow (Purple) around the image
                // d is distance from box edge. d > 0 is outside.
                if (d > -1.0) {
                    float glowDist = max(0.0, d);
                    // Exponential falloff for neon look. 0.02 controls spread (smaller = wider).
                    float glowIntensity = exp(-glowDist * 0.02) * 0.3; 
                    vec3 glowColor = vec3(0.7, 0.2, 1.0); // Bright Purple
                    finalBg.rgb += glowColor * glowIntensity;
                }
            }
            
            vec4 texColor = texture2D(tex, imgUV);
            
            if (imgUV.x >= 0.0 && imgUV.x <= 1.0 && imgUV.y >= 0.0 && imgUV.y <= 1.0) {
                return mix(finalBg, texColor, edge);
            }
            return finalBg;
        }

        void main() {
            vec2 uv = vTextureCoord;
            
            // Interaction
            float dist = distance(uv, uMouse);
            float ripple = snoise(uv * 10.0 + uTime * 0.5) * 0.02 * exp(-dist * 10.0);
            
            // Diagonal split SDF approximation
            // Desktop: (x + y) - 1.0. 
            // Mobile: Pin away from corners.
            
            float splitVal = 0.0;
            if (uResolutionWidth < 768.0) {
                // Mobile: 0.7x + y - 0.85
                // Passes through (0, 0.85) and (1, 0.15) roughly
                splitVal = (0.6 * uv.x + uv.y) - 0.80;
            } else {
                // Desktop: Corner to Corner
                splitVal = (uv.x + uv.y) - 1.0;
            }
            
            // Calc edge damping for distortion
            float edgeDamp = smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.85, uv.y);
            
            // Correct Aspect Ratio for Noise
            // Mobile (Aspect < 1): uv.y is long. If we treat 0..1 as square, we get stretched noise.
            // We want "Round" noise.
            // Also, we want enough vertical repetitions on mobile.
            float aspect = uResolutionWidth / uResolutionHeight;
            
            vec2 noiseUV = uv;
            float noiseFreq = 3.0; // Base frequency
            float noise = 1.0;
            
            if (aspect < 1.0) {
               
                 noiseUV.y /= aspect; 
                 // Decrease base freq slightly so it's not TOO busy, since we expanded space
                 noiseFreq = 1.5; 
                 noise = snoise(noiseUV * noiseFreq + uTime * 0.2) * 0.08;
            } else {

                 noiseFreq = 3.0; // Keep desktop feel
                 noise = snoise(noiseUV * noiseFreq + uTime * 0.2) * 0.05;
            }
            
           
            float distortion = (noise + ripple) * edgeDamp;
            
            // Distances for Liquid Merge
            // 1. Split Distance

            float dSplit = splitVal + distortion +0.02;
            
            // 2. Blob Distance
            // Normalize mouse position to aspect ratio
            vec2 aspectVec = vec2(aspect, 1.0);
            if (aspect < 1.0) aspectVec = vec2(1.0, 1.0/aspect); // Consistent logic
            
            float blobDist = distance(uv * aspectVec, uMouse * aspectVec);
            
            // Dynamic blob noise - Reduced for rounder shape
            float blobNoise = snoise(uv * 3.0 + uTime * 1.0) * 0.01;
            
            // If strength is 0, make radius negative so it disappears
            // Base radius ~15% + noise. 
            // We want d < 0 inside blob. d = dist - radius.
            float currentRadius = (0.1 + blobNoise) * uBlobStrength;
            
            // If strength is 0, d must be massive positive. 
            // If we just make radius 0, d is positive but near 0 at mouse.
            // We want it to vanish.
            // Let's bias the distance field itself.
            float dBlob = blobDist - currentRadius;
            
            // Use Smooth Minimum to merge the "holes"
            // We want to combine the NEGATIVE regions (where d < 0).
            // So we want min(dSplit, dBlob).
            // smin(a, b, k) blends them.
            float k = 0.2; // Smoothness factor (Higher = gloopier merge)
            float dFinal = smin(dSplit, dBlob, k);
            
            // Final Mask: 0.0 inside liquid (Top-Left or Blob), 1.0 outside (Bottom-Right)
            float mask = smoothstep(-0.01, 0.01, dFinal);
            
            vec4 baseProBg = vec4(0.988, 0.984, 0.976, 1.0); // #fcfbf9
            
            // Grid Pattern (Gray 200)
            vec3 gridColor = vec3(0.898, 0.906, 0.922);
            float gridSize = (uResolutionWidth < 768.0) ? 70.0 : 140.0;
            
            // Align grid to top-left (CSS standard)
            vec2 gridPx = vec2(uv.x * uResolutionWidth, (1.0 - uv.y) * uResolutionHeight);
            
            // Logic: mod(coord, 60) < 1.0 -> Grid Line
            vec2 gridCheck = step(vec2(1.0), mod(gridPx, gridSize)); 
            float isGrid = 1.0 - min(gridCheck.x, gridCheck.y); 
            
            vec4 proBg = vec4(mix(baseProBg.rgb, gridColor, isGrid), 1.0);
            vec4 proColor = getLayerColor(proTexture, uv, proBg, uResolutionWidth, uResolutionHeight, false, 0.0);

            // Optimization: If mask is > 0.99, we are fully in pro side. Skip chaos calc.
            if (mask > 0.99) {
                gl_FragColor = proColor;
            } else {
                vec4 chaosBg = vec4(0.008, 0.024, 0.094, 1.0); // Slate-950 (#020618)
                vec4 chaosColor = getLayerColor(chaosTexture, uv, chaosBg, uResolutionWidth, uResolutionHeight, true, 24.0);
                gl_FragColor = mix(chaosColor, proColor, mask);
            }
        }
    `;

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    try {
      const rect = container.getBoundingClientRect();

      const curtains = new Curtains({
        container: container,
        pixelRatio: Math.min(1.5, window.devicePixelRatio),
        watchScroll: false,
      });

      curtains.onError(() => {
        console.error("Curtains error");
        container.style.backgroundColor = "#050505";
      });

      const params = {
        vertexShader: vs,
        fragmentShader: fs,
        widthSegments: 40,
        heightSegments: 40,
        uniforms: {
          uTime: { name: "uTime", type: "1f", value: 0 },
          uMouse: { name: "uMouse", type: "2f", value: [0.5, 0.5] },
          uResolutionWidth: {
            name: "uResolutionWidth",
            type: "1f",
            value: rect.width || window.innerWidth,
          },
          uResolutionHeight: {
            name: "uResolutionHeight",
            type: "1f",
            value: rect.height || window.innerHeight,
          },
          uBlobStrength: { name: "uBlobStrength", type: "1f", value: 0 },
        },
      };

      const plane = new Plane(curtains, container, params as any);

      plane.onRender(() => {
        plane.uniforms.uTime.value = Number(plane.uniforms.uTime.value) + 0.01;

        // Idle detection logic
        const timeNow = Date.now();
        const timeSinceMove = timeNow - lastMouseTime.current;
        const isIdle = timeSinceMove > 1000;

        const targetStrength = isIdle ? 0.0 : 1.0;
        const speed = 0.05;

        blobStrength.current += (targetStrength - blobStrength.current) * speed;

        // Clean clamp
        if (blobStrength.current < 0.001) blobStrength.current = 0;
        if (blobStrength.current > 0.999) blobStrength.current = 1;

        plane.uniforms.uBlobStrength.value = blobStrength.current;

        // Mouse Lerp for "Drag" effect
        // 0.1 = very heavy drag, 0.2 = medium drag
        const lerpSpeed = 0.12;
        currentMouse.current[0] +=
          (targetMouse.current[0] - currentMouse.current[0]) * lerpSpeed;
        currentMouse.current[1] +=
          (targetMouse.current[1] - currentMouse.current[1]) * lerpSpeed;

        plane.uniforms.uMouse.value = currentMouse.current;
      });

      const handleMouseMove = (e: MouseEvent) => {
        // Disable on touch devices (though mousemove rarely fires there, being explicit is safer)
        if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

        lastMouseTime.current = Date.now();

        const r = container.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          const x = (e.clientX - r.left) / r.width;
          // Invert Y because WebGL 0,0 is usually bottom-left, but DOM is top-left
          const y = 1.0 - (e.clientY - r.top) / r.height;
          targetMouse.current = [x, y];
        }
      };

      const handleResize = () => {
        const r = container.getBoundingClientRect();
        plane.uniforms.uResolutionWidth.value = r.width;
        plane.uniforms.uResolutionHeight.value = r.height;
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("resize", handleResize);

      return () => {
        curtains.dispose();
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);
      };
    } catch (e) {
      console.error("Failed to init Curtains:", e);
      if (canvasRef.current) {
        canvasRef.current.style.backgroundColor = "#050505";
      }
    }
  }, []);

  return (
    <div
      ref={canvasRef}
      className="relative h-full w-full bg-linear-to-b from-[#fcfbf9] to-slate-950"
      id="canvas-container"
    >
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

      {/* Hidden images for WebGL textures */}
      <img
        src="/cosplay.jpg"
        data-sampler="chaosTexture"
        alt=""
        style={{ display: "none" }}
      />
      <img
        src="/normal.jpg"
        data-sampler="proTexture"
        alt=""
        style={{ display: "none" }}
      />
    </div>
  );
};

export default WebGLHero;
