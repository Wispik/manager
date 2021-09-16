/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import Router from 'vue-router'
import authService from "./services/auth/authService";

Vue.use(Router);

const auth = authService();

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return {x: 0, y: 0}
  },
  routes: [

    {
      // =============================================================================
      // MAIN LAYOUT ROUTES
      // =============================================================================
      path: '',
      component: () => import('./layouts/main/Main.vue'),
      children: [
        // =============================================================================
        // Theme Routes
        // =============================================================================
        {
          path: '/',
          name: 'home',
          meta: {
            authRequired: true,
          },
          component: () => import('./views/UserList.vue')
        },
        {
          path: '/analytics',
          name: 'analytics',
          meta: {
            authRequired: true,
          },
          component: () => import('./views/Analytics.vue')
        },
        {
          path: '/user/:id',
          name: 'UserDetailPage',
          meta: {
            authRequired: true,
          },
          component: () => import('./views/User.vue')
        },
        {
          path: '/reports',
          name: 'Reports',
          meta: {
            authRequired: true,
          },
          component: () => import('./views/Reports.vue')
        },
        {
          path: '/photolist',
          name: 'PhotoList',
          meta: {
            authRequired: true,
          },
          component: () => import('./views/PhotoList.vue')
        },
        {
          path: '/logout',
          name: 'Logout',
          component: () => import('./views/logout.vue')
        },
      ],
    },
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
    {
      path: '',
      component: () => import('@/layouts/full-page/FullPage.vue'),
      children: [
        // =============================================================================
        // PAGES
        // =============================================================================
        {
          path: '/login',
          name: 'page-login',
          component: () => import('@/views/pages/Login.vue')
        },
        {
          path: '/error-404',
          name: 'page-error-404',
          component: () => import('@/views/pages/Error404.vue')
        },
      ]
    },
    // Redirect to 404 page, if no match found
    {
      path: '*',
      redirect: '/error-404'
    }
  ],
});

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg');
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

router.beforeEach((to, from, next) => {
  if (to.meta.authRequired) {
    if (!(auth.isAuthenticated())) {
      router.push({
        path: '/login',
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
