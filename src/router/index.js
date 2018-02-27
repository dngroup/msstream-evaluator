import Vue from 'vue'
import Router from 'vue-router'
import PricingEvaluator from '@/components/PricingEvaluator'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PricingEvaluator',
      component: PricingEvaluator
    }
  ]
})
