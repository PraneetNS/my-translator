const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 700,
    minHeight: 500,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    // icon: path.join(__dirname, 'icon.png'), // User can add icon later
  })

  const isDev = process.env.NODE_ENV !== 'production'
  isDev
    ? win.loadURL('http://localhost:5173')
    : win.loadFile(path.join(__dirname, '../dist/index.html'))

  // Always-on-top shortcut
  globalShortcut.register('CommandOrControl+Shift+T', () => {
    const isOnTop = win.isAlwaysOnTop()
    win.setAlwaysOnTop(!isOnTop)
    win.setTitle(isOnTop ? 'Translator' : 'Translator — pinned')
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
