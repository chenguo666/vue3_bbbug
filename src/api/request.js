import axios from 'axios'
import { ElMessage } from 'element-plus'
import { diffTokenTime } from '@/utils/auth'
import store from '@/store'
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API,
  baseURL: 'http://music_api.guopro.cn/api/',
  timeout: 5000
})

service.interceptors.request.use(
  (config) => {
    if (localStorage.getItem('token')) {
      if (diffTokenTime()) {
        store.dispatch('app/logout')
        return Promise.reject(new Error('token 失效了'))
      }
    }
    const accessToken = localStorage.getItem('access_token') || ''
    const baseData = {
      access_token: accessToken,
      plat: 'vue',
      version: 10000
    }
    config.headers.Authorization = accessToken

    config.data = Object.assign({}, baseData, config.data || {})

    return config
  },
  (error) => {
    return Promise.reject(new Error(error))
  }
)

service.interceptors.response.use(
  (response) => {
    const data = response.data
    if (data.code === 200 || data.code === 201) {
      return data.data
    } else if (data.code === 401) {
      store.dispatch('app/logout')
      return data
    } else {
      ElMessage.error(data.msg)
      return Promise.reject(new Error(data.msg))
    }
  },
  (error) => {
    console.log(error.response)
    error.response && ElMessage.error(error.response.data)
    return Promise.reject(new Error(error.response.data))
  }
)
export default service
