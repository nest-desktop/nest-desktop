// electron/main.ts
// https://vuejsexamples.com/vite-vue3-electron-typescript-template/
// https://github.com/electron-vite/vite-plugin-electron/blob/main/examples/quick-start/electron/main.ts

process.env.DIST = join(__dirname, "../dist");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : join(process.env.DIST, "../public");

import { join } from "path";
import { BrowserWindow, app } from "electron";

// https://github.com/electron/electron/issues/32760
app.disableHardwareAcceleration();

let win: BrowserWindow | null;
const preload = join(__dirname, "./preload.js");
const url = process.env["VITE_DEV_SERVER_URL"];

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    icon: join(process.env.PUBLIC, "nest-desktop-icon.svg"),
    width: 1200,
    height: 750,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (url) {
    win.loadURL(url);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(join(process.env.DIST, "index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
