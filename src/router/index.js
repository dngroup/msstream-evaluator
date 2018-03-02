import Vue from 'vue'
import Router from 'vue-router'
import PricingEvaluator from '@/components/PricingEvaluator'
import Pricing from '@/components/Pricing'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PricingEvaluator',
      component: PricingEvaluator
    },
    {
      path: '/pricing',
      name: 'Pricing',
      component: Pricing
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
