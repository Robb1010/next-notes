'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import keytar from 'keytar'
import ApiOps from './helpers/api'
const isDevelopment = process.env.NODE_ENV !== 'production'

const path = require("path");
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

const apiOps = new ApiOps();

async function createWindow() {
  console.log(process.env.NODE_ENV);
  console.log("dsadsda");
  let inconPath;
  isDevelopment ? inconPath = path.join(__dirname, '../src/assets', 'icon.png') : inconPath = path.join(__dirname, 'assets', 'icon.png');
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    minWidth: 1200,
    height: 700,
    minHeight: 500,
    icon: inconPath,
    webPreferences: {
      webSecurity: false,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })





  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Api interactions
ipcMain.handle("login", async (event, credentials) => {
  return await apiOps.login(credentials);
});

ipcMain.handle("new-note", async (event, credentials, category) => {
  return await apiOps.newNote(credentials, category);
})

ipcMain.handle("update-note", async (event, credentials, body) => {
  return await apiOps.updateNote(credentials, body);
})

ipcMain.handle("delete-note", async (event, credentials, noteId) => {
  return await apiOps.deleteNote(credentials, noteId);
});

// Keytar interactions
ipcMain.handle("find-all", async () => {
  return await keytar.findCredentials("nextNotes");
});

ipcMain.on("set-password", async (event, user, pass) => {
  await keytar.setPassword("nextNotes", user, pass);
});

ipcMain.handle("delete-account", async (event, account) => {
  return await keytar.deletePassword("nextNotes", account);
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
