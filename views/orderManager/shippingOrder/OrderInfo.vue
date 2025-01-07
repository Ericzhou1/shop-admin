<template>
  <div>
    <el-descriptions :column="4">
      <el-descriptions-item label="销售单号：">{{
        infoData.purchaseOrderId
      }}</el-descriptions-item>
      <el-descriptions-item label="发货单号:">{{
        infoData.no
      }}</el-descriptions-item>
      <!-- <el-descriptions-item label="采购方:">{{
        infoData.num
      }}</el-descriptions-item> -->
      <el-descriptions-item label="总采购数量:">
        {{ infoData.purchaseOrderStock }}
      </el-descriptions-item>
      <el-descriptions-item label="商品项数:">
        {{ infoData.itemCount }}
      </el-descriptions-item>
      <el-descriptions-item label="发货件数:">
        {{ infoData.deliveredStock }}
      </el-descriptions-item>
      <el-descriptions-item label="发货时间:">
        {{ infoData.created }}
      </el-descriptions-item>
      <el-descriptions-item label="发货地址:">
        {{ infoData.deliveryAddress }}
      </el-descriptions-item>
      <el-descriptions-item label="物流单号:">
        {{ infoData.trackingNo }}
      </el-descriptions-item>
    </el-descriptions>
    <el-table :data="dataList" height="300">
      <el-table-column prop="ean13" label="条码" min-width="80" />
      <el-table-column prop="name" label="商品名称" min-width="80" />
      <el-table-column prop="totalQuantity" label="单据总件数" min-width="80" />
      <el-table-column prop="deliveredQuantity" label="发货件数" min-width="80">
        <template #default="scope">
          <el-input-number
            v-model="scope.row.deliveredQuantity"
            :disabled="disabled"
            :min="0"
            :precision="0"
        /></template>
      </el-table-column>
    </el-table>
    <div class="text-center">
      <el-button type="primary" @click="disabled = false" v-if="disabled"
        >修改</el-button
      >
      <el-button v-else type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  orderStatusOptions,
  purOrderStatusOptions,
  deliveryProList,
  deliveryUpdate
} from '@/api/orderManager'
const emit = defineEmits(['option-success', 'close-dialog'])
const infoData = ref<any>({})
const dataList = ref([])
const dialogVisible = ref()
const infoRef = ref()
const disabled = ref(true)

const update = (data: any) => {
  infoData.value = data
  deliveryProList({ deliveryOrderId: infoData.value.id }).then((res: any) => {
    dataList.value = res.data.items
  })
}
const cleanData = () => {
  infoData.value = {}
}
const save = async () => {
  try {
    const products = dataList.value.map((item: any) => {
      return {
        deliveryOrderProductId: item.id,
        stock: String(item.deliveredQuantity)
      }
    })
    const req = {
      no: infoData.value.no,
      products: products
    }
    await deliveryUpdate(req)
    emit('option-success')
    ElMessage.success('操作成功！')
  } catch (e: any) {
    console.log(e)
  }
}

defineExpose({
  update,
  cleanData
})
</script>
