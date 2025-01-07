<template>
  <div class="app-container">
    <el-row justify="space-between">
      <el-col :span="8">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-change="getList">
          <el-tab-pane label="可提现" :name="1" />
          <el-tab-pane label="待提现" :name="2" />
          <el-tab-pane label="已提现" :name="3" />
        </el-tabs>
      </el-col>
      <el-col :span="10">
        <DaterangeSelect
          v-model:startDate="startDate"
          v-model:endDate="endDate"
          @change="getList"
        />
      </el-col>
    </el-row>

    <el-row>
      <el-card class="w-50 mr-7">
        <el-row> 当前总收益 </el-row>
        <el-row color="#f67e3d"> ￥ {{ supplierInfo.totalRevenue }} </el-row>
      </el-card>
      <el-card class="w-50 mr-7">
        <el-row>
          {{
            typeOptions.find((item: any) => item.id === activeName)?.name
          }}金额
        </el-row>
        <el-row color="#f67e3d" justify="space-between" items="center">
          ￥
          {{
            supplierInfo[
              typeOptions.find((item: any) => item.id === activeName)!.key
            ]
          }}
          <span v-if="activeName === 1" class="btn" @click="apply"
            >申请提现</span
          >
        </el-row>
      </el-card>
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
      row-key="id"
    >
      <el-table-column prop="orderNo" label="单据编号" min-width="120" />

      <el-table-column
        prop="amount"
        :label="activeName === 1 ? '变动金额' : '提现金额'"
        min-width="80"
      />

      <el-table-column v-if="activeName === 1" label="当前余额" min-width="80">
        <template #default="scope">
          {{ (Number(scope.row.before) + Number(scope.row.amount)).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="单据状态" min-width="80">
        <template #default="scope">
          {{
            activeName === 1
              ? allStatusMap[scope.row.type]
              : statusMap[scope.row.status]
          }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="activeName === 1"
        prop="created"
        label="单据时间"
        min-width="80"
      />
      <el-table-column
        v-if="activeName !== 1"
        prop="created"
        label="发起提现时间"
        min-width="80"
      />
      <el-table-column
        v-if="activeName === 3"
        prop="auditAt"
        label="提现时间"
        min-width="80"
      />
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <div class="operation">
            <!-- 查看明细 -->
            <svg-icon
              icon-class="info"
              @click="readInfo(scope.row)"
              size="20px"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next, sizes, jumper "
      :total="pager.total"
      :page-sizes="[10, 20, 30, 40]"
      v-model:current-page="pager.page"
      v-model:page-size="pager.size"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      justify="end"
      class="page-footer"
    />
    <el-dialog
      v-model="dialogVisible"
      :title="dialogName"
      :width="operationType === 'add' ? '40%' : '70%'"
      :style="{ minWidth: operationType === 'add' ? '637px' : '973' }"
      class="product-info-dia"
      @close="closeDia"
    >
      <template v-if="dialogVisible">
        <DetailInfo v-if="infoType === 'audit'" ref="settleRef" />
        <ActDetailInfo
          v-else
          ref="infoRef"
          :type="operationType"
          :tab="activeName"
          :allStatusMap="allStatusMap"
          :supplierInfo="supplierInfo"
          @close-dialog="closeDia"
          @option-success="optionSuccess"
        />
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import DateUtil from '@/utils/getDate'
import { getsupplierInfo } from '../../../api/merchant/companyInformation'
import ActDetailInfo from './ActDetailInfo.vue'
import DetailInfo from '../settlementOrder/DetailInfo.vue'
import { supplierRecord, withdrawList } from '@/api/financial'
const startDate = ref()
const endDate = ref()
const pager = ref<any>({
  page: 1,
  size: 10,
  total: 0
})
const typeOptions = [
  {
    id: 1,
    name: '可提现',
    key: 'balance'
  },
  {
    id: 2,
    name: '未提现',
    key: 'pendingWithdrawal'
  },
  {
    id: 3,
    name: '已提现',
    key: 'withdrawal'
  }
]
const statusMap: any = {
  1: '待审核',
  2: '已审核',
  3: '已驳回'
}
const allStatusMap: any = {
  audit: '审核进账',
  withdraw: '申请提现',
  withdraw_return: '提现退回'
}
const activeName = ref(1)
const dataList = ref([
  {
    id: 1
  }
])
const isLoading = ref(false)
const supplierInfo = ref<any>({})
const dialogVisible = ref(false)
const dialogName = ref()
const operationType = ref()
const infoRef = ref()
const infoType = ref()
const settleRef = ref()

onMounted(() => {
  startDate.value = DateUtil.getDay(0, '-')
  endDate.value = DateUtil.getDay(0, '-')
  getInfo()
  getList()
})
const getInfo = async () => {
  const res = await getsupplierInfo()
  supplierInfo.value = res.data
}
const getList = async () => {
  try {
    dataList.value = []
    isLoading.value = true
    const req = {
      endDate: endDate.value,
      startDate: startDate.value,
      page: pager.value.page,
      size: pager.value.size,
      status:
        activeName.value === 2 ? 1 : activeName.value === 3 ? 2 : undefined
    }
    if (activeName.value === 1) {
      const res = await supplierRecord(req)
      dataList.value = res.data.items
      pager.value.total = res.data.total
      isLoading.value = false
    } else {
      const res = await withdrawList(req)
      dataList.value = res.data.items
      pager.value.total = res.data.total
      isLoading.value = false
    }
  } catch (e: any) {
    isLoading.value = false
  }
}
const readInfo = (data: any) => {
  operationType.value = 'info'
  dialogName.value = '查看详情'
  dialogVisible.value = true
  infoType.value = data.type
  if (infoType.value === 'audit') {
    nextTick(() => {
      settleRef.value.update(data.orderNo)
    })
  } else {
    nextTick(() => {
      infoRef.value?.update(data)
    })
  }
}
// 点击申请提现
const apply = () => {
  dialogVisible.value = true
  dialogName.value = '申请提现'
  operationType.value = 'add'
}

const tableRowClassName = (row: any) => {
  if (row.rowIndex % 2 == 0) {
    return 'even-row'
  } else {
    return 'odd-row'
  }
}

const handleSizeChange = (val: number) => {
  pager.value.size = val
  getList()
}
// 切换分页
const handleCurrentChange = (val: number) => {
  pager.value.page = val
  getList()
}
function closeDia() {
  dialogVisible.value = false
  infoType.value = ''
  nextTick(() => {
    infoRef.value?.cleanData()
  })
}
// 操作成功
function optionSuccess(unNeedClose?: boolean) {
  // dialogVisible.value = false
  // infoRef.value.cleanData()
  getList()
  getInfo()

  // 不需要关闭弹窗
  if (unNeedClose) return
  closeDia()
}
</script>

<style lang="scss" scoped>
:deep(.el-tabs__nav-wrap::after) {
  background-color: unset;
}
</style>
