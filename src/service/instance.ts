import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * 封装axios请求类
 */
export default class CustomAxiosInstance {
  instance: AxiosInstance

  constructor(axiosConfig: AxiosRequestConfig) {
    this.instance = axios.create(axiosConfig)
  }
  setInterceptor() {
    this.instance.interceptors.request.use(
      (config: any) => {
        console.log(config);
        const handleConfig = { ...config }
        if (handleConfig.headers) {
          handleConfig.headers.Authorization = ''
        }
        return handleConfig
      },
      (axiosError: AxiosError) => {
        console.log(axiosError);
      }
    )
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(response);
        return response.data
      },
      (axiosError: AxiosError) => {
        console.log(axiosError)
      }
    )
  }
}
