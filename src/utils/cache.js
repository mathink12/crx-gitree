/**
 * 设置持久化缓存
 * @param  {[type]} key [description]
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
const setCache = (key, val) => {
  if (typeof chrome?.storage?.sync?.set === 'function') {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.set({
          [key]: val
        }, (res) => {
          console.log(res)
          resolve(res)
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  return new Promise((resolve, reject) => {
    try {
      window.localStorage.setItem(key, val)
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 读取持久化缓存
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
const getCache = (key) => {
  if (typeof chrome?.storage?.sync?.get === 'function') {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.get(key, res => {
          resolve(res[key])
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  return new Promise((resolve, reject) => {
    try {
      const res = window.localStorage.getItem(key)
      resolve(res)
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 缓存 token
 * @param  {[type]} token [description]
 * @return {[type]}       [description]
 */
const cacheToken = (token) => setCache('gitree_access_token', token)

/**
 * 从缓存中读取 token
 * @return {[type]} [description]
 */
const getCachedToken = () => getCache('gitree_access_token')

export {
  setCache,
  getCache,
  cacheToken,
  getCachedToken
}
