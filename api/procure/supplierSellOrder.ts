import request from '@/utils/request'
import { AxiosPromise } from 'axios'

export function supplierSellOrderAgree(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/order/agree',
    method: 'post',
    data: data
  })
}
export function supplierSellOrderDetail(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/order/detail',
    method: 'post',
    data: data
  })
}

export function supplierSellOrderSettleDetail(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/payment_settle/detail',
    method: 'post',
    data: data
  })
}
export function supplierSellOrderCancel(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/order/cancel',
    method: 'post',
    data: data
  })
}
export function supplierSellOrderRevoke(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/order/revoke',
    method: 'post',
    data: data
  })
}
export function supplierSellOrderDelete(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/order/delete',
    method: 'post',
    data: data
  })
}
// 推荐供应商 列表
export function supplierStoreList(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/store/list',
    method: 'post',
    data: data
  })
}
export function supplierCompanyOptions(): AxiosPromise<any> {
  return request({
    url: '/v1/company/options',
    method: 'post'
  })
}

export function supplierSellOrderSettle(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/payment_settle/settle',
    method: 'post',
    data: data
  })
}

// 推荐供应商 列表

export function supplierStoreOptions(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/store/options',
    method: 'post',
    data: data
  })
}
export function supplierSpaceOptions(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/space/options',
    method: 'post',
    data: data
  })
}

export function supplierSpaceList(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/retail/store/spaces',
    method: 'post',
    data: data
  })
}
