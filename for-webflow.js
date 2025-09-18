export const CONFIG = {
  maxDPR: 2,
  camera: { fov: 60, near: 0.1, far: 100, pos: [0, 0, -3] },
  panes: { count: 6 },
  walls: { count: 6 },
};

export const params = {
  wallSizeX: 3,
  wallSizeY: 20,
  wallSpacingY: 1.8,
  wallOffsetX: 2.5,
  wallAngleDeg: 45,
  wallY: -25,
  chefSizeX: 1,
  chefSizeY: 1.6,
  chefLocX: 0.67,
  chefLocY: -1.56,
  chefHoverDuration: 0.3,
  chefOpacityNear: 2.0,
  chefOpacityFar: 10.0,

  panesY: -8,
  paneSizeX: 1.25,
  paneSizeY: 0.75,
  paneRadius: 1.5,
  paneRise: 0.7,
  paneTwistDeg: 50,
  paneFillet: 0.0,
  paneCurveSegments: 1,
  panesRotMinDeg: 75,
  panesRotMaxDeg: 2430,
  panesScrollEase: 2,
  paneColorTransition: 0.5,
  paneHoverScale: 1.05,
  paneHoverDuration: 0.3,
  fadeNear: 1,
  fadeFar: 5,

  lightIntensity: 4,
  lightY: 3,
  lightX: 0,
  lightZ: -4,

  bgPlaneX: 20,
  bgPlaneY: 30,
  bgPlaneLocY: 0,

  animatorMinY: 0,
  animatorMaxY: -35,
  animatorScrollEase: 2,
  animatorRotateThresholdX: -10,
  animatorRotateOnDeg: 90,

  dpr: 1,
  autoPerformance: true,
  speed: 0.05,
  scale: 2.5,
  fbmOctaves: 6,
  ridgeOctaves: 0,
  warp1: 0,
  warp2: 0.2,
  detailsAmp: 0.0,
  veilsAmp: 0.0,
  contrastMin: 0.1,
  contrastMax: 1.0,
  hotspotOn: true,
  hotspotX: 0.5,
  hotspotY: 0,
  hotspotInner: 0.0,
  hotspotOuter: 2,
  hotspotStrength: 0.5,
  canvasOpacity: 0.4,
  baseColorR: 1,
  baseColorG: 1,
  baseColorB: 1,
  blendMode: 'normal',

  gradientOpacity: 1,
  gradientBlendMode: 'multiply',
  gradientCenterColorR: 1,
  gradientCenterColorG: 1,
  gradientCenterColorB: 1,
  gradientOuterColorR: 0,
  gradientOuterColorG: 0,
  gradientOuterColorB: 0,
  gradientCenterX: 0.5,
  gradientCenterY: 0.2,
  gradientStrength: 1.0,
  gradientRadius: 0.8,

  mouseFollow: true,
  followDelay: 1,
  maxPlateRotDeg: 30,
};

export const paneImages = [
  'assets/panes/color/1.jpg',
  'assets/panes/color/2.jpg',
  'assets/panes/color/3.jpg',
  'assets/panes/color/4.jpg',
  'assets/panes/color/5.jpg',
  'assets/panes/color/6.jpg',
];

export const paneVideos = [
  'assets/panes/video/1.mp4',
  'assets/panes/video/2.mp4',
  'assets/panes/video/3.mp4',
  'assets/panes/video/4.mp4',
  'assets/panes/video/5.mp4',
  'assets/panes/video/6.mp4',
];

export const chefImages = [
  {
    imageLink: 'assets/chefs/1.jpeg',
    chefName: 'Chef Alice',
    chefLink: 'https://example.com/chefs/alice',
    chefDesc: 'Specializes in Italian cuisine with a modern twist.',
  },
  {
    imageLink: 'assets/chefs/2.jpeg',
    chefName: 'Chef Bob',
    chefLink: 'https://example.com/chefs/bob',
    chefDesc: 'Renowned for innovative French pastries.',
  },
  {
    imageLink: 'assets/chefs/3.jpeg',
    chefName: 'Chef Clara',
    chefLink: 'https://example.com/chefs/clara',
    chefDesc: 'Expert in fusion dishes combining Asian and Latin flavors.',
  },
  {
    imageLink: 'assets/chefs/4.jpeg',
    chefName: 'Chef David',
    chefLink: 'https://example.com/chefs/david',
    chefDesc: 'Master of sustainable seafood recipes.',
  },
  {
    imageLink: 'assets/chefs/5.jpeg',
    chefName: 'Chef Emma',
    chefLink: 'https://example.com/chefs/emma',
    chefDesc: 'Known for her vibrant vegetarian dishes.',
  },
  {
    imageLink: 'assets/chefs/6.jpeg',
    chefName: 'Chef Frank',
    chefLink: 'https://example.com/chefs/frank',
    chefDesc: 'Pioneers bold barbecue techniques.',
  },
];

import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20.0/dist/lil-gui.esm.js';

