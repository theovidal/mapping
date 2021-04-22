import View from './view/main'
import '../node_modules/bulma/css/bulma.min.css'
import './css/index.styl'
import registerIpcChannels from './ipc'

window.onload = () => {
  let view = new View()

  registerIpcChannels(view)
  view.animate()
}
