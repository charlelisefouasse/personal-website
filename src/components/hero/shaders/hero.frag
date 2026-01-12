precision highp float;

varying vec2 vTextureCoord;

uniform float uTime;
uniform vec2 uMouse;
uniform float uResolutionWidth;
uniform float uResolutionHeight;
uniform float uBlobStrength;

uniform sampler2D creativeTexture;
uniform sampler2D proTexture;

// --- Utils ---

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 a0 = x - floor(x + 0.5);
    vec3 g = a0 * vec3(x0.x,x12.xz) + h * vec3(x0.y,x12.yw);
    vec3 l = 1.79284291400159 - 0.85373472095314 * ( g*g + h*h );
    vec3 q = g * l.xyz + h * l.xyz;
    return 130.0 * dot(m, q);
}

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

float sdRoundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

// --- Specific Generators ---

// Calculates the image box SDF and texture UVs
// Returns vec3(dist, imgUV.x, imgUV.y)
vec3 calculateImageBox(vec2 uv, float resW, float resH) {
    // Branchless scale logic
    float scale = 0.85;
    scale = mix(scale, 1100.0 / resW, step(1024.0, resW));
    scale = mix(scale, 1350.0 / resW, step(2000.0, resW));

    float planeAspect = resW / resH;
    vec2 size = (planeAspect > 1.0) 
        ? vec2(1.0 / planeAspect, 1.0) * scale 
        : vec2(1.0, planeAspect) * scale;

    // UV for texture sampling
    vec2 offset = (1.0 - size) * 0.5;
    vec2 imgUV = (uv - offset) / size;

    // SDF
    vec2 pPixels = (uv - 0.5) * vec2(resW, resH);
    vec2 bPixels = (size * 0.5) * vec2(resW, resH);
    // Safe clamp for radius (ensures we don't invert the box)
    float r = min(24.0, min(bPixels.x, bPixels.y)); 
    
    // For Pro layer (radius 0), we can just set r to 0 externally, 
    // but calculating the generic box data here allows code reuse.
    
    float d = sdRoundedBox(pPixels, bPixels, r);
    
    return vec3(d, imgUV);
}

vec4 getCreativeBg(vec2 uv, float resW, float resH, float boxDist) {
    vec4 bg = vec4(0.008, 0.024, 0.094, 1.0); // Slate-950

    bool isDesktop = resW >= 768.0;
    vec2 size = isDesktop ? vec2(400.0, 500.0) : vec2(250.0, 250.0);
    float blurPx = isDesktop ? 180.0 : 80.0;
    vec2 radius = size * 0.5;
    
    vec2 currentPixel = uv * vec2(resW, resH);
    vec2 denom = radius + vec2(blurPx); // Pre-calc divisor

    // Blob 1: Blue
    vec2 center1 = vec2(resW * 0.25 + radius.x, resH * 0.75 - radius.y);
    vec2 diff1 = (currentPixel - center1) / denom;
    float val1 = exp(-2.0 * dot(diff1, diff1)); // dot(v,v) == length(v)^2

    // Blob 2: Purple
    vec2 center2 = vec2(resW * 0.75 - radius.x, resH * 0.25 + radius.y);
    vec2 diff2 = (currentPixel - center2) / denom;
    float val2 = exp(-2.0 * dot(diff2, diff2));

    bg.rgb += vec3(0.145, 0.388, 0.922) * val1 * 0.3;
    bg.rgb += vec3(0.576, 0.200, 0.918) * val2 * 0.3;

    // Neon Glow around image box
    // boxDist > 0 is outside.
    float glowIntensity = exp(-max(0.0, boxDist) * 0.05) * 0.6;
    bg.rgb += vec3(0.7, 0.2, 1.0) * glowIntensity;

    return bg;
}

