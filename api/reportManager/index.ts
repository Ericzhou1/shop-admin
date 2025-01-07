import request from '@/utils/request'
import { AxiosPromise } from 'axios'

export function getStores(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/retail/stores/enum',
    method: 'post',
    data
  })
}

export function getRetailMerchants(): AxiosPromise<any> {
  return request({
    url: '/v1/retail/merchants/enum',
    method: 'post'
  })
}
export function deliverGoodsCheck(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/deliver_goods/express_info',
    method: 'post',
    data: data
  })
}

export function getExpressInfo(data: any): AxiosPromise<any> {
  return request({
    url: '/deliverGoods/expressInfo',
    method: 'post',
    data: data
  })
}
export function deliverGoodsCreate(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/order/deliver_goods',
    method: 'post',
    data: data
  })
}
export function expressTypeList(): AxiosPromise<any> {
  return request({
    url: '/expressType/options',
    method: 'post'
  })
}

export function deliverGoodsList(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/deliver_goods/list',
    method: 'post',
    data: data
  })
}
export function supplierPushOrderDetail(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/order/detail',
    method: 'post',
    data: data
  })
}
export function pushOrderUpdate(data: any): AxiosPromise<any> {
  return request({
    url: '/pushOrder/update',
    method: 'post',
    data: data
  })
}

export function pushOrderSubmit(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/order/submit',
    method: 'post',
    data: data
  })
}

export function pushOrderCreate(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/order/save',
    method: 'post',
    data: data
  })
}
export function pushOrderList(data: any): AxiosPromise<any> {
  return request({
    url: '/pushOrder/list',
    method: 'post',
    data: data
  })
}
export function sellOrderList(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/order/list',
    method: 'post',
    data: data
  })
}
export function orderStatusList(): AxiosPromise<any> {
  return request({
    url: '/orderStatus/options',
    method: 'post'
  })
}