export function createDebugPanel(
  params,
  {
    THREE,
    renderer,
    pointLight,
    walls,
    panes,
    chefs,
    animator,
    buildWalls,
    buildPanes,
    buildChefs,
    bgMat,
    gradMat,
    updateAnimatorFromScroll,
    setPanesTweenDuration,
    setPixelRatio,
    blendModes,
  }
) {
  const gui = new GUI({ title: 'Controls' });

  // Lights
  const fLights = gui.addFolder('Lights');
  fLights
    .add(params, 'lightIntensity', 0, 10, 0.01)
    .name('Intensity')
    .onChange(() => (pointLight.intensity = params.lightIntensity));
  fLights
    .add(params, 'lightX', -10, 10, 0.1)
    .name('X')
    .onChange(() => (pointLight.position.x = params.lightX));
  fLights
    .add(params, 'lightY', -20, 10, 0.1)
    .name('Y')
    .onChange(() => (pointLight.position.y = params.lightY));
  fLights
    .add(params, 'lightZ', -10, 10, 0.1)
    .name('Z')
    .onChange(() => (pointLight.position.z = params.lightZ));
  fLights.close();

  // Walls
  const fWalls = gui.addFolder('Walls');
  fWalls
    .add(params, 'wallSizeX', 0.5, 5, 0.1)
    .name('Size X')
    .onChange(buildWalls);
  fWalls
    .add(params, 'wallSizeY', 0.5, 10, 0.1)
    .name('Size Y')
    .onChange(buildWalls);
  fWalls
    .add(params, 'wallSpacingY', 0.5, 3, 0.1)
    .name('Spacing Y')
    .onChange(buildWalls);
  fWalls
    .add(params, 'wallOffsetX', 0.5, 5, 0.1)
    .name('Offset X')
    .onChange(buildWalls);
  fWalls
    .add(params, 'wallAngleDeg', 0, 90, 1)
    .name('Angle °')
    .onChange(buildWalls);
  fWalls
    .add(params, 'wallY', -30, 5, 0.1)
    .name('Y Pos')
    .onChange(() => {
      walls.position.y = params.wallY;
    });
  fWalls
    .add(params, 'chefSizeX', 0, 5, 0.1)
    .name('Chef Size X')
    .onChange(buildChefs);
  fWalls
    .add(params, 'chefSizeY', 0, 5, 0.1)
    .name('Chef Size Y')
    .onChange(buildChefs);
  fWalls
    .add(params, 'chefLocX', 0, 5, 0.1)
    .name('Chef Loc X')
    .onChange(buildChefs);
  fWalls
    .add(params, 'chefLocY', -5, 5, 0.1)
    .name('Chef Loc Y')
    .onChange(buildChefs);
  fWalls.add(params, 'chefHoverDuration', 0.1, 1, 0.01);
  fWalls
    .add(params, 'chefOpacityNear', 0, 10, 0.1)
    .name('Chef Opacity Near')
    .onChange(buildChefs);
  fWalls
    .add(params, 'chefOpacityFar', 0, 20, 0.1)
    .name('Chef Opacity Far')
    .onChange(buildChefs);
  fWalls.close();

  // Panes
  const fPanes = gui.addFolder('Panes (Spiral)');
  fPanes.add(params, 'panesY', -20, 10, 0.1).name('Y').onChange(buildPanes);
  fPanes
    .add(params, 'paneSizeX', 0.5, 5, 0.1)
    .name('Size X')
    .onChange(buildPanes);
  fPanes
    .add(params, 'paneSizeY', 0.5, 5, 0.1)
    .name('Size Y')
    .onChange(buildPanes);
  fPanes
    .add(params, 'paneRadius', 0.4, 3, 0.05)
    .name('Radius')
    .onChange(buildPanes);
  fPanes
    .add(params, 'paneRise', 0.0, 1, 0.01)
    .name('Rise')
    .onChange(buildPanes);
  fPanes
    .add(params, 'paneTwistDeg', 0, 120, 1)
    .name('Twist °')
    .onChange(buildPanes);
  fPanes
    .add(params, 'paneFillet', 0, 1, 0.01)
    .name('Fillet R')
    .onChange(buildPanes);
  fPanes
    .add(params, 'paneCurveSegments', 1, 32, 1)
    .name('Fillet Segs')
    .onChange(buildPanes);
  fPanes
    .add(params, 'panesRotMinDeg', -2160, 2500, 1)
    .name('Rot Y Min °')
    .onChange(updateAnimatorFromScroll);
  fPanes
    .add(params, 'panesRotMaxDeg', -2160, 2500, 1)
    .name('Rot Y Max °')
    .onChange(updateAnimatorFromScroll);
  fPanes
    .add(params, 'panesScrollEase', 0.05, 2, 0.05)
    .name('Rot Tween (s)')
    .onChange((v) => setPanesTweenDuration(v));
  fPanes.add(params, 'paneColorTransition', 0, 2, 0.05).name('Color Tween (s)');
  fPanes.add(params, 'paneHoverScale', 1, 1.5, 0.05).name('Hover Scale');
  fPanes.add(params, 'paneHoverDuration', 0, 1, 0.05).name('Hover Tween (s)');
  fPanes.add(params, 'fadeNear', 0, 10, 0.1).name('Fade Near');
  fPanes.add(params, 'fadeFar', 2, 20, 0.1).name('Fade Far');
  fPanes.close();

  // Animator
  const fAnim = gui.addFolder('Animator Scroll');
  fAnim
    .add(params, 'animatorMaxY', -100, 0, 0.1)
    .name('Max Down (Y)')
    .onChange(updateAnimatorFromScroll);
  fAnim.add(params, 'animatorScrollEase', 0.05, 2, 0.05).name('Tween (s)');
  fAnim.close();

  // Clouds / Background shader
  const fCloud = gui.addFolder('Cloud Controls');
  fCloud
    .add(params, 'dpr', 0.5, 2.0, 0.25)
    .name('DPR (resolution)')
    .onChange((v) => {
      params.dpr = v;
      setPixelRatio(v);
    });
  fCloud.add(params, 'autoPerformance').name('Auto Performance');
  fCloud
    .add(params, 'canvasOpacity', 0.0, 1.0, 0.01)
    .name('Canvas Opacity')
    .onChange((v) => (bgMat.uniforms.uCanvasOpacity.value = v));
  fCloud
    .add(params, 'baseColorR', 0.0, 1.0, 0.01)
    .name('Base R')
    .onChange(() =>
      bgMat.uniforms.uBaseColor.value.set(
        params.baseColorR,
        params.baseColorG,
        params.baseColorB
      )
    );
  fCloud
    .add(params, 'baseColorG', 0.0, 1.0, 0.01)
    .name('Base G')
    .onChange(() =>
      bgMat.uniforms.uBaseColor.value.set(
        params.baseColorR,
        params.baseColorG,
        params.baseColorB
      )
    );
  fCloud
    .add(params, 'baseColorB', 0.0, 1.0, 0.01)
    .name('Base B')
    .onChange(() =>
      bgMat.uniforms.uBaseColor.value.set(
        params.baseColorR,
        params.baseColorG,
        params.baseColorB
      )
    );
  fCloud
    .add(params, 'blendMode', Object.keys(blendModes))
    .name('Canvas Blend')
    .onChange((v) => {
      bgMat.blending = blendModes[v] || THREE.NormalBlending;
      bgMat.needsUpdate = true;
    });

  const flow = fCloud.addFolder('Flow');
  flow
    .add(params, 'speed', 0.002, 0.05, 0.001)
    .name('Speed')
    .onChange((v) => (bgMat.uniforms.uSpeed.value = v));
  flow
    .add(params, 'scale', 0.3, 3.0, 0.01)
    .name('Scale (zoom)')
    .onChange((v) => (bgMat.uniforms.uScale.value = v));

  const noise = fCloud.addFolder('Noise / Octaves');
  noise
    .add(params, 'fbmOctaves', 0, 6, 1)
    .name('FBM Octaves')
    .onChange((v) => (bgMat.uniforms.uFbmOctaves.value = v));
  noise
    .add(params, 'ridgeOctaves', 0, 5, 1)
    .name('Ridge Octaves')
    .onChange((v) => (bgMat.uniforms.uRidgeOctaves.value = v));

  const warp = fCloud.addFolder('Domain Warp');
  warp
    .add(params, 'warp1', 0.0, 2.0, 0.01)
    .name('Warp 1')
    .onChange((v) => (bgMat.uniforms.uWarp1.value = v));
  warp
    .add(params, 'warp2', 0.0, 2.0, 0.01)
    .name('Warp 2')
    .onChange((v) => (bgMat.uniforms.uWarp2.value = v));

  const layers = fCloud.addFolder('Layer Amps');
  layers
    .add(params, 'detailsAmp', 0.0, 2.0, 0.01)
    .name('Details (ridge)')
    .onChange((v) => (bgMat.uniforms.uDetailsAmp.value = v));
  layers
    .add(params, 'veilsAmp', 0.0, 2.0, 0.01)
    .name('Veils (fbm)')
    .onChange((v) => (bgMat.uniforms.uVeilsAmp.value = v));

  const tone = fCloud.addFolder('Tone Map');
  tone
    .add(params, 'contrastMin', 0.0, 1, 0.001)
    .name('Black point')
    .onChange((v) => (bgMat.uniforms.uCMin.value = v));
  tone
    .add(params, 'contrastMax', 0.7, 1.0, 0.001)
    .name('White point')
    .onChange((v) => (bgMat.uniforms.uCMax.value = v));

  const hot = fCloud.addFolder('Hotspot');
  hot
    .add(params, 'hotspotOn')
    .name('Enable')
    .onChange((v) => (bgMat.uniforms.uHotspotOn.value = v ? 1 : 0));
  hot
    .add(params, 'hotspotX', 0.0, 1.0, 0.001)
    .name('X')
    .onChange((v) => (bgMat.uniforms.uHotspot.value.x = v));
  hot
    .add(params, 'hotspotY', 0.0, 1.0, 0.001)
    .name('Y')
    .onChange((v) => (bgMat.uniforms.uHotspot.value.y = v));
  hot
    .add(params, 'hotspotInner', 0.0, 1.2, 0.001)
    .name('Inner radius')
    .onChange((v) => (bgMat.uniforms.uHotspot.value.z = v * v));
  hot
    .add(params, 'hotspotOuter', 0.0, 2.0, 0.001)
    .name('Outer radius')
    .onChange((v) => (bgMat.uniforms.uHotspot.value.w = v * v));
  hot
    .add(params, 'hotspotStrength', 0.0, 1.0, 0.01)
    .name('Strength')
    .onChange((v) => (bgMat.uniforms.uHotspotStrength.value = v));

  // Gradient controls
  const fGradient = fCloud.addFolder('Gradient Plane');
  fGradient
    .add(params, 'gradientOpacity', 0.0, 1.0, 0.01)
    .name('Opacity')
    .onChange((v) => (gradMat.uniforms.uGradientOpacity.value = v));
  fGradient
    .add(params, 'gradientCenterX', 0.0, 1.0, 0.01)
    .name('Center X')
    .onChange((v) => (gradMat.uniforms.uGradientCenter.value.x = v));
  fGradient
    .add(params, 'gradientCenterY', 0.0, 1.0, 0.01)
    .name('Center Y')
    .onChange((v) => (gradMat.uniforms.uGradientCenter.value.y = v));
  fGradient
    .add(params, 'gradientStrength', 0.0, 2.0, 0.01)
    .name('Strength')
    .onChange((v) => (gradMat.uniforms.uGradientStrength.value = v));
  fGradient
    .add(params, 'gradientRadius', 0.1, 2.0, 0.01)
    .name('Radius')
    .onChange((v) => (gradMat.uniforms.uGradientRadius.value = v));
  fGradient
    .add(params, 'gradientBlendMode', Object.keys(blendModes))
    .name('Blend')
    .onChange((v) => {
      gradMat.blending = blendModes[v] || THREE.NormalBlending;
      gradMat.needsUpdate = true;
    });
  fCloud.close();

  const fFollow = gui.addFolder('Plate Mouse Follow');
  fFollow.add(params, 'mouseFollow').name('Enabled');
  fFollow.add(params, 'followDelay', 0.05, 1.5, 0.01).name('Tween Delay (s)');
  fFollow.add(params, 'maxPlateRotDeg', 0, 90, 1).name('Max Rotation (°)');
  fFollow.close();

  gui.close();

  return gui;
}

