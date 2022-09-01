/**
 * 项目路由
 * @type {[null]}
 */
const projectRoutes = [
  { path: '/index', component: ()=>import('../../components/index.vue') },
  { path: '/vue-test', component: () => import('../../components/test/vue-test.vue') },
];
export { projectRoutes };
