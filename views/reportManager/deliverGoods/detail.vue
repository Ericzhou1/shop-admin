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
              )?.label
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
            v-if="orderDetailInfo.spaceInfo.stackFee"
          >
            {{ orderDetailInfo.spaceInfo.stackFee }}
          </el-descriptions-item>
          <el-descriptions-item label="合计费用(元):">
            {{ orderDetailInfo.spaceInfo.totalFee }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>

      <el-col :span="24" flex="center">
        <el-button type="primary" @click="openBoxDialog"
          >管理物流信息</el-button
        >

        <el-button @click="goToList">返回</el-button>
      </el-col>
    </el-row>
    <el-dialog v-model="boxDialog" title="物流信息" width="1200">
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <el-button
            v-if="
              orderDetailInfo.baseInfo.orderStatus === 'WAIT_SHIP' ||
              orderDetailInfo.baseInfo.orderStatus === 'SHIPPED'
            "
            style="margin-bottom: 10px"
            type="primary"
            @click="addRow"
            >新增</el-button
          >
        </el-col>
        <el-col :span="10" :offset="0">
          <div>单号:{{ readyNum }}</div>
        </el-col>

        <el-col :span="12" :offset="0">
          <div
            v-for="(item, index) in expressInfo"
            :key="index"
            class="logistic-item"
          >
            <el-select
              v-model="item.expressType"
              placeholder="请选择快递公司"
              clearable
              filterable
              style="width: 200px"
            >
              <el-option
                v-for="option in expressTypeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>

            <el-input
              style="width: 70%; margin-left: 10px"
              v-model="item.shipmentNumber"
              placeholder="物流单号"
            />

            <el-input
              style="width: 30%; margin-left: 10px"
              v-model="item.phone"
              placeholder="手机尾号4位"
              v-if="item.shipmentNumber.substring(0, 2) === 'SF'"
            />
            <div class="buttons">
              <el-icon
                v-if="
                  orderDetailInfo.baseInfo.orderStatus === 'WAIT_SHIP' ||
                  orderDetailInfo.baseInfo.orderStatus === 'SHIPPED'
                "
                style="color: #f56c6c"
                @click="removeRow(index)"
              >
                <Delete />
              </el-icon>
              <el-icon style="color: #409eff" @click="viewInfo(item)">
                <Promotion />
              </el-icon>
            </div>
          </div>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-steps
            style="width: 100%"
            direction="vertical"
            :active="stepArray.length + 1"
            align-center
          >
            <el-step
              v-for="item in stepArray"
              :key="item.accept_time"
              :title="item.accept_time + ' (' + item.location + ' )'"
              :description="item.accept_station"
            />
          </el-steps>
        </el-col>
      </el-row>

      <template #footer>
        <div
          class="dialog-footer"
          style="display: flex; justify-content: center"
        >
          <el-button @click="boxDialog = false">取消</el-button>
          <el-button
            v-if="
              orderDetailInfo.baseInfo.orderStatus === 'WAIT_SHIP' ||
              orderDetailInfo.baseInfo.orderStatus === 'SHIPPED'
            "
            type="primary"
            @click="save"
            >提交</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { expressTypeOptions } from './expressTypeOptions'
import {
  orderStatusOptions,
  paymentMethodOptions
} from '../pushOrder/optionsInfo'
import {
  supplierPushOrderDetail,
  deliverGoodsCreate,
  deliverGoodsCheck
} from '@/api/reportManager'
import { useRoute } from 'vue-router'
import router from '@/router'

// 路由对象
const route = useRoute()
const boxDialog = ref<boolean>(false)
const stepArray = ref<any>([])
const readyNum = ref('')

const save = () => {
  // expressInfo里面每一项都要有值

  let errorMessageDisplayed = false

  expressInfo.value.forEach((item: any, index: number) => {
    if (errorMessageDisplayed) return

    if (!item.shipmentNumber || !item.expressType) {
      ElMessage.error(`第${index + 1}个物流信息不完整`)
      errorMessageDisplayed = true
      return
    } else {
      // shipmentNumber进行物流单号的校验
      if (!/^[A-Za-z0-9]+$/.test(item.shipmentNumber)) {
        ElMessage.error(`第${index + 1}个物流单号只能包含字母和数字`)
        errorMessageDisplayed = true
        return
      }
    }
  })

  if (!errorMessageDisplayed) {
    // 如果没有任何错误，调用 deliverGoodsCreate 接口
    let data = {
      expresses: replaceParamsBack(expressInfo.value),
      orderId: route.query.orderId
    }
    deliverGoodsCreate(data)
      .then((response) => {
        ElMessage.success('发货成功')
        boxDialog.value = false
        goToList()
      })
      .catch((error) => {
        ElMessage.error('发货失败')
      })
  }
}
const replaceParams = (data: any) => {
  return data.map((item: any) => {
    return {
      shipmentNumber: item.number,
      expressType: item.shipperCode
    }
  })
}
const replaceParamsBack = (data: any) => {
  return data.map((item: any) => {
    return {
      shipperCode: item.expressType,
      number: item.shipmentNumber
    }
  })
}

const openBoxDialog = () => {
  boxDialog.value = true
  if (expressInfo.value.length == 0) {
    expressInfo.value.push({
      shipmentNumber: '',
      phone: ''
    })
  }
  expressInfo.value = replaceParams(orderDetailInfo.expresses)
}
const expressInfo = ref<any>([])
const addRow = () => {
  if (expressInfo.value.length >= 15) {
    ElMessage.error('最多只能添加15条物流信息')
    return
  }
  expressInfo.value.push({
    shipmentNumber: '',
    phone: ''
  })
}

const removeRow = (index: any) => {
  if (expressInfo.value.length === 1) {
    ElMessage.error('至少保留一条物流信息')
    return
  }
  expressInfo.value.splice(index, 1)
}

const viewInfo = (row: any) => {
  readyNum.value = row.shipmentNumber
  let data = {
    shipperCode: row.expressType,
    number: row.shipmentNumber,
    phone: ''
  }
  if (!row.shipmentNumber) {
    ElMessage.error('请填写物流单号！')
    return
  }
  if (!row.expressType) {
    ElMessage.error('请选择快递公司！')
    return
  }
  if (row.shipmentNumber.substring(0, 2) === 'SF') {
    if (!row.phone) {
      ElMessage.error('请填写收件人或发件人手机尾号后4位！')
      return
    } else {
      data.phone = row.phone
      deliverGoodsCheck(data).then((res) => {
        stepArray.value = res.data.traces
      })
    }
  } else {
    deliverGoodsCheck(data).then((res) => {
      stepArray.value = res.data.traces
    })
  }
}

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
    totalCount: '',
    totalProductCount: '',
    allProducts: []
  }
})

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
  router.push({
    name: 'deliverGoods'
  })
}

// 获取订单详细信息
const fetchProductDetails = async () => {
  const res = await supplierPushOrderDetail({ orderId: route.query.orderId })
  Object.assign(orderDetailInfo, res.data)
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

:deep(.el-step__title) {
  font-size: 12px !important;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);

  .expressInfo-info {
    margin: 20px;
  }

  .logistic-item {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin-left: 10px;
  }

  .buttons .el-icon {
    margin-left: 10px;
    padding: 0;
    height: auto;
    line-height: 1.5;
  }

  .buttons .svg-icon {
    margin-left: 10px;
    padding: 0;
    height: auto;
    line-height: 1.5;
  }

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
