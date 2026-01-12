varying vec2 vTextureCoord;

uniform float uTime;
uniform vec2 uMouse;
uniform float uResolutionWidth;
uniform float uResolutionHeight;
uniform float uBlobStrength;

uniform sampler2D creativeTexture;
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

vec4 getLayerColor(sampler2D tex, vec2 uv, vec4 bgColor, float resW, float resH, bool iscreative, float radiusPx) {
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
    
    // Safe clamp for radius
    float r = min(radiusPx, min(bPixels.x, bPixels.y));
    
    // Pass bPixels directly. The SDF logic rounds "inward" from the box corners.
    float d = sdRoundedBox(pPixels, bPixels, r);
    
    // Soft edge (AA) - 1.0 pixel blur
    float edge = 1.0 - smoothstep(-1.0, 1.0, d);
    
    // Final background for this layer
    vec4 finalBg = bgColor;
    if (iscreative) {
        // EXACT Match for CreativeBackground.tsx
        
        bool isDesktop = resW >= 768.0;
        vec2 size = isDesktop ? vec2(400.0, 500.0) : vec2(250.0, 250.0);
        float blurPx = isDesktop ? 180.0 : 80.0;
        
        vec2 radius = size * 0.5;
        vec2 currentPixel = uv * vec2(resW, resH);

        // Gaussian Sigma approximation for CSS filter: blur(Npx)
        float sigma = blurPx; 
        float twoSigmaSq = 2.0 * sigma * sigma;

        // ---------------------------------------------------------
        // Blob 1: Blue (bg-blue-600)
        // Center X = 0.25*W + radius.x
        // Center Y = 0.75*H - radius.y
        vec2 center1 = vec2(resW * 0.25 + radius.x, resH * 0.75 - radius.y);
        
        vec2 diff1 = (currentPixel - center1);
        
        // ---------------------------------------------------------
        // Blob 2: Purple (bg-purple-600)
        // Center X = 0.75*W - radius.x
        // Center Y = 0.25*H + radius.y
        vec2 center2 = vec2(resW * 0.75 - radius.x, resH * 0.25 + radius.y);
        vec2 diff2 = (currentPixel - center2);
        
        float nd1 = length(diff1 / (radius + vec2(blurPx))); 
        float val1 = exp(-2.0 * nd1 * nd1); // Bell curve
        
        float nd2 = length(diff2 / (radius + vec2(blurPx)));
        float val2 = exp(-2.0 * nd2 * nd2);

        // Opacity 30% -> 0.3 intensity
        finalBg.rgb += vec3(0.145, 0.388, 0.922) * val1 * 0.3; 
        finalBg.rgb += vec3(0.576, 0.200, 0.918) * val2 * 0.3;
        
        // Neon Glow (Purple) around the image
        // d is distance from box edge. d > 0 is outside.
        if (d > -1.0) {
            float glowDist = max(0.0, d);
            // Exponential falloff for neon look. 0.05 controls spread (smaller = wider).
            float glowIntensity = exp(-glowDist * 0.05) * 0.6; 
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
    float splitVal = 0.0;
    if (uResolutionWidth < 768.0) {
        // Mobile: 0.7x + y - 0.85
        splitVal = (0.6 * uv.x + uv.y) - 0.80;
    } else {
        // Desktop: Corner to Corner
        splitVal = (uv.x + uv.y) - 1.0;
    }
    
    // Calc edge damping for distortion
    float edgeDamp = smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.85, uv.y);
    
    // Correct Aspect Ratio for Noise
    float aspect = uResolutionWidth / uResolutionHeight;
    
    vec2 noiseUV = uv;
    float noiseFreq = 3.0; // Base frequency
    float noise = 1.0;
    
    if (aspect < 1.0) {
            noiseUV.y /= aspect; 
            // Decrease base freq slightly so it's not TOO busy
            noiseFreq = 1.5; 
            noise = snoise(noiseUV * noiseFreq + uTime * 0.2) * 0.08;
    } else {
            noiseFreq = 3.0; // Keep desktop feel
            noise = snoise(noiseUV * noiseFreq + uTime * 0.2) * 0.05;
    }
    
    float distortion = (noise + ripple) * edgeDamp;
    
    // Distances for Liquid Merge
    float dSplit = splitVal + distortion + 0.02;
    
    // 2. Blob Distance
    // Normalize mouse position to aspect ratio
    vec2 aspectVec = vec2(aspect, 1.0);
    if (aspect < 1.0) aspectVec = vec2(1.0, 1.0/aspect); // Consistent logic
    
    float blobDist = distance(uv * aspectVec, uMouse * aspectVec);
    
    // Dynamic blob noise - Reduced for rounder shape
    float blobNoise = snoise(uv * 3.0 + uTime * 1.0) * 0.01;
    
    // If strength is 0, make radius negative so it disappears
    float currentRadius = (0.1 + blobNoise) * uBlobStrength;
    
    float dBlob = blobDist - currentRadius;
    
    // Use Smooth Minimum to merge the "holes"
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

    if (mask > 0.99) {
        gl_FragColor = proColor;
    } else {
        vec4 creativeBg = vec4(0.008, 0.024, 0.094, 1.0); // Slate-950 (#020618)
        vec4 creativeColor = getLayerColor(creativeTexture, uv, creativeBg, uResolutionWidth, uResolutionHeight, true, 24.0);
        gl_FragColor = mix(creativeColor, proColor, mask);
    }
}
