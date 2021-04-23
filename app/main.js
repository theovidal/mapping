const { app, BrowserWindow } = require('electron')
const registerMenu = require('./menu')
require('./components/ipc')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: 'assets/carriat.png',

    webPreferences: {
      nodeIntegration: true
    }
  })

  registerMenu(win)

  if (process.env.ENV === 'development') {
    win.loadURL('http://localhost:8080')
  } else {
    win.loadFile('index.html')
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
