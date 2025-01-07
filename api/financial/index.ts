import request from '@/utils/request'
import { AxiosPromise } from 'axios'

export function billList(data: any): AxiosPromise<any> {
  return request({
    url: '/bill/list',
    method: 'post',
    data
  })
}
export function billDetail(data: any): AxiosPromise<any> {
  return request({
    url: '/bill/info',
    method: 'post',
    data
  })
}
export function billListDetail(data: any): AxiosPromise<any> {
  return request({
    url: '/bill/list_detail',
    method: 'post',
    data
  })
}

export function createWidthdraw(data: any): AxiosPromise<any> {
  return request({
    url: '/withdraw/submit',
    method: 'post',
    data
  })
}
export function withdrawList(data: any): AxiosPromise<any> {
  return request({
    url: '/withdraw/list',
    method: 'post',
    data
  })
}
export function withdrawInfo(data: any): AxiosPromise<any> {
  return request({
    url: '/withdraw/info',
    method: 'post',
    data
  })
}
//
export function supplierRecord(data: any): AxiosPromise<any> {
  return request({
    url: '/supplier/balance/record',
    method: 'post',
    data
  })
}
// /withdraw/list
