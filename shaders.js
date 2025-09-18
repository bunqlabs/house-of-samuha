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
