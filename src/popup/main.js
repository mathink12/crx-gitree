import Vue from 'vue'

import App from './App.vue'

import vuetify from '@/plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

import BaseIcon from '@/components/BaseIcon'

Vue.config.productionTip = false

Vue.component('BaseIcon', BaseIcon)

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#gitree_popup')
