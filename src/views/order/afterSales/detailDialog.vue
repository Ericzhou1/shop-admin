<template>
  <el-dialog :model-value="visible" title="订单信息" width="80vw" align-center @close="closeDio">
    <div class="content">
      <el-descriptions title="收获信息" :column="2">
        <!-- <template #extra>
          <el-button type="primary">复制</el-button>
        </template> -->
        <el-descriptions-item label="用户昵称" width="50%">
          {{ orderRefund?.orderInfo?.nickName }}
        </el-descriptions-item>
        <el-descriptions-item label="收货人">
          {{ orderRefund?.orderInfo?.username }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">
          {{ orderRefund?.orderInfo?.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="收货地址">
          {{ orderRefund?.orderInfo?.address }}
        </el-descriptions-item>
      </el-descriptions>
      <el-divider />
      <el-descriptions title="订单信息" :column="2">
        <el-descriptions-item label="订单ID" width="50%">
          {{ orderRefund?.orderInfo?.no }}
        </el-descriptions-item>
        <el-descriptions-item label="订单状态" class-name="red" label-class-name="red">
          {{ orderStore.FefundStatusEnum[orderRefund?.orderInfo?.status] }}
        </el-descriptions-item>
        <el-descriptions-item label="商品总数">待开发</el-descriptions-item>
        <el-descriptions-item label="商品总价">
          {{ orderRefund?.orderInfo?.amount }}
        </el-descriptions-item>
        <el-descriptions-item label="交付邮费">待开发</el-descriptions-item>
        <el-descriptions-item label="优惠券金额">待开发</el-descriptions-item>
        <el-descriptions-item label="实际支付">
          {{ orderRefund?.orderInfo?.paidAmount }}
        </el-descriptions-item>
        <el-descriptions-item label="退款金额" class-name="orange" label-class-name="orange">
          {{ orderRefund.refund }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ orderRefund.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">待开发</el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1">
        <el-descriptions-item label="支付方式">
          {{ orderStore.PayTypeEnum[orderRefund?.orderInfo?.payType] }}
        </el-descriptions-item>
        <el-descriptions-item label="商家备注">{{ orderRefund.ShopRemark }}</el-descriptions-item>
      </el-descriptions>
      <el-divider />
      <el-descriptions title="物流信息" :column="2">
        <el-descriptions-item label="快递公司" width="50%">--</el-descriptions-item>
        <el-descriptions-item label="快递单号">
          -- &nbsp;&nbsp;&nbsp;
          <!-- <el-button type="primary" size="small">物流查询</el-button> -->
        </el-descriptions-item>
      </el-descriptions>
      <el-divider />
      <el-descriptions title="历史订单" :column="1" />
      <!-- <el-steps direction="vertical" :active="1" :space="100">
        <el-step title="Step 1" description="Some description" />
        <el-step title="Step 2" description="Some description" />
        <el-step title="Step 3" description="Some description" />
      </el-steps> -->
      <el-steps :active="shopping[0]?.packageInfo.length + 1" direction="vertical" align-center>
        <el-step
          v-for="item in shopping[0]?.packageInfo"
          :title="item.acceptTime + ' (' + item.location + ' )'"
          :description="item.acceptStation"
        />
      </el-steps>
    </div>
  </el-dialog>
</template>
<script setup>
import Api from '@/api/index'
import { useOrderStore } from '@/store'
const orderStore = useOrderStore()

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false,
  },
  no: {
    type: String,
    required: true,
  },
})
let { visible } = toRefs(props)
const emits = defineEmits(['update:visible'])
watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      getDetailData()
    }
  }
)

const orderRefund = reactive({})
const shopping = ref([])
const getDetailData = async () => {
  const data = await Api.OrderApi.getRefundDetail({ no: String(props.no) })
  Object.assign(orderRefund, data.orderRefund)
  shopping.value = data.shopping
}
const closeDio = () => {
  emits('update:visible', false)
}
</script>
<style scoped>
.content {
  height: 80vh;
  overflow-y: scroll;
}
:deep(.orange) {
  color: orange !important;
}
:deep(.red) {
  color: red !important;
}
</style>
