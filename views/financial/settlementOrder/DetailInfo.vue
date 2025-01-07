<template>
  <div>
    <el-descriptions :column="4">
      <el-descriptions-item label="商品件数">{{
        infoData.productStock
      }}</el-descriptions-item>
      <el-descriptions-item label="商品项数">{{
        infoData.productCount
      }}</el-descriptions-item>
      <el-descriptions-item label="总金额">
        {{ infoData.billAmount }}
      </el-descriptions-item>
      <el-descriptions-item label="日期">
        {{ infoData.billDate }}
      </el-descriptions-item>
    </el-descriptions>
    <el-table :data="dataList" height="300">
      <el-table-column prop="productEan13" label="条码" min-width="120" />
      <el-table-column prop="purchaseOrderNo" label="销售单号" min-width="80" />
      <el-table-column prop="productName" label="商品名称" min-width="80" />
      <el-table-column prop="productCount" label="商品件数" min-width="80" />
      <el-table-column
        prop="productSettlePrice"
        label="结算单价"
        min-width="80"
      />
      <el-table-column prop="productAmount" label="结算总价" min-width="80">
        <template #default="scope">
          <div
            v-if="scope.row.eventType === 'refund'"
            style="color: red"
            class="flex items-center"
          >
            {{ scope.row.productAmount }}
            <img
              src="/src/assets/images/return.jpg"
              alt=""
              style="width: 30px"
            />
          </div>
          <span v-else>{{ scope.row.productAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderCreated" label="订单时间" width="100" />
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
    <!-- <el-dialog
      v-model="dialogVisible"
      title="查看详情"
      width="70%"
      style="min-width: 1037px"
      class="product-info-dia"
      @close="closeDia"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { billListDetail, billDetail } from '@/api/financial'

const pager = ref<any>({
  page: 1,
  size: 10,
  total: 0
})
const infoData = ref<any>({})
const dataList = ref([])

const update = async (no: any) => {
  const res = await billDetail({ no: no })
  infoData.value = res.data
  getList()
}

const getList = async () => {
  const req = {
    page: pager.value.page,
    size: pager.value.size,
    no: infoData.value.orderNo
  }
  const res = await billListDetail(req)
  dataList.value = res.data.items
  pager.value.total = res.data.total
}
const cleanData = () => {
  infoData.value = {}
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
defineExpose({
  update,
  cleanData
})
</script>
