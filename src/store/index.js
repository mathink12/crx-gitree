import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // [owner, repo]
    ownerAndRepo: [],
    branch: 'master'
  },
  mutations: {
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
