import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ownerAndRepo: []
  },
  mutations: {
    setOwnerAndRepo (state, val) {
      state.ownerAndRepo = val || []
    }
  },
  actions: {
  },
  modules: {
  }
})
