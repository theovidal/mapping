import View from '../view/main'

const shortcuts: object = {
  'KeyV': {
    exec: (view: View) => view.resetCamera()
  },
  'KeyE': {
    shift: true,
    exec: (view: View) => view.export()
  }
}

function registerShortcuts(view: View) {
  document.addEventListener('keyup', event => {
    let handler = shortcuts[event.code]
    if (handler !== undefined) {
      if (
        handler.control !== undefined && !event.ctrlKey
        || handler.alt !== undefined && !event.altKey
        || handler.shift !== undefined && !event.shiftKey
      ) return

      handler.exec(view)
    }
  })
}

export default registerShortcuts
