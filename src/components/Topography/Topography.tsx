import React, { useEffect, useRef } from "react";

export interface TopographyProps {
  /**
   * Line color (any CSS color or a CSS variable like "var(--color-primary-solid)")
   * @default "var(--color-primary-solid)"
   */
  color?: string;
  /**
   * Rendering mode. "auto" follows the --theme-mode token of the active theme
   * @default "auto"
   */
  mode?: "auto" | "light" | "dark";
  /**
   * Number of contour lines
   * @default 18
   */
  lineCount?: number;
  /**
   * Contour line width in pixels
   * @default 1.5
   */
  lineWidth?: number;
  /**
   * Drift speed of the terrain
   * @default 0.25
   */
  speed?: number;
  /**
   * Terrain height
   * @default 0.65
   */
  elevation?: number;
  /**
   * Fine surface detail
   * @default 0.63
   */
  detail?: number;
  /**
   * Terrain morph speed
   * @default 0.39
   */
  morph?: number;
  /**
   * Camera tilt in degrees (90 looks straight down)
   * @default 90
   */
  tilt?: number;
  /**
   * Distance fog amount (0-1)
   * @default 0.3
   */
  fog?: number;
  /**
   * Opacity of the whole layer (0-1)
   * @default 0.5
   */
  opacity?: number;
  /**
   * Marker style drawn on the terrain grid
   * @default "dot"
   */
  markers?: "none" | "cross" | "dot";
  /**
   * Terrain reacts to the mouse pointer
   * @default true
   */
  interactive?: boolean;
  /**
   * Camera lean amount while the pointer moves
   * @default 1
   */
  parallax?: number;
  /**
   * Size of the glow that follows the pointer
   * @default 1
   */
  radius?: number;
  /**
   * Maximum frames per second
   * @default 30
   */
  fps?: number;
  /**
   * Maximum device pixel ratio used for rendering
   * @default 1.5
   */
  maxPixelRatio?: number;
  /**
   * Additional className
   */
  className?: string;
}

interface Cam {
  f: number[];
  r: number[];
  u: number[];
  eye: number[];
  distance: number;
}

interface Program {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
}

// ============================================
// CONSTANTS
// ============================================

const FOV = 0.32;
const ORBIT = 9;
const NEAR = 0.05;
const FAR = 160;
const HEIGHT = 1.7;
const FREQ = 0.45;
const INTRO = 2.4;
const MAXC = 60000;
const CELL_PX = 18;
const MSP = 1.25;
const SUN = [-0.81, 0.58, -0.02];

// ============================================
// SHADERS
// ============================================

const COMMON = `precision highp float;precision highp int;
uniform float uFrequency;uniform vec2 uMorph;uniform vec3 uEye;uniform vec3 uForward;uniform vec3 uNear;
uint lattice(ivec2 p){uvec2 q=uvec2(p+1073741824);uint h=q.x*2654435761u+q.y*2246822519u;h=(h^(h>>15u))*739982445u;h=(h^(h>>12u))*695872825u;return h^(h>>15u);}
float corner(ivec2 c,vec2 f){uint h=lattice(c);vec2 g=vec2(float(h&65535u),float(h>>16u))/32767.5-1.0;return dot(g,f);}
float noise(vec2 p){vec2 i=floor(p);vec2 f=p-i;ivec2 c=ivec2(i);vec2 u=f*f*f*(f*(f*6.0-15.0)+10.0);
float a=corner(c,f);float b=corner(c+ivec2(1,0),f-vec2(1.0,0.0));float d=corner(c+ivec2(0,1),f-vec2(0.0,1.0));float e=corner(c+ivec2(1,1),f-vec2(1.0,1.0));
return mix(mix(a,b,u.x),mix(d,e,u.x),u.y);}
vec2 octave(vec2 p,vec2 shift){return vec2(1.6*p.x-1.2*p.y,1.2*p.x+1.6*p.y)+shift;}
float relief(vec2 t){vec2 p=t*uFrequency;vec2 w=vec2(noise(p*0.42+uMorph),noise(p*0.42-uMorph.yx+vec2(5.2,1.3)));p+=w*0.8;
float n=noise(p)*0.55;p=octave(p,vec2(7.1,3.7));n+=noise(p)*0.15;p=octave(p,vec2(1.9,8.3));n+=noise(p)*0.04;
float s=log(1.0+exp(7.0*(3.0*n+0.05)))/7.0;return s*s*1.4+0.1*n;}
float settle(vec2 world){float depth=dot(vec3(world.x,0.0,world.y)-uEye,uForward);float x=clamp((depth-uNear.x)/max(uNear.y-uNear.x,1e-3),0.0,1.0);return mix(uNear.z,1.0,x*x*x*(x*(x*6.0-15.0)+10.0));}`;

