const { app, ipcMain, BrowserWindow, Menu } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: 'assets/carriat.png',

    webPreferences: {
      nodeIntegration: true
    }
  })

  const template = [
    {
      label: 'Vue',
      submenu: [
        {
          label: 'Réinitialiser la vue',
          accelerator: 'V',
          click: () => { win.webContents.send('view__reset') }
        }
      ]
    },
    {
      label: 'Données',
      submenu: [
        {
          label: 'Exporter',
          accelerator: 'Shift+E',
          click: () => { win.webContents.send('data__export') }
        }
      ]
    },
    {
      label: 'Application',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { role: 'quit' }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

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
