const { ipcRenderer } = window.require('electron')
import View from './view/main'

const channels: object = {
  render: {
    toggleLive: (view: View, liveRender: boolean) => view.toggleLive(liveRender),
    toggleQuickhull: (view: View, quickHull: boolean) => view.options.quickhullRender = quickHull,
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
    surface: (view: View, _) => {
      const surface = view.calculateSurface()
      if (surface > 0) ipcRenderer.send('showDialog', {
        title: 'Surface totale (approximation)',
        message: `${surface} cm²`
      })
    },
    volume: (view: View, _) => {
      const volume = view.calculateVolume()
      if (volume > 0) ipcRenderer.send('showDialog', {
        title: 'Volume total (approximation)',
        message: `${volume} cm³`
      })
    }
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
