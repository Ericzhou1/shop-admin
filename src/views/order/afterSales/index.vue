<template>
  <div class="app-container">
    <div class="search-bar">
      <MoreDivider minHeight="50px" maxHeight="200px">
        <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-suffix=":">
          <el-row>
            <el-form-item label="订单渠道" prop="channel">
              <el-radio-group v-model="queryParams.channel" @change="handleQuery">
                <el-radio-button
                  v-for="(label, value) in orderStore.ChannelEunm"
                  :key="Number(value)"
                  :label="label"
                  :value="Number(value)"
                />
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="订单状态" prop="status">
              <el-radio-group v-model="queryParams.status" @change="handleQuery">
                <el-radio-button
                  v-for="(label, value) in orderStore.FefundStatusEnum"
                  :key="Number(value)"
                  :label="label"
                  :value="Number(value)"
                />
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-form-item label="售后编号" prop="no">
            <el-input v-model="queryParams.no" placeholder="批量查询需用“，”隔开" />
          </el-form-item>
          <!-- <el-form-item label="物流单号">
            <el-input v-model="queryParams.logisticsCode" placeholder="批量查询需用“，”隔开" />
          </el-form-item> -->
          <!-- <el-form-item label="收货人手机号" prop="phone">
            <el-input v-model="queryParams.phone" placeholder="请输入收货人姓名" />
          </el-form-item> -->
          <!-- <el-form-item label="收货人姓名" prop="consignee">
            <el-input v-model="queryParams.consignee" placeholder="请输入收货人手机号" />
          </el-form-item> -->
          <!-- <el-form-item label="售后状态" prop="afterSaleStatus">
            <el-select
              v-model="queryParams.afterSaleStatus"
              placeholder="全部"
              clearable
              class="!w-[200px]"
            >
              <el-option label="待商家收货" :value="1" />
              <el-option label="待商家发货" :value="2" />
              <el-option label="待商家处理" :value="3" />
              <el-option label="待买家退货" :value="4" />
              <el-option label="退款中" :value="5" />
              <el-option label="退款成功" :value="6" />
              <el-option label="退款失败" :value="7" />
              <el-option label="售后关闭" :value="8" />
              <el-option label="绝售后申请" :value="9" />
              <el-option label="退货后商家拒绝" :value="10" />
              <el-option label="换货/补寄/维修" :value="11" />
              <el-option label="待买家收货" :value="12" />
              <el-option label="拒签后退款" :value="13" />
              <el-option label="换货成功" :value="14" />
              <el-option label="补寄成功" :value="15" />
              <el-option label="维修成功" :value="16" />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="售后类型" prop="afterSaleType">
            <el-select
              v-model="queryParams.afterSaleType"
              placeholder="全部"
              clearable
              class="!w-[200px]"
            >
              <el-option label="未发货仅退款" :value="1" />
              <el-option label="已发货仅退款" :value="2" />
              <el-option label="退货退款" :value="3" />
              <el-option label="换货" :value="4" />
              <el-option label="价格保护" :value="5" />
              <el-option label="补寄" :value="6" />
              <el-option label="维修-以换代修" :value="7" />
              <el-option label="维修-寄修" :value="8" />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="申请原因" prop="applyReason">
            <el-select
              v-model="queryParams.applyReason"
              placeholder="全部"
              clearable
              class="!w-[200px]"
            >
              <el-option label="无理由退换货" :value="1" />
              <el-option label="其他原因" :value="2" />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item>
            <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
            <el-button icon="refresh">重置</el-button>
          </el-form-item> -->
        </el-form>
      </MoreDivider>
    </div>
    <el-card shadow="never">
      <div class="operation">
        <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
        <el-button icon="refresh">重置</el-button>
      </div>
      <el-table v-loading="loading" :data="pageData" border>
        <el-table-column type="selection" align="center" width="50" />
        <el-table-column label="订单号" prop="no" align="center" width="280">
          <template #default="scope">
            <div>订单号: {{ scope.row.orderInfo.no }}</div>
            <div>退款号: {{ scope.row.no }}</div>
          </template>
        </el-table-column>
        <el-table-column label="用户信息" align="center" width="160">
          <template #default="scope">
            <div>用户名: {{ scope.row.orderInfo.nickName }}</div>
            <div>用户ID: {{ scope.row.orderInfo.mobile }}</div>
          </template>
        </el-table-column>
        <el-table-column label="所属店铺" align="center">
          <template #default="scope">待开发</template>
        </el-table-column>
        <el-table-column label="商品信息" align="center" width="300">
          <template #default="scope">
            <div v-for="item in scope.row.orderInfo.items" :key="item.id" class="goods-item">
              <el-image
                class="main-image mr-4"
                :src="item.mainImage"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[item.mainImage]"
                :initial-index="4"
                preview-teleported
                fit="cover"
              />
              <span>
                {{ item.name }}
                <span v-for="(specs, index) in item.specs" :key="index">
                  | {{ specs.name }}: {{ specs.value }}
                </span>
              </span>
              <span class="price">¥{{ item.price }} x {{ item.num }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="退款金额" props="refund" align="center" />
        <el-table-column label="原订单总额" align="center" width="150">
          <template #default="scope">
            <div>订单金额: {{ scope.row.orderInfo.amount }}</div>
            <div>付款方式: {{ scope.row.orderInfo.payType }}</div>
          </template>
        </el-table-column>
        <el-table-column label="售后类型" align="center">
          <template #default="scope">
            <div>{{ orderStore.FefundTypeEnum[scope.row.afterSaleType] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="售后状态" align="center">
          <template #default="scope">
            <div>{{ orderStore.FefundStatusEnum[scope.row.status] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="售后原因" align="center">
          <template #default="scope">
            <div>{{ scope.row.reason }}</div>
          </template>
        </el-table-column>
        <el-table-column label="发起退款时间" prop="createdAt" align="center" width="150" />
        <el-table-column label="操作" fixed="right" width="160">
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 1"
              type="primary"
              icon="FolderChecked"
              link
              size="small"
              @click="showCheckConfirmDialog(scope.row)"
            >
              审核
            </el-button>
            <el-button
              type="primary"
              icon="search"
              link
              size="small"
              @click="showDetailDialog(scope.row.no)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <pagination
          v-if="total > 0"
          v-model:total="total"
          v-model:page="queryParams.page"
          v-model:limit="queryParams.size"
          @pagination="handleQuery"
        />
      </div>
    </el-card>
    <CheckConfirmComponent
      v-model:visible="checkConfirmDialog.visible"
      :no="checkConfirmDialog.no"
      :type="checkConfirmDialog.type"
      @success="handleQuery"
    />
    <DetailDialog v-model:visible="detailDialog.visible" :no="detailDialog.no" />
  </div>
</template>

<script setup lang="ts">
import Api from '@/api/index'
import { useOrderStore } from '@/store'

import MoreDivider from '@/components/MoreDivider/index.vue'
import CheckConfirmComponent from './checkConfirm.vue'
import DetailDialog from './detailDialog.vue'

defineOptions({
  name: 'AfterSales',
})

const orderStore = useOrderStore()
orderStore.getPayTypeEnum()

const queryParams = reactive({
  channel: 0,
  status: 0, // 订单状态
  no: '',
  orderType: undefined,
  page: 1,
  size: 10,
  type: 0,
  userId: 0,
})
const loading = ref(false)
const pageData = ref([])
const total = ref(0)

// 导出
const exportExel = async () => {
  // loading.value = true
  // let params = {
  //   channel: queryParams.channel,
  //   consignee: null,
  //   no: queryParams.no,
  //   orderPayType: null,
  //   orderType: queryParams.orderType,
  //   phone: null,
  //   status: queryParams.status,
  //   userPhone: null,
  //   username: null,
  // }
  // const response: any = await Api.OrderApi.exportExel(params)
  // const fileData = response.data
  // const fileName = decodeURI(response.headers['content-disposition'].split(';')[1].split('=')[1])
  // const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
  // const blob = new Blob([fileData], { type: fileType })
  // const downloadUrl = window.URL.createObjectURL(blob)
  // const downloadLink = document.createElement('a')
  // downloadLink.href = downloadUrl
  // downloadLink.download = fileName
  // document.body.appendChild(downloadLink)
  // downloadLink.click()
  // document.body.removeChild(downloadLink)
  // window.URL.revokeObjectURL(downloadUrl)
  // loading.value = false
}

// 查询
const handleQuery = async () => {
  loading.value = true
  const data = await Api.OrderApi.getRefundList(queryParams)
  pageData.value = data.list
  total.value = data.total
  loading.value = false
}

const detailDialog = reactive({
  visible: false,
  no: '',
})

function showDetailDialog(no: string) {
  detailDialog.no = no
  detailDialog.visible = true
}

const checkConfirmDialog = reactive({
  visible: false,
  no: '',
  type: 0, // 1: 仅退款，2: 退货退款
})

function showCheckConfirmDialog(row: any) {
  checkConfirmDialog.no = row.no
  checkConfirmDialog.type = row.afterSaleType
  checkConfirmDialog.visible = true
}

onMounted(async () => {
  await handleQuery()
})
</script>

<style lang="scss" scoped>
.app-container {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .operation {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    margin-bottom: 20px;
  }
  :deep(.el-card) {
    flex: 1;
    display: flex;
    .el-card__body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .el-table {
        flex: 1;
      }
      .pagination {
        flex: 0 0 56px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
      }
    }
  }
}
:deep(.el-radio-button) {
  margin-right: 4px;

  .el-radio-button__inner {
    border: none !important;
    border-radius: 4px !important;
  }
}
.goods-item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .main-image {
    flex: 0 0 50px;
    width: 50;
    height: 50px;
  }
  .price {
    flex: 0 0 100px;
  }
  .status {
    flex: 0 0 50px;
  }
}
</style>
