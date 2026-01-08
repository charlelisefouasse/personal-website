import { useEffect, useRef } from "react";
import { Curtains, Plane } from "curtainsjs";
import ProfessionalLayer from "./ProfessionalLayer";
import CreativeLayer from "./CreativeLayer";

const WebGLHero = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

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

        // Rounded box SDF
        float sdRoundedBox(vec2 p, vec2 b, float r) {
            vec2 q = abs(p) - b + r;
            return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
        }

        vec4 getLayerColor(sampler2D tex, vec2 uv, vec4 bgColor, float resW, float resH, bool isChaos) {
            float imgAspect = 1.6; // 16/10
            float planeAspect = resW / resH;
            
            // Responsive width: larger on desktop than before, but still contained
            float scale = resW > 1024.0 ? 850.0 / resW : 0.85;
            
            vec2 size;
            if (planeAspect > imgAspect) {
                size = vec2(imgAspect / planeAspect, 1.0) * scale;
            } else {
                size = vec2(1.0, planeAspect / imgAspect) * scale;
            }
            
            vec2 offset = (1.0 - size) * 0.5;
            vec2 imgUV = (uv - offset) / size;
            
            // Rounded corners logic (24px)
            float radius = 24.0 / max(resW, resH); 
            vec2 p = uv - 0.5;
            vec2 b = size * 0.5;
            float d = sdRoundedBox(p, b - radius, radius);
            float edge = 1.0 - smoothstep(-0.001, 0.001, d);
            
            // Final background for this layer
            vec4 finalBg = bgColor;
            if (isChaos) {
                // Port dynamic glows to Chaos side - PIXEL PERFECT MATCH
                // CSS Logic:
                // Container: w-screen h-screen
                // Blue: top-1/4 left-1/4 w-[500px] h-[500px]
                // Purple: bottom-1/4 right-1/4 ...
                
                // Conversions:
                // Top-1/4 (y) = 0.75 * H. Element Top is at 0.75. Center is -250px (down).
                // Left-1/4 (x) = 0.25 * W. Element Left is at 0.25. Center is +250px (right).
                
                // Bottom-1/4 (y) = 0.25 * H. Element Bottom is at 0.25. Center is +250px (up).
                // Right-1/4 (x) = 0.75 * W. Element Right is at 0.75. Center is -250px (left).

                vec2 currentPixel = uv * vec2(resW, resH);

                // Blob 1: Blue (Top-Left CSS)
                // Center Y in UV space is calculated from bottom, so Top-1/4 is 0.75 height.
                // But CSS Top-1/4 means the TOP EDGE is at 25% from top.
                // So Top Edge Y = resH * 0.75.
                // Center Y = resH * 0.75 - 250.0.
                // Left Edge X = resW * 0.25.
                // Center X = resW * 0.25 + 250.0.
                vec2 center1Px = vec2(resW * 0.25 + 250.0, resH * 0.75 - 250.0);
                float dist1 = distance(currentPixel, center1Px);
                
                // Blob size 500px (radius 250) + Blur 180px.
                // Smooth falloff to match the soft css blur.
                float glow1 = smoothstep(450.0, 0.0, dist1) * 0.35; 
                
                // Blob 2: Purple (Bottom-Right CSS)
                // Bottom Edge Y = resH * 0.25.
                // Center Y = resH * 0.25 + 250.0.
                // Right Edge X = resW * 0.75.
                // Center X = resW * 0.75 - 250.0.
                vec2 center2Px = vec2(resW * 0.75 - 250.0, resH * 0.25 + 250.0);
                float dist2 = distance(currentPixel, center2Px);
                
                float glow2 = smoothstep(450.0, 0.0, dist2) * 0.35;

                finalBg.rgb += vec3(0.145, 0.388, 0.922) * glow1; 
                finalBg.rgb += vec3(0.576, 0.200, 0.918) * glow2;
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
            
            // Diagonal split formula
            float split = (uv.x + uv.y) - 1.0;
            
            // Calc edge damping: 0 at top/bottom, 1 in middle
            // This ensures the liquid effect fades out at the scroll boundaries
            float edgeDamp = smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.85, uv.y);
            
            // Distortion
            float noise = snoise(uv * 3.0 + uTime * 0.2) * 0.05;
            float distortion = (noise + ripple) * edgeDamp;
            
            // Final mask
            float mask = smoothstep(-0.01, 0.01, split + distortion);
            
            vec4 chaosBg = vec4(0.008, 0.024, 0.094, 1.0); // Slate-950 (#020618)
            vec4 proBg = vec4(0.988, 0.984, 0.976, 1.0); // White
            
            vec4 chaosColor = getLayerColor(chaosTexture, uv, chaosBg, uResolutionWidth, uResolutionHeight, true);
            vec4 proColor = getLayerColor(proTexture, uv, proBg, uResolutionWidth, uResolutionHeight, false);
            
            
            gl_FragColor = mix(chaosColor, proColor, mask);
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
        widthSegments: 20,
        heightSegments: 20,
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
        },
      };

      const plane = new Plane(curtains, container, params as any);

      plane.onRender(() => {
        plane.uniforms.uTime.value += 0.01;
      });

      const handleMouseMove = (e: MouseEvent) => {
        const r = container.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          plane.uniforms.uMouse.value = [x, y];
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
      className="w-full h-full bg-linear-to-b from-[#fcfbf9] to-slate-950 relative"
      id="canvas-container"
    >
      <div className="absolute inset-0 z-10 pointer-events-none">
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
        src="/creative.png"
        data-sampler="chaosTexture"
        alt=""
        style={{ display: "none" }}
      />
      <img
        src="/professional.png"
        data-sampler="proTexture"
        alt=""
        style={{ display: "none" }}
      />
    </div>
  );
};

export default WebGLHero;
