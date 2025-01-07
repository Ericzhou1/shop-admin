import request from '@/utils/request'
import { AxiosPromise } from 'axios'
//空间费用结算列表
export function spaceExpenseList(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/space_expense/list',
    method: 'post',
    data: data
  })
}
//空间费用结算
export function spaceExpenseSettle(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/space_expense/settle',
    method: 'post',
    data: data
  })
}

//货款结算列表
export function paymentSettleList(data: any): AxiosPromise<any> {
  return request({
    url: '/v1/payment_settle/list',
    method: 'post',
    data: data
  })
}
//货款结算详情
export function paymentSettleDetail(data: any): AxiosPromise<any> {
  return request({
    url: '/paymentSettle/detail',
    method: 'post',
    data: data
  })
}
//货款费用结算
export function paymentSettle(data: any): AxiosPromise<any> {
  return request({
    url: '/paymentSettle/settle',
    method: 'post',
    data: data
  })
}
