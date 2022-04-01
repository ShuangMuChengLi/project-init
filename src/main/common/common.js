import '../../css/base.less';
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {store} from '../../js/store/vuex-index';// vuex配置
import App from '../../components/App';
/**
 *
 * @param options
 * {
 *   router:vue router
 * }
 */
export default function(options){
  Vue.use(ElementUI);
  new Vue({
    store,
    router: options.router,
    created(){
    },
    render: h => h(App)
  }).$mount('#app');
}
