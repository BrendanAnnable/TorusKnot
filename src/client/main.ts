import { Clock } from 'three'
import { CubeTextureLoader } from 'three'
import { FrontSide } from 'three'
import { Color } from 'three'
import { PerspectiveCamera } from 'three'
import { WebGLRenderer } from 'three'
import { Mesh } from 'three'
import { RawShaderMaterial } from 'three'
import { Matrix4 } from 'three'
import { PlaneBufferGeometry } from 'three'
import { Scene } from 'three'
import { OrthographicCamera } from 'three'
import { LinearMipmapNearestFilter } from 'three'
import { LinearFilter } from 'three'
import { RepeatWrapping } from 'three'
import { WebGLRenderTarget } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'stats.js'
import * as dat from 'dat.gui'

import skyboxBack from '../images/skybox/sky_back6.png'
import skyboxBottom from '../images/skybox/sky_bottom4.png'
import skyboxFront from '../images/skybox/sky_front5.png'
import skyboxLeft from '../images/skybox/sky_left2.png'
import skyboxRight from '../images/skybox/sky_right1.png'
import skyboxTop from '../images/skybox/sky_top3.png'

import normalVertexShader from './shaders/normal.vert'
import normalFragmentShader from './shaders/normal.frag'
import skyboxVertexShader from './shaders/skybox.vert'
import skyboxFragmentShader from './shaders/skybox.frag'
import vertexShader from './shaders/shader.vert'
import fragmentShader from './shaders/shader.frag'

const TAU = Math.PI * 2

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement

function generateNormalMap(renderer: WebGLRenderer): WebGLRenderTarget {
  const renderTarget = new WebGLRenderTarget(1024, 1024, {
    wrapS: RepeatWrapping,
    wrapT: RepeatWrapping,
    magFilter: LinearFilter,
    minFilter: LinearMipmapNearestFilter,
    anisotropy: renderer.capabilities.getMaxAnisotropy(),
    depthBuffer: false,
    stencilBuffer: false,
  })
  renderTarget.texture.generateMipmaps = true

  const camera = new OrthographicCamera(0, 1, 1, 0, 0, 2)
  camera.position.z = 1
  const scene = new Scene()
  const geometry = new PlaneBufferGeometry(1, 1)
  geometry.applyMatrix(new Matrix4().makeTranslation(0.5, 0.5, 0))
  const material = new RawShaderMaterial({
    vertexShader: normalVertexShader,
    fragmentShader: normalFragmentShader,
  })
  const mesh = new Mesh(geometry, material)
  scene.add(mesh)
  renderer.setRenderTarget(renderTarget)
  renderer.render(scene, camera)
  renderer.setRenderTarget(null)
  return renderTarget
}

const stats = new Stats()
stats.showPanel(0)
stats.dom.style.position = 'absolute'
stats.dom.style.left = '0'
stats.dom.style.top = '0'
document.body.appendChild(stats.dom)

const gui = new dat.GUI()

const renderer = new WebGLRenderer({
  canvas,
  antialias: true,
})
renderer.sortObjects = false
//renderer.getContext().getExtension('OES_standard_derivatives');
//renderer.getContext().getExtension('OES_texture_float');
//renderer.getContext().getExtension('OES_texture_float_linear');
//renderer.setClearColor('#7F99B3');
//renderer.setClearColor('#050505');
renderer.setClearColor('#000')

const scene = new Scene()
const camera = new PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
//const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
camera.position.z = 8

const settings = {
  pointSize: 10,
  lighting: true,
  //'lighting': false,
  ambient: true,
  diffuse: true,
  specular: true,
  debugLighting: false,
  debugNormals: false,
  firstColor: '#7a7a7a',
  //'firstColor': '#ff0000',
  secondColor: '#0a002a',
  //'secondColor': '#00ff00',
  thirdColor: '#002a00',
  //'thirdColor': '#0000ff',
  shininess: 30,
  epsilon: 1e-2,
  tubeRadius: 0.15,
  torusKnotRadius: 1,
  numBumps: 3,
  bumpSize: 0.1,
  bumpShift: 1 / 2,
  numTwists: 56,
  numCoils: 3,
  numLoops: 7,
  spinningSpeed: 0.1,
  wireframe: false,
}
const material = new RawShaderMaterial({
  uniforms: {
    time: { value: 0 },
    epsilon: { value: settings.epsilon },
    pointSize: { value: settings.pointSize },
    uLighting: { value: settings.lighting },
    debugLighting: { value: settings.debugLighting },
    uAmbient: { value: settings.ambient },
    uDiffuse: { value: settings.diffuse },
    uSpecular: { value: settings.specular },
    firstColor: { value: new Color(settings.firstColor).toArray() },
    secondColor: { value: new Color(settings.secondColor).toArray() },
    thirdColor: { value: new Color(settings.thirdColor).toArray() },
    shininess: { value: settings.shininess },
    tubeRadius: { value: settings.tubeRadius },
    torusKnotRadius: { value: settings.torusKnotRadius },
    numBumps: { value: settings.numBumps },
    bumpShift: { value: settings.bumpShift },
    bumpSize: { value: settings.bumpSize },
    numTwists: { value: settings.numTwists },
    numCoils: { value: settings.numCoils },
    numLoops: { value: settings.numLoops },
    spinningSpeed: { value: settings.spinningSpeed },
    debugNormals: { value: settings.debugNormals },
    mouseX: { value: 1e5 },
    normalMap: { value: generateNormalMap(renderer).texture },
  },
  vertexShader,
  fragmentShader,
  side: FrontSide,
})
gui.add(settings, 'lighting').onChange((value: boolean) => {
  material.uniforms.uLighting.value = value
})
gui.add(settings, 'spinningSpeed', 0, 1).onChange((value: number) => {
  material.uniforms.spinningSpeed.value = value
})
//gui.add(settings, 'pointSize', 1, 100).onChange(function (value) {
//	material.uniforms.pointSize.value = value;
//});
gui.add(settings, 'bumpSize', 0.001, 0.2).onChange((value: number) => {
  material.uniforms.bumpSize.value = value
})
gui.add(settings, 'bumpShift', 0, 1).onChange((value: number) => {
  material.uniforms.bumpShift.value = value
})
gui
  .add(settings, 'numBumps', 0, 10)
  .step(1)
  .onChange((value: number) => {
    material.uniforms.numBumps.value = value
  })
