const { ipcRenderer } = window.require('electron')
import View from '../view/main'

const shortcuts: object = {
  view: {
    reset: (view: View) => view.resetCamera()
  },
  data: {
    export: (view: View) => view.export()
  }
}

function registerShortcuts(view: View) {
  for (let menu in shortcuts) {
    for (let item in shortcuts[menu]) {
      ipcRenderer.on(`${menu}__${item}`, () => shortcuts[menu][item](view))
    }
  }
}

export default registerShortcuts
