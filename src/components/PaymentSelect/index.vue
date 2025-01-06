<template>
  <div class="payment-select">
    <el-space wrap :size="12">
      <div
        v-for="item in sortedOptions"
        :key="item.nameEn"
        class="payment-item"
        :class="{
          'is-selected': modelValue.includes(item.nameEn),
          'is-disabled': item.disabled,
        }"
        @click="toggleSelect(item)"
      >
        <span class="payment-name">{{ item.nameCn }}</span>
        <div class="payment-check">
          <el-icon v-show="modelValue.includes(item.nameEn)"><Check /></el-icon>
        </div>
      </div>
    </el-space>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Check } from '@element-plus/icons-vue'

interface PaymentOption {
  nameEn: string
  nameCn: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    options: PaymentOption[]
    allowUnselect?: boolean
  }>(),
  {
    allowUnselect: true,
  }
)

const emit = defineEmits(['update:modelValue', 'change'])

// 切换选中状态
const toggleSelect = (item: PaymentOption) => {
  if (item.disabled) return

  const newValue = [...props.modelValue]
  const index = newValue.indexOf(item.nameEn)

  if (index > -1) {
    if (!props.allowUnselect && newValue.length === 1) return
    newValue.splice(index, 1)
  } else {
    newValue.push(item.nameEn)
  }

  emit('update:modelValue', newValue)
  emit('change', newValue)
}

// 按文字长度排序的选项
const sortedOptions = computed(() => {
  return [...props.options].sort((a, b) => a.nameCn.length - b.nameCn.length)
})
</script>

<style lang="scss" scoped>
.payment-select {
  .payment-item {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 70px;
    padding: 6px 12px;
    cursor: pointer;
    user-select: none;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      color: var(--el-color-primary);
      border-color: var(--el-color-primary);
    }

    &.is-selected {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
      border-color: var(--el-color-primary);

      .payment-check {
        opacity: 1;
      }
    }

    &.is-disabled {
      cursor: not-allowed;
      opacity: 0.6;

      &:hover {
        color: inherit;
        border-color: var(--el-border-color);
      }
    }

    .payment-name {
      flex: 1;
      font-size: 14px;
      line-height: 1;
      text-align: center;
    }

    .payment-check {
      position: absolute;
      top: -6px;
      right: -6px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      font-size: 10px;
      color: white;
      background-color: var(--el-color-primary);
      border-radius: 50%;
      opacity: 0;
      transition: opacity 0.3s;
    }
  }
}
</style>
