const { app, dialog, BrowserWindow } = require('electron')

const registerMenu = require('./menu')
require('./components/ipc')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Mapping 3D',
    icon: 'build/icon.png',

    webPreferences: {
      nodeIntegration: true
    }
  })

  registerMenu(win)

  if (process.env.ENV === 'dev') {
    win.loadURL('http://localhost:8080')
  } else {
    win.loadFile('index.html')
  }

  win.on('close', function(e){
    let choice = dialog.showMessageBoxSync(this,
      {
        type: 'question',
        buttons: ['Confirmer', 'Annuler'],
        title: "Fermer l'application",
        message: "Êtes-vous sûrs de quitter l'application ? Veillez à enregistrer le mapping via la commande Fichier > Exporter (vous pourrez réimporter votre travail à tout moment par la commande Importer)."
     })
     if (choice === 1) {
       e.preventDefault()
     }
  })
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
