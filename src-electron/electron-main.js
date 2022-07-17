import { app, BrowserWindow, nativeTheme } from 'electron'
import path from 'path'
import os from 'os'

import ex from 'express'
const express = ex()

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()
const port = process.env.PORT_BUILD || 12345
const appPath = app.getAppPath()

express.use(require('express').static(path.join(appPath, '/')))
express.get('/', (_, res) => res.sendFile(path.join(appPath, '/index.html')))
express.listen(port, () => console.log('Running on ' + port))

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

let mainWindow

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
      nativeWindowOpen: true
    }
  })

  if (process.env.DEBUGGING) {
    mainWindow.loadURL(process.env.APP_URL)

    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadURL('http://localhost:' + port)
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
