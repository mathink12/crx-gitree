import axios from 'axios'

/**
 * 获取用户的某个仓库(默认分支等信息)
 * https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepo
 * @param  {Object} params { owner, repo }
 * @return {[type]}        [description]
 */
const getOwnerRepo = (params = {}) => {
  const { owner, repo } = params
  const url = `/repos/${owner}/${repo}`
  return axios.get(url)
}

/**
 * 获取仓库的所有分支
 * https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoBranches
 * @param  {Object} params { owner, repo }
 * @return {[type]}        [description]
 */
const getRepoBranches = (params = {}) => {
  const { owner, repo } = params
  const url = `/repos/${owner}/${repo}/branches`
  return axios.get(url)
}

/**
 * 获取目录 Tree
 * https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoGitTreesSha
 * @author wangk 2020-10-16T18:20:30+0800
 * @param  {Object} sha 可以是分支名(如master)、Commit或者目录Tree的SHA值
 * @return {[type]}
 */
const getRepoTree = (params = {}) => {
  const { owner, repo, sha, recursive } = params
  const url = `/repos/${owner}/${repo}/git/trees/${sha}?recursive=${recursive || ''}`
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
  getOwnerRepo,
  getRepoBranches,
  getRepoTree,
  getDomRender
}
