<template>
  <el-dialog :model-value="visible" title="订单发送货" append-to-body @close="close">
    <el-form ref="userFormRef" :model="formData" label-suffix=":" label-width="80px">
      <!-- <el-row>
        <el-col :lg="7" :xs="24">
          <el-form-item label="收货人" prop="consignee">
            <el-input v-model="formData.consignee" placeholder="请输入收货人" />
          </el-form-item>
        </el-col>
        <el-col :lg="7" :xs="24">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="formData.phone" placeholder="联系电话" />
          </el-form-item>
        </el-col>
        <el-col :lg="7" :xs="24">
          <el-form-item label="收货地址" prop="address">
            <el-input v-model="formData.address" placeholder="联系电话" />
          </el-form-item>
        </el-col>
        <el-col :lg="3" :xs="24" class="modify">
          <el-button type="primary" @click="handleSubmit">修 改</el-button>
        </el-col>
      </el-row> -->
      <!-- <el-form-item label="选择类型" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio :value="1">发货</el-radio>
          <el-radio :value="2">无需配送</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="快递公司" prop="code">
        <el-select
          v-model="formData.code"
          placeholder="请选择快递公司"
          clearable
          class="!w-[100%]"
          @change="changeExpress"
        >
          <el-option
            v-for="item in expressTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
          <!-- <el-option label="正常" :value="1" />
          <el-option label="禁用" :value="0" /> -->
        </el-select>
      </el-form-item>
      <el-form-item label="快递单号" prop="no">
        <el-input v-model="formData.no" placeholder="请输入快递单号" />
        <div class="tips">请准确输入单号，保证收件人为订单内填写收件人电话和手机号</div>
      </el-form-item>
      <!-- <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="备注" />
      </el-form-item> -->
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import Api from '@/api/index'
import { expressTypeOptions } from '../expressTypeOptions'
defineOptions({
  name: 'deliveryDialog',
})

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
const emits = defineEmits(['update:visible', 'success'])

watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      formData.sn = props.no
    }
  }
)

const close = () => {
  emits('update:visible', false)
}

const formData = reactive({
  code: '', // 快递公司
  name: '', // 快递公司
  no: '', // 收货地址
  // type: 1, // 选择类型
  sn: '', // 快递公司
  remark: undefined,
})

const changeExpress = (value: any) => {
  let label = ''
  expressTypeOptions.forEach((item) => {
    if (item.value === value) {
      label = item.label
    }
  })
  formData.name = label
}

// 提交用户表单（防抖）
const handleSubmit = useDebounceFn(async () => {
  await Api.OrderApi.orderDelivery(formData)
  close()
  emits('success')
  // userFormRef.value.validate((valid: boolean) => {
  //   if (valid) {
  //     const userId = formData.id
  //     loading.value = true
  //     if (userId) {
  //       UserAPI.update(userId, formData)
  //         .then(() => {
  //           ElMessage.success('修改用户成功')
  //           handleCloseDialog()
  //           handleResetQuery()
  //         })
  //         .finally(() => (loading.value = false))
  //     } else {
  //       UserAPI.add(formData)
  //         .then(() => {
  //           ElMessage.success('新增用户成功')
  //           handleCloseDialog()
  //           handleResetQuery()
  //         })
  //         .finally(() => (loading.value = false))
  //     }
  //   }
  // })
}, 1000)
</script>

<style lang="scss" scoped>
.modify {
  display: flex;
  justify-content: flex-end;
}

.tips {
  font-weight: bolder;
  color: #d7d7d7;
}
</style>
