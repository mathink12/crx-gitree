import axios from 'axios'

/**
 * 获取目录 Tree
 * https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoGitTreesSha
 * @author wangk 2020-10-16T18:20:30+0800
 * @param  {String} sha 可以是分支名(如master)、Commit或者目录Tree的SHA值
 * @return {[type]}
 */
const getRepoTree = (params = {}) => {
  const { owner, repo, sha } = params
  const url = `/repos/${owner}/${repo}/git/trees/${sha}`
  return axios.get(url)
}

const getDomRender = (params = {}) => {
  const { owner, repo, branch, treePath } = params
  const url = `/${owner}/${repo}/blob/${branch}/${treePath}?_=${Date.now()}`
  return axios.get(url, {
    baseURL: '/',
    headers: {
      accept: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
    }
  })
}

export {
  getRepoTree,
  getDomRender
}