const TERRAIN_VERT = `#version 300 es
${COMMON}
uniform ivec2 uOrigin;uniform ivec2 uCamCell;uniform vec2 uCamFrac;uniform float uCell;uniform int uStride;uniform float uHeight;uniform mat4 uViewProj;
out vec2 vTerrain;out float vDepth;out float vLift;out vec3 vNormal;
void main(){
ivec2 step=ivec2(gl_VertexID>>1,gl_InstanceID+(gl_VertexID&1))*uStride;ivec2 local=uOrigin+step;
vec2 terrain=vec2(local+uCamCell)*uCell;vec2 world=vec2(local)*uCell-uCamFrac;float k=settle(world);
float h=relief(terrain)*k;float hx=relief(terrain+vec2(0.04,0.0))*k;float hz=relief(terrain+vec2(0.0,0.04))*k;
vNormal=vec3((h-hx)*uHeight/0.04,1.0,(h-hz)*uHeight/0.04);
vec4 clip=uViewProj*vec4(world.x,h*uHeight,world.y,1.0);gl_Position=clip;vTerrain=terrain;vDepth=clip.w;vLift=h*uHeight;}`;

const TERRAIN_FRAG = `#version 300 es
${COMMON}
uniform float uDetail,uLines,uLineWidth,uMajor,uBrightness,uReveal,uLightMode,uOpacity,uRefDepth;
uniform vec3 uColor,uFocus,uSun;uniform vec2 uFade;uniform vec4 uHeat;
in vec2 vTerrain;in float vDepth;in float vLift;in vec3 vNormal;out vec4 outColor;
float smoother(float x){x=clamp(x,0.0,1.0);return x*x*x*(x*(x*6.0-15.0)+10.0);}
float stroke(float dist,float width,float soft,float density,float crowd){float cover=max(0.0,min(min(width,soft),0.5*(width+soft)-dist))/soft;return mix(cover,min(width*density,1.0)*0.6,crowd);}
void main(){
vec2 spot=vTerrain;
vec2 dp=spot*uFrequency*5.0+vec2(13.1,4.7);
float h=relief(spot)+uDetail*0.1*(noise(dp)*0.6+noise(octave(dp,vec2(2.3,6.1)))*0.3);
float gx=dFdx(h)*uLines;float gy=dFdy(h)*uLines;
float lc=h*uLines+0.5;float density=max(sqrt(gx*gx+gy*gy),1e-5);
float dist=abs(fract(lc+0.5)-0.5)/density;
float major=uMajor*(1.0-step(0.5,mod(floor(lc+0.5),5.0)));
vec2 hd=spot-uHeat.xy;float heat=exp(-dot(hd,hd)/(uHeat.z*uHeat.z))*uHeat.w;
float depth=max(vDepth,0.01);float persp=clamp(sqrt(uRefDepth/depth),0.6,1.6);
float width=uLineWidth*persp*(1.0+0.6*major)*(1.0+0.45*min(heat,1.5));
float soft=1.0+min(uFocus.y*abs(1.0-uFocus.x/depth),uFocus.z);
float crowd=smoothstep(0.3,0.75,density*max(width,soft));
float cover=stroke(dist,width,soft,density,crowd);
vec3 normal=normalize(vNormal);float sun=clamp(dot(normal,uSun),0.0,1.0);
float level=mix(0.45,1.05,smoothstep(0.0,1.1,h))*mix(0.35,1.25,sun*sun)*(1.0+0.6*major);
level+=heat*1.4;
float fade=1.0-smoother((depth-uFade.x)/max(uFade.y-uFade.x,1e-3));
float light=cover*level*fade*uBrightness*uReveal;
if(uLightMode>0.5){float ink=(1.0-exp(-light*1.8))*0.92*uOpacity;outColor=vec4(uColor*ink,ink);return;}
vec3 color=1.0-exp(-uColor*light*1.8);
outColor=vec4(color,max(max(color.r,color.g),color.b))*uOpacity;}`;

