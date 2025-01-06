<template>
  <div class="app-container">
    <div class="search-bar">
      <MoreDivider minHeight="50px" maxHeight="400px">
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
                  v-for="(label, value) in orderStore.StatusEnum"
                  :key="Number(value)"
                  :label="label"
                  :value="Number(value)"
                />
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="支付方式" prop="orderPayType">
              <el-radio-group v-model="queryParams.orderPayType" @change="handleQuery">
                <el-radio-button
                  v-for="(label, value) in orderStore.PayTypeEnum"
                  :key="Number(value)"
                  :label="label"
                  :value="Number(value)"
                />
              </el-radio-group>
            </el-form-item>
          </el-row>
          <!-- <el-form-item label="支付方式" prop="orderPayType">
            <el-select
              v-model="queryParams.orderPayType"
              placeholder="请选择"
              clearable
              class="!w-[168px]"
              @change="handleQuery"
            >
              <el-option
                v-for="(label, value) in orderStore.PayTypeEnum"
                :key="Number(value)"
                :label="label"
                :value="Number(value)"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="订单编号" prop="no">
            <el-input
              v-model="queryParams.no"
              placeholder="请输入订单编号"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户电话" prop="userPhone">
            <el-input
              v-model="queryParams.userPhone"
              placeholder="请输入用户电话"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户昵称" prop="username">
            <el-input
              v-model="queryParams.username"
              placeholder="请输入用户昵称"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="收货人" prop="consignee">
            <el-input
              v-model="queryParams.consignee"
              placeholder="请输入收货人"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="收货电话" prop="phone">
            <el-input
              v-model="queryParams.phone"
              placeholder="请输入收货电话"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
        </el-form>
      </MoreDivider>
    </div>

    <el-card shadow="never">
      <div class="operation">
        <el-button icon="download" :loading="loading" @click="exportExel">导出</el-button>
        <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
        <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
      </div>
      <el-table v-loading="loading" :data="pageData">
        <el-table-column label="订单号 | 类型" align="center" width="220">
          <template #default="scope">
            <div>{{ scope.row.no }}</div>
            <div>【{{ orderStore.TypeEnum[scope.row.type] }}】</div>
          </template>
        </el-table-column>
        <el-table-column label="用户昵称 | ID | 手机号" align="center" width="220">
          <template #default="scope">
            <div>{{ scope.row.nickName }}</div>
            <div>{{ scope.row.userId }} | {{ scope.row.mobile }}</div>
          </template>
        </el-table-column>
        <el-table-column label="商品信息" align="center" width="400">
          <template #default="scope">
            <div v-for="item in scope.row.items" :key="item.id" class="goods-item">
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
        <el-table-column label="实际支付(现金或积分)" prop="paidAmount" align="center" width="180">
          <template #default="scope" />
        </el-table-column>
        <el-table-column label="支付方式" align="center">
          <template #default="scope">
            {{ orderStore.PayTypeEnum[scope.row.payType] }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" align="center">
          <template #default="scope">
            {{ orderStore.StatusEnum[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column label="支付时间" prop="paidAt" align="center" width="180">
          <template #default="scope" />
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="170" align="center">
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 2"
              type="primary"
              icon="edit"
              link
              size="small"
              @click="showDeliveryDialog(scope.row.no)"
            >
              发货
            </el-button>
            <el-button
              type="primary"
              icon="delete"
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
    <DeliveryDialog
      v-model:visible="deliveryDialog.visible"
      :no="deliveryDialog.no"
      @success="handleQuery"
    />
    <DetailDialog v-model:visible="detailDialog.visible" :no="detailDialog.no" />
  </div>
</template>

<script setup lang="ts">
import Api from '@/api/index'
import { useOrderStore } from '@/store'
import MoreDivider from '@/components/MoreDivider/index.vue'
import DeliveryDialog from './deliveryDialog.vue'
import DetailDialog from './detailDialog.vue'
defineOptions({
  name: 'OrderList',
})
const orderStore = useOrderStore()
orderStore.getPayTypeEnum()

const queryFormRef = ref(ElForm)
const queryParams = reactive({
  channel: 0, // 订单渠道
  status: 1, // 订单状态
  orderPayType: 0, // 支付方式
  createTime: undefined, // 创建时间
  deliveryTime: undefined, // 发货时间
  no: undefined, // 订单编号
  userPhone: undefined, // 用户电话
  username: undefined, // 用户昵称
  consignee: undefined, // 收货人
  phone: undefined, // 收货电话
  page: 1,
  size: 10,
})
const loading = ref(false)
const pageData = ref([])
const total = ref(0)

// 查询
const handleQuery = async () => {
  loading.value = true
  const data = await Api.OrderApi.getOrderList(queryParams)
  pageData.value = data.list
  total.value = data.total
  loading.value = false
}

// 重置查询
function handleResetQuery() {
  queryFormRef.value.resetFields()
  queryParams.page = 1
  handleQuery()
}

// 导出
const exportExel = async () => {
  loading.value = true
  let params = {
    channel: queryParams.channel,
    consignee: queryParams.consignee,
    no: queryParams.no,
    orderPayType: queryParams.orderPayType,
    orderType: null,
    phone: queryParams.phone,
    status: queryParams.status,
    userPhone: queryParams.userPhone,
    username: queryParams.username,
  }
  const response: any = await Api.OrderApi.exportExel(params)
  const fileData = response.data
  const fileName = decodeURI(response.headers['content-disposition'].split(';')[1].split('=')[1])
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'

  const blob = new Blob([fileData], { type: fileType })
  const downloadUrl = window.URL.createObjectURL(blob)

  const downloadLink = document.createElement('a')
  downloadLink.href = downloadUrl
  downloadLink.download = fileName

  document.body.appendChild(downloadLink)
  downloadLink.click()

  document.body.removeChild(downloadLink)
  window.URL.revokeObjectURL(downloadUrl)
  loading.value = false
}
const deliveryDialog = reactive({
  visible: false,
  no: '',
})

function showDeliveryDialog(no: string) {
  deliveryDialog.no = no
  deliveryDialog.visible = true
}

const detailDialog = reactive({
  visible: false,
  no: '',
})

function showDetailDialog(no: string) {
  detailDialog.no = no
  detailDialog.visible = true
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
    width: 50px;
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
