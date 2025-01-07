<template>
  <div class="app-container">
    <el-row justify="space-between">
      <el-col :span="24">
        <!-- 基本信息 -->
        <el-descriptions border :column="3" title="基本信息">
          <el-descriptions-item label="订单编号:">
            {{ orderDetailInfo.baseInfo.orderId }}
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
          <el-descriptions-item label="订单类型:">
            {{
              orderTypeOptions.find(
                (item: any) => item.value == orderDetailInfo.baseInfo.orderType
              )?.label
            }}
          </el-descriptions-item>
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

        <!-- 商品信息 -->
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
        </el-descriptions>

        <!-- 产品表格 -->
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
      </el-col>

      <el-descriptions :column="1">
        <el-descriptions-item label="实收金额：">
          <el-input
            :disabled="orderStatus !== 'UNSETTLED'"
            v-model="amountReal"
            style="width: 300px"
          ></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="备注信息：">
          <el-input
            :disabled="orderStatus !== 'UNSETTLED'"
            v-model="remark"
            type="textarea"
            autosize
            style="width: 300px"
          ></el-input>
        </el-descriptions-item>
      </el-descriptions>
      <el-col :span="24" flex="center">
        <el-button @click="goToList">返回</el-button>
        <el-button
          v-if="orderStatus == 'UNSETTLED'"
          type="primary"
          @click="accept"
          >结算</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import {
  supplierSellOrderSettle,
  supplierSellOrderDetail,
  supplierSellOrderSettleDetail
} from '@/api/procure/supplierSellOrder'
import { useRoute } from 'vue-router'
import {
  orderStatusOptions,
  paymentMethodOptions,
  orderTypeOptions
} from '../../reportManager/pushOrder/optionsInfo'

const route = useRoute()
const amountReal = ref<any>(0)
const remark = ref<any>('')

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
    storeName: ''
  },
  productInfo: {
    totalPrice: '',
    totalCount: '',
    totalProductCount: '',
    allProducts: []
  }
})

// 结算订单
const accept = () => {
  const data = {
    id: route.query.amountNo,
    amountNet: amountReal.value,
    remark: remark.value
  }
  supplierSellOrderSettle(data).then(() => {
    goToList()
  })
}

// 返回到订单列表
const goToList = () => {
  window.history.go(-1)
}

// 获取订单详情
const fetchProductDetails = async () => {
  const data = { orderId: route.query.orderId }
  const res = await supplierSellOrderDetail(data)
  Object.assign(orderDetailInfo, res.data)
  const supplierSellOrderSettleDetailRes = await supplierSellOrderSettleDetail({
    id: route.query.amountNo
  })
  if (supplierSellOrderSettleDetailRes.data.orderStatus !== 'UNSETTLED') {
    amountReal.value = supplierSellOrderSettleDetailRes.data.amountReal
    remark.value = supplierSellOrderSettleDetailRes.data.remark
  } else {
    amountReal.value = orderDetailInfo.productInfo.totalPrice
  }
}

const orderStatus = ref<any>('')
onMounted(() => {
  orderStatus.value = route.query.orderStatus
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
