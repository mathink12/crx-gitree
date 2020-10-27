import axios from 'axios'
import { baseURL } from './config.js'
import { addInterceptors } from './interceptors.js'

/**
 * 初始化接口
 * @author wangk 2020-01-03T14:59:50+0800
 * @return {[type]} [description]
 */
const initApi = () => {
  // 当前的请求队列
  axios.__requestQueue = new Map()
  axios.defaults.baseURL = baseURL
  addInterceptors()
}

/**
 * 清空 pending 中的请求
 * @author wangk 2020-03-25T10:03:03+0800
 * @return {[type]} [description]
 */
const cancelPendingRequests = () => {
  try {
    axios.__requestQueue.forEach(({ cancel, timestamp }, k) => {
      cancel()
    })
  } catch (e) {}
}

/**
 * 清空 pending 请求记录
 * @author wangk 2020-03-25T09:46:41+0800
 * @return {[type]} [description]
 */
const clearRequestQueue = () => {
  cancelPendingRequests()
  axios.__requestQueue = new Map()
}

/**
 * 获取当前正在 pending 的请求
 * @author wangk 2020-03-25T09:47:46+0800
 * @return {[type]} [description]
 */
const getRequestQueue = () => axios.__requestQueue

export {
  initApi,
  clearRequestQueue,
  cancelPendingRequests,
  getRequestQueue
}
