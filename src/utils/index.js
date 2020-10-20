/**
 * 获取当前用户、组织的仓库
 *   https://gitee.com/owner/repo/tree/master/dist -> /owner/repo
 * @author wangk 2020-10-16T18:13:44+0800
 * @return {Array} [owner, repo]
 */

const getOwnerAndRepo = () => {
  let res = []
  const reg = /gitee\.com\/[^/]+\/[^/]+/
  try {
    const path = window.location.href.match(reg)[0].replace('gitee.com/', '')
    res = path.split('/')
  } catch (e) {}

  return res
}

/**
 * 获取文件扩展名
 * @author wangk 2020-10-20T16:03:37+0800
 * @param  {[type]} filename [description]
 * @return {[type]}          [description]
 */
const getFileType = filename => {
  const index = filename.lastIndexOf('.')
  return filename.slice(index + 1)
}

export {
  getOwnerAndRepo,
  getFileType
}
