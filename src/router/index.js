import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/regist',
    component: () => import('@/views/regist/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '控制台', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/sendsms',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '发送短信',
        component: () => import('@/views/sendsms/index'),
        meta: { title: '发送短信', icon: 'guide' }
      }
    ]
  },

  {
    path: '/analysys',
    component: Layout,
    redirect: '/analysys/orders',
    name: '统计分析',
    meta: { title: '统计分析', icon: 'chart' },
    children: [
      {
        path: 'orders',
        name: '任务列表',
        component: () => import('@/views/analysys/orders/index'),
        meta: { title: '任务列表', icon: 'tree-table' }
      },
      {
        path: 'smslist',
        name: '明细记录',
        component: () => import('@/views/analysys/smslist/index'),
        meta: { title: '明细记录', icon: 'list' }
      }
    ]
  },

  {
    path: '/contact',
    component: Layout,
    redirect: '/contact/add',
    name: '通讯录',
    meta: { title: '通讯录', icon: 'address-book' },
    children: [
      {
        path: 'add',
        name: '新增联系人',
        component: () => import('@/views/contact/add/index'),
        meta: { title: '新增联系人', icon: 'adduser' }
      },
      {
        path: 'edit',
        name: '联系人管理',
        component: () => import('@/views/contact/edit/index'),
        meta: { title: '联系人管理', icon: 'editlist' }
      },
      {
        path: 'groupedit',
        name: '群组管理',
        component: () => import('@/views/contact/groupedit/index'),
        meta: { title: '群组管理', icon: 'group' }
      }
    ]
  },
  {
    path: '/userset',
    component: Layout,
    redirect: '/userset/resetpwd',
    name: '设置',
    meta: { title: '设置', icon: 'setting' },
    children: [
      {
        path: 'resetpwd',
        name: '修改密码',
        component: () => import('@/views/userset/resetpwd/index'),
        meta: { title: '修改密码', icon: 'password' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
