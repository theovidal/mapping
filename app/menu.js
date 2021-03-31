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
          label: 'Actualiser le rendu',
          accelerator: 'Shift+R',
          click: () => { win.webContents.send('render__update') }
        },
        {
          label: 'Réinitialiser la caméra',
          accelerator: 'V',
          click: () => { win.webContents.send('render__reset') }
        },
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