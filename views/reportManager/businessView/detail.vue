<template>
  <div>
    <div class="app-container">
      <el-row justify="space-between">
        <el-col :span="24">
          <el-descriptions border :column="4" title="基本信息">
            <!-- 基本信息 -->
            <el-descriptions-item label="订单日期:">
              {{ orderDetailInfo.baseInfo.orderDate }}
            </el-descriptions-item>
            <el-descriptions-item label="订单编号:">
              {{ orderDetailInfo.baseInfo.orderId }}
            </el-descriptions-item>
            <el-descriptions-item label="订单状态:">
              {{
                orderStatusOptions.find(
                  (item: any) =>
                    item.value == orderDetailInfo.baseInfo.orderStatus
                )?.label
              }}
            </el-descriptions-item>
            <el-descriptions-item label="预计送达日期:">
              {{ orderDetailInfo.baseInfo.expectedDeliveryDate }}
            </el-descriptions-item>
            <el-descriptions-item label="订单类型:">
              {{
                orderTypeOptions.find(
                  (item: any) =>
                    item.value == orderDetailInfo.baseInfo.orderType
                )?.label
              }}
            </el-descriptions-item>
            <el-descriptions-item label="支付方式:">
              {{
                paymentMethodOptions.find(
                  (item: any) =>
                    item.value == orderDetailInfo.baseInfo.paymentMethod
                )?.label || ''
              }}
            </el-descriptions-item>
            <el-descriptions-item label="订单状态:">
              {{
                orderStatusOptions.find(
                  (item: any) =>
                    item.value == orderDetailInfo.baseInfo.orderStatus
                )?.label
              }}
            </el-descriptions-item>
          </el-descriptions>
          <el-descriptions :column="3" title="商品信息" border style="">
            <el-descriptions-item label="商品总类:">
              {{ orderDetailInfo.productInfo.totalProductCount }}
            </el-descriptions-item>
            <el-descriptions-item label="商品总数:">
              {{ orderDetailInfo.productInfo.totalCount }}
            </el-descriptions-item>
            <el-descriptions-item label="商品总金额(元):">
              {{ orderDetailInfo.productInfo.totalPrice }}
            </el-descriptions-item>
            <!-- 产品信息 -->
          </el-descriptions>

          <el-table
            :data="orderDetailInfo.productInfo.allProducts"
            style="width: 100%"
            border
            max-height="300"
          >
            <el-table-column prop="productImage" label="产品图片" width="80">
              <template #default="scope">
                <el-image
                  style="width: 50px; height: 50px"
                  :src="'//images.weserv.nl/?url=' + scope.row.productImage"
                />
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="产品名称" />
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
            <el-table-column prop="productCount" label="数量" />
            <el-table-column prop="unitPrice" label="单价(元)" />
            <el-table-column prop="payPrice" label="支付价格(元)" />
          </el-table>

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
          <el-col :span="24" :offset="0">
            <el-descriptions
              :column="4"
              :border="true"
              title="空间信息"
              style="margin-bottom: 20px"
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
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import {
  supplierCompanyOptions,
  supplierStoreOptions,
  supplierSellOrderAgree,
  supplierSellOrderDetail
} from '@/api/procure/supplierSellOrder'
import {
  orderStatusOptions,
  paymentMethodOptions,
  orderTypeOptions
} from '../pushOrder/optionsInfo'

import { useRoute } from 'vue-router'
const route = useRoute()

const orderDetailInfo = reactive<any>({
  baseInfo: {
    orderDate: '',
    orderId: '',
    expectedDeliveryDate: '',
    orderType: '',
    paymentMethod: '',
    orderStatus: ''
  },
  spaceInfo: {
    storeAddress: '',
    companyName: '',
    storeName: '',
    BOOTH: '',
    exhibitionFee: '',
    STORAGE: '',
    storageFee: '',
    STACK: '',
    promotionFee: '',
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

const goToList = () => {
  window.history.go(-1)
}
const goBack = () => {
  window.history.go(-2)
}

const fetchProductDetails = async () => {
  const data = { orderId: route.query.orderId }
  const res = await supplierSellOrderDetail(data)
  Object.assign(orderDetailInfo, res.data)
}

onMounted(() => {
  fetchProductDetails()
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
    float: left;
  }
}
</style>
