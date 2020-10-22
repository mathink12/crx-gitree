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
          resolve(res)
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

export {
  setCache,
  getCache
}