gui
  .add(settings, 'numTwists', 0, 256)
  .step(1)
  .onChange((value: number) => {
    material.uniforms.numTwists.value = value
  })
gui.add(settings, 'tubeRadius', 0, 1).onChange((value: number) => {
  material.uniforms.tubeRadius.value = value
})
gui.add(settings, 'torusKnotRadius', 0, 2).onChange((value: number) => {
  material.uniforms.torusKnotRadius.value = value
})
gui
  .add(settings, 'numLoops', 1, 20)
  .step(1)
  .onChange((value: number) => {
    material.uniforms.numLoops.value = value
  })
gui
  .add(settings, 'numCoils', 1, 10)
  .step(1)
  .onChange((value: number) => {
    material.uniforms.numCoils.value = value
  })
gui.add(settings, 'shininess', 1, 100).onChange((value: number) => {
  material.uniforms.shininess.value = value
})
gui.addColor(settings, 'firstColor').onChange((value: string) => {
  material.uniforms.firstColor.value = new Color(value).toArray()
})
gui.addColor(settings, 'secondColor').onChange((value: string) => {
  material.uniforms.secondColor.value = new Color(value).toArray()
})
gui.addColor(settings, 'thirdColor').onChange((value: string) => {
  material.uniforms.thirdColor.value = new Color(value).toArray()
})

const debug = gui.addFolder('Debug')
debug.open()
debug.add(settings, 'wireframe').onChange((value: boolean) => {
  material.wireframe = value
})
debug.add(settings, 'ambient').onChange((value: boolean) => {
  material.uniforms.uAmbient.value = value
})
debug.add(settings, 'diffuse').onChange((value: boolean) => {
  material.uniforms.uDiffuse.value = value
})
debug.add(settings, 'specular').onChange((value: boolean) => {
  material.uniforms.uSpecular.value = value
})
debug.add(settings, 'debugLighting').onChange((value: boolean) => {
  material.uniforms.debugLighting.value = value
})
debug.add(settings, 'debugNormals').onChange((value: boolean) => {
  material.uniforms.debugNormals.value = value
})
debug.add(settings, 'epsilon', 1e-5, 1e-1).onChange((value: boolean) => {
  material.uniforms.epsilon.value = value
})

const box = new PlaneBufferGeometry(2, 2)
const tCube = new CubeTextureLoader().load([skyboxRight, skyboxLeft, skyboxTop, skyboxBottom, skyboxFront, skyboxBack])

const skyboxMaterial = new RawShaderMaterial({
  uniforms: {
    inverseProjectionMatrix: { type: 'm4', value: new Matrix4() },
    tCube: { type: 't', value: tCube },
  },
  vertexShader: skyboxVertexShader,
  fragmentShader: skyboxFragmentShader,
  side: FrontSide,
  depthWrite: false,
})

const skybox = new Mesh(box, skyboxMaterial)
scene.add(skybox)

const geometry = new PlaneBufferGeometry(TAU, TAU, 80, 5000)
geometry.applyMatrix(new Matrix4().makeTranslation(Math.PI, Math.PI, 0))
const mesh = new Mesh(geometry, material)
scene.add(mesh)

const clock = new Clock()

const controls = new OrbitControls(camera, canvas)

canvas.addEventListener('mousemove', e => {
  material.uniforms.mouseX.value = e.layerX
})

function render(): void {
  requestAnimationFrame(render)

  stats.begin()

  if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
  }

  material.uniforms.time.value = clock.getElapsedTime()
  skyboxMaterial.uniforms.inverseProjectionMatrix.value.getInverse(camera.projectionMatrix)

  controls.update()
  renderer.render(scene, camera)
  stats.end()
}

requestAnimationFrame(render)
