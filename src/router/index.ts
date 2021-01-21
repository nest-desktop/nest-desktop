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
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/About.vue'),
    },
    {
      path: '/project',
      name: 'Project',
      component: () => import('@/components/project/Project.vue'),
    },
    {
      path: '/project/:id',
      name: 'ProjectId',
      component: () => import('@/components/project/Project.vue'),
      props: true,
    },
    {
      path: '/model',
      name: 'Model',
      component: () => import('@/components/model/Model.vue'),
    },
    {
      path: '/model/:id',
      name: 'ModelId',
      component: () => import('@/components/model/Model.vue'),
      props: true,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/components/setting/Settings.vue'),
    },
  ],
});
