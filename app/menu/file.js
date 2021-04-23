const { dialog } = require('electron')
const SerialPort = require('serialport')
const fs = require('fs')
const { registerSerialPort } = require('../components/xbee')

let actualPort = ''
function selectPort(win) {
  SerialPort.list().then(
    ports => {
      const choice = dialog.showMessageBoxSync({
        title: 'Choix du port série',
        message: "Sélectionnez un port série ci-dessous. Si le port souhaité n'apparait pas, vérifier son branchement et son bon fonctionnement.",
        buttons: [
          'Annuler',
          ...ports.map(port => `${port.path} : ${port.manufacturer} ${actualPort === port.path ? '(Actuel)' : ''}`)
        ]
      })
      if (choice === 0) return
      actualPort = ports[choice - 1].path
      registerSerialPort(win, actualPort)
    },
    err => dialog.showErrorBox('Erreur dans la détection des ports série', err)
  )
}

function getFileMenu(win) {
  return {
    label: 'Fichier',
    submenu: [
      {
        label: 'Port série',
        id: 'serial-port',
        click: () => selectPort(win)
      },
      { type: 'separator' },
      {
        label: 'Importer',
        accelerator: 'Shift+I',
        click: () => openFile(win)
      },
      {
        label: 'Exporter',
        accelerator: 'Shift+E',
        click: () => { win.webContents.send('data__export') }
      },
      { type: 'separator' },
      { role: 'quit', label: 'Quitter' }
    ]
  }
}

function openFile(win) {
  let paths = dialog.showOpenDialogSync({
    properties: ['openFile'],
    filters: [
      { name: 'Fichiers textes', extensions: ['txt'] },
      { name: 'Tous les fichiers', extensions: ['*'] }
    ]
  })

  if (paths === undefined) return

  fs.readFile(paths[0], 'utf-8', (err, data) => {
    if (err !== null) {
      dialog.showErrorBox('Erreur dans le chargement du fichier', err.message)
    }

    win.webContents.send('data__import', data)
  })
}

module.exports = { getFileMenu, listPorts: selectPort }