// shaders.js
export const bgVert = `
  varying vec2 vUV;
  void main() {
    vUV = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const bgFrag = `
  precision mediump float;
  varying vec2 vUV;
  uniform float uTime;
  uniform float uAspect;
  uniform float uScale;
  uniform vec2  uSeed;
  uniform float uSpeed;
  uniform int   uFbmOctaves;
  uniform int   uRidgeOctaves;
  uniform float uWarp1;
  uniform float uWarp2;
  uniform float uDetailsAmp;
  uniform float uVeilsAmp;
  uniform float uCMin;
  uniform float uCMax;
  uniform int   uHotspotOn;
  uniform vec4  uHotspot;
  uniform float uHotspotStrength;
  uniform float uCanvasOpacity;
  uniform vec3  uBaseColor;

  vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec2 mod289(vec2 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute(i.y + vec3(0.0, i1.y, 1.0))
                    + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0*fract(p*C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314*(a0*a0 + h*h);
    vec3 g;
    g.x = a0.x*x0.x  + h.x*x0.y;
    g.y = a0.y*x12.x + h.y*x12.y;
    g.z = a0.z*x12.z + h.z*x12.w;
    return 130.0 * dot(m, g);
  }

  float fbmN(vec2 p, int oct){
    float f=0.0, a=0.5;
    const mat2 R = mat2(0.8,-0.6,0.6,0.8);
    for(int i=0;i<6;i++){
      if(i>=oct) break;
      f += a * snoise(p);
      p = R*p*2.0 + 0.01;
      a *= 0.5;
    }
    return f*0.5+0.5;
  }

  float ridgeN(vec2 p, int oct){
    float f=0.0, a=0.5;
    for(int i=0;i<5;i++){
      if(i>=oct) break;
      f += a * (1.0 - abs(snoise(p)));
      p *= 2.05;
      a *= 0.5;
    }
    return clamp(f,0.0,1.0);
  }

  float softLightFast(float a, float b){
    float k = (2.0*b - 1.0);
    return a + k * (a*(1.0 - a)*(1.0 - 0.5*a));
  }

  void main(){
    vec2 uv = vUV;
    vec2 p = vec2((uv.x - 0.5)*uAspect, uv.y - 0.5);
    float t = uTime * uSpeed;
    vec2  q = p * uScale + uSeed;

    vec2 w1 = (uWarp1 > 0.0) ? vec2(fbmN(q*0.9 + t, uFbmOctaves),
                                    fbmN(q*0.9 - t, uFbmOctaves)) : vec2(0.0);
    vec2 w2 = (uWarp2 > 0.0) ? vec2(fbmN(q*1.6 - 0.6*t, uFbmOctaves),
                                    fbmN(q*1.6 + 0.6*t, uFbmOctaves)) : vec2(0.0);
    vec2 pw = q + uWarp1*w1 + uWarp2*w2;

    float base    = fbmN(pw - 0.3*t, uFbmOctaves);
    float details = (uDetailsAmp > 0.0 && uRidgeOctaves>0) ? ridgeN(pw*1.8 + 0.5*t, uRidgeOctaves) : 0.0;
    float veils   = (uVeilsAmp  > 0.0 && uFbmOctaves>0)    ? fbmN(pw*0.55 + 4.0 - 0.2*t, uFbmOctaves) : 0.0;

    float c = softLightFast(base, details*uDetailsAmp);
    c *= mix(1.0, 1.05, veils*uVeilsAmp);

    if(uHotspotOn==1){
      vec2 d = uv - uHotspot.xy;
      float l2 = dot(d,d);
      float hotspot = 1.0 - smoothstep(uHotspot.z, uHotspot.w, l2);
      c = c*0.78 + hotspot*uHotspotStrength;
    }

    c = smoothstep(uCMin, uCMax, c);
    gl_FragColor = vec4(c * uBaseColor, uCanvasOpacity);
  }
`;

export const gradFrag = `
  precision mediump float;
  varying vec2 vUV;
  uniform vec3 uCenterColor;
  uniform vec3 uOuterColor;
  uniform float uGradientOpacity;
  uniform vec2 uGradientCenter;
  uniform float uGradientStrength;
  uniform float uGradientRadius;

  void main() {
    vec2 uv = vUV;
    float dist = length(uv - uGradientCenter) / uGradientRadius;
    float t = smoothstep(0.0, 1.0, dist);
    vec3 color = mix(uCenterColor, uOuterColor, t) * uGradientStrength;
    gl_FragColor = vec4(color, uGradientOpacity);
  }
`;

// turn array → THREE.Vector3 here (keeps params.js free of THREE)
const CONFIG = {
  ...RAW_CONFIG,
  camera: {
    ...RAW_CONFIG.camera,
    pos: new THREE.Vector3(...RAW_CONFIG.camera.pos),
  },
};

// Caches for textures and videos
const textureCache = new Map(); // Key: src (string), Value: THREE.Texture
const videoCache = new Map(); // Key: src (string), Value: { video: HTMLVideoElement, texture: THREE.VideoTexture }

(() => {
  // -----------------------------
  // Config / Params
  // -----------------------------
  const blendModes = {
    normal: THREE.NormalBlending,
    additive: THREE.AdditiveBlending,
    subtractive: THREE.SubtractiveBlending,
    multiply: THREE.MultiplyBlending,
  };

  const texLoader = new THREE.TextureLoader();

  // Texture and video loading with caching
  function getTexture(src) {
    if (!textureCache.has(src)) {
      const tex = texLoader.load(src, undefined, undefined, (err) => {
        console.error(`Failed to load texture ${src}:`, err);
      });
      textureCache.set(src, tex);
    }
    return textureCache.get(src);
  }

  function getVideoTexture(src) {
    if (!videoCache.has(src)) {
      const video = document.createElement('video');
      video.src = src;
      video.muted = true;
      video.loop = false;
      video.preload = 'metadata';
      video.playsInline = true;
      video.crossOrigin = 'anonymous';

      video.addEventListener('ended', () => {
        video._ended = true;
      });

      const videoTex = new THREE.VideoTexture(video);
      videoTex.colorSpace = THREE.SRGBColorSpace;
      videoTex.minFilter = THREE.LinearFilter;
      videoTex.magFilter = THREE.LinearFilter;
      videoTex.generateMipmaps = false;

      videoCache.set(src, { video, texture: videoTex });
    }
    return videoCache.get(src);
  }

  // Throttle function for raycasting
  function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function (...args) {
      if (!lastRan) {
        func(...args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  // -----------------------------
  // Scene
  // -----------------------------
  const scene = new THREE.Scene();

  // -----------------------------
  // Groups
  // -----------------------------
  const walls = new THREE.Group();
  walls.name = 'walls';
  walls.position.set(0, params.wallY, 0);
  scene.add(walls);

  const chefs = new THREE.Group();
  chefs.name = 'chefs';
  chefs.position.set(0, params.wallY, 0);
  scene.add(chefs);

  const panes = new THREE.Group();
  panes.name = 'panes';
  panes.position.set(0, params.panesY, 0);
  scene.add(panes);

  const animator = new THREE.Group();
  animator.name = 'animator';
  scene.add(animator);

  const plateGroup = new THREE.Group();
  plateGroup.name = 'plateGroup';
  animator.add(plateGroup);

  const backgroundGroup = new THREE.Group();
  backgroundGroup.name = 'backgroundGroup';
  backgroundGroup.position.set(0, 0, 5);
  scene.add(backgroundGroup);

  // -----------------------------
  // Materials
  // -----------------------------
  function newSeed() {
    return [Math.random() * 10, Math.random() * 10];
  }
  let seed = newSeed();

  const bgMat = new THREE.ShaderMaterial({
    vertexShader: bgVert,
    fragmentShader: bgFrag,
    uniforms: {
      uTime: { value: 0.0 },
      uAspect: { value: params.bgPlaneX / params.bgPlaneY },
      uScale: { value: params.scale },
      uSeed: { value: new THREE.Vector2(seed[0], seed[1]) },
      uSpeed: { value: params.speed },
      uFbmOctaves: { value: params.fbmOctaves },
      uRidgeOctaves: { value: params.ridgeOctaves },
      uWarp1: { value: params.warp1 },
      uWarp2: { value: params.warp2 },
      uDetailsAmp: { value: params.detailsAmp },
      uVeilsAmp: { value: params.veilsAmp },
      uCMin: { value: params.contrastMin },
      uCMax: { value: params.contrastMax },
      uHotspotOn: { value: params.hotspotOn ? 1 : 0 },
      uHotspot: {
        value: new THREE.Vector4(
          params.hotspotX,
          params.hotspotY,
          params.hotspotInner * params.hotspotInner,
          params.hotspotOuter * params.hotspotOuter
        ),
      },
      uHotspotStrength: { value: params.hotspotStrength },
      uCanvasOpacity: { value: params.canvasOpacity },
      uBaseColor: {
        value: new THREE.Vector3(
          params.baseColorR,
          params.baseColorG,
          params.baseColorB
        ),
      },
    },
    transparent: true,
    side: THREE.DoubleSide,
    blending: blendModes[params.blendMode] || THREE.NormalBlending,
  });

  const gradMat = new THREE.ShaderMaterial({
    vertexShader: bgVert,
    fragmentShader: gradFrag,
    uniforms: {
      uCenterColor: {
        value: new THREE.Vector3(
          params.gradientCenterColorR,
          params.gradientCenterColorG,
          params.gradientCenterColorB
        ),
      },
      uOuterColor: {
        value: new THREE.Vector3(
          params.gradientOuterColorR,
          params.gradientOuterColorG,
          params.gradientOuterColorB
        ),
      },
      uGradientOpacity: { value: params.gradientOpacity },
      uGradientCenter: {
        value: new THREE.Vector2(
          params.gradientCenterX,
          params.gradientCenterY
        ),
      },
      uGradientStrength: { value: params.gradientStrength },
      uGradientRadius: { value: params.gradientRadius },
    },
    transparent: true,
    side: THREE.DoubleSide,
    blending: blendModes[params.gradientBlendMode] || THREE.NormalBlending,
  });

  // -----------------------------
  // Renderer
  // -----------------------------
  const container = document.getElementById('webgl');
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const initDPR = Math.min(window.devicePixelRatio || 1, CONFIG.maxDPR);
  renderer.setPixelRatio(params.dpr);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // -----------------------------
  // Camera
  // -----------------------------
  const camera = new THREE.PerspectiveCamera(
    CONFIG.camera.fov,
    container.clientWidth / container.clientHeight,
    CONFIG.camera.near,
    CONFIG.camera.far
  );
  camera.position.copy(CONFIG.camera.pos);
  camera.lookAt(animator.position);
  animator.add(camera);

  // -----------------------------
  // Lights
  // -----------------------------
  const pointLight = new THREE.PointLight(0xffffff, params.lightIntensity, 20);
  pointLight.position.set(params.lightX, params.lightY, params.lightZ);
  animator.add(pointLight);
  const lightHelper = new THREE.PointLightHelper(pointLight, 0.1);
  scene.add(lightHelper);

  // -----------------------------
  // Utils: applyCoverUV
  // -----------------------------
  function applyCoverUV(tex, planeW, planeH) {
    const img = tex.image;
    if (!img || !img.width || !img.height) return;

    const imgAspect = img.width / img.height;
    const planeAspect = planeW / planeH;

    tex.center.set(0.5, 0.5);
    tex.offset.set(0, 0);
    tex.repeat.set(1, 1);
    tex.rotation = 0;

    if (imgAspect > planeAspect) {
      const rx = planeAspect / imgAspect;
      tex.repeat.set(rx, 1);
    } else {
      const ry = imgAspect / planeAspect;
      tex.repeat.set(1, ry);
    }

    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    tex.needsUpdate = true;
  }

  // -----------------------------
  // Utils: Rounded plane + UVs
  // -----------------------------
  function clampFillet(w, h, r) {
    return Math.max(0, Math.min(r, 0.5 * Math.min(w, h) - 1e-6));
  }

  function makeRoundedPlaneGeometry(w, h, r, curveSegments = 8) {
    const rr = clampFillet(w, h, r);
    const x = -w / 2,
      y = -h / 2;
    const s = new THREE.Shape();

    s.moveTo(x + rr, y);
    s.lineTo(x + w - rr, y);
    s.quadraticCurveTo(x + w, y, x + w, y + rr);
    s.lineTo(x + w, y + h - rr);
    s.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    s.lineTo(x + rr, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - rr);
    s.lineTo(x, y + rr);
    s.quadraticCurveTo(x, y, x + rr, y);

    return new THREE.ShapeGeometry(s, curveSegments);
  }

  function normalizeUVsToBounds(geometry) {
    geometry.computeBoundingBox();
    const bb = geometry.boundingBox;
    const pos = geometry.attributes.position;
    const count = pos.count;

    const uv = new Float32Array(count * 2);
    const spanX = bb.max.x - bb.min.x || 1;
    const spanY = bb.max.y - bb.min.y || 1;

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i),
        y = pos.getY(i);
      uv[2 * i] = (x - bb.min.x) / spanX;
      uv[2 * i + 1] = (y - bb.min.y) / spanY;
    }
    geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geometry.attributes.uv.needsUpdate = true;
  }

  function disposeChildren(
    group,
    { disposeMaterials = true, excludeMaterials = [] } = {}
  ) {
    const geometries = new Set();
    const materials = new Set();
    const textures = new Set();

    group.traverse((obj) => {
      if (obj.isMesh) {
        if (obj.geometry) geometries.add(obj.geometry);
        if (disposeMaterials) {
          const pushMat = (m) => {
            if (m && !excludeMaterials.includes(m)) {
              if (m.map) textures.add(m.map);
              materials.add(m);
            }
          };
          if (Array.isArray(obj.material)) obj.material.forEach(pushMat);
          else pushMat(obj.material);
        }
      }
    });

    group.clear();
    geometries.forEach((g) => g.dispose && g.dispose());
    materials.forEach((m) => m.dispose && m.dispose());
    textures.forEach((t) => t.dispose && t.dispose());
  }

  // -----------------------------
  // Utils: Text Sprite Creation
  // -----------------------------
  function createTextSprite(name, desc) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Style text (no black background)
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(name, 10, 30);
    ctx.font = '12px Arial';
    ctx.fillText(desc, 10, 50);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0, // Initially invisible
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(params.chefSizeX * 0.8, params.chefSizeY * 0.4, 1); // Scale relative to chef size
    sprite.position.set(-params.chefSizeX * 0.4, -params.chefSizeY * 0.5, 0.01); // Bottom left, slightly above chef plane

    // Wrap sprite in a group to apply rotation
    const spriteGroup = new THREE.Group();
    spriteGroup.add(sprite);
    return spriteGroup;
  }

  // -----------------------------
  // Utils: pointer & raycaster
  // -----------------------------
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hoveredPaneIndex = -1;
  let hoveredChefIndex = -1;
  let chefMedia = [];
  let paneMedia = [];
  let previousActive = -1;

  // -----------------------------
  // ANIMATION : Pane & Chef hover
  // -----------------------------
  function onPointerMove(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    // Pane hover
    const paneIntersects = raycaster.intersectObjects(panes.children, true);
    const paneHit = paneIntersects.length ? paneIntersects[0].object : null;
    const newPaneIndex = paneHit ? paneHit.userData.index : -1;

    if (newPaneIndex !== hoveredPaneIndex) {
      if (hoveredPaneIndex !== -1) {
        const pane = paneMedia[hoveredPaneIndex]?.mesh;
        if (pane) {
          gsap.to(pane.scale, {
            x: 1,
            y: 1,
            duration: params.paneHoverDuration,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      }
      if (newPaneIndex !== -1 && newPaneIndex === previousActive) {
        const pane = paneMedia[newPaneIndex]?.mesh;
        if (pane) {
          gsap.to(pane.scale, {
            x: params.paneHoverScale,
            y: params.paneHoverScale,
            duration: params.paneHoverDuration,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      }
      hoveredPaneIndex = newPaneIndex;
    }

    // Chef hover
    const chefIntersects = raycaster.intersectObjects(chefs.children, true);
    const chefHit = chefIntersects.length ? chefIntersects[0].object : null;
    const newChefIndex = chefHit ? chefHit.userData.index : -1;

    if (newChefIndex !== hoveredChefIndex) {
      if (hoveredChefIndex !== -1 && chefMedia[hoveredChefIndex]) {
        const chef = chefMedia[hoveredChefIndex];
        gsap.to(chef.mat.uniforms.uExposure, {
          value: 0.5,
          duration: params.chefHoverDuration,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(chef.textSprite.children[0].material, {
          opacity: 0,
          duration: params.chefHoverDuration,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(chef.textSprite.children[0].position, {
          y: -params.chefSizeY * 0.5,
          duration: params.chefHoverDuration,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
      if (newChefIndex !== -1 && chefMedia[newChefIndex]) {
        const chef = chefMedia[newChefIndex];
        gsap.to(chef.mat.uniforms.uExposure, {
          value: 1.0,
          duration: params.chefHoverDuration,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(chef.textSprite.children[0].material, {
          opacity: 1.0,
          duration: params.chefHoverDuration,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(chef.textSprite.children[0].position, {
          y: -params.chefSizeY * 0.5 - 0.2,
          duration: params.chefHoverDuration,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        renderer.domElement.style.cursor = 'pointer';
      } else {
        renderer.domElement.style.cursor = 'auto';
      }
      hoveredChefIndex = newChefIndex;
    }
  }

  function onPointerLeave() {
    // Pane leave
    if (hoveredPaneIndex !== -1 && paneMedia[hoveredPaneIndex]) {
      const pane = paneMedia[hoveredPaneIndex].mesh;
      gsap.to(pane.scale, {
        x: 1,
        y: 1,
        duration: params.paneHoverDuration,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      hoveredPaneIndex = -1;
    }

    // Chef leave
    if (hoveredChefIndex !== -1 && chefMedia[hoveredChefIndex]) {
      const chef = chefMedia[hoveredChefIndex];
      gsap.to(chef.mat.uniforms.uExposure, {
        value: 0.5,
        duration: params.chefHoverDuration,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(chef.textSprite.children[0].material, {
        opacity: 0,
        duration: params.chefHoverDuration,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(chef.textSprite.children[0].position, {
        y: -params.chefSizeY * 0.5,
        duration: params.chefHoverDuration,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      renderer.domElement.style.cursor = 'auto';
      hoveredChefIndex = -1;
    }
  }

  function onPointerClick(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    // Chef click
    const chefIntersects = raycaster.intersectObjects(chefs.children, true);
    const chefHit = chefIntersects.length ? chefIntersects[0].object : null;
    const chefIndex = chefHit ? chefHit.userData.index : -1;

    if (chefIndex !== -1 && chefMedia[chefIndex]) {
      const chefData = chefImages[Math.floor(chefIndex / 2)];
      if (chefData.chefLink) {
        window.location.href = chefData.chefLink; // Redirect in same tab
      }
    }
  }

  renderer.domElement.addEventListener(
    'pointermove',
    throttle(onPointerMove, 16),
    {
      passive: true,
    }
  );
  renderer.domElement.addEventListener('pointerleave', onPointerLeave);
  renderer.domElement.addEventListener('click', onPointerClick);

  function playPane(idx) {
    const m = paneMedia[idx];
    if (!m) return;

    if (m.video._ended) {
      m.video.currentTime = 0;
      m.video._ended = false;
    }

    const p = m.video.play();
    if (p && typeof p.then === 'function')
      p.catch(() => {
        /* ignore policy errors */
      });
  }

  function pausePane(idx) {
    const m = paneMedia[idx];
    if (!m) return;
    m.video.pause();
  }

  // -----------------------------
  // ANIMATION : Plate hover
  // -----------------------------
  function onPointerMovePlate(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (!plate || !params.mouseFollow) return;

    const maxRotRad = THREE.MathUtils.degToRad(params.maxPlateRotDeg);
    const baseRotY = Math.PI / 2;

    const targetRotX = pointer.y * maxRotRad;
    const targetRotY = pointer.x * maxRotRad + baseRotY;

    plateRotX(targetRotX);
    plateRotY(targetRotY);
  }

  function onPointerLeavePlate() {
    if (!plate) return;

    const baseRotY = Math.PI / 2;

    plateRotX(0);
    plateRotY(baseRotY);
  }

  renderer.domElement.addEventListener(
    'pointermove',
    throttle(onPointerMovePlate, 16),
    {
      passive: true,
    }
  );
  renderer.domElement.addEventListener('pointerleave', onPointerLeavePlate);

  // -----------------------------
  // Scroll animator
  // -----------------------------
  const scrollSection = document.getElementById('scrollspace');
  const animatorY = gsap.quickTo(animator.position, 'y', {
    duration: params.animatorScrollEase,
    ease: 'expo.out',
    overwrite: true,
  });
  const animatorRotX = gsap.quickTo(animator.rotation, 'x', {
    duration: params.animatorScrollEase,
    ease: 'expo.out',
    overwrite: true,
  });
  let panesRotY = gsap.quickTo(panes.rotation, 'y', {
    duration: params.panesScrollEase,
    ease: 'expo.out',
    overwrite: true,
  });

  function setPanesTweenDuration(dur) {
    panesRotY = gsap.quickTo(panes.rotation, 'y', {
      duration: dur,
      ease: 'expo.out',
      overwrite: true,
    });
  }

  function sectionProgress() {
    const rect = scrollSection.getBoundingClientRect();
    const vh = window.innerHeight;
    const scrolled = -rect.top;
    const maxScroll = Math.max(1, rect.height - vh);
    const progress = Math.min(1, Math.max(0, scrolled / maxScroll));
    return progress;
  }

  function updateAnimatorFromScroll() {
    const t = sectionProgress();
    const yTarget = THREE.MathUtils.lerp(
      params.animatorMinY,
      params.animatorMaxY,
      t
    );
    animatorY(yTarget);
    const below = yTarget <= params.animatorRotateThresholdX;
    const animatorRotTarget = below
      ? THREE.MathUtils.degToRad(params.animatorRotateOnDeg)
      : 0;
    animatorRotX(animatorRotTarget);
    const rotTarget = THREE.MathUtils.degToRad(
      THREE.MathUtils.lerp(-params.panesRotMinDeg, -params.panesRotMaxDeg, t)
    );
    panesRotY(rotTarget);
    const gradientOpacityTarget = below ? 0 : params.gradientOpacity;
    gsap.quickTo(gradMat.uniforms.uGradientOpacity, 'value', {
      duration: params.animatorScrollEase,
      ease: 'expo.out',
      overwrite: true,
    })(gradientOpacityTarget);
  }

  window.addEventListener('scroll', updateAnimatorFromScroll, {
    passive: true,
  });
  window.addEventListener('resize', updateAnimatorFromScroll);
  updateAnimatorFromScroll();

  // -----------------------------
  // Stats
  // -----------------------------
  const stats = new Stats();
  stats.showPanel(0);
  document.getElementById('stats').appendChild(stats.dom);

  // -----------------------------
  // Shared materials
  // -----------------------------
  function createGradientStandardMaterial({
    colorA = '#000000',
    colorB = '#333333',
    base = {},
  } = {}) {
    const mat = new THREE.MeshStandardMaterial({
      roughness: 0.6,
      metalness: 0.5,
      ...base,
    });

    const cA = new THREE.Color(colorA).convertSRGBToLinear();
    const cB = new THREE.Color(colorB).convertSRGBToLinear();

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uColorA = { value: new THREE.Vector3(cA.r, cA.g, cA.b) };
      shader.uniforms.uColorB = { value: new THREE.Vector3(cB.r, cB.g, cB.b) };

      shader.vertexShader = `
      varying vec2 vUv;
      ${shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        vUv = uv;
        `
      )}
    `;

      shader.fragmentShader = `
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      varying vec2 vUv;
      ${shader.fragmentShader.replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        `
        float t = vUv.x;
        vec3 grad = mix(uColorA, uColorB, t);
        vec4 diffuseColor = vec4(grad, opacity);
        `
      )}
    `;
    };

    return mat;
  }

  const wallMat = createGradientStandardMaterial({
    colorA: '#000000',
    colorB: '#666666',
    base: { roughness: 0.6, metalness: 0.7 },
  });

  const wallMatInverse = createGradientStandardMaterial({
    colorA: '#666666',
    colorB: '#000000',
    base: { roughness: 0.6, metalness: 0.7 },
  });

  const plateMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 1.4,
    metalness: 0.5,
    roughnessMap: texLoader.load('assets/plate/roughness.jpg', (tex) => {
      tex.flipY = false;
      if (tex.colorSpace !== undefined) tex.colorSpace = THREE.NoColorSpace;
    }),
  });

  // -----------------------------
  // Plate model
  // -----------------------------
  function addLogoTo(plate) {
    texLoader.load('assets/plate/logo.png', (tex) => {
      const aspect = (tex.image?.width || 1) / (tex.image?.height || 1);
      const H = 0.45;
      const geom = new THREE.PlaneGeometry(H * aspect, H);
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        transparent: true,
        roughness: 0.6,
        metalness: 0.6,
      });

      const logo = new THREE.Mesh(geom, mat);
      logo.rotation.set(0, Math.PI / 2, 0);
      logo.position.z = 0;

      logo.renderOrder = 1;
      plate.add(logo);
    });
  }

  let plate = null;
  let plateRotX;
  let plateRotY;

  const loader = new THREE.GLTFLoader();
  loader.load(
    'assets/plate/plate.glb',
    (gltf) => {
      plate = gltf.scene;
      plate.traverse((o) => {
        if (o.isMesh) {
          o.material = plateMat;
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });

      plate.scale.set(1, 1, 1);
      plate.position.set(0, 0, 0);
      plate.rotation.set(0, Math.PI / 2, 0);

      plateGroup.add(plate);

      plateRotX = gsap.quickTo(plate.rotation, 'x', {
        duration: params.followDelay,
        ease: 'power2.out',
      });
      plateRotY = gsap.quickTo(plate.rotation, 'y', {
        duration: params.followDelay,
        ease: 'power2.out',
      });

      addLogoTo(plate);
    },
    undefined,
    (err) => {
      console.warn('Failed to load plate.glb, using fallback cube', err);
      const geom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const fallbackPlate = new THREE.Mesh(geom, plateMat);
      plateGroup.add(fallbackPlate);
      plate = fallbackPlate;

      plateRotX = gsap.quickTo(plate.rotation, 'x', {
        duration: params.followDelay,
        ease: 'power2.out',
      });
      plateRotY = gsap.quickTo(plate.rotation, 'y', {
        duration: params.followDelay,
        ease: 'power2.out',
      });

      addLogoTo(plate);
    }
  );

  // -----------------------------
  // Background and Gradient Planes
  // -----------------------------
  const background = new THREE.Group();
  background.add(
    new THREE.Mesh(
      new THREE.PlaneGeometry(params.bgPlaneX, params.bgPlaneY),
      bgMat
    )
  );
  background.position.y = params.bgPlaneLocY;
  background.rotation.x = Math.PI;
  backgroundGroup.add(background);

  const gradientPlane = new THREE.Group();
  gradientPlane.add(
    new THREE.Mesh(
      new THREE.PlaneGeometry(params.bgPlaneX, params.bgPlaneY),
      gradMat
    )
  );
  gradientPlane.position.set(0, params.bgPlaneLocY, 4.5);
  gradientPlane.rotation.x = Math.PI;
  scene.add(gradientPlane);

  // -----------------------------
  // Builders
  // -----------------------------
  function buildWalls() {
    disposeChildren(walls, {
      disposeMaterials: true,
      excludeMaterials: [wallMat, wallMatInverse],
    });
    const geometry = new THREE.PlaneGeometry(
      params.wallSizeX,
      params.wallSizeY
    );
    const count = CONFIG.walls.count;
    const instancedMeshLeft = new THREE.InstancedMesh(
      geometry,
      wallMatInverse,
      count
    );
    const instancedMeshRight = new THREE.InstancedMesh(
      geometry,
      wallMat,
      count
    );
    const matrix = new THREE.Matrix4();
    const spacingY = params.wallSpacingY;
    const angleRad = THREE.MathUtils.degToRad(params.wallAngleDeg);
    const startY = -((count - 1) * spacingY) / 2;

    for (let i = 0; i < count; i++) {
      const y = startY + i * spacingY;
      matrix.identity();
      matrix.setPosition(-params.wallOffsetX, y, 0);
      matrix.multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));
      matrix.multiply(new THREE.Matrix4().makeRotationY(-angleRad + Math.PI));
      instancedMeshLeft.setMatrixAt(i, matrix);
      matrix.identity();
      matrix.setPosition(+params.wallOffsetX, y, 0);
      matrix.multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));
      matrix.multiply(new THREE.Matrix4().makeRotationY(+angleRad + Math.PI));
      instancedMeshRight.setMatrixAt(i, matrix);
    }

    walls.add(instancedMeshLeft, instancedMeshRight);
    walls.position.y = params.wallY;
  }

  function buildPanes() {
    if (paneMedia && paneMedia.length) {
      for (const m of paneMedia) {
        try {
          m.video?.pause();
        } catch {}
      }
    }

    disposeChildren(panes, { disposeMaterials: true, excludeMaterials: [] });
    paneMedia = [];

    const n = CONFIG.panes.count;
    const twistTotalRad = THREE.MathUtils.degToRad(params.paneTwistDeg * n);
    const planeW = params.paneSizeX;
    const planeH = params.paneSizeY;

    const spiralPlaneLocal = makeRoundedPlaneGeometry(
      planeW,
      planeH,
      params.paneFillet,
      params.paneCurveSegments
    );
    normalizeUVsToBounds(spiralPlaneLocal);

    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0 : i / (n - 1);
      const angle = t * twistTotalRad;
      const r = params.paneRadius;
      const px = Math.cos(angle) * r;
      const pz = Math.sin(angle) * r;
      const py = t * params.paneRise * n;

      const paneVert = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;

      const paneFrag = `
        uniform sampler2D map;
        uniform float uSaturation;
        uniform float uExposure;
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(map, vUv);
          float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
          vec3 finalColor = mix(vec3(gray), color.rgb, uSaturation);
          finalColor *= uExposure;
          gl_FragColor = vec4(finalColor, color.a * uOpacity);
        }
      `;

      const mat = new THREE.ShaderMaterial({
        vertexShader: paneVert,
        fragmentShader: paneFrag,
        uniforms: {
          map: { value: null },
          uSaturation: { value: 0.0 },
          uExposure: { value: 1.0 },
          uOpacity: { value: 1.0 },
        },
        side: THREE.DoubleSide,
        transparent: true,
      });

      const pane = new THREE.Mesh(spiralPlaneLocal, mat);
      pane.position.set(px, py, pz);
      pane.lookAt(0, py, 0);
      pane.rotation.y += Math.PI;
      pane.frustumCulled = false;
      pane.userData.index = i;
      pane.scale.set(1, 1, 1);
      panes.add(pane);

      const src = paneVideos[i % paneVideos.length];
      const { video, texture: videoTex } = getVideoTexture(src);
      mat.uniforms.map.value = videoTex;
      mat.needsUpdate = true;

      paneMedia.push({ mesh: pane, mat, video, videoTex, index: i });
    }

    panes.position.y = params.panesY;
  }

  function buildChefs() {
    disposeChildren(chefs, { disposeMaterials: true, excludeMaterials: [] });
    chefMedia = []; // Clear chefMedia to avoid stale references

    const chefPlaneLocal = new THREE.PlaneGeometry(
      params.chefSizeX,
      params.chefSizeY
    );
    const count = Math.floor(CONFIG.walls.count / 2);
    const spacingY = params.wallSpacingY * 2;
    const angleRad = THREE.MathUtils.degToRad(params.wallAngleDeg);
    const startY = -((count - 1) * spacingY) / 2;

    const leftGroup = new THREE.Group();
    const rightGroup = new THREE.Group();

    const chefVert = `
    varying vec2 vUv;
    varying vec3 vWorldPos;
    void main() {
      vUv = uv;
      vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const chefFrag = `
    uniform sampler2D map;
    uniform float uExposure;
    uniform float uOpacity;
    uniform vec3 uCameraPos;
    varying vec2 vUv;
    varying vec3 vWorldPos;
    void main() {
      vec4 color = texture2D(map, vUv);
      float dist = length(vWorldPos - uCameraPos);
      float opacity = clamp((10.0 - dist) / (10.0 - 2.0), 0.0, 1.0);
      vec3 finalColor = color.rgb * uExposure;
      gl_FragColor = vec4(finalColor, color.a * opacity * uOpacity);
    }
  `;

    for (let i = 0; i < count; i++) {
      const y = startY + i * spacingY;
      const chefDataRight = chefImages[i % chefImages.length];
      const chefDataLeft = chefImages[(i + count) % chefImages.length];

      // Right chef group
      const rightSrc = chefDataRight.imageLink;
      const rightTex = getTexture(rightSrc);
      const rightMat = new THREE.ShaderMaterial({
        vertexShader: chefVert,
        fragmentShader: chefFrag,
        uniforms: {
          map: { value: rightTex },
          uExposure: { value: 0.5 },
          uOpacity: { value: 1.0 },
          uCameraPos: { value: new THREE.Vector3() },
        },
        side: THREE.DoubleSide,
        transparent: true,
      });
      applyCoverUV(rightTex, params.chefSizeX, params.chefSizeY);
      const rightMesh = new THREE.Mesh(chefPlaneLocal, rightMat);
      const rightTextSprite = createTextSprite(
        chefDataRight.chefName,
        chefDataRight.chefDesc
      );
      const rightChefGroup = new THREE.Group();
      rightChefGroup.add(rightMesh, rightTextSprite);
      rightChefGroup.position.set(+params.wallOffsetX - params.chefLocX, y, 0);
      rightChefGroup.rotation.set(Math.PI / 2, +angleRad + Math.PI, 0);
      rightChefGroup.userData.index = i * 2;
      rightChefGroup.frustumCulled = false;
      rightChefGroup.children.forEach((child) => {
        child.userData.index = i * 2;
      });
      rightGroup.add(rightChefGroup);
      chefMedia.push({
        mesh: rightMesh,
        mat: rightMat,
        textSprite: rightTextSprite,
        index: i * 2,
      });

      // Left chef group
      const leftSrc = chefDataLeft.imageLink;
      const leftTex = getTexture(leftSrc);
      const leftMat = new THREE.ShaderMaterial({
        vertexShader: chefVert,
        fragmentShader: chefFrag,
        uniforms: {
          map: { value: leftTex },
          uExposure: { value: 0.5 },
          uOpacity: { value: 1.0 },
          uCameraPos: { value: new THREE.Vector3() },
        },
        side: THREE.DoubleSide,
        transparent: true,
      });
      applyCoverUV(leftTex, params.chefSizeX, params.chefSizeY);
      const leftMesh = new THREE.Mesh(chefPlaneLocal, leftMat);
      const leftTextSprite = createTextSprite(
        chefDataLeft.chefName,
        chefDataLeft.chefDesc
      );
      const leftChefGroup = new THREE.Group();
      leftChefGroup.add(leftMesh, leftTextSprite);
      leftChefGroup.position.set(-params.wallOffsetX + params.chefLocX, y, 0);
      leftChefGroup.rotation.set(Math.PI / 2, -angleRad + Math.PI, 0);
      leftChefGroup.userData.index = i * 2 + 1;
      leftChefGroup.frustumCulled = false;
      leftChefGroup.children.forEach((child) => {
        child.userData.index = i * 2 + 1;
      });
      leftGroup.add(leftChefGroup);
      chefMedia.push({
        mesh: leftMesh,
        mat: leftMat,
        textSprite: leftTextSprite,
        index: i * 2 + 1,
      });
    }

    chefs.add(leftGroup, rightGroup);
    chefs.position.y = params.wallY + params.chefLocY;

    // Debug log to verify chefMedia population
    console.log('chefMedia populated:', chefMedia.length, 'items');
  }

  buildWalls();
  buildPanes();
  buildChefs();

  // -----------------------------
  // GUI
  // -----------------------------
  createDebugPanel(params, {
    THREE,
    renderer,
    pointLight,
    walls,
    panes,
    chefs,
    animator,
    buildWalls,
    buildPanes,
    buildChefs,
    bgMat,
    gradMat,
    updateAnimatorFromScroll,
    setPanesTweenDuration,
    setPixelRatio: (v) => renderer.setPixelRatio(v),
    blendModes,
  });

  // -----------------------------
  // Resize
  // -----------------------------
  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  // -----------------------------
  // Animate
  // -----------------------------
  let frameCount = 0,
    tPrev = performance.now();
  const targetFPSHigh = 58,
    targetFPSLow = 28;

  function adaptPerformance() {
    if (!params.autoPerformance) return;
    const now = performance.now();
    frameCount++;
    if (now - tPrev >= 750) {
      const fps = (frameCount * 1000) / (now - tPrev);
      if (fps < targetFPSLow && params.fbmOctaves > 4) {
        params.fbmOctaves = 4;
        bgMat.uniforms.uFbmOctaves.value = params.fbmOctaves;
        console.log('octaves :', params.fbmOctaves);
      } else if (fps > targetFPSHigh && params.fbmOctaves < 6) {
        params.fbmOctaves = 6;
        bgMat.uniforms.uFbmOctaves.value = params.fbmOctaves;
        console.log('octaves :', params.fbmOctaves);
      }
      console.log('octaves :', params.fbmOctaves);
      frameCount = 0;
      tPrev = now;
    }
  }

  const t0 = performance.now();
  renderer.setAnimationLoop(() => {
    stats.begin();
    bgMat.uniforms.uTime.value = (performance.now() - t0) / 1000.0;
    adaptPerformance();

    let minZ = Infinity;
    let candidates = [];

    const cameraWorldPos = new THREE.Vector3();
    camera.getWorldPosition(cameraWorldPos);

    // Update chef material camera position
    for (const m of chefMedia) {
      m.mat.uniforms.uCameraPos.value.copy(cameraWorldPos);
    }

    for (let i = 0; i < panes.children.length; i++) {
      const pane = panes.children[i];
      const worldPos = new THREE.Vector3();
      pane.getWorldPosition(worldPos);
      const z = worldPos.z;
      if (z < minZ) {
        minZ = z;
        candidates = [i];
      } else if (z === minZ) {
        candidates.push(i);
      }
    }

    let activeIndex = -1;
    if (candidates.length === 1) {
      activeIndex = candidates[0];
    } else if (candidates.length > 1) {
      let minDist = Infinity;
      for (let idx of candidates) {
        const pane = panes.children[idx];
        const worldPos = new THREE.Vector3();
        pane.getWorldPosition(worldPos);
        const dist = cameraWorldPos.distanceTo(worldPos);
        if (dist < minDist) {
          minDist = dist;
          activeIndex = idx;
        }
      }
    }

    if (activeIndex !== previousActive) {
      if (previousActive !== -1) {
        const m = paneMedia[previousActive];
        pausePane(previousActive);
        gsap.to(m.mat.uniforms.uSaturation, {
          value: 0,
          duration: params.paneColorTransition,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
      if (activeIndex !== -1) {
        const m = paneMedia[activeIndex];
        playPane(activeIndex);
        gsap.to(m.mat.uniforms.uSaturation, {
          value: 1,
          duration: params.paneColorTransition,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
      previousActive = activeIndex;
    }

    if (hoveredPaneIndex !== -1 && hoveredPaneIndex !== activeIndex) {
      const pane = paneMedia[hoveredPaneIndex].mesh;
      gsap.to(pane.scale, {
        x: 1,
        y: 1,
        duration: params.paneHoverDuration,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    for (const m of paneMedia) {
      const pane = m.mesh;
      const worldPos = new THREE.Vector3();
      pane.getWorldPosition(worldPos);
      const zDist = Math.abs(worldPos.z - cameraWorldPos.z);
      if (zDist > params.fadeFar + 1) {
        m.mat.uniforms.uOpacity.value = 0;
        m.mat.uniforms.uExposure.value = 0;
        continue;
      }
      const factor = THREE.MathUtils.clamp(
        (params.fadeFar - zDist) / (params.fadeFar - params.fadeNear || 0.001),
        0,
        1
      );
      m.mat.uniforms.uOpacity.value = factor;
      m.mat.uniforms.uExposure.value = factor;
    }

    renderer.render(scene, camera);
    stats.end();
  });
})();
