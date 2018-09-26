// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import base from './global/base.js'
import './axios/index'

// mint-ui 
import mintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
// Element-ui 
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

import './assets/css/my-design.scss'
import './assets/icon/iconfont.css'

import Login from '@/pages/Login'
import alarmListFrame from '@/pages/alarmList/alarmListFrame'
import alarmDetails from '@/pages/alarmList/alarmDetails'
import searchFrame from '@/pages/search/searchFrame'
import searchResult from '@/pages/search/imageSearch/searchResult'
import personDetails from '@/pages/search/idNumberSearch/personDetails'
import addToGallery from '@/pages/search/idNumberSearch/addToGallery'
import selectDB from '@/pages/search/idNumberSearch/selectDB'
import settingFrame from '@/pages/setting/settingFrame'
import modifyPassword from '@/pages/setting/modifyPassword'
import searchSetting from '@/pages/setting/searchSetting'
import selectCamera from '@/pages/setting/searchSetting/selectCamera'
import selectGallery from '@/pages/setting/searchSetting/selectGallery'
import thresholdSetting from '@/pages/setting/searchSetting/thresholdSetting'

Vue.config.productionTip = false

Vue.use(base)
Vue.use(VueRouter)
Vue.use(mintUI)
Vue.use(ElementUI)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      // redirect: '/alarmList'
      name: '登录',
      iconClass: '',
      component: Login
    },
    {
      path: '/alarmList',
      name: '告警列表',
      component: alarmListFrame,
      iconClass: 'iconfont icon-list',
      children:[
        {
          path: '/alarmList/alarmDetails',
          name: '告警详情',
          component: alarmDetails,
          iconClass: ''
        }
      ]
    },
    {
      path: '/search',
      name: '盘查',
      component: searchFrame,
      iconClass: 'iconfont icon-search',
      children: [
        {
          path: '/search/searchResult',
          name: '盘查结果',
          component: searchResult,
          iconClass: '',
          children: [
            {
              path: '/search/searchResult/alarmDetails',
              name: '告警详情',
              component: alarmDetails,
              iconClass: ''
            }
          ]
        },
        {
          path: '/search/personDetails',
          name: '人员详情',
          component: personDetails,
          iconClass: ''
        },
        {
          path: '/search/addToGallery',
          name: '添加到库',
          component: addToGallery,
          iconClass: '',
          children: [
            {
              path: '/search/addToGallery/selectDB',
              name: '人像库选择',
              component: selectDB,
              iconClass: ''
            }
          ]
        }
      ]
    },
    {
      path: '/setting',
      name: '设置',
      component: settingFrame,
      iconClass: 'iconfont icon-setting',
      children: [
        {
          path: '/setting/modifyPassword',
          name: '修改密码',
          iconClass: 'iconfont icon-locksuo',
          component: modifyPassword 
        },
        {
          path: '/setting/searchSetting',
          name: '搜索设置',
          iconClass: 'iconfont icon-icons-',
          component: searchSetting,
          children: [
            {
              path: '/setting/searchSetting/selectCamera',
              name: '相机选择',
              iconClass: require('./assets/images/alarm_camera.png'),
              component: selectCamera
            },
            {
              path: '/setting/searchSetting/selectGallery',
              name: '人像库选择',
              iconClass: require('./assets/images/facedb.png'),
              component: selectGallery
            },
            {
              path: '/setting/searchSetting/thresholdSetting',
              name: '比对阈值设置',
              iconClass: require('./assets/images/threshold.png'),
              component: thresholdSetting
            }
          ]
        }
      ]
    }
  ],
  mode: 'history'
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router
})
