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
                v-model="formInline.shipmentNumber"
                placeholder="请输入发货单号"
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
                v-model="formInline.shipStatus"
                style="width: 100%"
                @change="fetchProductList"
                placeholder="请选择订单状态"
              >
                <el-option
                  v-for="item in shipStatusOptions"
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
                @click="resetSearch"
                type="primary"
                icon="RefreshRight"
              >
                重置搜索
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
        <el-table-column prop="shipmentDate" label="发货日期" min-width="120" />
        <el-table-column
          prop="shipmentNumber"
          label="发货单号"
          min-width="120"
        />

        <el-table-column prop="orderId" label="订单号" min-width="100" />

        <el-table-column
          prop="receiverCompany"
          label="收货公司"
          min-width="100"
        />
        <el-table-column
          prop="receiverStore"
          label="收货门店"
          min-width="100"
        />

        <el-table-column
          prop="expectedDeliveryDate"
          label="期望交付日期"
          min-width="100"
        />

        <el-table-column prop="shipStatus" label="订单状态" min-width="80">
          <template #default="scope">
            <span
              :style="{ color: getOrderStatus(scope.row.shipStatus).color }"
            >
              {{ getOrderStatus(scope.row.shipStatus).label }}
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
              <el-tooltip
                class="box-item"
                effect="dark"
                content="详情"
                placement="top"
              >
                <svg-icon
                  icon-class="info"
                  @click="readInfo(scope.row)"
                  size="20px"
                />
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
  supplierStoreOptions
} from '@/api/procure/supplierSellOrder'

import { deliverGoodsList } from '@/api/reportManager/index'
import DateUtil from '@/utils/getDate'
const dateRange = ref()
const companyOptions = ref<any>([])
const storeOptions = ref<any>([])

const shipStatusOptions = ref<any>([
  { value: 'SHIPPING', label: '已发货', color: '#03A9F4' },
  { value: 'SHIPSTATE_SHIPPED', label: '已收货', color: '#4CAF50' }
])
const getOrderStatus = (status: any) => {
  const option = shipStatusOptions.value.find(
    (item: any) => item.value == status
  )
  return option ? option : { label: '', color: '' }
}
const dataList = ref<any>([])
const pager = ref<any>({ total: 0, page: 1, pageSize: 10 })
const activeDateType = ref<any>('')

function dataPickerChange(data: any) {
  if (data) {
    formInline.start_date = DateUtil.formatDate(toRaw(data)[0])
    formInline.end_date = DateUtil.formatDate(toRaw(data)[1])
  } else {
    formInline.start_date = ''
    formInline.end_date = ''
  }
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
  shipmentNumber: '',
  companyId: '',
  storeId: '',
  shipStatus: ''
})
const isLoading = ref(false)

const readInfo = (row: any) => {
  router.push({
    name: 'deliverGoodsDetail',
    query: { orderId: row.orderId }
  })
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
    ...formInline
  }
  const res = await deliverGoodsList(req)
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
