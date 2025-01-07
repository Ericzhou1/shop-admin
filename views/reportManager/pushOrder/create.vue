<template>
  <div>
    <div class="app-container">
      <el-row justify="space-between">
        <div class="purchase-order-title">
          <span>{{ title }}</span>
        </div>
        <el-col :span="24">
          <el-form
            ref="formRef"
            :model="orderDetailInfo"
            :rules="formRules"
            label-width="auto"
          >
            <el-row>
              <el-col
                v-if="orderDetailInfo.baseInfo.orderId"
                :span="6"
                :offset="0"
              >
                <el-form-item label="订单编号" prop="baseInfo.orderId">
                  {{ orderDetailInfo.baseInfo.orderId }}
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="orderDetailInfo.baseInfo.orderId">
                <el-form-item label="订单状态" prop="baseInfo.orderStatus">
                  {{
                    orderStatusOptions.find(
                      (item: any) =>
                        item.value == orderDetailInfo.baseInfo.orderStatus
                    )?.label
                  }}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="期望送达日期" prop="baseInfo.wantDate">
                  <el-date-picker
                    v-model="orderDetailInfo.baseInfo.wantDate"
                    type="date"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    placeholder="期望送达时间"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="支付方式" prop="baseInfo.payType">
                  <el-select
                    v-model="orderDetailInfo.baseInfo.payType"
                    style="width: 100%"
                    placeholder="请选择支付方式"
                  >
                    <el-option
                      v-for="item in paymentMethodOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="选择商品">
                  <el-button type="primary" @click="selectProduct">
                    选择商品
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="商品信息">
                  <div class="order-product-info">
                    <span
                      >商品种类:{{
                        orderDetailInfo.productInfo.allProducts.length
                      }}</span
                    >
                    <span>商品总件数:{{ productTotalCount }}</span>
                    <span>总价:{{ productTotalPrice }}</span>
                  </div>
                  <el-table
                    :data="orderDetailInfo.productInfo.allProducts"
                    style="width: 100%"
                    border
                    max-height="250"
                  >
                    <el-table-column
                      prop="productBarcode"
                      label="商品条码"
                      min-width="60"
                    />
                    <el-table-column prop="productName" label="商品名称" />
                    <el-table-column
                      prop="productImage"
                      label="商品图片"
                      min-width="60"
                    >
                      <template #default="scope">
                        <el-image
                          style="width: 30px; height: 30px"
                          :src="
                            '//images.weserv.nl/?url=' + scope.row.productImage
                          "
                        />
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="productParameters"
                      label="产品参数"
                      show-overflow-tooltip
                      width="200"
                    >
                      <template #default="scope">
                        <span
                          v-for="(item, index) in scope.row.productParameters"
                          :key="index"
                        >
                          <span>{{ item.key }}:{{ item.value }};</span>
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="productCount"
                      label="数量"
                      align="center"
                      width="200"
                    >
                      <template #default="scope">
                        <el-input-number
                          v-model="scope.row.productCount"
                          :min="1"
                          :step="1"
                          :max="99999"
                          :precision="0"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column prop="unitPrice" label="单价(元)" />
                    <el-table-column prop="" label="支付价格(元)">
                      <template #default="scope">
                        {{
                          (
                            scope.row.productCount * scope.row.unitPrice
                          ).toFixed(2) || 0
                        }}元
                      </template>
                    </el-table-column>
                    <el-table-column prop="" label="操作" align="center">
                      <template #default="scope">
                        <el-icon
                          @click="deleProduct(scope.row, scope.$index)"
                          size="20px"
                        >
                          <delete />
                        </el-icon>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="选择提货点">
                  <el-form
                    ref="storeFormRef"
                    :rules="storeRules"
                    :inline="true"
                    :model="storeForm"
                  >
                    <el-form-item
                      label="公司:"
                      style="width: 200px"
                      prop="companyId"
                    >
                      <el-select
                        v-model="storeForm.companyId"
                        style="width: 100%"
                        @change="doGetStoreOptions"
                        placeholder="请选择商户公司"
                      >
                        <el-option
                          v-for="option in companyOptions"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="门店:"
                      style="width: 200px"
                      prop="storeId"
                    >
                      <el-select
                        v-model="storeForm.storeId"
                        style="width: 100%"
                        placeholder="请选择门店"
                        @change="doGetSpaceOptions"
                      >
                        <el-option
                          v-for="option in storeOptions"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="门店地址">{{
                      orderDetailInfo.spaceInfo.storeAddress
                    }}</el-form-item>
                    <el-form-item label="总费用(元)">{{
                      totalPrice
                    }}</el-form-item>
                  </el-form>
                </el-form-item>
              </el-col>
              <el-col :span="23" :offset="1">
                <el-table
                  :data="spaceOptions"
                  style="width: 100%"
                  max-height="450"
                >
                  <el-table-column
                    prop="label"
                    label="空间名称"
                    min-width="60"
                  />
                  <el-table-column
                    prop="Total"
                    label="原始总空间(m2)"
                    min-width="60"
                  />
                  <el-table-column
                    prop="Free"
                    label="空间剩余(m2)"
                    min-width="60"
                  />
                  <el-table-column prop="" label="空间剩余率" min-width="60">
                    <template #default="scope">
                      <span v-if="scope.row.Standards && scope.row.Total">
                        {{
                          ((scope.row.Free / scope.row.Total) * 100).toFixed(2)
                        }}%
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="needSpace"
                    label="需要面积(m2)"
                    min-width="120"
                  >
                    <template #default="scope">
                      <el-input-number
                        :disabled="!scope.row.Standards"
                        v-model="scope.row.needSpace"
                        :min="0"
                        :step="1"
                        :precision="1"
                        :max="Number(scope.row.Standards)"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="Standards"
                    label="面积价格(元/m2)"
                    min-width="60"
                  />
                  <el-table-column
                    prop="totalPrice"
                    label="总价格(元)"
                    min-width="60"
                  >
                    <template #default="scope">
                      {{
                        scope.row.needSpace
                          ? (scope.row.needSpace * scope.row.Standards).toFixed(
                              2
                            )
                          : 0
                      }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <el-form-item />
          </el-form>
        </el-col>
        <el-col :span="24" flex="center">
          <el-button @click="goToList">返回</el-button>
          <el-button
            v-if="!orderDetailInfo.baseInfo.orderId"
            type="primary"
            @click="saveOrder"
            >保存</el-button
          >
          <el-button type="primary" @click="submitOrder">提交</el-button>
        </el-col>
      </el-row>
    </div>
    <el-dialog v-model="dialogProductVisible" title="请选择商品" width="1500">
      <el-form
        :model="productForm"
        ref="form"
        label-width="80px"
        :inline="true"
      >
        <el-form-item label="商品分类">
          <el-select
            style="width: 180px"
            @change="searchProduct"
            v-model="productForm.productType"
          >
            <el-option
              v-for="item in productTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="productForm.productName" />
        </el-form-item>
        <el-form-item label="商品条码">
          <el-input v-model="productForm.productBarcode" />
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input v-model="productForm.productCode" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="resetSearch" icon="RefreshRight">
            重置搜索
          </el-button>
          <el-button type="primary" @click="searchProduct">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="productData"
        ref="multipleTableRef"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        max-height="450"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="productCode" label="商品编码" min-width="60" />
        <el-table-column
          prop="productBarcode"
          label="商品条码"
          min-width="60"
        />
        <el-table-column prop="productImage" label="商品图片" min-width="60">
          <template #default="scope">
            <el-image
              style="width: 30px; height: 30px"
              :src="'//images.weserv.nl/?url=' + scope.row.productImage"
            />
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品名称" min-width="60" />
        <el-table-column prop="unitPrice" label="单价（元）" min-width="60" />
        <el-table-column
          prop="productParameters"
          label="产品参数"
          show-overflow-tooltip
          width="200"
        >
          <template #default="scope">
            <span
              v-for="(item, index) in scope.row.productParameters"
              :key="index"
            >
              <span>{{ item.key }}:{{ item.value }};</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="productType" label="分类" min-width="60">
          <template #default="scope">
            {{
              productTypeOptions.find(
                (item: any) => item.value == scope.row.productType
              )?.label
            }}
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">关闭</el-button>
          <el-button type="primary" @click="addProduct">确认添加</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import {
  supplierCompanyOptions,
  supplierStoreOptions,
  supplierSpaceList
} from '@/api/procure/supplierSellOrder'
import { productTypeList, productList } from '@/api/product'
import {
  pushOrderCreate,
  pushOrderSubmit,
  pushOrderUpdate,
  supplierPushOrderDetail,
  getRetailMerchants,
  getStores
} from '@/api/reportManager'
import { orderStatusOptions, paymentMethodOptions } from './optionsInfo'

import { useRoute } from 'vue-router'
const title = ref('')
const storeFormRef = ref<any>(null) // 引用门店表单
const formRef = ref<any>(null) // 引用基础表单

// 计算总价格(元)
const totalPrice = computed(() => {
  return spaceOptions.value
    .reduce((sum: any, option: any) => {
      return sum + (option.needSpace * option.Standards || 0)
    }, 0)
    .toFixed(2)
})

// 计算商品总价
const productTotalPrice = computed(() => {
  return orderDetailInfo.productInfo.allProducts
    .reduce((sum: any, product: any) => {
      return sum + (product.unitPrice * product.productCount || 0)
    }, 0)
    .toFixed(2)
})

// 删除商品
const deleProduct = (product: any, index: number) => {
  orderDetailInfo.productInfo.allProducts.splice(index, 1)
}

// 计算商品总数量
const productTotalCount = computed(() => {
  return orderDetailInfo.productInfo.allProducts.reduce(
    (sum: any, product: any) => {
      return sum + (product.productCount || 0)
    },
    0
  )
})

// 表单验证规则
const formRules = {
  'baseInfo.wantDate': [
    { required: true, message: '请选择日期', trigger: 'change' }
  ],
  'baseInfo.payType': [
    { required: true, message: '请选择付款方式', trigger: 'change' }
  ]
}

const storeRules = {
  companyId: [{ required: true, message: '请选择商户公司', trigger: 'change' }],
  storeId: [{ required: true, message: '请选择门店', trigger: 'change' }]
}

// 路由对象
const route = useRoute()
const productTypeOptions = ref<any>([])

const subData = ref<any>({})

// 产品表单数据
const productForm = reactive<any>({
  productType: '',
  productName: '',
  productBarcode: '',
  productCode: ''
})

// 门店表单数据
const storeForm = reactive<any>({
  companyId: '',
  storeId: '',
  spaceId: ''
})

// 各种数据选项
const productData = ref<any>([])
const companyOptions = ref<any>([])
const storeOptions = ref<any>([])
const spaceOptions = ref<any>([
  { label: '展位', value: 'BOOTH', needSpace: 0 },
  { label: '仓储', value: 'STORAGE', needSpace: 0 },
  { label: '堆头', value: 'STACK', needSpace: 0 }
])
const spaceData = ref<any>({})
const dialogProductVisible = ref<boolean>(false)

// 订单详细信息
const orderDetailInfo = reactive<any>({
  baseInfo: {
    wantDate: '',
    payType: ''
  },
  spaceInfo: {
    storeAddress: '',
    companyName: '',
    storeName: '',
    BOOTH: '',
    STORAGE: '',
    STACK: '',
    totalFee: ''
  },
  productInfo: {
    totalPrice: '',
    totalCount: '',
    totalProductCount: '',
    allProducts: []
  }
})

// 选择的多个产品
const multipleSelection = ref<any>([])

// 关闭对话框并重置表单
const closeDialog = () => {
  dialogProductVisible.value = false
  multipleSelection.value = []
  productForm.productType = ''
  productForm.productName = ''
  productForm.productBarcode = ''
  productForm.productCode = ''
}

// 获取公司选项
const doGetCompanyOptions = () => {
  getRetailMerchants()
    .then((res) => {
      companyOptions.value = res.data.items
    })
    .catch(() => {})
}

// 获取门店选项
const doGetStoreOptions = () => {
  getStores({ merchantId: storeForm.companyId })
    .then((res) => {
      storeOptions.value = res.data.items
      storeForm.storeId = ''
    })
    .catch(() => {})
}

// 获取空间选项
const doGetSpaceOptions = () => {
  addStore()
  supplierSpaceList({ id: Number(storeForm.storeId) })
    .then((res) => {
      spaceData.value = res.data
      spaceOptions.value[0].Free = spaceData.value.boothFree
      spaceOptions.value[1].Free = spaceData.value.storageFree
      spaceOptions.value[2].Free = spaceData.value.stackFree
      spaceOptions.value[0].Standards = spaceData.value.boothStandards
      spaceOptions.value[1].Standards = spaceData.value.storageStandards
      spaceOptions.value[2].Standards = spaceData.value.stackStandards
      spaceOptions.value[0].Total = spaceData.value.boothTotal
      spaceOptions.value[1].Total = spaceData.value.storageTotal
      spaceOptions.value[2].Total = spaceData.value.stackTotal
    })
    .catch(() => {})
}

// 添加产品到订单中
const addProduct = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.error('请选择要添加的商品')
    return
  }

  const existingProductBarcodes = new Set(
    orderDetailInfo.productInfo.allProducts.map(
      (product: any) => product.productBarcode
    )
  )

  multipleSelection.value.forEach((product: any) => {
    if (!existingProductBarcodes.has(product.productBarcode)) {
      orderDetailInfo.productInfo.allProducts.push(product)
      existingProductBarcodes.add(product.productBarcode)
    }
  })

  dialogProductVisible.value = false
}

