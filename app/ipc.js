const { ipcMain, dialog } = require('electron')

ipcMain.on('showDialog', (event, arg) => {
  dialog.showMessageBox({
    title: 'Surface totale',
    message: `${arg} cm²`
  })
})
