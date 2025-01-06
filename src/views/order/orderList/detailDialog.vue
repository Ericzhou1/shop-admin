<template>
  <el-dialog
    :model-value="visible"
    title="订单详情"
    width="80vw"
    class="order-detail-dialog"
    align-center
    append-to-body
    @close="close"
  >
    <div class="container">
      <!-- <el-card class="mb-10px">
        <el-steps :active="1" align-center>
          <el-step title="提交订单" description="2017-07-19 15:43:23" />
          <el-step title="支付订单" description="未支付" />
          <el-step title="发货" />
          <el-step title="确认收货" />
          <el-step title="完成评价" />
        </el-steps>
      </el-card> -->
      <el-card>
        <el-descriptions class="mb-20px" title="基本信息" direction="vertical" :column="6" border>
          <el-descriptions-item label="订单编号">{{ orderInfo.no }}</el-descriptions-item>
          <el-descriptions-item label="发货单流水号">待开发</el-descriptions-item>
          <el-descriptions-item label="用户账号">{{ orderInfo.nickName }}</el-descriptions-item>
          <el-descriptions-item label="支付方式">
            {{ orderStore.PayTypeEnum[orderInfo.payType] }}
          </el-descriptions-item>
          <el-descriptions-item label="订单来源">
            {{ orderStore.ChannelEunm[orderInfo.channel] }}
          </el-descriptions-item>
          <el-descriptions-item label="订单类型">
            {{ orderStore.TypeEnum[orderInfo.type] }}
          </el-descriptions-item>
          <el-descriptions-item label="配送方式">待开发</el-descriptions-item>
          <el-descriptions-item label="物流单号">待开发</el-descriptions-item>
          <el-descriptions-item label="自动确认收货时间">待开发</el-descriptions-item>
          <el-descriptions-item label="订单可得分佣">待开发</el-descriptions-item>
          <el-descriptions-item label="订单可得积分">待开发</el-descriptions-item>
          <el-descriptions-item label="活动信息">待开发</el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="mb-20px" title="发货信息" direction="vertical" :column="4" border>
          <el-descriptions-item label="快递公司编码">{{ shopping.code }}</el-descriptions-item>
          <el-descriptions-item label="快递公司">{{ shopping.name }}</el-descriptions-item>
          <el-descriptions-item label="物流单号">{{ shopping.no }}</el-descriptions-item>
          <el-descriptions-item label="运费">待开发</el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="mb-20px" title="发票信息" direction="vertical" :column="4" border>
          <el-descriptions-item label="发票类型">待开发</el-descriptions-item>
          <el-descriptions-item label="发票抬头">待开发</el-descriptions-item>
          <el-descriptions-item label="发票内容">待开发</el-descriptions-item>
          <el-descriptions-item label="收票人信息">待开发</el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="mb-20px" title="收货人信息" direction="vertical" :column="4" border>
          <el-descriptions-item label="收货人">{{ orderInfo.consignee }}</el-descriptions-item>
          <el-descriptions-item label="手机号码">{{ orderInfo.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮政编码">待开发</el-descriptions-item>
          <el-descriptions-item label="收货地址">{{ orderInfo.address }}</el-descriptions-item>
        </el-descriptions>
        <div class="el-descriptions__header">
          <div class="el-descriptions__title">商品信息</div>
        </div>
        <el-table class="mb-20px" :data="orderInfo.items">
          <el-table-column label="商品图片" align="center">
            <template #default="scope">
              <el-image
                class="main-image mr-4"
                :src="scope.row.mainImage"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[scope.row.mainImage]"
                :initial-index="4"
                preview-teleported
                fit="cover"
              />
            </template>
          </el-table-column>
          <el-table-column label="商品名称" prop="name" align="center">
            <template #default="scope" />
          </el-table-column>
          <el-table-column label="价格" prop="price" align="center">
            <template #default="scope" />
          </el-table-column>
          <el-table-column label="货号" prop="skuNo" align="center">
            <template #default="scope" />
          </el-table-column>
          <el-table-column label="属性" align="center">
            <template #default="scope">
              <span v-for="(specs, index) in scope.row.specs" :key="index">
                | {{ specs.name }}: {{ specs.value }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="num" align="center">
            <template #default="scope" />
          </el-table-column>
          <el-table-column label="小计" prop="realAmount" align="center">
            <template #default="scope" />
          </el-table-column>
        </el-table>
        <el-descriptions class="mb-20px" title="费用信息" direction="vertical" :column="4" border>
          <el-descriptions-item label="商品合计">¥{{ orderInfo.goodsAmount }}</el-descriptions-item>
          <el-descriptions-item label="运费">¥待开发</el-descriptions-item>
          <el-descriptions-item label="优惠券">-¥待开发</el-descriptions-item>
          <el-descriptions-item label="优币抵扣">-¥待开发</el-descriptions-item>
          <el-descriptions-item label="活动优惠">-¥待开发</el-descriptions-item>
          <el-descriptions-item label="折扣金额">-¥待开发</el-descriptions-item>
          <el-descriptions-item label="订单总金额">¥{{ orderInfo.amount }}</el-descriptions-item>
          <el-descriptions-item label="应付款金额">
            ¥{{ orderInfo.paidAmount }}
          </el-descriptions-item>
        </el-descriptions>
        <!-- <div class="el-descriptions__header">
          <div class="el-descriptions__title">操作信息</div>
        </div>
        <el-table class="mb-20px">
          <el-table-column label="操作者" align="center">
            <template #default="scope" />
          </el-table-column>
          <el-table-column label="操作时间" align="center">
            <template #default="scope" />
          </el-table-column>
          <el-table-column label="订单状态" align="center">
            <template #default="scope" />
          </el-table-column>
          <el-table-column label="付款状态" align="center">
            <template #default="scope" />
          </el-table-column>
          <el-table-column label="发货状态" align="center">
            <template #default="scope" />
          </el-table-column>
          <el-table-column label="备注" align="center">
            <template #default="scope" />
          </el-table-column>
        </el-table> -->
      </el-card>
    </div>
  </el-dialog>
</template>
<script setup>
import Api from '@/api/index'
import { useOrderStore } from '@/store'

defineOptions({
  name: 'detailDialog',
})

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
const orderInfo = reactive({})
const shopping = reactive({})
const getDetailData = async () => {
  const data = await Api.OrderApi.getDetailData({ no: String(props.no) })
  Object.assign(orderInfo, data.orderInfo)
  Object.assign(shopping, data.shopping[0])
}
const close = () => {
  emits('update:visible', false)
}
</script>
<style scoped>
.order-detail-dialog {
  .container {
    height: 80vh;
    overflow: auto;

    .main-image {
      width: 50px;
      height: 50px;
    }
  }
}
</style>