const MARKER_VERT = `#version 300 es
${COMMON}
uniform ivec2 uOrigin;uniform ivec2 uCamCell;uniform vec2 uCamFrac;uniform float uSpacing;uniform int uColumns;uniform float uHeight;uniform mat4 uViewProj;uniform vec2 uView;uniform float uSize;uniform float uRefDepth;uniform vec4 uHeat;uniform float uTime;
out vec2 vCorner;out float vSize;out float vGlow;out float vFrame;out float vDepth;
void main(){
ivec2 local=uOrigin+ivec2(gl_InstanceID%uColumns,gl_InstanceID/uColumns);ivec2 id=local+uCamCell;
vec2 terrain=vec2(id)*uSpacing;vec2 world=vec2(local)*uSpacing-uCamFrac;
float h=relief(terrain)*settle(world);
vec4 clip=uViewProj*vec4(world.x,h*uHeight+0.05,world.y,1.0);
uint seed=lattice(id+ivec2(911,377));float a=float(seed&1023u)/1023.0;float b=float((seed>>10u)&1023u)/1023.0;
vec2 hd=terrain-uHeat.xy;float heat=exp(-dot(hd,hd)/(uHeat.z*uHeat.z))*uHeat.w;
float blink=step(0.92,a)*(0.5+0.5*sin(uTime*(1.4+b*2.2)+b*40.0));
float size=uSize*clamp(sqrt(uRefDepth/max(clip.w,0.01)),0.6,1.3)*(1.0+0.4*heat+0.35*blink);
float frame=max(smoothstep(0.55,0.95,blink),smoothstep(0.3,0.8,heat));
vec2 corner=vec2(float(gl_VertexID&1),float(gl_VertexID>>1))*2.0-1.0;
vec2 offset=corner*(size*(frame>0.001?2.6:1.0)+1.5);
clip.xy+=offset/uView*2.0*clip.w;
gl_Position=clip;vCorner=offset;vSize=size;vFrame=frame;vGlow=0.5+0.4*b+blink*0.9+heat*1.8;vDepth=clip.w;}`;

const MARKER_FRAG = `#version 300 es
precision highp float;
uniform vec3 uColor;uniform vec2 uFade;uniform float uReveal,uBrightness,uLightMode,uOpacity,uStyle,uPixel;
in vec2 vCorner;in float vSize;in float vGlow;in float vFrame;in float vDepth;out vec4 outColor;
float smoother(float x){x=clamp(x,0.0,1.0);return x*x*x*(x*(x*6.0-15.0)+10.0);}
void main(){vec2 a=abs(vCorner);float cover;
if(uStyle<0.5){float thick=max(0.6*uPixel,0.5);float across=clamp(vSize-a.x+0.5,0.0,1.0)*clamp(thick-a.y+0.5,0.0,1.0);float down=clamp(vSize-a.y+0.5,0.0,1.0)*clamp(thick-a.x+0.5,0.0,1.0);cover=max(across,down);}
else{cover=clamp(vSize*0.42-length(vCorner)+0.5,0.0,1.0);}
if(vFrame>0.001){float edge=vSize*2.3;float reach=edge*0.45;float line=max(0.5*uPixel,0.5);
float sides=clamp(line-abs(a.x-edge)+0.5,0.0,1.0)*clamp(a.y-edge+reach+0.5,0.0,1.0)*clamp(edge+line-a.y+0.5,0.0,1.0);
float caps=clamp(line-abs(a.y-edge)+0.5,0.0,1.0)*clamp(a.x-edge+reach+0.5,0.0,1.0)*clamp(edge+line-a.x+0.5,0.0,1.0);
cover=max(cover,max(sides,caps)*vFrame*0.8);}
float fade=1.0-smoother((vDepth-uFade.x)/max(uFade.y-uFade.x,1e-3));
float light=cover*vGlow*fade*fade*uReveal*uBrightness;
if(uLightMode>0.5){float ink=(1.0-exp(-light*1.8))*0.92*uOpacity;outColor=vec4(uColor*ink,ink);return;}
vec3 color=1.0-exp(-uColor*light*1.8);outColor=vec4(color,max(max(color.r,color.g),color.b))*uOpacity;}`;

