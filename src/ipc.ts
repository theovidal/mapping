const { ipcRenderer } = window.require('electron')
import View from './view/main'

const channels: object = {
  render: {
    toggleLive: (view: View, liveRender: boolean) => view.toggleLive(liveRender),
    update: (view: View, _) => view.update(),
    resetCamera: (view: View, _) => view.resetCamera(),
    clear: (view: View, _) => view.clear()
  },
  data: {
    addPoint: (view: View, arg: Array<Number>) => view.addPoint(arg[0], arg[1], arg[2]),
    import: (view: View, arg: string) => view.import(arg),
    export: (view: View, _) => view.export()
  },
  calculate: {
    surface: (view: View, _) => ipcRenderer.send('showDialog', view.calculateSurface())
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
