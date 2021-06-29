import Vue from 'vue'
import App from './App.vue'
// 追記ここから
// import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
// ここまで
// import './assets/scss/style.scss';

Vue.config.productionTip = false

// 追記ここから
Vue.use(VueAxios, axios)
// ここまで

new Vue({
  // router,
  render: h => h(App),
}).$mount('#app')
  

  
  
 
  
