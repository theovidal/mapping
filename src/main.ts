import * as THREE from 'three/src/Three'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry'
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils'
import View from './view/main'
import '../node_modules/bulma/css/bulma.min.css'
import './css/index.styl'
import registerIpcChannels from './ipc'

window.onload = () => {
  let view = new View()

  // Random data set of points
  let vertices: Array<THREE.Vector3> = []
  for (let i = 0; i < 20; i++) {
    let randomX = -15 + Math.round(Math.random() * 30);
    let randomY = -15 + Math.round(Math.random() * 30);
    let randomZ = -15 + Math.round(Math.random() * 30);

    vertices.push(new THREE.Vector3(randomX, randomY, randomZ))
  }

  // Rendering the points we created
  const pointsMaterial = new THREE.PointsMaterial({
    color: 0x0080ff,
    size: 1,
    alphaTest: 0.5
  })

  const pointsGeometry = new THREE.BufferGeometry().setFromPoints(vertices)
  const points = new THREE.Points(pointsGeometry, pointsMaterial)
  view.scene.add(points)

  // Creating the ConvexGeometry and the materials (faces + edges)
  const geometry = new ConvexGeometry(vertices)
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    opacity: 0.7,
    transparent: true
  })
  let wireFrameMat = new THREE.MeshBasicMaterial()
  wireFrameMat.wireframe = true

  let mesh = SceneUtils.createMultiMaterialObject(geometry, [material, wireFrameMat])
  view.scene.add(mesh)

  // Calculating the total surface based on all the vertices
  const position = geometry.getAttribute('position')
  let totalSurface = 0

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

    totalSurface += Math.sqrt(p * (p - ab) * (p - bc) * (p - ac))
  }

  console.log("total surface:", totalSurface)

  registerIpcChannels(view)
  view.animate()
}
