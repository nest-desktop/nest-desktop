import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/AppInfo.vue'),
      props: {
        includeProjectButtons: true,
      },
    },
    {
      path: '/project',
      name: 'project',
      component: () => import('@/views/Project.vue'),
    },
    {
      path: '/project/:id',
      name: 'projectId',
      component: () => import('@/views/Project.vue'),
      props: true,
    },
    {
      path: '/model',
      name: 'model',
      component: () => import('@/views/Model.vue'),
    },
    {
      path: '/model/:id',
      name: 'modelId',
      component: () => import('@/views/Model.vue'),
      props: true,
    },
    {
      path: '/settings',
      name: 'appSettings',
      component: () => import('@/views/AppSettings.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AppInfo.vue'),
      props: {
        includeProjectButtons: false,
      },
    },
  ],
});
