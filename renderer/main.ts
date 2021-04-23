import registerIpcChannels from './ipc'

import View from './view/main'

import '../node_modules/bulma/css/bulma.min.css'
import './style/index.styl'

window.onload = () => {
  let view = new View()

  registerIpcChannels(view)
  view.animate()
}
