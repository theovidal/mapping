import { Vector3 } from 'three/src/Three'

function getVertices(position: Array<Number>, index: number): Array<Vector3> {
  let vertices: Array<Vector3> = []
  for (let i = index; i < index + 9; i += 3) {
    vertices.push(new Vector3(position[i], position[i+1], position[i+2]))
  }
  return vertices
}

export { getVertices }
