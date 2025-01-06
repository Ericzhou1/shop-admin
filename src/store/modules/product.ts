import Api from '@/api/index'
export const useProductStore = defineStore('product', () => {
  // 商品类型
  let ProductTypeOptions: any = ref([])
  const getProductType = async () => {
    if (ProductTypeOptions.value.length) {
      return ProductTypeOptions.value
    } else {
      const data = await Api.ProductApi.getProductType()
      ProductTypeOptions.value = data.list
      return ProductTypeOptions.value
    }
  }
  // 品牌列表
  let ProductBrandOptions: any = ref([])
  const getProductBrand = async () => {
    if (ProductBrandOptions.value.length) {
      return ProductBrandOptions.value
    } else {
      const data = await Api.ProductApi.getProductBrandList()
      ProductBrandOptions.value = data.list
      return ProductBrandOptions.value
    }
  }
  // 单位列表
  let UnitOptions: any = ref([])
  const getUnit = async () => {
    if (UnitOptions.value.length) {
      return UnitOptions.value
    } else {
      const data = await Api.ProductApi.getProductUnitList()
      UnitOptions.value = data.list
      return UnitOptions.value
    }
  }
  // 店铺列表
  let ShopOptions: any = ref([])
  const getProductShop = async () => {
    if (ShopOptions.value.length) {
      return ShopOptions.value
    } else {
      const data = await Api.ProductApi.getShopList()
      ShopOptions.value = data.list
      return ShopOptions.value
    }
  }
  let PayTypeOptions: any = ref([])
  const getPayType = async () => {
    if (PayTypeOptions.value.length) {
      return PayTypeOptions.value
    } else {
      const data = await Api.ProductApi.getPayType()
      PayTypeOptions.value = data.list
      return PayTypeOptions.value
    }
  }
  // 渠道列表
  let ChannelOptions: any = ref([])
  const getChannel = async () => {
    if (ChannelOptions.value.length) {
      return ChannelOptions.value
    } else {
      const data = await Api.ProductApi.getChannelList({
        page: 1,
        size: 1000,
      })
      ChannelOptions.value = data.list
      return ChannelOptions.value
    }
  }
  // 审核状态
  const CheckStatusOption: any = [
    {
      id: 1,
      name: '待审核',
    },
    {
      id: 2,
      name: '审核失败',
    },
    {
      id: 3,
      name: '审核通过',
    },
  ]
  // 商品状态
  const StatusOption: any = [
    {
      id: 1,
      name: '待上架',
    },
    {
      id: 2,
      name: '仓库中',
    },
    {
      id: 3,
      name: '正常',
    },
    {
      id: 4,
      name: '违规',
    },
  ]
  return {
    CheckStatusOption,
    StatusOption,
    ProductTypeOptions,
    getProductType,
    ProductBrandOptions,
    getProductBrand,
    UnitOptions,
    getUnit,
    getProductShop,
    ShopOptions,
    PayTypeOptions,
    getPayType,
    ChannelOptions,
    getChannel,
  }
})
