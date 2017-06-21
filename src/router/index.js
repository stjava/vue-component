import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import vuecale from '@/page/vue-cale'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'vuecale',
      component: vuecale
    }
  ]
})
