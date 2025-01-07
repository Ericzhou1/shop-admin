<template>
  <div>
    <!-- 发货订单 -->
    <div class="app-container">
      <el-row justify="space-between">
        <el-col :span="8">
          <DaterangeSelect
            class="w-full"
            v-model:startDate="startDate"
            v-model:endDate="endDate"
            @change="getList"
          />
        </el-col>
        <el-col :span="12" class="flex">
          <el-input
            v-model="reqData.purchaseNo"
            placeholder="请输入销售单号"
            class="mr-2"
          />
          <el-input
            v-model="reqData.trackingNo"
            placeholder="请输入物流单号"
            class="mr-2"
          />
          <!-- <el-select
            v-model="reqData.status"
            style="width: 100%"
            placeholder="请选择订单状态"
            class="mr-2"
          >
            <el-option
              v-for="item in orderStatusOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select> -->
          <el-button type="primary" @click="getList" icon="Search">
            搜索
          </el-button>
          <el-button type="primary" @click="resetSearch" icon="RefreshRight">
            重置搜索
          </el-button>
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
        <el-table-column
          prop="purchaseOrderNo"
          label="销售单号"
          min-width="150"
        />
        <el-table-column prop="no" label="发货单号" min-width="150" />
        <el-table-column
          prop="deliveryAddress"
          label="发货地址"
          min-width="150"
        />
        <el-table-column
          prop="purchaseOrderStock"
          label="总采购数量"
          min-width="150"
        />
        <el-table-column
          prop="deliveredStock"
          label="发货件数"
          min-width="150"
        />
        <el-table-column prop="created" label="创建时间" min-width="120" />

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
              <!-- 查看详情 -->

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
        layout="prev, pager, next, sizes, jumper"
        :total="pager.total"
        :page-sizes="[10, 20, 30, 40]"
        v-model:current-page="pager.page"
        v-model:page-size="pager.pageSize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        justify="center"
      />
      <el-dialog
        v-model="dialogVisible"
        title="订单详情"
        width="70%"
        style="min-width: 1037px"
        @close="closeDia"
      >
        <OrderInfo
          v-if="dialogVisible"
          ref="infoRef"
          @option-success="optionSuccess"
          @close-dialog="closeDia"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  orderStatusOptions,
  purOrderStatusOptions,
  deliveryList
} from '@/api/orderManager'
import DateUtil from '@/utils/getDate'
import OrderInfo from './OrderInfo.vue'

const startDate = ref()
const endDate = ref()
const pager = ref<any>({ page: 1, size: 10, total: 0 })

const reqData = ref({
  purchaseNo: undefined,
  trackingNo: undefined
})
const dataList = ref([])
const isLoading = ref(false)
const dialogVisible = ref(false)
const infoRef = ref()

onMounted(() => {
  startDate.value = DateUtil.getDay(0, '-')
  endDate.value = DateUtil.getDay(0, '-')
  getList()
})
const resetSearch = () => {
  reqData.value = {
    trackingNo: undefined,
    purchaseNo: undefined
  }
  getList()
}
const getList = async () => {
  try {
    const req = {
      ...reqData.value,
      page: pager.value.page,
      size: pager.value.size,
      startDate: startDate.value,
      endDate: endDate.value
    }
    const res = await deliveryList(req)
    dataList.value = res.data.items
    pager.value.total = res.data.total
  } catch (e: any) {
    console.log(e)
  }
}

const readInfo = (data: any) => {
  dialogVisible.value = true
  nextTick(() => {
    infoRef.value.update(data)
  })
}

function closeDia() {
  dialogVisible.value = false
  nextTick(() => {
    infoRef.value?.cleanData()
  })
}
// 操作成功
function optionSuccess() {
  dialogVisible.value = false
  infoRef.value.cleanData()
  getList()
}

// 表格样式
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
</script>
