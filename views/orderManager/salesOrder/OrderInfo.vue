<template>
  <div>
    <el-descriptions :column="4">
      <el-descriptions-item label="单据总件数:">{{
        infoData.stock
      }}</el-descriptions-item>
      <el-descriptions-item label="商品项数:">{{
        infoData.itemCount
      }}</el-descriptions-item>
      <el-descriptions-item label="总金额:">
        {{ infoData.amount }}
      </el-descriptions-item>
      <el-descriptions-item label="订单状态:">
        {{
          purOrderStatusOptions.find((s: any) => s.id === infoData.status)?.name
        }}
      </el-descriptions-item>
      <el-descriptions-item label="期望送达时间:">
        {{ infoData.expectedTime }}
      </el-descriptions-item>
      <el-descriptions-item label="送货地址:">
        {{ infoData.location }}
      </el-descriptions-item>
      <el-descriptions-item label="联系人:">
        {{ infoData.contactName }}
      </el-descriptions-item>
      <el-descriptions-item label="手机号:">
        {{ infoData.contactPhone }}
      </el-descriptions-item>
    </el-descriptions>
    <el-table :data="dataList" height="300">
      <el-table-column prop="ean13" label="条码" min-width="80" />
      <el-table-column prop="name" label="商品名称" min-width="80" />
      <el-table-column prop="buyPrice" label="销售价" min-width="80" />
      <el-table-column prop="quantity" label="总采购数量" min-width="80" />
      <el-table-column prop="deliveryStock" label="已发货数量" min-width="80" />
      <el-table-column prop="receiveStock" label="已签收数量" min-width="80" />
    </el-table>
    <div class="text-center">
      <el-button
        @click="deliverGoods"
        type="primary"
        v-if="[2, 3, 4, 6].includes(infoData.status)"
        >发货</el-button
      >
      <el-button
        @click="accept"
        type="primary"
        v-if="isUnRecive && infoData.status === 2"
        >接单</el-button
      >
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="发货"
      width="80%"
      style="min-width: 1037px"
      @close="closeDia"
    >
      <DeliverGoods
        v-if="dialogVisible"
        ref="infoRef"
        :dataList="dataList"
        @option-success="optionSuccess"
        @close-dialog="closeDia"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import DeliverGoods from './DeliverGoods.vue'
import {
  orderProducts,
  purOrderStatusOptions,
  orderRecive
} from '@/api/orderManager'

const emit = defineEmits(['option-success', 'close-dialog'])
const infoData = ref<any>({})
const dataList = ref([])
const dialogVisible = ref()
const infoRef = ref()
const isUnRecive = ref(true)

const update = (data: any) => {
  infoData.value = data
  orderProducts({ purchaseOrderId: data.id }).then((res: any) => {
    dataList.value = res.data.items
  })
}
const cleanData = () => {
  infoData.value = {}
  dataList.value = []
  isUnRecive.value = true
}
// 发货
const deliverGoods = async () => {
  dialogVisible.value = true
  nextTick(() => {
    infoRef.value?.update(infoData.value)
  })
}
// 接单
const accept = async () => {
  try {
    await orderRecive({ ids: [infoData.value.id] })
    emit('option-success', true)
    ElMessage.success('接单成功！')
    isUnRecive.value = false
    infoData.value.status = 3
  } catch (e: any) {
    console.log(e)
    emit('option-success')
  }
}

function closeDia() {
  dialogVisible.value = false
  nextTick(() => {
    infoRef?.value?.cleanData()
  })
}
function optionSuccess(data: any) {
  emit('option-success')
}
defineExpose({
  update,
  cleanData
})
</script>
