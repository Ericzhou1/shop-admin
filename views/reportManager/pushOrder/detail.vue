<template>
  <div class="app-container">
    <el-row justify="space-between">
      <el-col :span="24">
        <el-descriptions :border="true" :column="4" title="订单详情">
          <el-descriptions-item label="订单编号">
            {{ orderDetailInfo.baseInfo.orderId }}
          </el-descriptions-item>
          <el-descriptions-item label="订单状态:">
            {{
              orderStatusOptions.find(
                (item: any) =>
                  item.value == orderDetailInfo.baseInfo.orderStatus
              )?.label || ''
            }}
          </el-descriptions-item>
          <el-descriptions-item label="期望送达日期">
            {{ orderDetailInfo.baseInfo.expectedDeliveryDate }}
          </el-descriptions-item>
          <el-descriptions-item label="支付方式">
            {{
              paymentMethodOptions.find(
                (item: any) =>
                  item.value == orderDetailInfo.baseInfo.paymentMethod
              )?.label || ''
            }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1" title="商品信息" style="margin-top: 20px">
          <el-descriptions-item>
            <div class="order-product-info">
              <span
                >商品种类:
                {{ orderDetailInfo.productInfo.allProducts.length }}</span
              >
              <span>商品总件数: {{ productTotalCount }}</span>
              <span>总价: {{ productTotalPrice }}</span>
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
                    :src="'//images.weserv.nl/?url=' + scope.row.productImage"
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
                  {{ scope.row.productCount }}
                </template>
              </el-table-column>
              <el-table-column prop="unitPrice" label="单价(元)" />
              <el-table-column prop="" label="支付价格(元)">
                <template #default="scope">
                  {{
                    (scope.row.productCount * scope.row.unitPrice).toFixed(2) ||
                    0
                  }}元
                </template>
              </el-table-column>
            </el-table>
          </el-descriptions-item>
        </el-descriptions>

        <el-descriptions :border="true" :column="3" title="提货点信息">
          <el-descriptions-item label="公司">
            {{ orderDetailInfo.spaceInfo.companyName }}
          </el-descriptions-item>
          <el-descriptions-item label="门店">
            {{ orderDetailInfo.spaceInfo.storeName }}
          </el-descriptions-item>
          <el-descriptions-item label="门店地址">
            {{ orderDetailInfo.spaceInfo.storeAddress }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col :span="24" :offset="0">
        <el-descriptions
          :column="4"
          :border="true"
          title="空间信息"
          style="margin-top: 20px; margin-bottom: 20px"
        >
          <!-- 空间信息 -->

          <el-descriptions-item
            label="展位(m2):"
            v-if="orderDetailInfo.spaceInfo.exhibitionFee"
          >
            {{ orderDetailInfo.spaceInfo.exhibitionSpace }}
          </el-descriptions-item>
          <el-descriptions-item
            label="展位费用(元):"
            v-if="orderDetailInfo.spaceInfo.exhibitionFee"
          >
            {{ orderDetailInfo.spaceInfo.exhibitionFee }}
          </el-descriptions-item>
          <el-descriptions-item
            label="仓储(m2):"
            v-if="orderDetailInfo.spaceInfo.storageFee"
          >
            {{ orderDetailInfo.spaceInfo.storageSpace }}
          </el-descriptions-item>
          <el-descriptions-item
            label="仓储费用(元):"
            v-if="orderDetailInfo.spaceInfo.storageFee"
          >
            {{ orderDetailInfo.spaceInfo.storageFee }}
          </el-descriptions-item>
          <el-descriptions-item
            label="堆头(m2):"
            v-if="orderDetailInfo.spaceInfo.stackSpace"
          >
            {{ orderDetailInfo.spaceInfo.stackSpace }}
          </el-descriptions-item>
          <el-descriptions-item
            label="堆头费用(元):"
            v-if="orderDetailInfo.spaceInfo.stackSpace"
          >
            {{ orderDetailInfo.spaceInfo.stackFee }}
          </el-descriptions-item>
          <el-descriptions-item label="合计费用(元):">
            {{ orderDetailInfo.spaceInfo.totalFee }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>

      <el-col :span="24" flex="center">
        <el-button @click="goToList">返回</el-button>
        <el-button
          v-if="orderDetailInfo.baseInfo.orderStatus === 'WAIT_RECEIVE'"
          type="primary"
          @click="accept(true)"
          >接单</el-button
        >
        <el-button
          v-if="orderDetailInfo.baseInfo.orderStatus === 'WAIT_RECEIVE'"
          type="primary"
          @click="accept(false)"
          >拒单</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { supplierSellOrderAgree } from '@/api/procure/supplierSellOrder'
import { productTypeList, productList } from '@/api/product'
import { supplierPushOrderDetail, pushOrderCreate } from '@/api/reportManager'
import { useRoute } from 'vue-router'
import { orderStatusOptions, paymentMethodOptions } from './optionsInfo'

// 路由对象
const route = useRoute()
const spaceOptions = ref<any>([
  { label: '展位', value: 'BOOTH' },
  { label: '仓储', value: 'STORAGE' },
  { label: '堆头', value: 'STACK' }
])

// 订单详细信息
const orderDetailInfo = reactive<any>({
  baseInfo: {
    expectedDeliveryDate: '',
    paymentMethod: ''
  },
  spaceInfo: {
    storeAddress: '',
    companyName: '',
    storeName: '',
    totalFee: ''
  },
  productInfo: {
    totalPrice: '',
    totalCount: '',
    totalProductCount: '',
    allProducts: []
  }
})
const accept = (type: boolean) => {
  supplierSellOrderAgree({ orderId: route.query.orderId, agree: type }).then(
    () => {
      if (type) {
        ElMessage.success('已接单')
      } else {
        ElMessage.success('已拒单')
      }
      goToList()
    }
  )
}
// 计算商品总价
const productTotalPrice = computed(() => {
  return orderDetailInfo.productInfo.allProducts
    .reduce((sum: any, product: any) => {
      return sum + (product.unitPrice * product.productCount || 0)
    }, 0)
    .toFixed(2)
})

// 计算商品总数量
const productTotalCount = computed(() => {
  return orderDetailInfo.productInfo.allProducts.reduce(
    (sum: any, product: any) => {
      return sum + (product.productCount || 0)
    },
    0
  )
})

// 返回订单列表
const goToList = () => {
  window.history.go(-1)
}

// 获取订单详细信息
const fetchProductDetails = async () => {
  const res = await supplierPushOrderDetail({ orderId: route.query.orderId })
  Object.assign(orderDetailInfo, res.data)
  // 检查并添加空间信息
  spaceOptions.value = []
  const spaceInfo = res.data.spaceInfo
  if (spaceInfo.BOOTH) {
    spaceOptions.value.push(spaceInfo.BOOTH)
  }
  if (spaceInfo.STORAGE) {
    spaceOptions.value.push(spaceInfo.STORAGE)
  }
  if (spaceInfo.STACK) {
    spaceOptions.value.push(spaceInfo.STACK)
  }
}

// 组件挂载时初始化数据
onMounted(() => {
  if (route.query.orderId) {
    fetchProductDetails()
  }
})
</script>

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
  :deep(.el-table__inner-wrapper) {
    border-radius: 0 0 0 0 !important;
  }
  :deep(.el-scrollbar__wrap) {
    border-radius: 0 0 0 0 !important;
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
