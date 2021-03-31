import * as THREE from 'three/src/Three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter'
import download from '../utils/filesystem'

interface Options {
  liveRender: boolean
}

const defaultOptions = {
  liveRender: true
}

let pointsPool: Array<THREE.Mesh> = []

class View {
  scene: THREE.Scene
  camera: THREE.PersectiveCamera
  renderer: THREE.WebGLRenderer
  controls: OrbitControls

  geometry: THREE.SphereGeometry
  material: THREE.MeshBasicMaterial
  options: Options

  constructor() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer()
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.options = Object.assign({}, defaultOptions)

    this.scene.add(new THREE.AxesHelper(5))

    this.geometry = new THREE.SphereGeometry(0.5, 22, 22)
    this.material = new THREE.MeshBasicMaterial({
      color: 0xf4f4f4,
    })

    this.resetCamera()
    this.setSize()
    window.onresize = this.setSize.bind(this)
    document.body.appendChild(this.renderer.domElement)

    /*document.getElementById('data__export-btn').addEventListener('click', () => this.export())
    document.getElementById('view__camera-reset').addEventListener('click', () => this.resetCamera())*/
  }

  setSize() {
    let width = window.innerWidth
    let height = window.innerHeight
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  resetCamera() {
    this.controls.reset()
    this.camera.rotation.set(0)
    this.camera.position.set(0, 20, 20)
  }

  addPoint(x, y, z: Number) {
    const point = new THREE.Mesh(this.geometry, this.material)
    point.position.set(x, y, z)
    if (this.options.liveRender) this.scene.add(point)
    else pointsPool.push(point)
  }

  toggleLive(liveRender: boolean) {
    this.options.liveRender = liveRender
    this.update()
  }

  update() {
    pointsPool.forEach(point => this.scene.add(point))
    pointsPool = []
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  export() {
    const exporter = new OBJExporter()
    const result = exporter.parse(this.scene)
    download('mapping.obj', 'text/plain', result)
  }
}

export default View
export { View }
