import { app, BrowserWindow, shell } from "electron"
import log from "electron-log"
import { autoUpdater } from "electron-updater"
import path from "path"
import MenuBuilder from "./menu"
import { registerEvents } from "./events"
import { registerIpcMain } from "./utils/ipc"
import { isDev } from "./utils/env"

export default class AppUpdater {
  constructor() {
    log.transports.file.level = "info"
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()
    autoUpdater.on("update-downloaded", (info) => {
      mainWindow.webContents.send("update-downloaded")
    })
  }
}
export let mainWindow: BrowserWindow | null = null

const installExtensions = async () => {
  // eslint-disable-next-line global-require,@typescript-eslint/no-var-requires
  const installer = require("electron-devtools-installer")
  const forceDownload = isDev()
  const extensions = ["REACT_DEVELOPER_TOOLS"]

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log)
}
export const createWindow = async () => {
  if (isDev()) {
    await installExtensions()
  }

  const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, "assets") : path.join(__dirname, "../assets")

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths)
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 780,
    titleBarStyle: "hidden",
    icon: getAssetPath("icon.png"),
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      preload: __dirname + "/preload.js",
    },
  })
  mainWindow.webContents.openDevTools()

  if (app.isPackaged) {
    mainWindow.loadURL(`file://${__dirname}/renderer/index.html`)
  } else {
    mainWindow.loadURL(`http://localhost:3000`)
  }

  mainWindow.webContents.on("did-finish-load", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on("closed", () => {
    mainWindow = null
  })

  const menuBuilder = new MenuBuilder(mainWindow)
  menuBuilder.buildMenu()

  // Open urls in the user's browser
  mainWindow.webContents.on("new-window", (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater()
}

if (!isDev()) {
  // eslint-disable-next-line global-require,@typescript-eslint/no-var-requires
  const sourceMapSupport = require("source-map-support")
  sourceMapSupport.install()
}

if (isDev()) {
  // eslint-disable-next-line global-require,@typescript-eslint/no-var-requires
  require("electron-debug")()
}

export const initElectron = () => {
  // 创建应用
  app.whenReady().then(createWindow).catch(console.log)
  registerEvents(app)
  registerIpcMain()
}
