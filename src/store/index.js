import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appLoading: false, // loading 加载
    appSnackbar: {
      show: false,
      text: '提示'
    },
    // [owner, repo]
    ownerAndRepo: [],
    branch: 'master'
  },
  mutations: {
    setAppLoading (state, val) {
      state.appLoading = val === true
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
    }
  },
  actions: {
  },
  modules: {
  }
})
