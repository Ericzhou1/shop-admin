<template>
  <el-row class="p-2">
    <el-col v-for="(item, index) in row" :key="index" :span="2">
      <el-descriptions :column="1">
        <el-descriptions-item>
          <el-image :src="item.mainImage" style="width: 58px; height: 58px" />
        </el-descriptions-item>
        <el-descriptions-item
          v-for="(specItem, specIndex) in item.specs"
          :key="specIndex"
          :label="`${specItem.specName}:`"
        >
          {{ specItem.specValue }}
        </el-descriptions-item>
        <el-descriptions-item label="SKU:">{{ item.id }}</el-descriptions-item>
        <el-descriptions-item label="价格:">
          {{ `￥${item.price}` }}
        </el-descriptions-item>
        <el-descriptions-item label="库存:">
          {{ item.stock }}
        </el-descriptions-item>
      </el-descriptions>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
const props = defineProps({
  row: {
    type: Object,
    default: () => ({}),
  },
})
// console.log(props.row)
</script>

<style lang="scss" scoped></style>
