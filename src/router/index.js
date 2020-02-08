import Vue from 'vue'
import Router from 'vue-router'
import readerViewer from '@/components/reader-viewer'
// import list from '@/components/list'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'readerViewer',
      component: readerViewer
    }
  ]
})
