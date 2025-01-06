import request from '@/utils/request'

const ProductApi = {
  // 品牌列表
  getProductBrandList() {
    return request<any, any>({
      url: `/goods/brand/list`,
      method: 'post',
    })
  },
  // 商品分类
  getProductType() {
    return request<any, any>({
      url: `/goods/classes/list`,
      method: 'post',
    })
  },
  // 新增商品
  addProduct(data: any) {
    return request<any, any>({
      url: `/goods/add`,
      method: 'post',
      data,
    })
  },
  // 商品列表
  getProductList(data: any) {
    return request<any, any>({
      url: `/goods/list`,
      method: 'post',
      data,
    })
  },
  // 商品档案
  getProductBaseList(data: any) {
    return request<any, any>({
      url: `/goods/base/list`,
      method: 'post',
      data,
    })
  },
  // 商品规格
  getProductSpecList(data?: any) {
    return request<any, any>({
      url: `/goods/spec/list`,
      method: 'post',
      data,
    })
  },
  // 商品分类
  getProductUnitList(data?: any) {
    return request<any, any>({
      url: `/goods/unit/list`,
      method: 'post',
      data,
    })
  },
  // 商家列表
  getShopList(data?: any) {
    return request<any, any>({
      url: `/shop/list`,
      method: 'post',
      data,
    })
  },
  // sku参数
  getProductSkuData(data: any) {
    return request<any, any>({
      url: `/goods/sku/list`,
      method: 'post',
      data,
    })
  },
  //支付方式
  getPayType() {
    return request<any, any>({
      url: `/goods/pay/channel`,
      method: 'post',
    })
  },
  // 渠道
  getChannelList(data: any) {
    return request<any, any>({
      url: `/goods/channel/list`,
      method: 'post',
      data,
    })
  },
}

export default ProductApi
