/*
 * @Author: UpYou
 * @Date: 2021-02-08 17:00:10
 * @LastEditTime: 2021-02-16 20:18:16
 * @Description:
 *
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [

    {
      path: '/',
      name: 'heroList-page',
      component: require('@/pages/heroList').default
    },
    {
      path: '/playGif',
      name: 'playGif-page',
      component: require('@/pages/playGif').default
    },
    {
      path: '/preview',
      name: 'heroList-page',
      component: require('@/pages/preview').default
    },
    {
      path: '/export-gif-thread-page',
      name: 'export-gif-thread-page',
      component: require('@/pages/exportGif').default
    },
    {
      path: '/export-image-thread-page',
      name: 'export-gif-thread-page',
      component: require('@/pages/exportImage').default
    }
  ]
})
