<template>
  <!-- 商品详情和物流设置表单 -->
  <el-form
    ref="formRefTwo"
    :model="formData"
    :rules="formRules"
    label-width="auto"
    label-suffix=":"
    class="contentbox"
  >
    <div class="content">
      <!-- 物流设置区域 -->
      <div class="logistics-section">
        <div class="section-title">物流设置</div>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <!-- 物流方式选择 -->
            <el-form-item label="物流方式" prop="logistics.logisticsType" required>
              <el-radio-group v-model="formData.logistics.logisticsType">
                <el-radio :label="LogisticsType.EXPRESS">快递</el-radio>
                <!-- <el-radio :label="LogisticsType.UNSPECIFIED">未指定</el-radio> -->
              </el-radio-group>
            </el-form-item>

            <!-- 运费类型选择 - 仅在选择快递时显示 -->
            <!-- 运费设置 -->
            <el-form-item
              v-if="formData.logistics.logisticsType === LogisticsType.EXPRESS"
              label="运费"
              prop="logistics.freight"
              required
            >
              <el-input-number
                v-model="formData.logistics.freight"
                :min="0"
                :precision="2"
                :step="1"
              />
              <span class="unit">元</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 商品详情区域 -->
      <div class="detail-section">
        <div class="section-title">商品详情</div>
        <el-row :gutter="20" class="editor-row">
          <!-- 富文本编辑器区域 -->
          <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
            <el-form-item label="商品详情" prop="description" required>
              <div class="editor-container">
                <editor
                  v-model="formData.description"
                  :min-height="600"
                  :style="{ width: '100%', height: '560px' }"
                  scene="spc-test"
                />
              </div>
            </el-form-item>
          </el-col>
          <!-- 手机预览区域 - 在小屏幕下隐藏 -->
          <el-col :xs="0" :sm="0" :md="8" :lg="8" :xl="8">
            <div class="preview-container">
              <div class="ifam">
                <div class="preview-content" v-html="formData.description" />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 底部按钮区域 -->
    <el-row justify="center" class="footer">
      <el-button @click="nextStep('one')">上一步</el-button>
      <el-button type="primary" @click="nextStep('three')">下一步</el-button>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import Editor from '@/components/WangEditor/index.vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

// 物流方式枚举
enum LogisticsType {
  UNSPECIFIED = 0, // 未指定
  EXPRESS = 1, // 快递
}

const formRefTwo = ref<FormInstance>()
const emit = defineEmits(['changeStep'])

// 表单数据
const formData = reactive({
  description: '', // 商品详情
  logistics: {
    logisticsType: LogisticsType.EXPRESS, // 物流方式
    transportId: 1, // 运费模板ID
    transportPrice: '0', // 运费价格
    freight: 0, // 统一运费金额（临时存储）
  },
})

// 表单验证规则
const formRules: FormRules = {
  description: [
    {
      required: true,
      message: '请填写商品详情',
      trigger: ['blur', 'change'],
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        // 移除 HTML 标签后检查内容是否为空
        const cleanText = value?.replace(/<[^>]*>/g, '')?.trim() || ''
        if (!cleanText) {
          callback(new Error('商品详情不能为空'))
        } else if (cleanText.length < 10) {
          callback(new Error('商品详情不能少于10个字符'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  'logistics.logisticsType': [{ required: true, message: '请选择物流方式', trigger: 'change' }],
  'logistics.freight': [
    {
      required: true,
      message: '请输入运费金额',
      trigger: ['blur', 'change'],
      type: 'number',
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (
          formData.logistics.logisticsType === LogisticsType.EXPRESS &&
          (value === undefined || value === null)
        ) {
          callback(new Error('请输入运费金额'))
        } else if (value < 0) {
          callback(new Error('运费不能小于0'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
}

// 监听物流方式变化
watch(
  () => formData.logistics.logisticsType,
  (newValue) => {
    if (newValue === LogisticsType.UNSPECIFIED) {
      // 重置运费相关数据
      formData.logistics.transportId = 1
      formData.logistics.transportPrice = '0'
      formData.logistics.freight = 0
    }
  }
)

// 步骤切换处理
const nextStep = async (type: string) => {
  // 返回上一步不需要验证
  if (type === 'one') {
    emit('changeStep', type)
    return
  }

  // 表单验证
  if (!formRefTwo.value) {
    ElMessage.error('表单初始化失败')
    return
  }

  try {
    await formRefTwo.value.validate()
    // 额外检查商品详情是否为空
    const cleanText = formData.description?.replace(/<[^>]*>/g, '')?.trim() || ''
    if (!cleanText) {
      ElMessage.error('商品详情不能为空')
      return
    }

    // 如果选择了统一邮费，设置运费价格
    if (formData.logistics.logisticsType === LogisticsType.EXPRESS) {
      formData.logistics.transportPrice = String(formData.logistics.freight || 0)
    }
    // 传递数据给父组件
    emit('changeStep', type, {
      description: formData.description,
      logistics: {
        logisticsType: formData.logistics.logisticsType,
        transportId: formData.logistics.transportId,
        transportPrice: formData.logistics.transportPrice,
      },
    })
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('请填写必填项')
    return
  }
}
</script>
<style lang="scss" scoped>
// 主容器样式
.contentbox {
  display: flex;
  flex-direction: column;
  height: 100%;

  // 内容区域
  .content {
    flex: 1;
    padding: 20px;
    overflow: auto;

    // 编辑器行高度
    .editor-row {
      min-height: 644px;
    }

    // 区域标题样式
    .section-title {
      padding-left: 10px;
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: 500;
      border-left: 4px solid #18c5c1;
    }

    // 商品详情区域
    .detail-section {
      margin-bottom: 30px;
    }

    // 物流设置区域
    .logistics-section {
      margin-top: 20px;
    }

    // 编辑器容器
    .editor-container {
      height: 644px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;

      // 大屏幕适配
      @media screen and (width <= 1400px) {
        height: 515px;
      }
    }

    // 预览容器
    .preview-container {
      height: 644px;
      padding: 0 20px;

      // 大屏幕适配
      @media screen and (width <= 1400px) {
        height: 515px;
        transform: scale(0.8);
        transform-origin: top center;
      }

      // 手机预览框
      .ifam {
        position: relative;
        width: 344px;
        height: 644px;
        padding: 40px 20px;
        padding-top: 50px;
        margin: 0 auto;
        background: url('../../../assets/images/phonebg.png') no-repeat top;
        background-size: 344px 644px;

        // 预览内容区域
        .preview-content {
          height: 500px;
          padding: 10px;
          overflow-y: auto;
          font-size: 14px;

          // 预览图片适配
          :deep(img) {
            max-width: 100%;
            height: auto;
          }
        }
      }
    }
  }

  // 底部按钮区域
  .footer {
    padding: 10px;
  }
}

// 小屏幕适配
@media screen and (width <= 768px) {
  .contentbox {
    .content {
      padding: 10px;

      .section-title {
        margin-bottom: 15px;
        font-size: 14px;
      }

      .editor-container {
        height: auto;
        min-height: 400px;
      }

      .editor-row {
        min-height: auto;
      }
    }

    :deep(.el-form-item) {
      margin-bottom: 15px;
    }
  }
}

// 单位文本样式
.unit {
  margin-left: 8px;
  color: #666;
}

// 表单标签样式
:deep(.el-form-item__label) {
  font-weight: normal;
}
</style>