// ============================================
// HELPERS
// ============================================

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

const smoother = (x: number) => {
  const t = clamp(x, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

const compile = (gl: WebGL2RenderingContext, type: number, src: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  console.warn(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
};

const link = (
  gl: WebGL2RenderingContext,
  vert: string,
  frag: string,
): Program | null => {
  const vs = compile(gl, gl.VERTEX_SHADER, vert);
  const fs = compile(gl, gl.FRAGMENT_SHADER, frag);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const total = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < total; i++) {
    const info = gl.getActiveUniform(program, i);
    if (info) {
      uniforms[info.name.replace(/\[0\]$/, "")] = gl.getUniformLocation(
        program,
        info.name,
      );
    }
  }
  return { program, uniforms };
};

// Parses any CSS color through a 1x1 canvas
let scratch: CanvasRenderingContext2D | null = null;

const resolveColor = (value: string): number[] => {
  let v = value.trim();

  if (v.startsWith("var(")) {
    const name = v.slice(4, -1).split(",")[0].trim();
    v =
      getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim() || "#7c5cff";
  }

  if (!scratch) {
    const probe = document.createElement("canvas");
    probe.width = 1;
    probe.height = 1;
    scratch = probe.getContext("2d", { willReadFrequently: true });
  }
  if (!scratch) return [0.486, 0.361, 1];

  scratch.clearRect(0, 0, 1, 1);
  scratch.fillStyle = "#7c5cff";
  scratch.fillStyle = v;
  scratch.fillRect(0, 0, 1, 1);
  const [r, g, b] = scratch.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
};

const orient = (yaw: number, pitch: number) => {
  const cp = Math.cos(pitch);
  const f = [Math.sin(yaw) * cp, -Math.sin(pitch), Math.cos(yaw) * cp];
  const r = [Math.cos(yaw), 0, -Math.sin(yaw)];
  const u = [
    f[1] * r[2] - f[2] * r[1],
    f[2] * r[0] - f[0] * r[2],
    f[0] * r[1] - f[1] * r[0],
  ];
  return { f, r, u };
};

const lens = (aspect: number) => clamp(0.4877 / aspect, FOV, 0.6);

const viewProj = (cam: Cam, aspect: number, out: Float32Array) => {
  const { eye, f, r, u } = cam;
  const t = 1 / lens(aspect);
  const nf = 1 / (NEAR - FAR);
  const view = [
    r[0],
    u[0],
    -f[0],
    0,
    r[1],
    u[1],
    -f[1],
    0,
    r[2],
    u[2],
    -f[2],
    0,
    -(r[0] * eye[0] + r[1] * eye[1] + r[2] * eye[2]),
    -(u[0] * eye[0] + u[1] * eye[1] + u[2] * eye[2]),
    f[0] * eye[0] + f[1] * eye[1] + f[2] * eye[2],
    1,
  ];
  const proj = [
    t / aspect,
    0,
    0,
    0,
    0,
    t,
    0,
    0,
    0,
    0,
    (FAR + NEAR) * nf,
    -1,
    0,
    0,
    2 * FAR * NEAR * nf,
    0,
  ];

  for (let c = 0; c < 4; c++) {
    for (let row = 0; row < 4; row++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) sum += proj[k * 4 + row] * view[c * 4 + k];
      out[c * 4 + row] = sum;
    }
  }
  return out;
};

/**
 * Dara UI Topography - Interactive contour-line terrain background
 *
 * Features:
 * - WebGL2 terrain rendered as animated contour lines
 * - Optional pointer glow and camera lean, solved analytically (no ray marching)
 * - Layer opacity control
 * - Frame rate cap, capped pixel ratio and no post-processing passes
 * - Pauses while hidden or offscreen and honors reduced motion
 * - Follows the active theme color tokens and the --theme-mode token
 * - Renders nothing when WebGL2 is unavailable
 */
export const Topography: React.FC<TopographyProps> = ({
  color = "var(--color-primary-solid)",
  mode = "auto",
  lineCount = 18,
  lineWidth = 1.5,
  speed = 0.25,
  elevation = 0.65,
  detail = 0.63,
  morph = 0.39,
  tilt = 90,
  fog = 0.3,
  opacity = 0.5,
  markers = "dot",
  interactive = true,
  parallax = 1,
  radius = 1,
  fps = 30,
  maxPixelRatio = 1.5,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep latest config in a ref so the render loop never restarts
  const cfg = useRef({
    color,
    mode,
    lineCount,
    lineWidth,
    speed,
    elevation,
    detail,
    morph,
    tilt,
    fog,
    markers,
    interactive,
    parallax,
    radius,
    fps,
    maxPixelRatio,
  });
  cfg.current = {
    color,
    mode,
    lineCount,
    lineWidth,
    speed,
    elevation,
    detail,
    morph,
    tilt,
    fog,
    markers,
    interactive,
    parallax,
    radius,
    fps,
    maxPixelRatio,
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.style.cssText = "display:block;width:100%;height:100%";
    container.appendChild(canvas);

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: true,
      stencil: false,
      powerPreference: "low-power",
    });

    const terrain = gl ? link(gl, TERRAIN_VERT, TERRAIN_FRAG) : null;
    const marker = gl ? link(gl, MARKER_VERT, MARKER_FRAG) : null;

    if (!gl || !terrain || !marker) {
      container.removeChild(canvas);
      return;
    }

    const vao = gl.createVertexArray();
    const matrix = new Float32Array(4 * 4);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const view = { width: 1, height: 1, ratio: 1, cell: 0.05, cellKey: "" };
    const pointer = { x: 0, y: 0, inside: false };
    const st = {
      intro: reduce ? 1 : 0,
      rise: reduce ? 1 : 0,
      travelX: 0,
      travelZ: 0,
      morph: 0,
      yaw: 0,
      pitch: 0,
      yv: 0,
      pv: 0,
      presence: 0,
      clock: 0,
      hit: null as { x: number; z: number } | null,
    };

    // ============================================
    // THEME
    // ============================================
    const theme = { rgb: [0.486, 0.361, 1], light: false };
    let lastColor = "";
    let lastMode = "";

    const readTheme = () => {
      const c = cfg.current;
      theme.rgb = resolveColor(c.color);
      const meta = getComputedStyle(document.documentElement)
        .getPropertyValue("--theme-mode")
        .trim();
      theme.light = c.mode === "auto" ? meta === "light" : c.mode === "light";
      lastColor = c.color;
      lastMode = c.mode;
    };
    readTheme();

    const themeObserver = new MutationObserver(readTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // ============================================
    // CAMERA
    // ============================================
    const camera = (): Cam => {
      const c = cfg.current;
      const pitch = Math.min(
        (c.tilt * Math.PI) / 180 + st.pitch,
        Math.PI / 2 - 1e-4,
      );
      const fr = orient(st.yaw, pitch);
      const lift = c.elevation * HEIGHT * st.rise * 0.18;
      const clearance = c.elevation * HEIGHT * st.rise * 1.3 + 0.9;
      const distance = Math.max(ORBIT, (clearance - lift) / Math.sin(pitch));
      return {
        ...fr,
        distance,
        eye: [
          -fr.f[0] * distance,
          lift - fr.f[1] * distance,
          -fr.f[2] * distance,
        ],
      };
    };

    const rayDir = (cam: Cam, nx: number, ny: number) => {
      const aspect = view.width / view.height;
      const t = lens(aspect);
      const d = [0, 1, 2].map(
        (i) => cam.f[i] + cam.r[i] * nx * t * aspect + cam.u[i] * ny * t,
      );
      const l = Math.hypot(d[0], d[1], d[2]);
      return d.map((v) => v / l);
    };

    const along = (cam: Cam, d: number[]) =>
      d[0] * cam.f[0] + d[1] * cam.f[1] + d[2] * cam.f[2];

    const groundDepth = (cam: Cam, ny: number) => {
      const d = rayDir(cam, 0, ny);
      if (d[1] > -1e-3) return Infinity;
      return (cam.eye[1] / -d[1]) * along(cam, d);
    };

    const nearRange = (cam: Cam) => [
      groundDepth(cam, -1) * 0.9,
      cam.distance,
      0,
    ];

    const footprint = (cam: Cam, fadeEnd: number) => {
      const c = cfg.current;
      const ceiling = c.elevation * HEIGHT * st.rise * 1.7 + 0.2 + 1.5;
      const box = {
        minX: Infinity,
        maxX: -Infinity,
        minZ: Infinity,
        maxZ: -Infinity,
        near: Infinity,
      };

      const add = (d: number[], dist: number) => {
        const x = cam.eye[0] + d[0] * dist;
        const z = cam.eye[2] + d[2] * dist;
        box.minX = Math.min(box.minX, x);
        box.maxX = Math.max(box.maxX, x);
        box.minZ = Math.min(box.minZ, z);
        box.maxZ = Math.max(box.maxZ, z);
      };

      for (const nx of [-1.08, 0, 1.08]) {
        for (const ny of [-1.08, 1.08]) {
          const d = rayDir(cam, nx, ny);
          const fw = Math.max(along(cam, d), 1e-3);
          let near = NEAR;
          let far = (fadeEnd * 1.05) / fw;
          if (d[1] < -1e-4) {
            near = Math.max(NEAR, (cam.eye[1] - ceiling) / -d[1]);
            far = Math.min(far, cam.eye[1] / -d[1]);
          }
          near = Math.min(near, far);
          add(d, near);
          add(d, far);
          box.near = Math.min(box.near, near * fw);
        }
      }
      return box;
    };

    const grid = (box: ReturnType<typeof footprint>, cell: number) => {
      const camX = Math.floor(st.travelX / cell);
      const camZ = Math.floor(st.travelZ / cell);
      const fracX = st.travelX - camX * cell;
      const fracZ = st.travelZ - camZ * cell;
      const k0 = Math.floor((box.minX + fracX) / cell) - 2;
      const m0 = Math.floor((box.minZ + fracZ) / cell) - 2;
      const columns = clamp(
        Math.ceil((box.maxX + fracX) / cell) + 2 - k0,
        1,
        4000,
      );
      const rows = clamp(
        Math.ceil((box.maxZ + fracZ) / cell) + 2 - m0,
        1,
        Math.floor((MAXC * 1.5) / columns),
      );
      return { cell, camX, camZ, fracX, fracZ, k0, m0, columns, rows };
    };

    // ============================================
    // RENDER
    // ============================================
    const render = () => {
      const c = cfg.current;
      const cam = camera();
      viewProj(cam, view.width / view.height, matrix);

      const bottom = groundDepth(cam, -1);
      const top = Math.min(groundDepth(cam, 1), cam.distance * 3.2);
      const horizon = Math.max(top, bottom * 1.6, cam.distance * 1.4);
      const fadeEnd = horizon + (bottom * 1.8 - horizon) * c.fog;
      const fadeStart = fadeEnd * 0.7 + (bottom * 0.7 - fadeEnd * 0.7) * c.fog;
      const box = footprint(cam, fadeEnd);

      const key = `${view.width}x${view.height}@${view.ratio}|${Math.round(c.tilt / 4)}|${Math.round(c.elevation * 5)}|${c.fog}`;
      if (key !== view.cellKey) {
        view.cellKey = key;
        const focal =
          (view.height * view.ratio * 0.5) / lens(view.width / view.height);
        let cell = clamp(
          (CELL_PX * Math.max(box.near, 0.5)) / focal,
          0.02,
          0.4,
        );
        const cells =
          ((box.maxX - box.minX) * (box.maxZ - box.minZ)) / (cell * cell);
        if (cells > MAXC) cell *= Math.sqrt(cells / MAXC);
        view.cell = cell;
      }

      const pixel = view.ratio;
      const height = c.elevation * HEIGHT * st.rise;
      const layout = grid(box, view.cell);
      const near = nearRange(cam);
      const dots = c.markers !== "none" ? grid(box, MSP) : null;
      const reveal = smoother(st.intro / 0.35);
      const hitX = st.hit ? st.hit.x : 0;
      const hitZ = st.hit ? st.hit.z : 0;
      const heatStrength = st.hit ? st.presence * (0.35 + 0.5 * 1.5) : 0;
      const focusScale = 0.02 * view.height * 0.016;

      gl.bindVertexArray(vao);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);

      // ----- Terrain pass -----
      gl.useProgram(terrain.program);
      const u = terrain.uniforms;
      gl.uniform1f(u.uFrequency, FREQ);
      gl.uniform2f(u.uMorph, st.morph * 0.37, st.morph * 0.23);
      gl.uniform2i(u.uOrigin, layout.k0, layout.m0);
      gl.uniform2i(u.uCamCell, layout.camX, layout.camZ);
      gl.uniform2f(u.uCamFrac, layout.fracX, layout.fracZ);
      gl.uniform1f(u.uCell, layout.cell);
      gl.uniform1i(u.uStride, 1);
      gl.uniform1f(u.uHeight, height);
      gl.uniform3fv(u.uEye, cam.eye);
      gl.uniform3fv(u.uForward, cam.f);
      gl.uniform3fv(u.uNear, near);
      gl.uniform1f(u.uRefDepth, cam.distance);
      gl.uniformMatrix4fv(u.uViewProj, false, matrix);
      gl.uniform1f(u.uDetail, c.detail);
      gl.uniform1f(u.uLines, c.lineCount);
      gl.uniform1f(u.uLineWidth, c.lineWidth * pixel);
      gl.uniform1f(u.uMajor, 1);
      gl.uniform3fv(u.uColor, theme.rgb);
      gl.uniform1f(u.uBrightness, 1);
      gl.uniform2f(u.uFade, fadeStart, fadeEnd);
      gl.uniform3f(
        u.uFocus,
        cam.distance,
        focusScale * pixel,
        view.height * 0.03 * pixel,
      );
      gl.uniform4f(u.uHeat, hitX, hitZ, 0.9 * c.radius, heatStrength);
      gl.uniform3fv(u.uSun, SUN);
      gl.uniform1f(u.uReveal, reveal);
      gl.uniform1f(u.uLightMode, theme.light ? 1 : 0);
      gl.uniform1f(u.uOpacity, 1);

      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LESS);
      gl.depthMask(true);
      gl.disable(gl.BLEND);
      gl.clearColor(0, 0, 0, 0);
      gl.clearDepth(1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawArraysInstanced(
        gl.TRIANGLE_STRIP,
        0,
        2 * (layout.columns + 1),
        layout.rows,
      );

      // ----- Marker pass -----
      if (dots) {
        gl.useProgram(marker.program);
        const m = marker.uniforms;
        gl.uniform1f(m.uFrequency, FREQ);
        gl.uniform2f(m.uMorph, st.morph * 0.37, st.morph * 0.23);
        gl.uniform3fv(m.uEye, cam.eye);
        gl.uniform3fv(m.uForward, cam.f);
        gl.uniform3fv(m.uNear, near);
        gl.uniform2i(m.uOrigin, dots.k0, dots.m0);
        gl.uniform2i(m.uCamCell, dots.camX, dots.camZ);
        gl.uniform2f(m.uCamFrac, dots.fracX, dots.fracZ);
        gl.uniform1f(m.uSpacing, dots.cell);
        gl.uniform1i(m.uColumns, dots.columns + 1);
        gl.uniform1f(m.uHeight, height);
        gl.uniformMatrix4fv(m.uViewProj, false, matrix);
        gl.uniform2f(m.uView, canvas.width, canvas.height);
        gl.uniform1f(m.uSize, 4 * pixel);
        gl.uniform1f(m.uRefDepth, cam.distance);
        gl.uniform4f(m.uHeat, hitX, hitZ, 1.2 * c.radius, heatStrength);
        gl.uniform1f(m.uTime, st.clock);
        gl.uniform3fv(m.uColor, theme.rgb);
        gl.uniform2f(m.uFade, fadeStart, fadeEnd);
        gl.uniform1f(m.uReveal, reveal);
        gl.uniform1f(m.uBrightness, 1);
        gl.uniform1f(m.uLightMode, theme.light ? 1 : 0);
        gl.uniform1f(m.uOpacity, 1);
        gl.uniform1f(m.uStyle, c.markers === "cross" ? 0 : 1);
        gl.uniform1f(m.uPixel, pixel);

        gl.depthFunc(gl.LEQUAL);
        gl.depthMask(false);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.drawArraysInstanced(
          gl.TRIANGLE_STRIP,
          0,
          4,
          (dots.columns + 1) * (dots.rows + 1),
        );
        gl.disable(gl.BLEND);
        gl.depthMask(true);
      }

      gl.disable(gl.DEPTH_TEST);
    };

    // ============================================
    // LOOP
    // ============================================
    let raf = 0;
    let lastDraw = 0;
    let visible = true;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);

      if (document.hidden || !visible) {
        lastDraw = 0;
        return;
      }

      const c = cfg.current;
      const interval = 1000 / clamp(c.fps, 10, 60);
      if (lastDraw && now - lastDraw < interval - 2) return;

      const dt = lastDraw ? clamp((now - lastDraw) / 1000, 0, 0.1) : 1 / 30;
      lastDraw = now;

      if (c.color !== lastColor || c.mode !== lastMode) readTheme();

      if (st.intro < 1) st.intro = Math.min(1, st.intro + dt / INTRO);
      st.rise = smoother(st.intro);
      st.clock += dt;
      st.travelZ += c.speed * 0.8 * dt;
      st.morph += c.morph * 0.12 * dt;

      const engaged = c.interactive && pointer.inside;
      st.presence +=
        ((engaged ? 1 : 0) - st.presence) *
        (1 - Math.exp(-dt / (engaged ? 0.18 : 0.45)));

      const nx = (pointer.x / view.width) * 2 - 1;
      const ny = 1 - (pointer.y / view.height) * 2;
      const lean = engaged ? c.parallax : 0;
      const targetYaw = nx * lean * 0.09;
      const targetPitch = -ny * lean * 0.045;

      st.yv += (38 * (targetYaw - st.yaw) - 11 * st.yv) * dt;
      st.pv += (38 * (targetPitch - st.pitch) - 11 * st.pv) * dt;
      st.yaw += st.yv * dt;
      st.pitch += st.pv * dt;

      if (engaged) {
        const cam = camera();
        const d = rayDir(cam, nx, ny);
        if (d[1] < -1e-3) {
          const planeY = c.elevation * HEIGHT * st.rise * 0.3;
          const t = (planeY - cam.eye[1]) / d[1];
          st.hit = {
            x: st.travelX + cam.eye[0] + d[0] * t,
            z: st.travelZ + cam.eye[2] + d[2] * t,
          };
        }
      } else if (st.presence < 0.002) {
        st.hit = null;
      }

      render();
    };

    // ============================================
    // EVENTS
    // ============================================
    const resize = () => {
      view.width = Math.max(1, container.clientWidth);
      view.height = Math.max(1, container.clientHeight);
      view.ratio = Math.min(
        window.devicePixelRatio || 1,
        cfg.current.maxPixelRatio,
      );
      canvas.width = Math.max(1, Math.round(view.width * view.ratio));
      canvas.height = Math.max(1, Math.round(view.height * view.ratio));
      view.cellKey = "";
      render();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!cfg.current.interactive || reduce) return;
      const rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.inside =
        pointer.x >= 0 &&
        pointer.y >= 0 &&
        pointer.x <= rect.width &&
        pointer.y <= rect.height;
    };
    const onPointerLeave = () => {
      pointer.inside = false;
    };
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") pointer.inside = false;
    };
    const onContextLost = (e: Event) => e.preventDefault();

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("webglcontextlost", onContextLost);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibilityObserver.observe(container);

    resize();
    if (!reduce) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.deleteProgram(terrain.program);
      gl.deleteProgram(marker.program);
      gl.deleteVertexArray(vao);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`fixed inset-0 z-0 pointer-events-none ${className}`}
      style={{ opacity: clamp(opacity, 0, 1) }}
    />
  );
};

Topography.displayName = "Topography";
export default Topography;
