import request from '@/utils/request'
import { AxiosPromise } from 'axios'

export function getsupplierInfo(): AxiosPromise<any> {
  return request({
    url: '/supplier/info',
    method: 'post'
  })
}
