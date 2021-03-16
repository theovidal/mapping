import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let view = {
  scene: null,
  camera: null,
  controls: null,
  renderer: null,

  objects: [],

  initializeScene() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer()
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.scene.add(new THREE.AmbientLight(0xffffff))

    this.scene.add(new THREE.AxesHelper(5))

    this.camera.position.set(0, 20, 20)

    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)
  },

  addPoint(x, y, z) {
    const geometry = new THREE.SphereGeometry(0.5, 128, 128)
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xf4f4f4,
    })
    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.set(x, y, z)
    this.scene.add(sphere)
  }
}

function animate() {
  requestAnimationFrame(animate)
  view.controls.update()
  view.renderer.render(view.scene, view.camera)
}

export { view, animate }
