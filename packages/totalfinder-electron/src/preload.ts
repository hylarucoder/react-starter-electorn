const { contextBridge, ipcRenderer } = require("electron")
contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: ipcRenderer,
  emit: (data) =>
    ipcRenderer.send("emit", {
      data,
    }),
  on: (fn) => {
    ipcRenderer.on("on", (event, ...args) => fn(...args))
  },
})
