export const CONFIG = {
  maxDPR: 2,
  camera: { fov: 60, near: 0.1, far: 100, pos: [0, 0, -3] },
  panes: { count: 6 },
  walls: { count: 6 },
};

export const params = {
  wallSizeX: 3,
  wallSizeY: 20,
  wallSpacingY: 3,
  wallOffsetX: 4.5,
  wallAngleDeg: 45,
  wallY: -25,
  chefSizeX: 2.1,
  chefSizeY: 3.8,
  chefLocX: 0.3,
  chefLocY: -1.7,
  chefHoverDuration: 0.3,
  chefOpacityNear: 0.0,
  chefOpacityFar: 20.0,

  panesY: -8,
  paneSizeX: 0.84375,
  paneSizeY: 1.5,
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
  'https://bunqlabs.github.io/house-of-samuha/Videos/1.mp4',
  'https://bunqlabs.github.io/house-of-samuha/Videos/2.mp4',
  'https://bunqlabs.github.io/house-of-samuha/Videos/3.mp4',
  'https://bunqlabs.github.io/house-of-samuha/Videos/4.mp4',
  'https://bunqlabs.github.io/house-of-samuha/Videos/5.mp4',
  'https://bunqlabs.github.io/house-of-samuha/Videos/6.mp4',
];

export const chefImages = [
  {
    imageLink:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68cbce71b457bbb25fdf041f_0.jpg',
    chefName: 'Chef Alice',
    chefLink: 'https://house-of-samuha.webflow.io/',
    chefTitle:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68cbcbabeaf3a242b2a92d07_0.png',
  },
  {
    imageLink:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68cbce71a9e9ecfe9222cbb9_1.jpg',
    chefName: 'Chef Bob',
    chefLink: 'https://house-of-samuha.webflow.io/',
    chefTitle:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68cbc9e0adcc360b7449ce36_1.png',
  },
  {
    imageLink:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68cbce717107c1a68d7f3a69_2.jpg',
    chefName: 'Chef Clara',
    chefLink: 'https://house-of-samuha.webflow.io/',
    chefTitle:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68cbcbabce139335c7269a30_2.png',
  },
  {
    imageLink:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68cbce713dc86ed94f54e64d_3.jpg',
    chefName: 'Chef David',
    chefLink: 'https://house-of-samuha.webflow.io/',
    chefTitle:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68cbc9e03b6eef17cce0e219_4.png',
  },
  {
    imageLink:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68cbce71a1ab6884c06f7dc5_4.jpg',
    chefName: 'Chef Emma',
    chefLink: 'https://house-of-samuha.webflow.io/',
    chefTitle:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68cbcbabecf34c8ceebbea1b_4.png',
  },
  {
    imageLink:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68cbce715782e5fdcaedac20_5.jpg',
    chefName: 'Chef Frank',
    chefLink: 'https://house-of-samuha.webflow.io/',
    chefTitle:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68cbcbab06a080472106d8fa_5.png',
  },
];
