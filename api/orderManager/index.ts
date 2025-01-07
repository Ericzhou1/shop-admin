import request from '@/utils/request'
import { AxiosPromise } from 'axios'

// 订单列表
export function orderList(data: any): AxiosPromise<any> {
  return request({
    url: '/order/list',
    method: 'post',
    data: data
  })
}
// 接单
export function orderRecive(data: any): AxiosPromise<any> {
  return request({
    url: '/order/recive',
    method: 'post',
    data: data
  })
}
// /order/products
export function orderProducts(data: any): AxiosPromise<any> {
  return request({
    url: '/order/products',
    method: 'post',
    data: data
  })
}
// fahuo deliverGood
export function deliverGood(data: any): AxiosPromise<any> {
  return request({
    url: '/delivery/submit',
    method: 'post',
    data: data
  })
}
// 发货列表 deliveryList
export function deliveryList(data: any): AxiosPromise<any> {
  return request({
    url: '/delivery/list',
    method: 'post',
    data: data
  })
}
export function deliveryProList(data: any): AxiosPromise<any> {
  return request({
    url: '/delivery/list_product',
    method: 'post',
    data: data
  })
}
export function deliveryUpdate(data: any): AxiosPromise<any> {
  return request({
    url: '/delivery/update',
    method: 'post',
    data: data
  })
}
export const purOrderStatusOptions = [
  {
    id: 1,
    name: '待审核'
  },
  {
    id: 2,
    name: '待接单'
  },
  {
    id: 3,
    name: '已接单'
  },

  {
    id: 4,
    name: '部分发货'
  },
  {
    id: 5,
    name: '已发货'
  },
  {
    id: 6,
    name: '部分收货'
  },
  {
    id: 7,
    name: '已签收'
  },
  {
    id: 8,
    name: '已取消'
  }
]
export const orderStatusOptions = [
  {
    id: 2,
    name: '待接单'
  },
  {
    id: 3,
    name: '已接单'
  },

  {
    id: 4,
    name: '部分发货'
  },
  {
    id: 5,
    name: '已发货'
  },
  {
    id: 6,
    name: '部分收货'
  },
  {
    id: 7,
    name: '已签收'
  },
  {
    id: 8,
    name: '已取消'
  }
]
