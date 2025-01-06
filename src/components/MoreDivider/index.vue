<template>
  <div class="more-divider">
    <div class="content" :style="{ maxHeight: height }">
      <slot />
    </div>
    <el-divider>
      <el-link type="primary" :underline="false" @click="toggle">
        <div v-if="toggleStatus" class="text">
          <span>收起</span>
          <el-icon><ArrowDownBold /></el-icon>
        </div>
        <div v-else class="text">
          <span>展开</span>
          <el-icon><ArrowDownBold /></el-icon>
        </div>
      </el-link>
    </el-divider>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MoreDivider',
})
const props = defineProps({
  minHeight: {
    type: String,
    default: '',
  },
  maxHeight: {
    type: String,
    default: '',
  },
})

const toggleStatus = ref(false)
const height = ref(props.minHeight)

const toggle = () => {
  toggleStatus.value = !toggleStatus.value
  if (toggleStatus.value) {
    height.value = props.maxHeight
  } else {
    height.value = props.minHeight
  }
  // if (height.value === props.maxHeight) {
  //   height.value = props.minHeight
  // } else {
  //   height.value = props.maxHeight
  // }
}
onMounted(() => {
  toggleStatus.value = false
  height.value = props.minHeight
})
</script>

<style lang="scss" scoped>
.more-divider {
  .content {
    overflow: auto;
    transition: max-height 0.3s ease-in-out;
  }
  .text {
    display: flex;
    align-items: center;
  }
}
</style>
