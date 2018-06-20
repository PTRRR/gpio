// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueHead from 'vue-head'

const bus = new Vue()

Vue.config.productionTip = false
Vue.mixin({
  data () {
    return {
      bus
    }
  }
})

Vue.use(VueHead)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