// 添加门店信息到订单中
const addStore = () => {
  const selectedCompany = companyOptions.value.find(
    (item: any) => item.value == storeForm.companyId
  )
  const selectedStore = storeOptions.value.find(
    (item: any) => item.value == storeForm.storeId
  )

  if (selectedCompany) {
    orderDetailInfo.spaceInfo.companyId = storeForm.companyId
    orderDetailInfo.spaceInfo.companyName = selectedCompany.label
  }

  if (selectedStore) {
    orderDetailInfo.spaceInfo.storeId = storeForm.storeId
    orderDetailInfo.spaceInfo.storeName = selectedStore.label
    orderDetailInfo.spaceInfo.storeAddress = selectedStore.storeAddress
  }
}

// 处理产品选择变化
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

// 选择产品并打开对话框
const selectProduct = () => {
  dialogProductVisible.value = true
  productTypeList().then((res) => {
    productTypeOptions.value = res.data.items
  })
  searchProduct()
}
// 重置搜索
const resetSearch = () => {
  productForm.productType = ''
  productForm.productName = ''
  productForm.productBarcode = ''
  productForm.productCode = ''
}

// 搜索产品
const searchProduct = () => {
  productList({
    productCode: productForm.productCode,
    productBarcode: productForm.productBarcode,
    productType: productForm.productType,
    productName: productForm.productName,
    page: 1,
    pageSize: 99999
  }).then((res) => {
    productData.value = res.data.items
  })
}
// 保存订单
const saveOrder = () => {
  formRef.value.validate((valid: any) => {
    if (
      valid &&
      orderDetailInfo.productInfo.allProducts.length !== 0 &&
      productTotalPrice.value > 0
    ) {
      storeFormRef.value.validate((subValid: any) => {
        if (subValid && totalPrice.value > 0) {
          subData.value = {
            wantDate: orderDetailInfo.baseInfo.wantDate,
            payType: orderDetailInfo.baseInfo.payType,
            goodses: []
          }
          orderDetailInfo.productInfo.allProducts.forEach((item: any) => {
            subData.value.goodses.push({
              code: item.productCode,
              count: item.productCount
            })
          })
          subData.value.storeId = storeForm.storeId
          subData.value.booth = String(spaceOptions.value[0].needSpace)
          subData.value.storage = String(spaceOptions.value[1].needSpace)
          subData.value.stack = String(spaceOptions.value[2].needSpace)

          if (orderDetailInfo.baseInfo.orderId) {
            subData.value.orderId = orderDetailInfo.baseInfo.orderId
          }
          pushOrderCreate(subData.value).then((res) => {
            ElMessage.success('保存成功')
            goToList()
          })
        } else {
          ElMessage.error('请选择提货点并填写至少一个空间面积')
        }
      })
    } else {
      ElMessage.error('请选择必填项目并且添加最少一件商品')
    }
  })
}
// 提交订单
const submitOrder = () => {
  formRef.value.validate((valid: any) => {
    if (
      valid &&
      orderDetailInfo.productInfo.allProducts.length !== 0 &&
      productTotalPrice.value > 0
    ) {
      storeFormRef.value.validate((subValid: any) => {
        if (subValid && totalPrice.value > 0) {
          subData.value = {
            wantDate: orderDetailInfo.baseInfo.wantDate,
            payType: orderDetailInfo.baseInfo.payType,
            goodses: []
          }
          orderDetailInfo.productInfo.allProducts.forEach((item: any) => {
            subData.value.goodses.push({
              code: item.productCode,
              count: item.productCount
            })
          })
          subData.value.storeId = storeForm.storeId
          subData.value.booth = String(spaceOptions.value[0].needSpace)
          subData.value.storage = String(spaceOptions.value[1].needSpace)
          subData.value.stack = String(spaceOptions.value[2].needSpace)

          if (orderDetailInfo.baseInfo.orderId) {
            subData.value.orderId = orderDetailInfo.baseInfo.orderId
          }
          pushOrderCreate(subData.value).then((res) => {
            let id = res.data.orderId
            pushOrderSubmit({ orderId: id }).then(() => {
              ElMessage.success('创建成功')
              goToList()
            })
          })
        } else {
          ElMessage.error('请选择提货点并填写至少一个空间面积')
        }
      })
    } else {
      ElMessage.error('请选择必填项目并且添加最少一件商品')
    }
  })
}

