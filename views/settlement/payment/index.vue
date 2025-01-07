<template>
  <div class="app-container">
    <!-- 商品列表 -->
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
            <el-select
              v-model="formInline.companyId"
              style="width: 100%"
              @change="doGetStoreOptions"
              placeholder="请选择商户公司"
              clearable
            >
              <el-option
                v-for="item in companyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="width: 100px">
            <el-select
              v-model="formInline.storeId"
              style="width: 100%"
              @change="fetchProductList"
              placeholder="请选择门店"
            >
              <el-option
                v-for="item in storeOptions"
                :key="item.value"
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
              clearable
            >
              <el-option
                v-for="item in orderStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="width: 150px">
            <el-select
              clearable
              v-model="formInline.loss"
              style="width: 100%"
              @change="fetchProductList"
              placeholder="结算浮动"
            >
              <el-option
                v-for="item in lossOptions"
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
            <el-button type="primary" @click="resetSearch" icon="RefreshRight">
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
      <el-table-column prop="orderDate" label="订单时间" min-width="120" />
      <el-table-column prop="orderId" label="订单编号" min-width="80" />
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
        prop="amountReceivable"
        label="应收合计"
        min-width="100"
      />
      <el-table-column prop="ammountNet" label="实收合计" min-width="100" />
      <el-table-column prop="" label="结算浮动金额(元)" min-width="100">
        <template #default="scope">
          <span
            v-if="
              scope.row.orderStatus == 'SETTLED' &&
              Number(scope.row.ammountNet) > Number(scope.row.amountReceivable)
            "
            style="color: #4caf50"
          >
            +{{
              (scope.row.ammountNet - scope.row.amountReceivable).toFixed(2)
            }}
          </span>
          <span
            v-else-if="
              scope.row.orderStatus == 'SETTLED' &&
              Number(scope.row.ammountNet) < Number(scope.row.amountReceivable)
            "
            style="color: #f44336"
          >
            -{{
              (scope.row.amountReceivable - scope.row.ammountNet).toFixed(2)
            }}
          </span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="损益备注" min-width="120" />
      <el-table-column prop="orderStatus" label="状态" min-width="80">
        <template #default="scope">
          {{
            orderStatusOptions.find(
              (item: any) => item.value == scope.row.orderStatus
            )?.label
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        header-align="left"
        align="left"
        label="操作"
        fixed="right"
        min-width="150"
      >
        <template #default="scope">
          <div class="operation">
            <span
              class="btn mr-5"
              v-if="scope.row.orderStatus == 'UNSETTLED'"
              @click="readInfo(scope.row)"
            >
              结算
            </span>
            <span v-else class="btn mr-5" @click="readInfo(scope.row)">
              查看
            </span>
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
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, toRaw } from 'vue'
import router from '@/router'
import {
  supplierCompanyOptions,
  supplierStoreOptions
} from '@/api/procure/supplierSellOrder'
import { paymentSettleList } from '@/api/spaceExpense/index'
import DateUtil from '@/utils/getDate'
import { orderTypeOptions } from '../../reportManager/pushOrder/optionsInfo'

const dateRange = ref()
const companyOptions = ref<any>([])
const storeOptions = ref<any>([])

// 订单状态下拉列表
const orderStatusOptions = ref<any>([
  { label: '未结算', value: 'UNSETTLED' },
  { label: '已结算', value: 'SETTLED' }
])

// 损益情况下拉列表
const lossOptions = ref<any>([
  { label: '下浮', value: 'LOSS' },
  { label: '上浮', value: 'OBTAIN' }
])
const dataList = ref<any>([])
const pager = ref<any>({ total: 0, page: 1, pageSize: 10 })
const activeDateType = ref<any>('')

const formInline = reactive<any>({
  start_date: '',
  end_date: '',
  companyId: '',
  storeId: '',
  orderStatus: '',
  loss: ''
})
const isLoading = ref(false)

// 获取公司选项
const doGetCompanyOptions = () => {
  supplierCompanyOptions()
    .then((res) => {
      companyOptions.value = res.data.items
    })
    .catch(() => {})
}

// 获取门店选项
const doGetStoreOptions = (e: any) => {
  formInline.storeId = ''
  supplierStoreOptions({ companyId: e })
    .then((res) => {
      storeOptions.value = res.data.items
      fetchProductList()
    })
    .catch(() => {})
}

// 处理日期区间更改
const dataPickerChange = (data: any) => {
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

// 处理菜单选择
const elMenuChange = (data: string) => {
  const numData = Number(data)
  formInline.start_date = DateUtil.getDay(numData, '-', '')
  formInline.end_date =
    numData >= -1
      ? DateUtil.getDay(numData, '-', 'end')
      : DateUtil.getDay(0, '-', 'end')
  dateRange.value = [formInline.start_date, formInline.end_date]
  fetchProductList()
}

// 读取订单信息
const readInfo = (row: any) => {
  router.push({
    name: 'paymentDetail',
    query: {
      orderId: row.orderId,
      orderStatus: row.orderStatus,
      amountNo: row.amountNo
    }
  })
}

// 获取商品列表
const fetchProductList = async () => {
  isLoading.value = true
  const req = {
    page: pager.value.page,
    pageSize: pager.value.pageSize,
    ...formInline
  }
  const res = await paymentSettleList(req)
  dataList.value = res.data.items
  pager.value.total = res.data.total
  isLoading.value = false
}

// 重置搜索
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

// 处理分页大小更改
const handleSizeChange = (val: number) => {
  pager.value.pageSize = val
  fetchProductList()
}

// 处理当前页更改
const handleCurrentChange = (val: number) => {
  pager.value.page = val
  fetchProductList()
}

// 表格行样式
const tableRowClassName = (row: any) => {
  return row.rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

// 初始化数据
onMounted(() => {
  doGetCompanyOptions()
  fetchProductList()
})
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
