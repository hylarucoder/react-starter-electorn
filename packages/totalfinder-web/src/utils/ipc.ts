// @ts-ignore
const ipcRenderer = window.electron.ipcRenderer

export const getElectron = (): any => {
  // @ts-ignore
  return window.electron
}

const CLIENT_TOKEN = "CLIENT_TOKEN"

export async function getToken() {
  return await ipcRenderer.invoke("getStoreValue", CLIENT_TOKEN)
}

export async function setToken(token: string) {
  return await ipcRenderer.invoke("setStoreValue", CLIENT_TOKEN, token)
}

export async function saveObject(key: string, obj: any) {
  return await ipcRenderer.invoke("setStoreValue", key, obj)
}

export async function loadObject(key: string, defaultValue: any) {
  return (await ipcRenderer.invoke("getStoreValue", key, defaultValue)) || defaultValue
}

export async function clearToken() {
  return await ipcRenderer.invoke("resetStoreValue", CLIENT_TOKEN)
}

export async function quitAndInstall() {
  return await ipcRenderer.invoke("quitAndInstall")
}
