/**
 * 项目路由
 * @type {[null]}
 */
const projectRoutes = [
  { path: '/index', component: ()=>import('../../components/index.vue') },
  { path: '/client', component: ()=>import('../../components/client/client') },
  { path: '/control', component: ()=>import('../../components/control/control') },
];
export { projectRoutes };
