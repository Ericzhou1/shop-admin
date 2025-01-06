<template>
  <div class="app-container">
    <el-card>
      <el-steps
        class="mb-4 custom-steps"
        space="33%"
        :active="activeTab"
        simple
        finish-status="success"
      >
        <el-step title="第一步 基本信息设置">
          <template #icon>
            <svg-icon icon-class="circleOne" size="22" />
          </template>
        </el-step>
        <el-step title="第二步 商品详情/物流设置">
          <template #icon>
            <svg-icon icon-class="circleTwo" size="22" />
          </template>
        </el-step>
        <el-step title="第三步 营销设置/可售渠道设置/其他设置">
          <template #icon>
            <svg-icon icon-class="circleThree" size="22" />
          </template>
        </el-step>
      </el-steps>
      <keep-alive class="content">
        <component
          :is="currentComponent"
          :key="activeTab"
          :stepOneData="stepOneData"
          :stepTwoData="stepTwoData"
          @changeStep="changeStep"
        />
      </keep-alive>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, computed, markRaw, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { useTagsViewStore } from '@/store'
import Api from '@/api/index'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const tagsViewStore = useTagsViewStore()

// 异步加载组件
const StepOne = defineAsyncComponent(() => import('./StepOne.vue'))
const StepTwo = defineAsyncComponent(() => import('./StepTwo.vue'))
const StepThree = defineAsyncComponent(() => import('./StepThree.vue'))

// 当前步骤
const activeTab = ref(0)

// 当前组件
const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 0:
      return StepOne
    case 1:
      return StepTwo
    case 2:
      return StepThree
    default:
      return StepOne
  }
})

// 商品数据
const productData = reactive<any>({
  // 第一步数据
  stepOne: {},
  // 第二步数据
  stepTwo: {},
  // 第三步数据
  stepThree: {},
})

const stepOneData = ref({})
const stepTwoData = ref({})

const steps = shallowRef([markRaw(StepOne), markRaw(StepTwo), markRaw(StepThree)])

/**
 * 步骤切换处理
 * @param type 步骤类型
 * @param data 表单数据
 */
const changeStep = async (type: string, data?: any) => {
  switch (type) {
    case 'cancel':
      // 取消操作
      router.push('/product/productList')
      const view = {
        name: 'productAdd',
        title: '',
        path: '/product/productAdd',
        fullPath: '/product/productAdd',
      }
      tagsViewStore.delView(view)
      break
    case 'one':
      activeTab.value = 0
      break
    case 'two':
      // 只有传入数据时才允许进入下一步
      if (data) {
        productData.stepOne = data
        activeTab.value = 1
      }
      break
    case 'three':
      // 只有传入数据时才允许进入下一步
      if (data) {
        productData.stepTwo = data
        activeTab.value = 2
      }
      break
    case 'success':
      // 只有传入数据时才允许提交
      if (data) {
        productData.stepThree = data
        try {
          // 组合提交数据前的校验
          if (!productData.stepOne.goodsBaseId) {
            ElMessage.error('请完善第一步的商品基本信息')
            activeTab.value = 0
            return
          }
          if (!productData.stepTwo.description) {
            ElMessage.error('请完善第二步的商品详情')
            activeTab.value = 1
            return
          }
          if (productData.stepThree.channelIds.length === 0) {
            ElMessage.error('请完善第三步的可售渠道')
            return
          }

          // 显示确认对话框
          await ElMessageBox.confirm('确认提交商品信息吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })

          // 组合提交数据
          const submitData = {
            ...productData.stepOne,
            ...productData.stepTwo,
            ...productData.stepThree,
          }
          // 调用添加商品接口
          await Api.ProductApi.addProduct(submitData)
          ElMessage.success('添加商品成功')
          // 提交成功后跳转
          router.push('/product/productList')
        } catch (error) {
          if (error === 'cancel') return
          console.error('提交失败:', error)
          ElMessage.error('添加商品失败')
        }
      }
      break
    default:
      console.error('无效的步骤类型')
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  :deep(.el-card) {
    height: 100%;
    overflow: hidden;

    .el-card__body {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
  }

  :deep(.custom-steps) {
    .el-step {
      .el-step__title {
        font-size: 14px;
        line-height: 1.4;
      }

      &.is-simple {
        &.is-active {
          background-color: #00c1a0;

          .el-step__title {
            color: #fff;
          }
        }
      }
    }
  }
}

.content {
  flex: 1;
  overflow: auto;
}
</style>
