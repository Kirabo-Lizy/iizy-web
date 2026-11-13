import * as THREE from 'three'

/**
 * "Small steps, connected" as drifting silk: wide translucent ribbons that slowly fold and twist,
 * with a pearly sheen where they turn away from you, and a few motes of light floating past.
 * Everything moves on the GPU (vertex shaders), so the CPU does almost nothing per frame.
 *  - hero: two pastel silks on the light hero; they unveil once, then breathe.
 *  - map:  three glowing silks on the dark Clarity Map, unveiled and rippled by scroll.
 */
export type FlowMode = 'hero' | 'map'

export type FlowHandle = {
  setProgress: (p: number) => void
  dispose: () => void
}

type Silk = { baseY: number; amp: number; freq: number; phase: number; width: number; depth: number; twist: number; speed: number; colors: [string, string, string] }

type Preset = {
  silks: Silk[]
  motes: number
  blending: THREE.Blending
  opacity: number
  moteAlpha: number
  tilt: number
  cameraZ: number
}

const PRESETS: Record<FlowMode, Preset> = {
  hero: {
    silks: [
      { baseY: 0.6, amp: 0.9, freq: 0.26, phase: 0.4, width: 1.5, depth: 1.4, twist: 1.25, speed: 0.16, colors: ['#b7a6f2', '#c9a0dc', '#f2b6d9'] },
      { baseY: -1.3, amp: 0.7, freq: 0.31, phase: 2.6, width: 1.1, depth: 1.1, twist: 1.6, speed: 0.13, colors: ['#f0b3d6', '#c39ae6', '#9f8ae8'] },
    ],
    motes: 120,
    blending: THREE.NormalBlending,
    opacity: 0.8,
    moteAlpha: 0.55,
    tilt: -0.06,
    cameraZ: 12,
  },
  map: {
    silks: [
      { baseY: 0.9, amp: 0.8, freq: 0.24, phase: 1.1, width: 1.6, depth: 1.6, twist: 1.3, speed: 0.12, colors: ['#5b45c2', '#a35ac9', '#e47ab9'] },
      { baseY: -0.4, amp: 0.65, freq: 0.29, phase: 3.3, width: 1.2, depth: 1.3, twist: 1.7, speed: 0.1, colors: ['#7c5fe0', '#c072d0', '#f39ac9'] },
      { baseY: -1.7, amp: 0.55, freq: 0.34, phase: 5.0, width: 0.9, depth: 1.0, twist: 1.5, speed: 0.14, colors: ['#4f3ba8', '#8f63d8', '#d977c0'] },
    ],
    motes: 240,
    blending: THREE.AdditiveBlending,
    opacity: 1,
    moteAlpha: 0.8,
    tilt: 0.3,
    cameraZ: 12,
  },
}

const LEN = 26

const silkVert = /* glsl */ `
  uniform float uTime;
  uniform float uBaseY;
  uniform float uAmp;
  uniform float uFreq;
  uniform float uPhase;
  uniform float uWidth;
  uniform float uDepth;
  uniform float uTwist;
  uniform float uLen;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;

  vec3 surf(float u, float v) {
    float x = (u - 0.5) * uLen;
    float t = uTime;
    float y = uBaseY
      + sin(x * uFreq + t + uPhase) * uAmp
      + sin(x * uFreq * 2.1 - t * 0.6 + uPhase * 1.7) * uAmp * 0.22;
    float z = cos(x * uFreq * 0.8 + t * 0.7 + uPhase) * uDepth;
    // the cross-section slowly rolls along the length: this is what makes it read as silk
    float a = sin(x * 0.2 + t * 0.55 + uPhase) * uTwist + 0.35;
    float w = uWidth * (0.35 + 0.65 * sin(u * 3.14159));
    return vec3(x, y + v * w * 0.5 * cos(a), z + v * w * 0.5 * sin(a));
  }

  void main() {
    float u = uv.x;
    float v = uv.y * 2.0 - 1.0;
    vec3 p = surf(u, v);
    vec3 du = surf(u + 0.002, v) - p;
    vec3 dv = surf(u, v + 0.02) - p;
    vec3 n = normalize(cross(du, dv));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * n);
    vView = normalize(-mv.xyz);
    vUv = vec2(u, v);
    gl_Position = projectionMatrix * mv;
  }
`

