import * as THREE from 'three/src/Three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry'
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils'
import { PLYExporter } from 'three/examples/jsm/exporters/PLYExporter'
const { ipcRenderer } = window.require('electron')
import download from '../utils/filesystem'

interface Options {
  liveRender: boolean,
  quickhullRender: boolean
}

const defaultOptions = {
  liveRender: true,
  quickhullRender: false
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

  exporter: PLYExporter

  points: Array<Array<Number>> = []
  vertices: Array<THREE.Vector3> = []

  constructor() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer()
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.options = Object.assign({}, defaultOptions)
    this.exporter = new PLYExporter()

    this.scene.add(new THREE.AxesHelper(25))

    this.geometry = new THREE.SphereGeometry(0.5, 22, 22)
    this.material = new THREE.MeshBasicMaterial({
      color: 0xf4f4f4,
    })

    this.resetCamera()
    this.setSize()
    window.onresize = this.setSize.bind(this)
    document.body.appendChild(this.renderer.domElement)
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
    this.points.push([x, y, z])
    this.vertices.push(new THREE.Vector3(x, y, z))

    const point = new THREE.Mesh(this.geometry, this.material)
    point.position.set(x, y, z)
    if (this.options.liveRender) this.scene.add(point)
    else pointsPool.push(point)

    /*const pointsMaterial = new THREE.PointsMaterial({
      color: 0x0080ff,
      size: 1,
      alphaTest: 0.5
    })

    const pointsGeometry = new THREE.BufferGeometry().setFromPoints(vertices)
    const points = new THREE.Points(pointsGeometry, pointsMaterial)
    view.scene.add(points)*/
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

  clear() {
    // Reverse order is mandatory for this array
    for(let i = this.scene.children.length - 1; i >= 0; i--) {
      let obj = this.scene.children[i]
      if (obj.type === 'AxesHelper') continue
      this.scene.remove(obj)
    }
    this.points = []
    this.vertices = []
  }

  import(data: string) {
    data.split('\n').forEach(point => {
      let coordinates: Array<Number> = point.split(' ').map(value => parseFloat(value))
      this.addPoint(coordinates[0], coordinates[1], coordinates[2])
    })
  }

  export() {
    let content = ''
    this.points.forEach(point => {
      content += point.join(" ") + "\n"
    })
    download('mapping.txt', 'text/plain', content)

    /*const result = this.exporter.parse(this.scene)
    download('mapping.ply', 'text/plain', result)*/
  }

  createConvexGeometry(): ConvexGeometry {
    if (this.points.length < 4) {
      ipcRenderer.send('showErrorDialog', {
        title: 'Erreur de calcul',
        message: 'Le rendu doit comporter au moins 4 points'
      })
      return undefined
    }

    const geometry = new ConvexGeometry(this.vertices)
    if (this.options.quickhullRender) {
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.7,
        transparent: true
      })
      let wireFrameMat = new THREE.MeshBasicMaterial()
      wireFrameMat.wireframe = true

      let mesh = SceneUtils.createMultiMaterialObject(geometry, [material, wireFrameMat])
      this.scene.add(mesh)
    }
    return geometry
  }

  calculateSurface(): Number {
    const geometry = this.createConvexGeometry()
    if (geometry === undefined) return -1

    const position = geometry.getAttribute('position')
    let surface = 0

    for (let i = 0; i < position.array.length; i += 9) {
      const xA = position.array[i]
      const yA = position.array[i + 1]
      const zA = position.array[i + 2]

      const xB = position.array[i + 3]
      const yB = position.array[i + 4]
      const zB = position.array[i + 5]

      const xC = position.array[i + 6]
      const yC = position.array[i + 7]
      const zC = position.array[i + 8]

      const ab = Math.sqrt((xB - xA)**2 + (yB - yA)**2 + (zB - zA)**2)
      const bc = Math.sqrt((xB - xC)**2 + (yB - yC)**2 + (zB - zC)**2)
      const ac = Math.sqrt((xC - xA)**2 + (yC - yA)**2 + (zC - zA)**2)

      const p = (ab + bc + ac)/2

      surface += Math.sqrt(p * (p - ab) * (p - bc) * (p - ac))
    }

    return surface
  }

  calculateVolume(): Number {
    const geometry = this.createConvexGeometry()
    if (geometry === undefined) return -1

    const position = geometry.getAttribute('position')
    let volume = 0

    for (let i = 0; i < position.array.length; i += 9) {
      const v1 = new THREE.Vector3(position.array[i], position.array[i + 1], position.array[i + 2])
      const v2 = new THREE.Vector3(position.array[i + 3], position.array[i + 4], position.array[i + 5])
      const v3 = new THREE.Vector3(position.array[i + 6], position.array[i + 7], position.array[i + 8])

      volume += v1.cross(v2).dot(v3)
    }

    return volume/6
  }
}

export default View
export { View }
