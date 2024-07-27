import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import uView from "uview-ui";
Vue.use(uView); //使用uview-ui

//全局混入==>分享功能
import share from '@/globalMixin/share.js'
import Request from 'util/http.js';
Vue.mixin(share);
Vue.prototype.$Request = Request; // 全局请求
// 在 main.js 中创建一个事件总线
export const EventBus = new Vue();

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif