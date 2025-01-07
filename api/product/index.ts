import request from '@/utils/request'
import { AxiosPromise } from 'axios'

// 商品类型
export function productDetails(data: any): AxiosPromise<any> {
  return request({
    url: '/product/info',
    method: 'post',
    data: data
  })
}
// 商品类型
export function productTypeList(): AxiosPromise<any> {
  return request({
    url: '/product/categories',
    method: 'post'
  })
}
// 商品列表
export function productList(data: any): AxiosPromise<any> {
  return request({
    url: '/product/list',
    method: 'post',
    data: data
  })
}
