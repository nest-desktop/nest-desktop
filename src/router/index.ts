import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/AppInfo.vue'),
      props: {
        includeProjectButtons: true,
      },
    },
    {
      path: '/project',
      name: 'Project',
      component: () => import('@/views/Project.vue'),
    },
    {
      path: '/project/:id',
      name: 'ProjectId',
      component: () => import('@/views/Project.vue'),
      props: true,
    },
    {
      path: '/model',
      name: 'Model',
      component: () => import('@/views/Model.vue'),
    },
    {
      path: '/model/:id',
      name: 'ModelId',
      component: () => import('@/views/Model.vue'),
      props: true,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/Settings.vue'),
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/AppInfo.vue'),
      props: {
        includeProjectButtons: false,
      },
    },
  ],
});
