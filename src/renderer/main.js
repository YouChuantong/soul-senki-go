/*
 * @Author: UpYou
 * @Date: 2021-02-08 17:00:10
 * @LastEditTime: 2021-02-16 21:04:07
 * @Description:
 *
 */
import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

axios.defaults.baseURL = 'https://angel-s.alphagame.hk/nutaku.en'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.prototype.$http = axios
/* eslint-disable no-new */
new Vue({
	components: {App},
	router,
	store,
	template: '<App/>'
}).$mount('#app')
