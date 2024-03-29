import Vue from 'vue'
import App from './App.vue'

// import './registerServiceWorker'
import store from './store'

import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import '@/assets/scss/index.scss'
import '@/assets/scss/file-icon.scss'

import { initApi } from '@/api'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

initApi()
new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#gitree_container')
