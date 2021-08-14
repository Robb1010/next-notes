"use strict";

import {app, BrowserWindow, ipcMain, nativeTheme, protocol, shell, Menu} from "electron";
import {createProtocol} from "vue-cli-plugin-electron-builder/lib";
import installExtension, {VUEJS_DEVTOOLS} from "electron-devtools-installer";
import keytar from "keytar";
import isDev from "electron-is-dev";

const isDevelopment = process.env.NODE_ENV !== "production";
const os = require("os");
const path = require("path");

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      secure: true,
      standard: true,
    },
  },
]);

let iconPath;

isDev ? iconPath = path.join(__dirname, "../src/assets", "nextnotes.png") : iconPath = path.join(__dirname, "build/icons", "icon.png");

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1100,
    height: 700,
    minWidth: 1000,
    minHeight: 500,
    webPreferences: {
      webSecurity: false,
      spellcheck: false,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  //Hide the menu
  //Menu.setApplicationMenu(null);

  os.platform() === "linux" ? win.setIcon(iconPath) : null;

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  let wc = win.webContents;
  wc.on("will-navigate", function (e, url) {
    if (url != wc.getURL()) {
      e.preventDefault();
      shell.openExternal(url);
    }
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  await createWindow();
});

// Context menu -- should be in an ipcMain call
/*

const template = [{
    label: 'Menu Item 1',
    click: () => {
      event.sender.send('context-menu-command', 'menu-item-1')
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'Menu Item 2',
    type: 'checkbox',
    checked: true
  }
]

const menu = Menu.buildFromTemplate(template)
menu.popup();
*/

// Detect System Theme
//console.log(nativeTheme.shouldUseDarkColors);

ipcMain.handle("delete-account", async (event, account) => {
  return await keytar.deletePassword("nextNotes", account);
});

ipcMain.handle("find-all", async () => {
  return await keytar.findCredentials("nextNotes");
});

ipcMain.on("set-password", async (event, user, pass) => {
  await keytar.setPassword("nextNotes", user, pass);
});

ipcMain.handle("handle-theme", async () => {
  return nativeTheme.shouldUseDarkColors;
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