vec4 getProBg(vec2 uv, float resW, float resH) {
    vec3 baseColor = vec3(0.988, 0.984, 0.976); // #fcfbf9
    vec3 gridColor = vec3(0.898, 0.906, 0.922);
    
    float gridSize = (resW < 768.0) ? 70.0 : 140.0;
    
    // Grid logic using fract for efficiency
    vec2 gridPx = vec2(uv.x * resW, (1.0 - uv.y) * resH);
    vec2 center = vec2(resW, resH) * 0.5;
    vec2 gridUV = fract((gridPx - center) / gridSize + 0.5); // Centered grid
    
    // Check edges (stroke width ~1px)
    vec2 gridCheck = step(1.0 / gridSize, gridUV); 
    float isGrid = 1.0 - (gridCheck.x * gridCheck.y); // 1.0 on lines
    
    return vec4(mix(baseColor, gridColor, isGrid), 1.0);
}

// --- Main ---

void main() {
    vec2 uv = vTextureCoord;
    
    // 1. Interaction & Distortion
    float dist = distance(uv, uMouse);
    float ripple = snoise(uv * 10.0 + uTime * 0.5) * 0.02 * exp(-dist * 10.0);
    
    float edgeDamp = smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.85, uv.y);
    
    float aspect = uResolutionWidth / uResolutionHeight;
    vec2 noiseUV = uv;
    float noiseFreq = 3.0;
    float noiseAmp = 0.05;
    
    if (aspect < 1.0) {
        noiseUV.y /= aspect;
        noiseFreq = 1.5;
        noiseAmp = 0.08;
    }
    float noise = snoise(noiseUV * noiseFreq + uTime * 0.2) * noiseAmp;
    
    float distortion = (noise + ripple) * edgeDamp;

    // 2. Liquid Shape Logic
    
    // --- UPDATED SPLIT LOGIC ---
    float splitVal = 0.0;
    if (uResolutionWidth < 768.0) {
        // Mobile: Reduced X multiplier (0.6 -> 0.2) makes it flatter.
        // Adjusted offset (0.80 -> 0.65) to keep it centered vertically.
        splitVal = (0.2 * uv.x + uv.y) - 0.65; 
    } else {
        // Desktop: Corner to Corner (Unchanged)
        splitVal = (uv.x + uv.y) - 1.0;
    }
    // ---------------------------
        
    float dSplit = splitVal + distortion + 0.02;

    vec2 aspectVec = (aspect < 1.0) ? vec2(1.0, 1.0/aspect) : vec2(aspect, 1.0);
    float blobDist = distance(uv * aspectVec, uMouse * aspectVec);
    float blobNoise = snoise(uv * 3.0 + uTime * 1.0) * 0.01;
    float currentRadius = (0.1 + blobNoise) * uBlobStrength;
    
    float dBlob = blobDist - currentRadius;
    float dFinal = smin(dSplit, dBlob, 0.2); 
    
    float mask = smoothstep(-0.01, 0.01, dFinal);

    // 3. Rendering Layers (Optimized)
    vec3 boxData = calculateImageBox(uv, uResolutionWidth, uResolutionHeight);
    float dBox = boxData.x;
    vec2 imgUV = boxData.yz;
    
    vec4 proBg = getProBg(uv, uResolutionWidth, uResolutionHeight);
    
    float insideImg = (imgUV.x >= 0.0 && imgUV.x <= 1.0 && imgUV.y >= 0.0 && imgUV.y <= 1.0) ? 1.0 : 0.0;
    
    vec4 proColor = proBg;
    if (insideImg > 0.5) {
        vec4 tex = texture2D(proTexture, imgUV);
        proColor = mix(proBg, tex, insideImg);
    }

    if (mask > 0.99) {
        gl_FragColor = proColor;
        return;
    }

    vec4 creativeBg = getCreativeBg(uv, uResolutionWidth, uResolutionHeight, dBox);
    float edge = 1.0 - smoothstep(-1.0, 1.0, dBox);
    vec4 creativeColor = creativeBg;
    
    if (insideImg > 0.5) {
        vec4 tex = texture2D(creativeTexture, imgUV);
        creativeColor = mix(creativeBg, tex, edge);
    }
    
    gl_FragColor = mix(creativeColor, proColor, mask);
}