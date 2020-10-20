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

export {
  getRepoTree
}
