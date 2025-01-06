<template>
  <el-form
    ref="formRefThree"
    label-width="auto"
    :model="formData"
    :rules="formRules"
    label-suffix=":"
    class="contentbox"
  >
    <div class="content">
      <!-- 营销设置 -->
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="营销设置" name="first" />
      </el-tabs>
      <el-form-item label="是否推荐" required prop="isRecommend">
        <el-radio-group v-model="formData.isRecommend">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 是否VIP -->
      <el-form-item label="是否VIP(仅自营店铺可见)" required prop="isVip">
        <el-radio-group v-model="formData.isVip">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 商品副标题 -->
      <el-form-item label="商品副标题" prop="subTitle">
        <el-input v-model="formData.subTitle" placeholder="请输入商品副标题" style="width: 500px" />
      </el-form-item>

      <!-- 可售渠道 -->
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="可售渠道" name="first" />
      </el-tabs>
      <el-form-item label="请勾选可售渠道，当前已勾选" required prop="channelIds">
        <span class="channel-count">{{ selectedChannelCount }} 个渠道</span>
      </el-form-item>
      <!-- 渠道列表 -->
      <el-table :data="productStore.ChannelOptions" border>
        <el-table-column width="80" align="center">
          <template #default="scope">
            <el-checkbox v-model="scope.row.selected" @change="handleChannelSelect" />
          </template>
        </el-table-column>
        <el-table-column prop="id" label="渠道编号" align="center" />
        <el-table-column prop="name" label="渠道名称" align="center" />
      </el-table>
    </div>

    <el-row justify="center" class="footer">
      <el-button @click="prevStep">上一步</el-button>
      <el-button type="primary" @click="submitForm">完成</el-button>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import Api from '@/api'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/store/modules/product'
const productStore = useProductStore()
const emit = defineEmits(['changeStep'])
const formRefThree = ref<FormInstance>()
const activeName = ref('first')

// 表单数据
const formData = reactive({
  isRecommend: false, // 是否推荐
  isVip: false, // 是否VIP
  subTitle: '', // 商品副标题
  channelIds: [] as number[], // 选中的渠道ID列表
})
onMounted(() => {
  productStore.getChannel()
})

// 计算选中的渠道数量
const selectedChannelCount = computed(() => {
  return productStore.ChannelOptions.filter((item: any) => item.selected).length
})

// 处理渠道选择变化
const handleChannelSelect = () => {
  formData.channelIds = productStore.ChannelOptions.filter((item: any) => item.selected).map(
    (item: any) => Number(item.id)
  )
}

// 表单验证规则
const formRules = computed(() => ({
  isRecommend: [{ required: true, message: '请选择是否推荐', trigger: 'change' }],
  isVip: [{ required: true, message: '请选择是否VIP', trigger: 'change' }],
  subTitle: [{ max: 200, message: '副标题最多200个字符', trigger: 'blur' }],
  channelIds: [
    {
      required: true,
      message: '请至少选择一个渠道',
      trigger: 'change',
      validator: (rule: any, value: any, callback: any) => {
        if (value.length === 0) {
          callback(new Error('请至少选择一个渠道'))
        } else {
          callback()
        }
      },
    },
  ],
}))
onMounted(() => {
  productStore.ChannelOptions.forEach((item: any) => {
    if (formData.channelIds.includes(Number(item.id))) {
      item.selected = true
    }
  })
})
// 上一步
const prevStep = () => {
  emit('changeStep', 'two', formData)
}

interface Props {
  stepOneData: any
  stepTwoData: any
}

const props = defineProps<Props>()

// 提交表单
const submitForm = async () => {
  if (!formRefThree.value) return

  try {
    await formRefThree.value.validate()
    // 验证通过，传递数据给父组件
    emit('changeStep', 'success', formData)
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('请填写必填项')
  }
}
</script>

<style lang="scss" scoped>
.contentbox {
  display: flex;
  flex-direction: column;

  .content {
    flex: 1;
    padding: 20px;
    overflow: auto;

    .channel-count {
      margin: 0 4px;
      font-weight: bold;
      color: #18c5c1;
    }

    :deep(.el-table) {
      .el-checkbox {
        margin-right: 0;
      }
    }

    // 副标题输入框样式
    :deep(.el-input) {
      .el-input__wrapper {
        padding: 1px 11px;
      }
    }
  }

  .footer {
    padding: 10px;
  }
}

:deep(.el-form-item__label) {
  font-weight: normal;
}
</style>
