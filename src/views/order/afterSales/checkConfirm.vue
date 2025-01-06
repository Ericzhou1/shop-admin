<template>
  <el-dialog :model-value="visible" title="请修改内容" width="500" @close="closeDio">
    <div class="content">
      <el-form :model="ruleForm" label-width="auto" label-suffix=":">
        <el-form-item label="审核结果" prop="approve">
          <el-radio-group v-model="ruleForm.approve">
            <el-radio :value="true">同意</el-radio>
            <el-radio :value="false">不同意</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="备注" prop="reson">
          <el-input v-model="ruleForm.reson" show-word-limit maxlength="200" type="textarea" />
        </el-form-item> -->
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDio">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import Api from '@/api/index'

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
  type: {
    type: Number,
    required: true,
  },
})
let { visible } = toRefs(props)
const emits = defineEmits(['update:visible', 'success'])
const closeDio = () => {
  emits('update:visible', false)
}
const ruleForm = reactive({
  approve: undefined,
  afterSaleNo: '',
})

// const rules = {
//   result: [{ required: true, message: '请选择结果', trigger: 'blur' }],
//   desc: [{ required: true, message: '请填写备注', trigger: 'blur' }],
// }
const submit = async () => {
  ruleForm.afterSaleNo = props.no
  if (props.type === 1) {
    await Api.OrderApi.fefund(ruleForm)
    emits('success')
    closeDio()
  } else if (props.type === 2) {
    await Api.OrderApi.return(ruleForm)
    emits('success')
    closeDio()
  } else {
    ElMessage.error('无法退货或退款')
  }
}
</script>
