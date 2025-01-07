<template>
  <div>
    <el-form
      ref="formRef"
      :model="formData"
      label-width="auto"
      :inline="true"
      class="el-form"
      :rules="formRules"
    >
      <el-row style="padding: 0">
        <el-col :span="6" class="pr-3">
          <el-form-item
            label="快递公司:"
            prop="trackCompanyCode"
            required
            style="width: 100%"
          >
            <el-select
              v-model="formData.trackCompanyCode"
              style="width: 100%"
              filterable
            >
              <el-option
                v-for="item in expressTypeOptions"
                :value="item.value"
                :label="item.label"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="pr-3">
          <el-form-item label="物流单号:" prop="trackingNo" required>
            <el-input
              v-model="formData.trackingNo"
              placeholder="请输入物流单号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6" class="pr-3">
          <el-form-item label="送货地址:" prop="deliveryAddress" requried>
            <el-input
              v-model="formData.deliveryAddress"
              placeholder="请输入送货地址"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="deliverProducts" height="300">
      <el-table-column prop="ean13" label="商品条码" min-width="120" />
      <el-table-column prop="name" label="商品名称" min-width="80" />
      <el-table-column prop="quantity" label="单据总件数" min-width="80" />
      <el-table-column prop="deliveryStock" label="已发货" min-width="80" />
      <el-table-column prop="deliverCount" label="发货件数" min-width="120">
        <template #default="scope">
          <el-input-number
            :min="0"
            v-model="scope.row.deliverCount"
            :disabled="scope.row.shipped === scope.row.deliverCount"
            :precision="0"
          />
        </template>
      </el-table-column>
    </el-table>
    <div class="text-center">
      <el-button @click="save" type="primary">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { deliverGood } from '@/api/orderManager'
import { expressTypeOptions } from '@/api/orderManager/expressTypeOptions'

const props = defineProps({
  dataList: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['option-success', 'close-dialog'])

const formRef = ref()
// 发货请求参数
const formData = ref<any>({
  trackingNo: '',
  deliveryAddress: '',
  purchaseOrderId: '',
  products: []
})
const formRules = computed(() => {
  return {
    trackCompanyCode: [
      {
        required: true,
        trigger: 'blur',
        message: '请选择快递公司'
      }
    ],
    trackingNo: [
      {
        required: true,
        trigger: 'blur',
        message: '请输入物流单号'
      }
    ],
    deliveryAddress: [
      {
        required: true,
        trigger: 'blur',
        message: '请输入送货地址'
      }
    ]
  }
})
const deliverProducts = ref<any>([])

const update = (data: any) => {
  // 发货地址默认为下单门店地址
  formData.value.deliveryAddress = data.location
  formData.value.purchaseOrderId = data.id
  deliverProducts.value = props.dataList.map((item: any) => {
    // 默认发货件数等于单据件数
    item.deliverCount = item.quantity - item.deliveryStock
    return item
  })
}
const cleanData = () => {
  formData.value = {}
  deliverProducts.value = []
}
// 发货
const save = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const list = deliverProducts.value.filter(
          (item: any) => item.deliverCount
        )
        if (!list.length) {
          ElMessage.warning('暂无发货商品！请填写发货数量！')
          return
        }
        formData.value.products = list.map((item: any) => {
          return {
            purchaseOrderProductId: item.id,
            stock: String(item.deliverCount)
          }
        })
        await deliverGood(formData.value)
        emit('option-success')
        ElMessage.success('操作成功！')
      } catch (e: any) {
        console.log(111)
        ElMessage.error('操作失败！')
        emit('option-success')
      }
    }
  })
}
defineExpose({
  update,
  cleanData
})
</script>
