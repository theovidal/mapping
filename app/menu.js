const { Menu } = require('electron')

function getMenu(win) {
  const template = [
    {
      label: 'Fichier',
      submenu: [
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
        {
          label: 'Réinitialiser la vue',
          accelerator: 'V',
          click: () => { win.webContents.send('view__reset') }
        },
        { type: 'separator' },
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
    }
  ]

  return Menu.buildFromTemplate(template)
}

module.exports = getMenu