import axios from "axios"
import { message } from "antd"
import { clearToken, getToken } from "../utils/ipc"

axios.defaults.timeout = 20000

const httpClient = axios.create()

let BASE_URL = "http://localhost:5000"

httpClient.interceptors.request.use(
  async (config: any) => {
    config.baseURL = BASE_URL
    const AK = await getToken()
    if (AK) {
      config.headers.Authorization = `Bearer ${AK}`
    }
    return config
  },
  (err: any) => {
    return Promise.reject(err)
  }
)

httpClient.interceptors.response.use(
  (response: any) => {
    return response
  },
  (error: any) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          if (typeof error.response.data.message === "string") {
            message.error(error.response.data.message)
          }
          break
        case 404:
          message.error(error.response.data.message)
          break
        case 500:
          message.error("服务器出了小毛病哦")
          break
      }
    }
    return Promise.reject(error.response)
  }
)

export function doGet(url: string, params = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    httpClient
      .get(url, {
        params: params,
      })
      .then((response: any) => {
        resolve(response.data)
      })
      .catch(async (err?: any) => {
        if (err && err.status) {
          console.log(`请求${url}错误,${err.status}`)
          if (err.status === 401 || err.status === 403) {
            await clearToken()
            reject(err)
          }
        }
      })
  })
}

export function doPost(url: string, data = {}, strict = true): Promise<any> {
  return new Promise((resolve, reject) => {
    httpClient.post(url, data).then(
      (response: any) => {
        resolve(response.data)
      },
      (err: any) => {
        reject(err)
      }
    )
  })
}
