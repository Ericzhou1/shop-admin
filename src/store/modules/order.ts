import Api from '@/api/index'
export const useOrderStore = defineStore('order', () => {
  // 订单渠道
  const ChannelEunm: any = {
    0: '全部',
    1: '知心话',
  }

  // 订单状态
  const StatusEnum: any = {
    1: '待支付',
    2: '待发货',
    3: '部分发货',
    4: '已发货',
    5: '待评价',
    6: '已完成',
    7: '退款中',
  }

  // 订单类型
  const TypeEnum: any = {
    0: '未指定',
    1: '普通订单',
    2: '直播订单',
  }

  // 支付类型
  let PayTypeEnum: any = ref(null)
  const getPayTypeEnum = async () => {
    if (PayTypeEnum.value) {
      return PayTypeEnum.value
    } else {
      const data = await Api.OrderApi.getOrderConst()
      const obj: any = {}
      data.forEach((item: any) => {
        obj[item.key] = item.value
      })
      PayTypeEnum.value = obj
      return PayTypeEnum.value
    }
  }

  // 售后订单状态
  const FefundStatusEnum: any = {
    0: '全部',
    1: '待商家处理',
    2: '待买家退货',
    3: '待商家收货',
    4: '退款成功',
    5: '商家拒绝',
  }

  // 售后订单类型
  const FefundTypeEnum: any = {
    1: '仅退款',
    2: '退货退款',
  }

  return {
    ChannelEunm,
    StatusEnum,
    TypeEnum,
    PayTypeEnum,
    FefundStatusEnum,
    FefundTypeEnum,
    getPayTypeEnum,
  }
})
