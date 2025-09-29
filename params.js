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
  paneSizeX: 1,
  paneSizeY: 1.77,
  paneRadius: 1,
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
  fadeNear: 1.8,
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
  animatorRotateThresholdX: -12,
  animatorRotateOnDeg: 90,
  animatorFadeStart: -27,

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
  'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e%2F68d4e9f6ee7be1982228db5a_6-transcode.mp4',
  'https://bunqlabs.github.io/house-of-samuha/assets/panes/5.webm',
  'https://bunqlabs.github.io/house-of-samuha/assets/panes/4.webm',
  'https://bunqlabs.github.io/house-of-samuha/assets/panes/3.webm',
  'https://bunqlabs.github.io/house-of-samuha/assets/panes/2.webm',
  'https://bunqlabs.github.io/house-of-samuha/assets/panes/1.webm',
];

export const chefImages = [
  {
    imageLink:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68cbce715782e5fdcaedac20_5.jpg',
    chefName: 'Chef Nikos',
    chefLink: 'https://house-of-samuha.webflow.io/chefs/chef-nikos-demetriou',
    chefTitle:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68da68c69bf32c1d3b4047ea_5.png',
  },

  {
    imageLink:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68cbce713dc86ed94f54e64d_3.jpg',
    chefName: 'Chef Malik',
    chefLink: 'https://house-of-samuha.webflow.io/chefs/chef-malik-johnson',
    chefTitle:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68da68c6d7bbcab182113e68_3.png',
  },
  {
    imageLink:
      'https://cdn.prod.website-files.com/68cbd4317d1a4230f02acfbd/68cbd5d6a1ab6884c0722405_1.jpg',
    chefName: 'Chef Jia',
    chefLink: 'https://house-of-samuha.webflow.io/chefs/chef-jia-chen',
    chefTitle:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68da68c645c6f790ce038338_1.png',
  },
  {
    imageLink:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68cbce71a1ab6884c06f7dc5_4.jpg',
    chefName: 'Chef Marco',
    chefLink: 'https://house-of-samuha.webflow.io/chefs/chef-marco-de-santis',
    chefTitle:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68da68c6fd9ef5ed64e34c6f_4.png',
  },
  {
    imageLink:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68cbce717107c1a68d7f3a69_2.jpg',
    chefName: 'Chef Bennett',
    chefLink: 'https://house-of-samuha.webflow.io/chefs/chef-bennett-shaw',
    chefTitle:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68da68c69bf32c1d3b4047e7_2.png',
  },
  {
    imageLink:
      'https://cdn.prod.website-files.com/68cbd4317d1a4230f02acfbd/68cbd45ac846b4f282cb75a4_0.jpg',
    chefName: 'Chef Antonio',
    chefLink: 'https://house-of-samuha.webflow.io/chefs/chef-antonio-ricci',
    chefTitle:
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68da68c6d98717542ad88280_0.png',
  },
];
