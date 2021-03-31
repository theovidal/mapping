const { ipcRenderer } = window.require('electron')
import View from './view/main'

const channels: object = {
  render: {
    toggleLive: (view: View, liveRender: boolean) => view.toggleLive(liveRender),
    update: (view: View, _) => view.update(),
    reset: (view: View, _) => view.resetCamera()
  },
  data: {
    addPoint: (view: View, arg: Array<Number>) => view.addPoint(arg[0], arg[1], arg[2]),
    export: (view: View, _) => view.export()
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
