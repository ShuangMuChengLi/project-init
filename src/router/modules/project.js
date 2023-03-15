/**
 * 项目路由
 * @type {[null]}
 */
const projectRoutes = [
  { path: '/index', component: ()=>import('../../components/index.vue') },
  { path: '/vue-test', component: () => import('../../components/test/vue-test.vue') },
  { path: '/position-test', component: () => import('../../components/test/vue-test2.vue') },
  { path: '/websocket-api-test', component: () => import('../../components/test/websocket-api-test.vue') },
  { path: '/async-test', component: () => import('../../components/test/async-test/async-test') }
];
export { projectRoutes };
