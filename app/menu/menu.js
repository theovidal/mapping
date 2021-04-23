const { Menu, dialog } = require('electron')
const { getFileMenu } = require('./file')

function registerMenu(win) {
  const template = [
    getFileMenu(win),
    {
      label: 'Fenêtre',
      submenu: [
        { role: 'togglefullscreen', label: 'Plein écran' },
        { role: 'minimize', label: 'Minimiser' }
      ]
    },
    {
      label: 'Application',
      submenu: [
        { role: 'reload', label: 'Recharger' },
        { role: 'forceReload', label: 'Rechargement forcé' },
        { role: 'toggleDevTools', label: 'Outils de développement' }
      ]
    },
    {
      label: 'Rendu',
      submenu: [
        {
          label: 'En temps réel',
          type: 'checkbox',
          checked: true,
          click: (item) => { win.webContents.send('render__toggleLive', item.checked) }
        },
        {
          label: 'Actualiser',
          accelerator: 'R',
          click: () => { win.webContents.send('render__update') }
        },
        {
          label: 'Réinitialiser la caméra',
          accelerator: 'V',
          click: () => { win.webContents.send('render__resetCamera') }
        },
        {
          label: 'Nettoyer',
          accelerator: 'Shift+N',
          click: () => {
            const choice = dialog.showMessageBoxSync({
              type: 'warning',
              message: "Il est conseillé d'exporter les données dans un fichier texte afin de ne pas les perdre et pouvoir les réimporter plus tard.",
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
          label: 'Aperçu du Quickhull',
          type: 'checkbox',
          checked: false,
          click: (item) => { win.webContents.send('render__toggleQuickhull', item.checked) }
        },
        { type: 'separator' },
        {
          label: 'Surface totale',
          click: () => { win.webContents.send('calculate__surface')}
        },
        {
          label: 'Volume total',
          click: () => { win.webContents.send('calculate__volume')}
        }
      ]
    }
  ]

  let menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

module.exports = registerMenu
