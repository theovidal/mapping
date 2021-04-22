const { Menu, dialog } = require('electron')
const fs = require('fs')

function getMenu(win) {
  const template = [
    {
      label: 'Fichier',
      submenu: [
        {
          label: 'Importer',
          accelerator: 'Shift+I',
          click: () => {
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
        },
        {
          label: 'Exporter',
          accelerator: 'Shift+E',
          click: () => { win.webContents.send('data__export') }
        },
        { type: 'separator' },
        { role: 'quit', label: 'Quitter' }
      ]
    },
    {
      label: 'Fenêtre',
      submenu: [
        { role: 'togglefullscreen', label: 'Plein écran' },
        { role: 'minimize', label: 'Minimiser' }
      ]
    },
    {
      label: 'Rendu',
      submenu: [
        {
          label: 'Temps réel',
          type: 'checkbox',
          checked: true,
          click: (item) => { win.webContents.send('render__toggleLive', item.checked) }
        },
        {
          label: 'Actualiser',
          accelerator: 'Shift+R',
          click: () => { win.webContents.send('render__update') }
        },
        {
          label: 'Réinitialiser la caméra',
          accelerator: 'V',
          click: () => { win.webContents.send('render__resetCamera') }
        },
        {
          label: 'Nettoyer',
          accelerator: 'Shift+R',
          click: () => {
            const choice = dialog.showMessageBoxSync({
              type: 'warning',
              message: "Nous vous conseillons d'exporter le rendu dans un fichier texte afin de ne pas le perdre.",
              buttons: ['Annuler', 'Nettoyer']
            })
            if (choice === 1) win.webContents.send('render__clear')
          }
        }
      ]
    },
    {
      label: 'Calculer',
      submenu: [
        {
          label: 'Surface totale',
          click: () => { win.webContents.send('calculate__surface')}
        }
      ]
    },
    {
      label: 'Application',
      submenu: [
        { role: 'reload', label: 'Recharger' },
        { role: 'forceReload', label: 'Rechargement forcé' },
        { role: 'toggleDevTools', label: 'Outils de développement' }
      ]
    }
  ]

  return Menu.buildFromTemplate(template)
}

module.exports = getMenu