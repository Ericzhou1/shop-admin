<template>
  <div>
    <!-- 商品列表 -->
    <div class="app-container">
      <el-row justify="space-between">
        <el-col :span="24" class="flex">
          <el-form :inline="true" :model="formInline">
            <el-form-item style="width: 300px">
              <el-menu
                :default-active="activeDateType"
                class="el-menu-demo"
                mode="horizontal"
                :ellipsis="false"
                @select="elMenuChange"
              >
                <el-menu-item index="0">今天</el-menu-item>
                <el-menu-item index="-1">昨天</el-menu-item>
                <el-menu-item index="-6">7日</el-menu-item>
                <el-menu-item index="-30">30日</el-menu-item>
              </el-menu>
            </el-form-item>
            <el-form-item style="width: 300px">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                class="mr-5 ml-5"
                @change="dataPickerChange"
              />
            </el-form-item>
            <el-form-item style="width: 150px">
              <el-input
                v-model="formInline.orderId"
                placeholder="请输入订单号"
              />
            </el-form-item>
            <el-form-item style="width: 150px">
              <el-select
                v-model="formInline.companyId"
                style="width: 100%"
                @change="doGetStoreOptions"
                placeholder="请选择商户公司"
              >
                <el-option
                  v-for="item in companyOptions"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item style="width: 150px">
              <el-select
                v-model="formInline.storeId"
                style="width: 100%"
                @change="fetchProductList"
                placeholder="请选择门店"
              >
                <el-option
                  v-for="item in storeOptions"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item style="width: 150px">
              <el-select
                v-model="formInline.orderStatus"
                style="width: 100%"
                @change="fetchProductList"
                placeholder="请选择订单状态"
              >
                <el-option
                  v-for="item in orderStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="fetchProductList" icon="Search">
                搜索
              </el-button>
              <el-button
                type="primary"
                @click="resetSearch"
                icon="RefreshRight"
              >
                重置搜索
              </el-button>
              <el-button type="primary" @click="readInfo({}, '')">
                新建商机订单
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-table
        :data="dataList"
        v-loading="isLoading"
        :scrollbar-always-on="false"
        :header-cell-style="{
          textAlign: 'center',
          borderTop: '2px solid #f6f6f6',
          borderBottom: 'none'
        }"
        :row-class-name="tableRowClassName"
        class="table-container"
      >
        <el-table-column prop="orderDate" label="订单日期" min-width="120" />
        <el-table-column prop="orderId" label="订单号" min-width="100" />
        <el-table-column prop="orderType" label="订单类型" min-width="80">
          <template #default="scope">
            {{
              orderTypeOptions.find(
                (item: any) => item.value == scope.row.orderType
              )?.label
            }}
          </template>
        </el-table-column>

        <el-table-column prop="companyName" label="商户名称" min-width="100" />
        <el-table-column prop="storeName" label="门店名称" min-width="100" />
        <el-table-column
          prop="spaceOccupancy"
          label="空间占用情况"
          show-overflow-tooltip
          min-width="200"
        >
          <template #default="scope">
            展位:{{ scope.row.spaceOccupancy.booth }} 仓储:{{
              scope.row.spaceOccupancy.storage
            }}
            堆头:{{ scope.row.spaceOccupancy.stack }}
          </template>
        </el-table-column>

        <el-table-column
          prop="amountReceivable"
          label="应回货款金额"
          min-width="120"
        />
        <el-table-column
          prop="spaceFee"
          label="应付空间费(元)"
          min-width="100"
        />
        <el-table-column
          prop="expectedDeliveryDate"
          label="期望交付日期"
          min-width="120"
        />
        <el-table-column prop="orderStatus" label="订单状态" min-width="80">
          <template #default="scope">
            <span
              :style="{ color: getOrderStatus(scope.row.orderStatus).color }"
            >
              {{ getOrderStatus(scope.row.orderStatus).label }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          header-align="left"
          align="left"
          label="操作"
          fixed="right"
          min-width="200"
        >
          <template #default="scope">
            <div class="operation">
              <!-- 查看详情 -->
              <el-tooltip
                class="box-item"
                effect="dark"
                content="撤回订单"
                placement="top"
                v-if="scope.row.orderStatus === 'WAIT_RECEIVE'"
              >
                <el-icon @click="revokeOrder(scope.row)" size="20px">
                  <Remove />
                </el-icon>
              </el-tooltip>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="取消订单"
                placement="top"
                v-if="
                  scope.row.orderStatus === 'WAIT_SHIP' ||
                  scope.row.orderStatus === 'WAIT_RECEIVE'
                "
              >
                <el-icon @click="cancelOrder(scope.row)" size="20px">
                  <CircleClose />
                </el-icon>
              </el-tooltip>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="修改"
                placement="top"
                v-if="scope.row.orderStatus === 'WAIT_SUBMIT'"
              >
                <el-icon @click="readInfo(scope.row, 'edit')" size="20px">
                  <Edit />
                </el-icon>
              </el-tooltip>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="查看"
                placement="top"
              >
                <svg-icon
                  icon-class="info"
                  @click="readInfo(scope.row, 'check')"
                  size="20px"
                />
              </el-tooltip>

              <el-popconfirm
                width="220"
                confirm-button-text="确定"
                cancel-button-text="取消"
                :icon="InfoFilled"
                icon-color="#626AEF"
                title="确定要删除这条数据吗?"
                @confirm="delAccount(scope.row.orderId)"
                v-if="
                  scope.row.orderStatus === 'REJECTED' ||
                  scope.row.orderStatus === 'CANCELLED' ||
                  scope.row.orderStatus === 'WAIT_SUBMIT'
                "
              >
                <template #reference>
                  <el-icon size="20px"><Delete /></el-icon>
                </template>
              </el-popconfirm>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="发货"
                placement="top"
              >
                <el-icon
                  v-if="
                    scope.row.orderStatus === 'WAIT_SHIP' ||
                    scope.row.orderStatus === 'SHIPPED' ||
                    scope.row.orderStatus === 'RECEIVED_GOODS'
                  "
                  @click="sendBox(scope.row)"
                  size="20px"
                >
                  <MessageBox />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next, sizes, jumper"
        :total="pager.total"
        :page-sizes="[10, 20, 30, 40]"
        v-model:current-page="pager.page"
        v-model:page-size="pager.pageSize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        justify="center"
        class="page-footer"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'

import { onMounted, ref, reactive } from 'vue'
import router from '@/router'
import {
  supplierCompanyOptions,
  supplierStoreOptions,
  supplierSellOrderDelete,
  supplierSellOrderRevoke,
  supplierSellOrderCancel
} from '@/api/procure/supplierSellOrder'
import { orderStatusOptions, orderTypeOptions } from './optionsInfo'

import { sellOrderList, orderStatusList } from '@/api/reportManager/index'
import DateUtil from '@/utils/getDate'
const dateRange = ref()
const companyOptions = ref<any>([])
const storeOptions = ref<any>([])

const getOrderStatus = (status: any) => {
  const option = orderStatusOptions.find((item: any) => item.value == status)
  return option ? option : { label: '', color: '' }
}
const dataList = ref<any>([])
const pager = ref<any>({ total: 0, page: 1, pageSize: 10 })
const activeDateType = ref<any>('')

function sendBox(row: any) {
  router.push({
    name: 'deliverGoodsDetail',
    query: { orderId: row.orderId }
  })
}
// 取消订单
const cancelOrder = (row: any) => {
  supplierSellOrderCancel({ orderId: row.orderId })
    .then(() => {
      ElMessage.success('取消成功！')
      fetchProductList()
    })
    .catch((error) => {
      ElMessage.error(error)
    })
}
// 撤回订单
const revokeOrder = (row: any) => {
  supplierSellOrderRevoke({ orderId: row.orderId })
    .then(() => {
      ElMessage.success('取消成功！')
      fetchProductList()
    })
    .catch((error) => {
      ElMessage.error(error)
    })
}
// 删除
const delAccount = (orderId: any) => {
  supplierSellOrderDelete({ orderId: orderId })
    .then(() => {
      ElMessage.success('删除成功！')
      fetchProductList()
    })
    .catch((error) => {
      ElMessage.error(error)
    })
}
function dataPickerChange(data: any) {
  if (data) {
    formInline.start_date = DateUtil.formatDate(toRaw(data)[0])
    formInline.end_date = DateUtil.formatDate(toRaw(data)[1])
  } else {
    formInline.start_date = ''
    formInline.end_date = ''
  }
  // 不高亮任何地方 如果写成固定值，则第二次执行该语句时el-menu不会更新视图
  activeDateType.value = Math.random().toString()

  nextTick(() => {
    activeDateType.value = ''
  })
  fetchProductList()
}

function doGetCompanyOptions() {
  supplierCompanyOptions()
    .then((res) => {
      companyOptions.value = res.data.items
    })
    .catch(() => {})
}

function doGetStoreOptions(e: any) {
  formInline.storeId = ''
  let data = {
    companyId: e
  }
  supplierStoreOptions(data)
    .then((res) => {
      storeOptions.value = res.data.items
    })
    .catch(() => {})
}
// 查询日期区间更改
function elMenuChange(data: string) {
  if (Number(data) >= -1) {
    formInline.start_date = DateUtil.getDay(Number(data), '-', '')
    formInline.end_date = DateUtil.getDay(Number(data), '-', 'end')
  } else {
    formInline.start_date = DateUtil.getDay(Number(data), '-', '')
    formInline.end_date = DateUtil.getDay(0, '-', 'end')
  }

  dateRange.value = [formInline.start_date, formInline.end_date]
  fetchProductList()
}

const formInline = reactive<any>({
  start_date: '',
  end_date: '',
  orderId: '',
  companyId: '',
  storeId: '',
  orderStatus: ''
})
const isLoading = ref(false)

const readInfo = (row: any, type: any) => {
  if (type === 'check') {
    router.push({
      name: 'pushOrderDetail',
      query: { orderId: row.orderId }
    })
  } else if (type === 'create') {
    router.push({
      name: 'pushOrderCreate'
    })
  } else {
    router.push({
      name: 'pushOrderCreate',
      query: { orderId: row.orderId, type: 'edit' }
    })
  }
}

onMounted(() => {
  doGetCompanyOptions()
  fetchProductList()
})

const tableRowClassName = (row: any) => {
  return row.rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

const fetchProductList = async () => {
  isLoading.value = true
  const req = {
    page: pager.value.page,
    pageSize: pager.value.pageSize,
    orderType: 'PUSH',
    ...formInline
  }
  const res = await sellOrderList(req)
  dataList.value = res.data.items
  pager.value.total = res.data.total
  isLoading.value = false
}

const resetSearch = () => {
  Object.keys(formInline).forEach((key) => {
    formInline[key] = ''
  })
  dateRange.value = []
  activeDateType.value = Math.random().toString()

  nextTick(() => {
    activeDateType.value = ''
  })
  pager.value.page = 1
  pager.value.pageSize = 10
  fetchProductList()
}

const handleSizeChange = (val: number) => {
  pager.value.pageSize = val
  fetchProductList()
}

const handleCurrentChange = (val: number) => {
  pager.value.page = val
  fetchProductList()
}
</script>

<style lang="scss" scoped>
:deep(.el-table .even-row td) {
  text-align: center;
}
:deep(.el-dialog__header) {
  text-align: center;
}
:deep(.el-radio) {
  margin-right: 0;
  font-weight: normal;
  flex: 0 0 50%;
}
:deep(.el-checkbox-group) {
  .el-checkbox {
    margin: 0;
    font-weight: normal;
  }
}
.app-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  .table-container {
    flex: 1;
    overflow: auto;
  }
  .points {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .point_icon_list {
      img {
        margin-left: 2px;
        width: 26px;
        height: 16px;
      }
    }
  }
  .page-footer {
    height: 30px;
  }
  .el-table--default {
    margin-bottom: 20px;
    .operation {
      display: flex;
      justify-content: space-evenly;
      flex-direction: row;
      flex-wrap: nowrap;
    }
  }
}
</style>
