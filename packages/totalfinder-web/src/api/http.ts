import { doGet, doPost } from "./client"

export const fetchProfile = async () => {
  return await doGet("/user/profile")
}

export const doLogin = async (params: any) => {
  return await doPost("/user/login", params)
}

export const taskStart = async (params: any) => {
  return await doPost("/user/transform_task/start", params)
}

export const taskUploaded = async (params: any) => {
  return await doPost("/user/transform_task/uploaded", params)
}

export const taskQuery = async (params: any) => {
  return await doPost("/user/transform_task/query", params)
}

export const taskDownload = async (params: any) => {
  return await doPost("/user/transform_task/download", params)
}
