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
        <el-table-column prop="amountNo" label="费用单号" min-width="100" />
        <el-table-column prop="orderId" label="订单编号" min-width="80" />
        <el-table-column prop="companyName" label="商户名称" min-width="100" />
        <el-table-column prop="storeName" label="门店名称" min-width="100" />

        <el-table-column prop="amount" label="应付合计(元)" min-width="120" />
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
                @click="showDetail(scope.row)"
                >结算</span
              >
              <span v-else class="btn mr-5" @click="showDetail(scope.row)"
                >查看</span
              >
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
      <el-dialog
        v-model="dialogVisible"
        width="50%"
        @close="dialogVisible = false"
        title="空间费用结算"
      >
        <el-descriptions
          :column="2"
          label-position="left"
          label-width="auto"
          border
          class="justify-around"
        >
          <el-descriptions-item label="费用单号">{{
            formData.amountNo
          }}</el-descriptions-item>
          <el-descriptions-item label="销售订单号">{{
            formData.orderId
          }}</el-descriptions-item>
          <el-descriptions-item label="商户名称">{{
            formData.companyName
          }}</el-descriptions-item>
          <el-descriptions-item label="门店名称">{{
            formData.storeName
          }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            {{
              orderStatusOptions.find(
                (item: any) => item.value == formData.orderStatus
              )?.label
            }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
          :column="3"
          :border="true"
          title="空间信息"
          style="margin-top: 20px; margin-bottom: 20px"
        >
          <!-- 空间信息 -->

          <el-descriptions-item label="展位(m2):">
            {{ formData.booth }}
          </el-descriptions-item>
          <el-descriptions-item label="展位单价(元):">
            {{ formData.booth_standard }}
          </el-descriptions-item>
          <el-descriptions-item label="展位费用(元):">
            {{ formData.booth_fee }}
          </el-descriptions-item>
          <el-descriptions-item label="仓储(m2):">
            {{ formData.storage }}
          </el-descriptions-item>
          <el-descriptions-item label="仓储单价(元):">
            {{ formData.storage_standard }}
          </el-descriptions-item>
          <el-descriptions-item label="仓储费用(元):">
            {{ formData.storage_fee }}
          </el-descriptions-item>
          <el-descriptions-item label="堆头(m2):">
            {{ formData.stack }}
          </el-descriptions-item>
          <el-descriptions-item label="堆头单价(元):">
            {{ formData.stack_standard }}
          </el-descriptions-item>
          <el-descriptions-item label="堆头费用(元):">
            {{ formData.stack_fee }}
          </el-descriptions-item>
          <el-descriptions-item label="合计费用(元):">
            {{ formData.total_fee }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- <el-descriptions :column="2" label-width="auto">
          <el-descriptions-item label="付款方式">
            <el-select
              :disabled="formData.orderStatus == 'SETTLED'"
              v-model="paymentMethod"
              placeholder="请选择付款方式"
              style="width: 300px"
            >
              <el-option
                v-for="item in methodOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              /> </el-select
          ></el-descriptions-item>
        </el-descriptions> -->

        <el-row justify="center" class="mt-10">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-popconfirm
            width="220"
            confirm-button-text="确定"
            cancel-button-text="取消"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="确定要结算吗?"
            @confirm="settle"
          >
            <template #reference>
              <el-button
                v-if="formData.orderStatus == 'UNSETTLED'"
                type="primary"
                >结算</el-button
              >
            </template>
          </el-popconfirm>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'
import {
  supplierCompanyOptions,
  supplierStoreOptions
} from '@/api/procure/supplierSellOrder'

import { spaceExpenseList, spaceExpenseSettle } from '@/api/spaceExpense/index'
import DateUtil from '@/utils/getDate'
const dateRange = ref()
const companyOptions = ref<any>([])
const storeOptions = ref<any>([])
const formData: any = ref({})
const paymentMethod = ref(1) //付款方式
const orderStatusOptions = ref<any>([
  { label: '未结算', value: 'UNSETTLED' },
  { label: '已结算', value: 'SETTLED' }
])
const methodOptions = ref<any>([
  { label: '第三方支付平台', value: 1 },
  { label: '其他', value: 2 }
])
const dataList = ref<any>([])
const tableList = ref([])
const pager = ref<any>({ total: 0, page: 1, pageSize: 10 })
const activeDateType = ref<any>('')

const dialogVisible = ref(false)
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

const showDetail = (data = {}) => {
  dialogVisible.value = true
  formData.value = Object.assign({}, data)
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
  companyId: '',
  storeId: '',
  orderStatus: ''
})
const isLoading = ref(false)

onMounted(() => {
  doGetCompanyOptions()
  fetchProductList()
})
//结算
const settle = async () => {
  await spaceExpenseSettle({
    id: formData.value.amountNo
    // paymentMethod: paymentMethod.value
  })
  dialogVisible.value = false
  ElMessage.success('结算成功')
  fetchProductList()
}

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
  const res = await spaceExpenseList(req)
  dataList.value = res.data.items
  pager.value.total = res.data.total
  isLoading.value = false
}

const resetSearch = () => {
  Object.keys(formInline).forEach((key) => {
    formInline[key] = ''
  })
  dateRange.value = []
  // 不高亮任何地方 如果写成固定值，则第二次执行该语句时el-menu不会更新视图
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
