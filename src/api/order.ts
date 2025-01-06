import request from '@/utils/request'

const OrderApi = {
  // 支付类型枚举
  getOrderConst() {
    return request<any, any>({
      url: `/order/const`,
      method: 'post',
    })
  },
  // exel导出
  exportExel(data: any) {
    return request<any, any>({
      url: `/order/excel`,
      method: 'post',
      data,
      responseType: 'blob',
    })
  },
  // 订单列表
  getOrderList(data: any) {
    return request<any, any>({
      url: `/order/list`,
      method: 'post',
      data,
    })
  },
  // 订单详情
  getDetailData(data: any) {
    return request<any, any>({
      url: `/order/detail`,
      method: 'post',
      data,
    })
  },
  // 订单发货
  orderDelivery(data: any) {
    return request<any, any>({
      url: `/order/delivery`,
      method: 'post',
      data,
    })
  },
  // 售后订单列表
  getRefundList(data: any) {
    return request<any, any>({
      url: `/order/refund/list`,
      method: 'post',
      data,
    })
  },
  // 售后订单详情
  getRefundDetail(data: any) {
    return request<any, any>({
      url: `/order/refund/detail`,
      method: 'post',
      data,
    })
  },
  // 仅退款
  fefund(data: any) {
    return request<any, any>({
      url: `/order/refund/refund`,
      method: 'post',
      data,
    })
  },
  // 退货退款
  return(data: any) {
    return request<any, any>({
      url: `/order/refund/return`,
      method: 'post',
      data,
    })
  },
}

export default OrderApi