const silkFrag = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uReveal;
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    float u = vUv.x;
    float ndv = abs(dot(normalize(vNormal), normalize(vView)));
    float fres = pow(1.0 - ndv, 2.2);

    vec3 base = mix(mix(uA, uB, smoothstep(0.0, 0.55, u)), uC, smoothstep(0.45, 1.0, u));
    // soft thin-film shimmer that drifts very slowly
    vec3 pearl = 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + fres * 0.55 + u * 0.35 + uTime * 0.004));
    vec3 col = mix(base, mix(base, pearl, 0.45), fres);
    col += vec3(1.0) * pow(fres, 3.0) * 0.28;

    // faint woven texture, barely there
    float weave = 0.94 + 0.06 * sin(vUv.y * 60.0 + u * 8.0);

    float edge = smoothstep(1.0, 0.25, abs(vUv.y));
    float ends = smoothstep(0.0, 0.14, u) * smoothstep(1.0, 0.86, u);
    float reveal = 1.0 - smoothstep(uReveal - 0.22, uReveal, u);
    float a = (0.12 + 0.6 * fres) * edge * ends * reveal * weave * uOpacity;
    if (a < 0.003) discard;
    gl_FragColor = vec4(col, a);
  }
`

const moteVert = /* glsl */ `
  attribute vec4 aSeed;
  uniform float uTime;
  uniform float uLen;
  uniform float uDpr;
  uniform float uReveal;
  varying float vAlpha;
  void main() {
    float speed = 0.12 + aSeed.w * 0.22;
    float x = mod(aSeed.x * uLen + uTime * speed, uLen) - uLen * 0.5;
    float y = aSeed.y * 3.4 + sin(uTime * 0.25 + aSeed.w * 6.2831 + x * 0.18) * 0.35;
    float z = aSeed.z * 4.0 - 1.5;
    vec4 mv = modelViewMatrix * vec4(x, y, z, 1.0);
    float u = x / uLen + 0.5;
    float ends = smoothstep(0.0, 0.15, u) * smoothstep(1.0, 0.85, u);
    float twinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed.w) + aSeed.x * 40.0);
    vAlpha = ends * twinkle * (1.0 - smoothstep(uReveal - 0.2, uReveal, u));
    gl_PointSize = (2.0 + aSeed.w * 4.5) * uDpr * (10.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`

const moteFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    if (a * vAlpha < 0.01) discard;
    gl_FragColor = vec4(uColor, a * vAlpha * uAlpha);
  }
`

/** Frame-rate independent smoothing factor. */
const damp = (rate: number, dt: number) => 1 - Math.exp(-rate * dt)

export function createFlow(canvas: HTMLCanvasElement, mode: FlowMode, opts: { reducedMotion: boolean }): FlowHandle {
  const preset = PRESETS[mode]
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 1.75)

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(dpr)
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
  const world = new THREE.Group()
  world.rotation.z = preset.tilt
  scene.add(world)

  const disposables: { dispose: () => void }[] = []

  // Silks
  const geo = new THREE.PlaneGeometry(1, 1, coarse ? 160 : 240, 28)
  disposables.push(geo)
  const silkMats = preset.silks.map((s, i) => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: silkVert,
      fragmentShader: silkFrag,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: preset.blending,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: preset.opacity },
        uReveal: { value: 0 },
        uLen: { value: LEN },
        uBaseY: { value: s.baseY },
        uAmp: { value: s.amp },
        uFreq: { value: s.freq },
        uPhase: { value: s.phase },
        uWidth: { value: s.width },
        uDepth: { value: s.depth },
        uTwist: { value: s.twist },
        uA: { value: new THREE.Color(s.colors[0]) },
        uB: { value: new THREE.Color(s.colors[1]) },
        uC: { value: new THREE.Color(s.colors[2]) },
      },
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.frustumCulled = false
    mesh.renderOrder = i
    world.add(mesh)
    disposables.push(mat)
    return mat
  })

  // Motes
  let seed = mode === 'hero' ? 11 : 29
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
  const seeds = new Float32Array(preset.motes * 4)
  for (let i = 0; i < seeds.length; i++) seeds[i] = i % 4 === 1 ? rand() * 2 - 1 : rand()
  const moteGeo = new THREE.BufferGeometry()
  moteGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(preset.motes * 3), 3))
  moteGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4))
  const moteMat = new THREE.ShaderMaterial({
    vertexShader: moteVert,
    fragmentShader: moteFrag,
    transparent: true,
    depthWrite: false,
    blending: preset.blending,
    uniforms: {
      uTime: { value: 0 },
      uLen: { value: LEN },
      uDpr: { value: dpr },
      uReveal: { value: 0 },
      uAlpha: { value: preset.moteAlpha },
      uColor: { value: new THREE.Color(mode === 'hero' ? '#9b84e6' : '#f3c6ff') },
    },
  })
  const motes = new THREE.Points(moteGeo, moteMat)
  motes.frustumCulled = false
  world.add(motes)
  disposables.push(moteGeo, moteMat)

  // Sizing
  let width = 0
  let height = 0
  const resize = () => {
    const parent = canvas.parentElement
    const w = parent?.clientWidth || window.innerWidth
    const h = parent?.clientHeight || window.innerHeight
    if (w === width && h === height) return
    width = w
    height = h
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    const ratio = w / h
    camera.position.set(0, 0, preset.cameraZ * (ratio < 1 ? 1.2 + (1 - ratio) * 0.8 : 1))
    camera.updateProjectionMatrix()
    render()
  }
  const ro = new ResizeObserver(resize)
  if (canvas.parentElement) ro.observe(canvas.parentElement)

  // Pointer: a slow, gentle lean toward the cursor
  const pointer = { x: 0, y: 0 }
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth - 0.5) * 2
    pointer.y = (e.clientY / window.innerHeight - 0.5) * 2
  }
  if (!coarse && !opts.reducedMotion) window.addEventListener('pointermove', onPointer, { passive: true })

  let progress = 0
  let shown = 0
  let clock = opts.reducedMotion ? 6 : 0
  let intro = opts.reducedMotion ? 1 : 0
  let last = performance.now()
  let raf = 0
  let visible = true
  let running = false

  const update = (dt: number) => {
    if (!opts.reducedMotion) {
      clock += dt
      intro = Math.min(1, intro + dt / 3.4)
    }
    shown += (progress - shown) * (dt ? damp(3.5, dt) : 1)

    // reveal runs a little past 1 so the soft wipe fully clears the far end
    const reveal = mode === 'hero'
      ? (1 - Math.pow(1 - intro, 3)) * 1.25
      : 0.12 + Math.min(1, shown * 1.15) * 1.13
    // on the map, scrolling also ripples the silk forward
    const t = clock + (mode === 'map' ? shown * 2.4 : 0)

    silkMats.forEach((m, i) => {
      m.uniforms.uTime.value = t * (preset.silks[i].speed / 0.13)
      m.uniforms.uReveal.value = reveal
    })
    moteMat.uniforms.uTime.value = t
    moteMat.uniforms.uReveal.value = reveal

    const k = dt ? damp(1.2, dt) : 1
    world.rotation.x += (pointer.y * 0.05 - world.rotation.x) * k
    world.rotation.y += (pointer.x * 0.08 + Math.sin(clock * 0.07) * 0.03 - world.rotation.y) * k
    if (mode === 'map') world.position.z = shown * 1.2
  }

  function render() {
    if (!width || !height) return
    renderer.render(scene, camera)
  }

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    update(dt)
    render()
    raf = requestAnimationFrame(frame)
  }
  const start = () => {
    if (running || opts.reducedMotion || !visible || document.hidden) return
    running = true
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(raf)
  }

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    if (visible) start()
    else stop()
  })
  io.observe(canvas)
  const onVis = () => (document.hidden ? stop() : start())
  document.addEventListener('visibilitychange', onVis)

  resize()
  update(0)
  render()
  start()

  return {
    setProgress(p: number) {
      progress = Math.min(1, Math.max(0, p))
      if (opts.reducedMotion) {
        shown = progress
        update(0)
        render()
      }
    },
    dispose() {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onPointer)
      disposables.forEach((d) => d.dispose())
      renderer.dispose()
    },
  }
}
