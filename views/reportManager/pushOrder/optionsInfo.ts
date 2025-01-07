export const orderStatusOptions = [
  { value: 'WAIT_SUBMIT', label: '待提交', color: '#9E9E9E' },
  { value: 'WAIT_RECEIVE', label: '待接单', color: '#FF9800' }, // 橙色
  { value: 'WAIT_SHIP', label: '待发货', color: '#FFC107' }, // 黄色
  { value: 'SHIPPED', label: '已发货', color: '#03A9F4' }, // 蓝色
  { value: 'RECEIVED_GOODS', label: '已收货', color: '#4CAF50' }, // 绿色
  { value: 'REJECTED', label: '已拒绝', color: '#F44336' }, // 红色
  { value: 'CANCELLED', label: '已取消', color: '#9E9E9E' } // 灰色
]
export const paymentMethodOptions = [
  { value: 'GOODS_FIRST', label: '先货后款' },
  { value: 'OFFLINE', label: '线下支付' }
]
export const orderTypeOptions = ref<any>([
  { label: '采购订单', value: 'RECIEVE' },
  { label: '自荐订单', value: 'PUSH' }
])
