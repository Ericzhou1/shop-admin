<template>
  <div class="notes-payable app-container">
    <!-- 结算订单 -->
    <el-row justify="space-between">
      <el-col :span="20" class="flex">
        <DaterangeSelect
          v-model:startDate="startDate"
          v-model:endDate="endDate"
          @change="getList"
        />
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
      <el-table-column prop="orderNo" label="单据编号" min-width="120" />
      <el-table-column prop="productCount" label="商品项数" min-width="80" />
      <el-table-column prop="productStock" label="商品件数" min-width="80" />
      <el-table-column prop="billAmount" label="结算金额" min-width="80" />
      <el-table-column prop="created" label="创建时间" min-width="80" />
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
      title="查看详情"
      width="70%"
      style="min-width: 1037px"
      class="product-info-dia"
      @close="closeDia"
    >
      <DetailInfo v-if="dialogVisible" ref="infoRef" @close-dialog="closeDia" />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import {
  InfoFilled,
  Search,
  Filter,
  RefreshRight
} from '@element-plus/icons-vue'
import DateUtil from '@/utils/getDate'
import DetailInfo from './DetailInfo.vue'
import { billList } from '@/api/financial'

const pager = ref<any>({
  page: 1,
  size: 10,
  total: 0
})
const startDate = ref()
const endDate = ref()
const dataList = ref([])
const isLoading = ref(false)

const dialogVisible = ref(false)
const infoRef = ref()

const supplierOption = ref<any>([])

onMounted(() => {
  startDate.value = DateUtil.getDay(0, '-')
  endDate.value = DateUtil.getDay(0, '-')
  getList()
})

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
const getList = async () => {
  try {
    const req = {
      endDate: endDate.value,
      page: pager.value.page,
      size: pager.value.size,
      startDate: startDate.value
    }
    const res = await billList(req)
    dataList.value = res.data.items
    pager.value.total = res.data.total
  } catch (e: any) {
    console.log(e)
  }
}
const resetSearch = () => {}
const readInfo = (data: any) => {
  dialogVisible.value = true
  nextTick(() => {
    infoRef.value.update(data.orderNo)
  })
}
function closeDia() {
  dialogVisible.value = false
  nextTick(() => {
    infoRef.value?.cleanData()
  })
}
</script>
