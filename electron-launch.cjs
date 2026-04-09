// electron-launch.cjs — waits for Vite then spawns Electron
const { spawn } = require('child_process')
const http = require('http')

const VITE_URL = 'http://localhost:5173'
const MAX_TRIES = 30
const INTERVAL_MS = 1000

let tries = 0

function check() {
  tries++
  http.get(VITE_URL, (res) => {
    if (res.statusCode === 200 || res.statusCode === 304) {
      console.log('[launcher] Vite is ready — starting Electron')
      const electronBin = process.platform === 'win32' ? 'electron.cmd' : 'electron'
      const proc = spawn(
        electronBin,
        ['.'],
        {
          stdio: 'inherit',
          env: { ...process.env, NODE_ENV: 'development' },
          shell: true,
          cwd: process.cwd(),
        }
      )
      proc.on('close', code => process.exit(code))
    } else {
      retry()
    }
  }).on('error', retry)
}

function retry() {
  if (tries >= MAX_TRIES) {
    console.error('[launcher] Vite never started. Giving up.')
    process.exit(1)
  }
  setTimeout(check, INTERVAL_MS)
}

check()
