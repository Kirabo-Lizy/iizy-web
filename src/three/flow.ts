import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/**
 * "Small steps, connected": ribbons of light with particles (steps) streaming along them and
 * glossy beads (milestones) riding the flow.
 *  - hero: pastel ribbons on the light hero; they draw in once, then keep flowing.
 *  - map:  glowing ribbons on the dark Clarity Map, revealed by scroll progress.
 */
export type FlowMode = 'hero' | 'map'

export type FlowHandle = {
  setProgress: (p: number) => void
  dispose: () => void
}

type Preset = {
  ribbons: number
  particlesPerRibbon: number
  palette: [string, string, string]
  blending: THREE.Blending
  opacity: number
  particleAlpha: number
  cameraZ: number
}

const PRESETS: Record<FlowMode, Preset> = {
  hero: {
    ribbons: 3,
    particlesPerRibbon: 110,
    palette: ['#8e7ae0', '#ab4aba', '#e46fb8'],
    blending: THREE.NormalBlending,
    opacity: 0.75,
    particleAlpha: 0.75,
    cameraZ: 12,
  },
  map: {
    ribbons: 4,
    particlesPerRibbon: 170,
    palette: ['#7c66dc', '#c36fd0', '#f07ec2'],
    blending: THREE.AdditiveBlending,
    opacity: 0.9,
    particleAlpha: 0.9,
    cameraZ: 12,
  },
}

const SAMPLES = 400

/** Small deterministic PRNG so the composition is the same on every load. */
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeCurve(mode: FlowMode, i: number, n: number, rand: () => number) {
  const pts: THREE.Vector3[] = []
  const steps = 8
  if (mode === 'hero') {
    // Long, gentle waves crossing the hero, spread around the vertical middle.
    const baseY = -1.9 + (i / Math.max(1, n - 1)) * 2.6
    const amp = 0.7 + rand() * 0.6
    const freq = 0.32 + rand() * 0.18
    const phase = rand() * Math.PI * 2
    for (let k = 0; k <= steps; k++) {
      const x = -11 + (22 * k) / steps
      pts.push(new THREE.Vector3(x, baseY + Math.sin(x * freq + phase) * amp, Math.cos(x * 0.25 + phase) * 1.6 - 1))
    }
  } else {
    // Ribbons rising from lower-left to upper-right through depth, like a journey forward.
    const spread = (i - (n - 1) / 2) * 0.9
    const phase = rand() * Math.PI * 2
    for (let k = 0; k <= steps; k++) {
      const u = k / steps
      const x = -10 + 20 * u
      const y = -2.6 + 4.6 * u * u + spread + Math.sin(u * 5 + phase) * 0.55
      const z = -5 + 5.5 * u + Math.cos(u * 4 + phase) * 1.2
      pts.push(new THREE.Vector3(x, y, z))
    }
  }
  return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5)
}

const ribbonVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`

const ribbonFrag = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  uniform float uOpacity;
  uniform float uSeed;
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float x = vUv.x;
    vec3 col = mix(mix(uA, uB, smoothstep(0.0, 0.5, x)), uC, smoothstep(0.5, 1.0, x));
    float rim = pow(1.0 - abs(dot(vNormal, vView)), 1.4);
    // pulses of light travelling along the ribbon
    float p = fract(x * 2.2 - uTime * 0.11 + uSeed);
    float pulse = exp(-pow((p - 0.5) * 9.0, 2.0));
    float ends = smoothstep(0.0, 0.1, x) * smoothstep(1.0, 0.9, x);
    float reveal = 1.0 - smoothstep(uReveal - 0.04, uReveal, x);
    float head = exp(-pow((x - uReveal) * 40.0, 2.0)) * step(0.001, uReveal) * step(uReveal, 0.999);
    float a = (0.22 + 0.55 * rim + 0.7 * pulse) * ends * reveal + head * 0.9;
    gl_FragColor = vec4(col + pulse * 0.25 + head * 0.4, a * uOpacity);
  }
`

const pointsVert = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  uniform float uDpr;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uDpr * (9.0 / -mv.z);
    vAlpha = aAlpha;
    vColor = aColor;
    gl_Position = projectionMatrix * mv;
  }
`

const pointsFrag = /* glsl */ `
  uniform float uAlpha;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a = a * a;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha * uAlpha);
  }
