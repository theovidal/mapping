import * as THREE from 'three/src/Three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry'
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils'

const { ipcRenderer } = window.require('electron')

import download from '../utils/filesystem'
import { getVertices } from '../utils/vectors'

interface Options {
  liveRendering: boolean,
  quickhullRendering: boolean
}

const defaultOptions = {
  liveRendering: true,
  quickhullRendering: false
}

let verticesPool: Array<THREE.Vector3> = []

class View {
  scene: THREE.Scene
  camera: THREE.PersectiveCamera
  renderer: THREE.WebGLRenderer
  controls: OrbitControls

  geometry: THREE.SphereGeometry
  material: THREE.MeshBasicMaterial
  options: Options

  vertices: Array<THREE.Vector3> = []

  constructor() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer()
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.options = Object.assign({}, defaultOptions)

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
    let vertices: THREE.Vector3 = new THREE.Vector3(x, y, z)
    this.vertices.push(vertices)

    if (this.options.liveRendering) this.renderPoint(vertices)
    else verticesPool.push(vertices)
  }

  toggleLiveRendering(liveRendering: boolean) {
    this.options.liveRendering = liveRendering
    this.update()
  }

  update() {
    verticesPool.forEach(vertices => this.renderPoint(vertices))
    verticesPool = []
  }

  renderPoint(vertices: THREE.Vector3) {
    const point = new THREE.Mesh(this.geometry, this.material)
    point.position.set(...vertices.toArray())
    this.scene.add(point)

    /* const pointsMaterial = new THREE.PointsMaterial({
      color: 0x0080ff,
      size: 1,
      alphaTest: 0.5
    })

    const pointsGeometry = new THREE.BufferGeometry().setFromPoints(vertices)
    const points = new THREE.Points(pointsGeometry, pointsMaterial)
    view.scene.add(points) */
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
    this.vertices = []
    verticesPool = []
  }

  import(data: string) {
    data.split('\n').forEach(point => {
      if (point.length < 5) return

      let coordinates: Array<Number> = point.split(' ').map(value => parseFloat(value))
      this.addPoint(coordinates[0], coordinates[1], coordinates[2])
    })
  }

  export() {
    let content = ''
    this.vertices.forEach(point => content += point.toArray().join(" ") + "\n")
    download('mapping.txt', 'text/plain', content)

    /* const result = this.exporter.parse(this.scene)
    download('mapping.ply', 'text/plain', result) */
  }

  createConvexGeometry(): ConvexGeometry {
    if (this.vertices.length < 4) {
      ipcRenderer.send('showErrorDialog', {
        title: 'Erreur de calcul',
        message: 'Le rendu doit comporter au moins 4 points'
      })
      return undefined
    }

    const geometry = new ConvexGeometry(this.vertices)
    if (this.options.quickhullRendering) {
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.6,
        transparent: true
      })
      let wireFrameMat = new THREE.MeshBasicMaterial()
      wireFrameMat.wireframe = true

      let mesh = SceneUtils.createMultiMaterialObject(geometry, [material, wireFrameMat])
      this.scene.add(mesh)
    }
    return geometry
  }

  calculateSurface() {
    const geometry = this.createConvexGeometry()
    if (geometry === undefined) return

    const position = geometry.getAttribute('position')
    let surface = 0

    for (let i = 0; i < position.array.length; i += 9) {
      const v = getVertices(position.array, i)
      const ab = v[0].distanceTo(v[1])
      const bc = v[1].distanceTo(v[2])
      const ac = v[0].distanceTo(v[2])
      const p = (ab + bc + ac)/2

      surface += Math.sqrt(p * (p - ab) * (p - bc) * (p - ac))
    }

    ipcRenderer.send('showDialog', {
      title: 'Surface totale (approximation)',
      message: `${surface} cm²`
    })
  }

  calculateVolume() {
    const geometry = this.createConvexGeometry()
    if (geometry === undefined) return

    const position = geometry.getAttribute('position')
    let volume = 0

    for (let i = 0; i < position.array.length; i += 9) {
      const v = getVertices(position.array, i)
      volume += v[0].cross(v[1]).dot(v[2])
    }

    ipcRenderer.send('showDialog', {
      title: 'Volume total (approximation)',
      message: `${volume/6} cm³`
    })
  }
}

export default View
export { View }
