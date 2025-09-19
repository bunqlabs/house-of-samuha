import {
  bgVert,
  bgFrag,
  gradFrag,
} from 'https://bunqlabs.github.io/house-of-samuha/shaders.js';
import {
  CONFIG as RAW_CONFIG,
  params,
  paneImages,
  paneVideos,
  chefImages,
} from 'https://bunqlabs.github.io/house-of-samuha/params.js';
import { createDebugPanel } from 'https://bunqlabs.github.io/house-of-samuha/debug.js';

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
  // Scene (Main)
  // -----------------------------
  const scene = new THREE.Scene();

  // -----------------------------
  // Groups (Main)
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
  // Renderer (Main)
  // -----------------------------
  const container = document.getElementById('webgl');
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const initDPR = Math.min(window.devicePixelRatio || 1, CONFIG.maxDPR);
  renderer.setPixelRatio(params.dpr);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // -----------------------------
  // Camera (Main)
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
  // Lights (Main)
  // -----------------------------
  const pointLight = new THREE.PointLight(0xffffff, params.lightIntensity, 20);
  pointLight.position.set(params.lightX, params.lightY, params.lightZ);
  animator.add(pointLight);
  const lightHelper = new THREE.PointLightHelper(pointLight, 0.1);
  scene.add(lightHelper);

  // -----------------------------
  // Footer Scene
  // -----------------------------
  const footerContainer = document.getElementById('footer-webgl');
  const footerScene = new THREE.Scene();
  const footerRenderer = new THREE.WebGLRenderer({ antialias: true });
  footerRenderer.setPixelRatio(params.dpr);
  footerRenderer.setSize(
    footerContainer.clientWidth,
    footerContainer.clientHeight
  );
  footerContainer.appendChild(footerRenderer.domElement);

  const footerCamera = new THREE.PerspectiveCamera(
    CONFIG.camera.fov,
    footerContainer.clientWidth / footerContainer.clientHeight,
    CONFIG.camera.near,
    CONFIG.camera.far
  );
  footerCamera.position.set(0, 0, 5);
  footerCamera.lookAt(0, 0, 0);

  const footerBgMat = new THREE.ShaderMaterial({
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

  const footerBackground = new THREE.Mesh(
    new THREE.PlaneGeometry(params.bgPlaneX, params.bgPlaneY),
    footerBgMat
  );
  footerBackground.position.y = params.bgPlaneLocY;
  footerBackground.rotation.x = Math.PI;
  footerScene.add(footerBackground);

  // -----------------------------
  // Footer Visibility Observer
  // -----------------------------
  let footerVisible = false;
  const footerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        footerVisible = entry.isIntersecting;
      });
    },
    { threshold: 0.1 } // Trigger when 10% of footer is visible
  );
  footerObserver.observe(footerContainer);

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

  // Replace the createTextSprite function
  function createTextSprite(index) {
    const chefData = chefImages[index % chefImages.length];
    const src = chefData.chefTitle; // Access chefTitle from chefImages
    const texture = getTexture(src);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0,
    });

    const geometry = new THREE.PlaneGeometry(
      params.chefSizeX * 0.6,
      params.chefSizeY * 0.1
    );
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      -params.chefSizeX * 0.05,
      -params.chefSizeY * 0.55,
      -0.01
    );

    const spriteGroup = new THREE.Group();
    spriteGroup.add(mesh);
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
          y: -params.chefSizeY * 0.55,
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
          y: -params.chefSizeY * 0.6,
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

    const chefIntersects = raycaster.intersectObjects(chefs.children, true);
    const chefHit = chefIntersects.length ? chefIntersects[0].object : null;
    const chefIndex = chefHit ? chefHit.userData.index : -1;

    if (chefIndex !== -1 && chefMedia[chefIndex]) {
      const chefData = chefImages[Math.floor(chefIndex / 2)];
      if (chefData.chefLink) {
        window.location.href = chefData.chefLink;
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

    const minY = -32;
    const maxY = -35;
    const opacityProgress = THREE.MathUtils.clamp(
      (yTarget - minY) / (maxY - minY),
      0,
      1
    );
    const targetOpacity = 1 - opacityProgress;
    gsap.quickTo(container, 'opacity', {
      duration: params.animatorScrollEase,
      ease: 'expo.out',
      overwrite: true,
    })(targetOpacity);
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
    roughnessMap: texLoader.load(
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68c2d60a68bb01b690ee98c8_roughness.jpg',
      (tex) => {
        tex.flipY = false;
        if (tex.colorSpace !== undefined) tex.colorSpace = THREE.NoColorSpace;
      }
    ),
  });

  // -----------------------------
  // Plate model
  // -----------------------------
  function addLogoTo(plate) {
    texLoader.load(
      'https://cdn.prod.website-files.com/68a844b2b31c9628c316759e/68c2d60abccb39942d8c6792_logo.png',
      (tex) => {
        const aspect = (tex.image?.width || 1) / (tex.image?.height || 1);
        const H = 0.5;
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
      }
    );
  }

  let plate = null;
  let plateRotX;
  let plateRotY;

  const loader = new THREE.GLTFLoader();
  loader.load(
    'https://rohan-pckg.github.io/3d-stuff/models/plate.glb',
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
    chefMedia = [];

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
      // Left wall: First three chefs (indices 0, 1, 2 for Antonio, Jia, Bennett)
      const leftChefIndex = i % 3; // Cycle through 0, 1, 2
      const chefDataLeft = chefImages[leftChefIndex];
      // Right wall: Last three chefs (indices 3, 4, 5 for Malik, Marco, Nikos)
      const rightChefIndex = 3 + (i % 3); // Cycle through 3, 4, 5
      const chefDataRight = chefImages[rightChefIndex];

      // Right chef
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
      const rightTextSprite = createTextSprite(rightChefIndex);
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

      // Left chef
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
      const leftTextSprite = createTextSprite(leftChefIndex);
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

    console.log('chefMedia populated:', chefMedia.length, 'items');
  }

  buildWalls();
  buildPanes();
  buildChefs();

  // -----------------------------
  // Resize
  // -----------------------------
  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    const footerW = footerContainer.clientWidth;
    const footerH = footerContainer.clientHeight;
    footerRenderer.setSize(footerW, footerH);
    footerCamera.aspect = footerW / footerH;
    footerCamera.updateProjectionMatrix();
    footerBgMat.uniforms.uAspect.value = params.bgPlaneX / params.bgPlaneY;
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
        footerBgMat.uniforms.uFbmOctaves.value = params.fbmOctaves;
        console.log('octaves :', params.fbmOctaves);
      } else if (fps > targetFPSHigh && params.fbmOctaves < 6) {
        params.fbmOctaves = 6;
        bgMat.uniforms.uFbmOctaves.value = params.fbmOctaves;
        footerBgMat.uniforms.uFbmOctaves.value = params.fbmOctaves;
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
    const currentTime = (performance.now() - t0) / 1000.0;
    bgMat.uniforms.uTime.value = currentTime;
    footerBgMat.uniforms.uTime.value = currentTime;
    adaptPerformance();

    let minZ = Infinity;
    let candidates = [];

    const cameraWorldPos = new THREE.Vector3();
    camera.getWorldPosition(cameraWorldPos);

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
    if (footerVisible) {
      footerRenderer.render(footerScene, footerCamera);
    }
    stats.end();
  });
})();
