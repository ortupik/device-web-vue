import Vue from 'vue'
import Router from 'vue-router'
import DeviceDetails from '@/components/DeviceDetails'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'deviceDetails',
      component: DeviceDetails
    }
  ]
})
