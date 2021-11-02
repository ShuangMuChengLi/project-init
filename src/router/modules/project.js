/**
 * 项目路由
 * @type {[null]}
 */
const projectRoutes = [
  { path: '/index', component: ()=>import('../../components/index.vue') },
  { path: '/homepage', component: ()=>import('../../components/homepage/homepage.vue') },
];
export { projectRoutes };
