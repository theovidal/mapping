import View from './view/main'
import '../node_modules/bulma/css/bulma.min.css'
import './css/index.styl'
import registerIpcChannels from './ipc'

window.onload = () => {
  let view = new View()
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

  registerIpcChannels(view)
  view.animate()
}
