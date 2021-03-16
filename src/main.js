import { view, animate } from './view/main.js'

import './css/main.styl'

window.onload = () => {
  view.initializeScene()
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      view.addPoint(i, j, 0)
    }
  }
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      view.addPoint(0, j, i)
    }
  }

  animate()
  window.view = view
}
