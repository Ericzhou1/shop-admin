import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { usePermissionStoreHook } from '@/store/modules/permission'
const permissionStore = usePermissionStoreHook()

export const Layout = () => import('@/layout/index.vue')

export const temporaryRoutes: any = [
  {
    path: '/merchant',
    component: Layout,
    name: 'merchant',
    meta: {
      title: '企业资料',
      icon: 'index',
      hidden: false
    },
    children: [
      {
        path: 'companyInformation',
        component: () =>
          import('@/views/merchant/companyInformation/index.vue'),
        name: 'companyInformation',
        meta: {
          title: '企业信息',
          icon: '',
          hidden: false,
          keepAlive: true
        }
      }
    ]
  },
  // {
  //   path: '/procure',
  //   component: Layout,
  //   name: 'procure',
  //   meta: {
  //     title: '提货点列表',
  //     icon: 'procure',
  //     hidden: false
  //   },
  //   children: [
  //     {
  //       path: 'supplier',
  //       component: () => import('@/views/procure/supplier/index.vue'),
  //       name: 'supplier',
  //       meta: {
  //         title: '合作提货点',
  //         icon: '',
  //         hidden: false,
  //         keepAlive: true
  //       }
  //     }
  //   ]
  // },
  {
    path: '/product',
    component: Layout,
    name: 'product',
    meta: {
      title: '企业商品',
      icon: 'product',
      hidden: false
    },
    children: [
      {
        path: 'productdetail',
        component: () =>
          import('@/views/product/productList/Productdetail.vue'),
        name: 'productdetail',
        meta: {
          title: '商品详情',
          icon: '',
          hidden: true,
          keepAlive: true
        }
      },
      {
        path: 'productList',
        component: () => import('@/views/product/productList/index.vue'),
        name: 'productList',
        meta: {
          title: '商品列表',
          icon: '',
          hidden: false,
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/orderManager',
    component: Layout,
    name: 'orderManager',
    meta: {
      title: '订单管理',
      icon: 'report',
      hidden: false
    },
    children: [
      {
        path: 'salesOrder',
        component: () => import('@/views/orderManager/salesOrder/index.vue'),
        name: 'salesOrder',
        meta: {
          title: '销售订单',
          icon: '',
          hidden: false,
          keepAlive: true
        }
      },
      {
        path: 'shippingOrder',
        component: () => import('@/views/orderManager/shippingOrder/index.vue'),
        name: 'shippingOrder',
        meta: {
          title: '发货订单',
          icon: '',
          hidden: false,
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/financial',
    component: Layout,
    name: 'financial',
    meta: {
      title: '财务管理',
      icon: 'report',
      hidden: false
    },
    children: [
      {
        path: 'settlementOrder',
        component: () => import('@/views/financial/settlementOrder/index.vue'),
        name: 'settlementOrder',
        meta: {
          title: '结算订单',
          icon: '',
          hidden: false,
          keepAlive: true
        }
      },
      {
        path: 'accountCenter',
        component: () => import('@/views/financial/accountCenter/index.vue'),
        name: 'accountCenter',
        meta: {
          title: '账户中心',
          icon: '',
          hidden: false,
          keepAlive: true
        }
      }
    ]
  }
  // {
  //   path: '/reportManager',
  //   component: Layout,
  //   name: 'reportManager',
  //   meta: {
  //     title: '订单管理',
  //     icon: 'report',
  //     hidden: false
  //   },
  //   children: [
  //     {
  //       path: 'businessView',
  //       component: () => import('@/views/reportManager/businessView/index.vue'),
  //       name: 'businessView',
  //       meta: {
  //         title: '销售订单',
  //         icon: '',
  //         hidden: false,
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: 'businessDetail',
  //       component: () =>
  //         import('@/views/reportManager/businessView/detail.vue'),
  //       name: 'businessDetail',
  //       meta: {
  //         title: '订单详情',
  //         icon: '',
  //         hidden: true,
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: 'pushOrder',
  //       component: () => import('@/views/reportManager/pushOrder/index.vue'),
  //       name: 'pushOrder',
  //       meta: {
  //         title: '自荐订单',
  //         icon: '',
  //         hidden: false,
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: 'pushOrderCreate',
  //       component: () => import('@/views/reportManager/pushOrder/create.vue'),
  //       name: 'pushOrderCreate',
  //       meta: {
  //         title: '新建自荐订单',
  //         icon: '',
  //         hidden: true,
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: 'pushOrderDetail',
  //       component: () => import('@/views/reportManager/pushOrder/detail.vue'),
  //       name: 'pushOrderDetail',
  //       meta: {
  //         title: '自荐订单详情',
  //         icon: '',
  //         hidden: true,
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: 'deliverGoods',
  //       component: () => import('@/views/reportManager/deliverGoods/index.vue'),
  //       name: 'deliverGoods',
  //       meta: {
  //         title: '发货订单',
  //         icon: '',
  //         hidden: false,
  //         keepAlive: true
  //       }
  //     },

  //     {
  //       path: 'deliverGoodsDetail',
  //       component: () =>
  //         import('@/views/reportManager/deliverGoods/detail.vue'),
  //       name: 'deliverGoodsDetail',
  //       meta: {
  //         title: '发货订单详情',
  //         icon: '',
  //         hidden: true,
  //         keepAlive: true
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/settlement',
  //   component: Layout,
  //   name: 'settlement',
  //   meta: {
  //     title: '结算',
  //     icon: 'settlement',
  //     hidden: false
  //   },
  //   children: [
  //     {
  //       path: 'expense',
  //       component: () => import('@/views/settlement/expense/index.vue'),
  //       name: 'expense',
  //       meta: {
  //         title: '费用结算',
  //         icon: '',
  //         hidden: false,
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: 'payment',
  //       component: () => import('@/views/settlement/payment/index.vue'),
  //       name: 'payment',
  //       meta: {
  //         title: '货款结算',
  //         icon: '',
  //         hidden: false,
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: 'paymentDetail',
  //       component: () => import('@/views/settlement/payment/detail.vue'),
  //       name: 'paymentDetail',
  //       meta: {
  //         title: '货款结算详情',
  //         icon: '',
  //         hidden: true,
  //         keepAlive: true
  //       }
  //     }
  //   ]
  // }
]

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },

  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  },

  {
    path: '/',
    name: '/',
    component: Layout,
    redirect: '/merchant/companyInformation',
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401.vue'),
        meta: { hidden: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404.vue'),
        meta: { hidden: true }
      }
    ]
  }

  // 外部链接
  // {
  //   path: "/external-link",
  //   component: Layout,
  //   children: [ {
  //       component: () => import("@/views/external-link/index.vue"),
  //       path: "https://www.cnblogs.com/haoxianrui/",
  //       meta: { title: "外部链接", icon: "link" },
  //     },
  //   ],
  // },
  // 多级嵌套路由
  /* {
         path: '/nested',
         component: Layout,
         redirect: '/nested/level1/level2',
         name: 'Nested',
         meta: {title: '多级菜单', icon: 'nested'},
         children: [
             {
                 path: 'level1',
                 component: () => import('@/views/nested/level1/index.vue'),
                 name: 'Level1',
                 meta: {title: '菜单一级'},
                 redirect: '/nested/level1/level2',
                 children: [
                     {
                         path: 'level2',
                         component: () => import('@/views/nested/level1/level2/index.vue'),
                         name: 'Level2',
                         meta: {title: '菜单二级'},
                         redirect: '/nested/level1/level2/level3',
                         children: [
                             {
                                 path: 'level3-1',
                                 component: () => import('@/views/nested/level1/level2/level3/index1.vue'),
                                 name: 'Level3-1',
                                 meta: {title: '菜单三级-1'}
                             },
                             {
                                 path: 'level3-2',
                                 component: () => import('@/views/nested/level1/level2/level3/index2.vue'),
                                 name: 'Level3-2',
                                 meta: {title: '菜单三级-2'}
                             }
                         ]
                     }
                 ]
             },
         ]
     }*/
]

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 })
})

permissionStore.setRoutes(temporaryRoutes)
temporaryRoutes.forEach((route: any) => {
  router.addRoute(route)
})

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: '/login' })
}

export default router
