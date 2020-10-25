import axios from 'axios'

const CancelToken = axios.CancelToken

/**
 * 判断当前接口地址是否是上传文件
 * @author wangk 2020-01-03T14:35:29+0800
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
const _isUploadFileUrl = url => {
  // TODO: 判断当前是否是上传文件的接口 url
  return false
}

/**
 * @private 计算请求指纹
 * @author wangk 2019-12-07T16:13:07+0800
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
const _calcRequestFingerprint = config => {
  const { url, method, data } = config
  // 上传文件
  if (_isUploadFileUrl(url)) {
    return method.toLowerCase() + url
  }
  // 不是上传文件
  return method.toLowerCase() + url + JSON.stringify(data)
}

/**
 * @private 添加请求拦截器
 * @author wangk 2019-12-07T16:30:55+0800
 * @return {[type]} [description]
 */
const _addRequestInterceptors = () => {
  axios.interceptors.request.use(config => {
    // request cancellation
    let cancel
    config.cancelToken = new CancelToken(c => {
      cancel = c
    })

    // 计算请求指纹
    const fingerprint = _calcRequestFingerprint(config)
    config.fingerprint = fingerprint

    if (!axios.__requestQueue) {
      axios.__requestQueue = new Map()
    }

    const { __requestQueue } = axios
    if (__requestQueue.has(fingerprint)) {
      // 首先判断是否超过 30s 还没有响应
      // 则继续请求
      const { timestamp } = __requestQueue.get(fingerprint)
      // 30 秒之内的重复请求, 直接取消
      if (Date.now() - timestamp <= 30 * 1000) {
        console.warn('========↓↓↓↓ warning: 已拦截重复请求，请检查代码！ ↓↓↓↓========')
        console.warn(`重复请求为: ${config.url}`)
        console.warn('========↑↑↑↑ warning: 已拦截重复请求，请检查代码！ ↑↑↑↑========')
        if (process.env.NODE_ENV !== 'production') {
          cancel()
        }
      }
    } else {
      axios.__requestQueue.set(fingerprint, {
        // 路由前置守卫中检查是否有 pending 状态的接口
        // 如果有, 则调用 cancel() 方法将其一一取消
        cancel,
        // 增加请求时间戳, 防止在某些意外情况下队列中某些请求没有被移除
        // 正常情况下收到后端响应后会将已响应的请求从 pending 队列中移除
        // 如果出现异常, 可能导致某些请求无法从队列中移除
        // 此时通过时间戳来判断是否可以移除(如：在路由全局前置守卫中对比)
        timestamp: Date.now()
      })
    }

    return config
  }, error => {
    // TODO: 弹出错误提示
    return Promise.reject(error)
  })
}

/**
 * @private 添加响应拦截器
 * @author wangk 2019-12-07T16:31:06+0800
 * @return {[type]} [description]
 */
const _addResponseInterceptors = () => {
  axios.interceptors.response.use(response => {
    console.log(response)
    const { fingerprint } = response.config
    try {
      axios.__requestQueue.delete(fingerprint)
    } catch (e) {
      console.log(e)
    }

    return response.data
  }, error => {
    if (axios.isCancel(error)) {
      // TODO: cancelled
    } else if (error.response) {
      const { fingerprint } = error.response.config
      try {
        axios.__requestQueue.delete(fingerprint)
      } catch (e) {
        console.log(e)
      }

      const { data, status, statusText } = error.response
      console.log(data, status, statusText)

      if (data) {
        _showErrorMsg(
          data.error_description ||
          data.message ||
          data.error ||
          '请求出错了！'
        )
      } else {
        _showErrorMsg(`请求出错了：${status}（${statusText}）`)
      }
    } else if (error.request) {
      _showErrorMsg(error.request)
    } else {
      // TODO
    }
    // 不走 try...catch
    // return Promise.reject(error)
    return {
      __gitreeFailed: true,
      type: 'REQUEST_ERROR'
    }
  })
}

/**
 * 显示错误信息
 * @author wangk 2020-01-09T16:53:14+0800
 * @param  {String} message [description]
 * @return {[type]}         [description]
 */
const _showErrorMsg = (message = '数据获取失败') => {
  console.log('错误处理')
}

/**
 * @public 添加拦截器
 * @author wangk 2019-12-09T17:49:14+0800
 * @return {[type]} [description]
 */
const addInterceptors = () => {
  _addRequestInterceptors()
  _addResponseInterceptors()
}

export {
  addInterceptors
}
