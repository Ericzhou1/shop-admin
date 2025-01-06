import type { RouteRecordRaw } from 'vue-router'
import { constantRoutes } from '@/router'
import { store } from '@/store'
import router from '@/router'

// import MenuAPI, { type RouteVO } from '@/api/system/menu'
import { type RouteVO } from '@/api/system/menu'
const modules = import.meta.glob('../../views/**/**.vue')
const Layout = () => import('@/layout/index.vue')

export const usePermissionStore = defineStore('permission', () => {
  // 所有路由，包括静态和动态路由
  const routes = ref<RouteRecordRaw[]>([])
  // 混合模式左侧菜单
  const mixLeftMenus = ref<RouteRecordRaw[]>([])
  // 路由是否已加载
  const isRoutesLoaded = ref(false)

  /**
   * 生成动态路由
   */
  function generateRoutes() {
    return new Promise<RouteRecordRaw[]>((resolve) => {
      const data: any = [
        {
          path: '/order',
          component: 'Layout',
          redirect: '/order/orderList',
          name: '/order',
          meta: {
            title: '订单',
            icon: 'system',
            hidden: false,
            alwaysShow: false,
            params: null,
          },
          children: [
            {
              path: 'orderList',
              component: 'order/orderList/index',
              name: 'OrderList',
              meta: {
                title: '订单列表',
                icon: 'el-icon-User',
                hidden: false,
                keepAlive: true,
                alwaysShow: false,
                params: null,
              },
            },
            {
              path: 'afterSales',
              component: 'order/afterSales/index',
              name: 'AfterSales',
              meta: {
                title: '售后订单',
                icon: 'tree',
                hidden: false,
                keepAlive: true,
                alwaysShow: false,
                params: null,
              },
            },
          ],
        },
        {
          path: '/product',
          component: 'Layout',
          redirect: '/product/productList',
          name: '/product',
          meta: {
            title: '商品',
            icon: 'document',
            hidden: false,
            alwaysShow: true,
            params: null,
          },
          children: [
            {
              path: 'productList',
              component: 'product/productList/index',
              name: 'ProductList',
              meta: {
                title: '商品列表',
                icon: 'collapse',
                hidden: false,
                keepAlive: true,
                alwaysShow: false,
                params: null,
              },
            },
            {
              path: 'productAdd',
              component: 'product/productAdd/index',
              name: 'ProductAdd',
              meta: {
                title: '添加商品',
                icon: 'tree',
                hidden: true,
                keepAlive: true,
                alwaysShow: false,
                params: null,
              },
            },
          ],
        },
      ]
      const dynamicRoutes = transformRoutes(data)
      routes.value = constantRoutes.concat(dynamicRoutes)
      isRoutesLoaded.value = true
      resolve(dynamicRoutes)
      // MenuAPI.getRoutes()
      //   .then((data) => {
      //     const data3 = [...data2, ...data]
      //     const dynamicRoutes = transformRoutes(data3)
      //     routes.value = constantRoutes.concat(dynamicRoutes)
      //     isRoutesLoaded.value = true
      //     resolve(dynamicRoutes)
      //   })
      //   .catch((error) => {
      //     reject(error)
      //   })
    })
  }

  /**
   * 混合模式菜单下根据顶部菜单路径设置左侧菜单
   *
   * @param topMenuPath - 顶部菜单路径
   */
  const setMixLeftMenus = (topMenuPath: string) => {
    const matchedItem = routes.value.find((item: any) => item.path === topMenuPath)
    if (matchedItem && matchedItem.children) {
      mixLeftMenus.value = matchedItem.children
    }
  }

  /**
   * 重置路由
   */
  const resetRouter = () => {
    // 删除动态路由，保留静态路由
    routes.value.forEach((route: any) => {
      if (route.name && !constantRoutes.find((r) => r.name === route.name)) {
        // 从 router 实例中移除动态路由
        router.removeRoute(route.name)
      }
    })

    routes.value = []
    mixLeftMenus.value = []
    isRoutesLoaded.value = false
  }

  return {
    routes,
    generateRoutes,
    mixLeftMenus,
    setMixLeftMenus,
    isRoutesLoaded,
    resetRouter,
  }
})

/**
 * 转换路由数据为组件
 */
const transformRoutes = (routes: RouteVO[]) => {
  const asyncRoutes: RouteRecordRaw[] = []
  routes.forEach((route) => {
    const tmpRoute = { ...route } as RouteRecordRaw
    // 顶级目录，替换为 Layout 组件
    if (tmpRoute.component?.toString() == 'Layout') {
      tmpRoute.component = Layout
    } else {
      // 其他菜单，根据组件路径动态加载组件
      const component = modules[`../../views/${tmpRoute.component}.vue`]
      if (component) {
        tmpRoute.component = component
      } else {
        tmpRoute.component = modules['../../views/error-page/404.vue']
      }
    }

    if (tmpRoute.children) {
      tmpRoute.children = transformRoutes(route.children)
    }

    asyncRoutes.push(tmpRoute)
  })

  return asyncRoutes
}

/**
 * 在组件外使用 Pinia store 实例 @see https://pinia.vuejs.org/core-concepts/outside-component-usage.html
 */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
