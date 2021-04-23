const { ipcMain, dialog } = require('electron')

ipcMain.on('showDialog', (_, arg) => {
  dialog.showMessageBox(arg)
})

ipcMain.on('showErrorDialog', (_, arg) => {
  dialog.showErrorBox(arg.title, arg.message)
})