`

export function createFlow(canvas: HTMLCanvasElement, mode: FlowMode, opts: { reducedMotion: boolean }): FlowHandle {
  const preset = PRESETS[mode]
  const rand = rng(mode === 'hero' ? 7 : 21)
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 1.75)

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(dpr)
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
  camera.position.set(0, 0, preset.cameraZ)

  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const envTex = pmrem.fromScene(room, 0.04).texture
  scene.environment = envTex

  const world = new THREE.Group()
  scene.add(world)

  const colors = preset.palette.map((c) => new THREE.Color(c))
  const disposables: { dispose: () => void }[] = [envTex, pmrem]

  // Ribbons
  const curves: THREE.CatmullRomCurve3[] = []
  const samples: Float32Array[] = []
  const ribbonMats: THREE.ShaderMaterial[] = []
  for (let i = 0; i < preset.ribbons; i++) {
    const curve = makeCurve(mode, i, preset.ribbons, rand)
    curves.push(curve)
    const s = new Float32Array((SAMPLES + 1) * 3)
    curve.getSpacedPoints(SAMPLES).forEach((p, k) => p.toArray(s, k * 3))
    samples.push(s)

    const radius = mode === 'hero' ? 0.035 + rand() * 0.04 : 0.04 + rand() * 0.05
    const geo = new THREE.TubeGeometry(curve, 320, radius, 10, false)
    const mat = new THREE.ShaderMaterial({
      vertexShader: ribbonVert,
      fragmentShader: ribbonFrag,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: preset.blending,
      uniforms: {
        uTime: { value: 0 },
        uReveal: { value: opts.reducedMotion || mode === 'map' ? 1 : 0 },
        uOpacity: { value: preset.opacity },
        uSeed: { value: rand() },
        uA: { value: colors[0] },
        uB: { value: colors[1] },
        uC: { value: colors[2] },
      },
    })
    ribbonMats.push(mat)
    world.add(new THREE.Mesh(geo, mat))
    disposables.push(geo, mat)
  }

  const sampleAt = (ribbon: number, t: number, out: THREE.Vector3) => {
    const s = samples[ribbon]
    const f = Math.min(Math.max(t, 0), 1) * SAMPLES
    const k = Math.min(Math.floor(f), SAMPLES - 1)
    const r = f - k
    const a = k * 3
    const b = a + 3
    return out.set(s[a] + (s[b] - s[a]) * r, s[a + 1] + (s[b + 1] - s[a + 1]) * r, s[a + 2] + (s[b + 2] - s[a + 2]) * r)
  }

  // Particles (the "steps")
  const count = preset.ribbons * preset.particlesPerRibbon
  const pRibbon = new Uint8Array(count)
  const pT = new Float32Array(count)
  const pSpeed = new Float32Array(count)
  const pOffset = new Float32Array(count * 3)
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const alphas = new Float32Array(count)
  const pColors = new Float32Array(count * 3)
  const tmp = new THREE.Color()
  for (let i = 0; i < count; i++) {
    pRibbon[i] = i % preset.ribbons
    pT[i] = rand()
    pSpeed[i] = 0.012 + rand() * 0.025
    const spread = mode === 'hero' ? 0.32 : 0.45
    pOffset[i * 3] = (rand() - 0.5) * spread
    pOffset[i * 3 + 1] = (rand() - 0.5) * spread
    pOffset[i * 3 + 2] = (rand() - 0.5) * spread
    sizes[i] = (mode === 'hero' ? 5 : 6) + rand() * (mode === 'hero' ? 9 : 12)
    alphas[i] = 0.35 + rand() * 0.65
    tmp.copy(colors[0]).lerp(colors[2], rand()).lerp(colors[1], rand() * 0.5)
    tmp.toArray(pColors, i * 3)
  }
  const pGeo = new THREE.BufferGeometry()
  const posAttr = new THREE.BufferAttribute(positions, 3)
  posAttr.setUsage(THREE.DynamicDrawUsage)
  const alphaAttr = new THREE.BufferAttribute(alphas.slice(), 1)
  alphaAttr.setUsage(THREE.DynamicDrawUsage)
  pGeo.setAttribute('position', posAttr)
  pGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  pGeo.setAttribute('aAlpha', alphaAttr)
  pGeo.setAttribute('aColor', new THREE.BufferAttribute(pColors, 3))
  const pMat = new THREE.ShaderMaterial({
    vertexShader: pointsVert,
    fragmentShader: pointsFrag,
    transparent: true,
    depthWrite: false,
    blending: preset.blending,
    uniforms: { uDpr: { value: dpr }, uAlpha: { value: preset.particleAlpha } },
  })
  const points = new THREE.Points(pGeo, pMat)
  points.frustumCulled = false
  world.add(points)
  disposables.push(pGeo, pMat)

  // Beads (the milestones), one per ribbon
  const beadGeo = new THREE.SphereGeometry(1, 48, 32)
  disposables.push(beadGeo)
  const beads = curves.map((_, i) => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: colors[i % colors.length].clone().lerp(new THREE.Color('#ffffff'), mode === 'hero' ? 0.35 : 0.15),
      roughness: 0.12,
      metalness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      iridescence: 1,
      iridescenceIOR: 1.35,
      envMapIntensity: mode === 'hero' ? 1.1 : 1.4,
      transparent: true,
      opacity: 1,
    })
    disposables.push(mat)
    const mesh = new THREE.Mesh(beadGeo, mat)
    const r = (mode === 'hero' ? 0.16 : 0.2) + rand() * 0.1
    mesh.scale.setScalar(r)
    world.add(mesh)
    return { mesh, mat, t0: rand(), speed: 0.018 + rand() * 0.012 }
  })

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
    // keep the composition's width on narrow (portrait) screens
    const narrow = w / h < 1
    camera.position.z = preset.cameraZ * (narrow ? 1.25 + (1 - w / h) * 0.9 : 1)
    camera.updateProjectionMatrix()
    render()
  }
  const ro = new ResizeObserver(resize)
  if (canvas.parentElement) ro.observe(canvas.parentElement)

  // Pointer parallax (fine pointers only)
  const target = { x: 0, y: 0 }
  const onPointer = (e: PointerEvent) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2
    target.y = (e.clientY / window.innerHeight - 0.5) * 2
  }
  if (!coarse && !opts.reducedMotion) window.addEventListener('pointermove', onPointer, { passive: true })

  // State
  let progress = 0
  let shownProgress = 0
  let elapsed = opts.reducedMotion ? 20 : 0
  let last = performance.now()
  let raf = 0
  let visible = true
  let running = false
  const v = new THREE.Vector3()

  const update = (dt: number) => {
    if (!opts.reducedMotion) elapsed += dt
    shownProgress += (progress - shownProgress) * Math.min(1, dt * 6 || 1)
    const reveal = mode === 'hero' ? Math.min(1, elapsed / 2.6) : 0.06 + shownProgress * 0.94
    const eased = mode === 'hero' ? 1 - Math.pow(1 - reveal, 3) : reveal

    ribbonMats.forEach((m) => {
      m.uniforms.uTime.value = elapsed
      m.uniforms.uReveal.value = eased
    })

    const boost = mode === 'map' ? 1 + Math.abs(progress - shownProgress) * 40 : 1
    for (let i = 0; i < count; i++) {
      if (!opts.reducedMotion) pT[i] = (pT[i] + pSpeed[i] * dt * boost) % 1
      const t = pT[i]
      sampleAt(pRibbon[i], t, v)
      const wob = Math.sin(elapsed * 0.8 + i) * 0.04
      positions[i * 3] = v.x + pOffset[i * 3]
      positions[i * 3 + 1] = v.y + pOffset[i * 3 + 1] + wob
      positions[i * 3 + 2] = v.z + pOffset[i * 3 + 2]
      // hide steps beyond the revealed part of the path, fade near the ends
      const edge = Math.min(1, t / 0.08, (1 - t) / 0.08)
      alphaAttr.array[i] = t <= eased ? alphas[i] * Math.max(0, edge) : 0
    }
    posAttr.needsUpdate = true
    alphaAttr.needsUpdate = true

    beads.forEach((b, i) => {
      const t = mode === 'hero'
        ? 0.08 + ((b.t0 + elapsed * b.speed) % 1) * 0.84
        : Math.max(0.06, eased - 0.02 - i * 0.03)
      sampleAt(i, t, v)
      b.mesh.position.copy(v)
      b.mesh.rotation.y = elapsed * 0.4 + i
      const vis = mode === 'hero' ? Math.min(1, Math.max(0, (eased - t) * 8)) : 1
      b.mat.opacity = vis
      b.mesh.visible = vis > 0.01
    })

    // gentle drift + parallax
    const tx = target.y * 0.08 + (mode === 'map' ? -0.12 + shownProgress * 0.18 : 0)
    const ty = target.x * 0.14 + Math.sin(elapsed * 0.12) * 0.05
    world.rotation.x += (tx - world.rotation.x) * Math.min(1, dt * 2.5 || 1)
    world.rotation.y += (ty - world.rotation.y) * Math.min(1, dt * 2.5 || 1)
    if (mode === 'map') world.position.z = shownProgress * 1.6
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
        shownProgress = progress
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
