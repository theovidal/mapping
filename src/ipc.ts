const { ipcRenderer } = window.require('electron')
import View from './view/main'

const channels: object = {
  view: {
    reset: (view: View) => view.resetCamera()
  },
  data: {
    addPoint: (_: View, arg: string) => console.log(arg),
    export: (view: View, _: string) => view.export()
  }
}

function registerIpcChannels(view: View) {
  for (let category in channels) {
    for (let item in channels[category]) {
      ipcRenderer.on(`${category}__${item}`, (_, arg) => channels[category][item](view, arg))
    }
  }
}

export default registerIpcChannels
