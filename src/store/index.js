import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 当前激活的面板: tree(目录树), settings(设置页面)
    activePane: 'tree',
    token: '',
    drawerLoading: false, // loading 加载(仅覆盖抽屉层)
    fullscreenLoading: false, // 全屏 loading
    appSnackbar: {
      show: false,
      text: '提示'
    },
    repoData: {
      owner: '', // 当前仓库的所有者
      repo: '', // 当前仓库名
      defaultBranch: '', // 当前仓库的默认分支 name
      activeBranch: '', // 当前仓库的活动分支 name
      branches: [] // 当前仓库的所有分支
    }
  },
  mutations: {
    setActivePane (state, val) {
      const invalidVals = ['tree', 'settings']
      if (!invalidVals.includes(val)) {
        console.warn('非法值！只能是：' + invalidVals.join(', '))
        return
      }

      state.activePane = val
    },
    setToken (state, val) {
      state.token = val || ''
    },
    setDrawerLoading (state, val) {
      state.drawerLoading = val === true
    },
    setFullscreenLoading (state, val) {
      state.fullscreenLoading = val === true
    },
    showAppSnackbar (state, text) {
      state.appSnackbar = {
        show: true,
        text
      }
    },
    hideAppSnackbar (state) {
      state.appSnackbar.show = false
    },
    setOwnerAndRepo (state, val) {
      state.ownerAndRepo = val || []
    },
    setBranch (state, val) {
      state.branch = val || 'master'
    },
    setRepoData (state, val) {
      state.repoData = val
    }
  },
  actions: {
  },
  modules: {
  }
})