// 根据值查找空间选项
const searchByValue = (array: any, searchValue: any) => {
  const result = array.find((item: any) => item.value == searchValue) || null
  return result && (!result.needSpace || result.needSpace === 0) ? {} : result
}

// 返回订单列表
const goToList = () => {
  window.history.go(-1)
}

// 获取订单详细信息
const fetchProductDetails = async () => {
  try {
    const res = await supplierPushOrderDetail({ orderId: route.query.orderId })
    Object.assign(orderDetailInfo, res.data)
    orderDetailInfo.baseInfo.wantDate = res.data.baseInfo.expectedDeliveryDate

    const company = companyOptions.value.find(
      (item: any) => item.label === orderDetailInfo.spaceInfo.companyName
    )
    storeForm.companyId = company?.value

    const storeRes = await getStores({ merchantId: storeForm.companyId })
    storeOptions.value = storeRes.data.items

    const store = storeOptions.value.find(
      (item: any) => item.label === orderDetailInfo.spaceInfo.storeName
    )
    storeForm.storeId = store?.value

    const spaceRes = await supplierSpaceList({ id: Number(storeForm.storeId) })
    spaceOptions.value[0].Free = spaceRes.data.boothFree
    spaceOptions.value[1].Free = spaceRes.data.storageFree
    spaceOptions.value[2].Free = spaceRes.data.stackFree
    spaceOptions.value[0].Standards = spaceRes.data.boothStandards
    spaceOptions.value[1].Standards = spaceRes.data.storageStandards
    spaceOptions.value[2].Standards = spaceRes.data.stackStandards
    spaceOptions.value[0].Total = spaceRes.data.boothTotal
    spaceOptions.value[1].Total = spaceRes.data.storageTotal
    spaceOptions.value[2].Total = spaceRes.data.stackTotal
    spaceOptions.value[0].needSpace = Number(
      orderDetailInfo.spaceInfo.exhibitionSpace
    )
    spaceOptions.value[1].needSpace = Number(
      orderDetailInfo.spaceInfo.storageSpace
    )
    spaceOptions.value[2].needSpace = Number(
      orderDetailInfo.spaceInfo.stackSpace
    )

    orderDetailInfo.spaceInfo.totalFee = spaceOptions.value
      .reduce((total: number, space: any) => {
        return total + (space.needSpace * space.Standards || 0)
      }, 0)
      .toFixed(2)
    orderDetailInfo.baseInfo.payType = orderDetailInfo.baseInfo.paymentMethod
  } catch (error) {
    console.error('Error fetching product details:', error)
  }
}

// 组件挂载时初始化数据
onMounted(() => {
  getRetailMerchants()
    .then((res) => {
      companyOptions.value = res.data.items
    })
    .then(() => {
      if (route.query.orderId) {
        title.value = '编辑采购订单'
        fetchProductDetails()
      } else {
        title.value = '新建采购订单'
      }
    })
    .catch(() => {})
})
</script>
```
<style lang="scss" scoped>
:deep(.el-descriptions__label) {
  font-weight: 500 !important;
}
.app-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);

  .product-image {
    width: 100px;
    height: 100px;
    margin-left: 20px;
    margin-top: 20px;
    float: left;
  }
  .order-product-info {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    span {
      margin-left: 30px;
      text-align: center;
    }
  }
}
</style>
