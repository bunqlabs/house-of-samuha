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
