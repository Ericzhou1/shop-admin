<template>
  <div>
    <!-- 商品列表 -->
    <div class="app-container">
      <el-row justify="space-between">
        <el-col :span="21" class="flex">
          <el-form :inline="true" :model="formInline">
            <!-- <el-form-item style="width: 200px">
              <el-input
                v-model="formInline.productCode"
                placeholder="请输入商品编码"
              />
            </el-form-item> -->
            <el-form-item style="width: 200px">
              <el-input
                v-model="formInline.productBarcode"
                placeholder="请输入商品名称/条形码"
              />
            </el-form-item>
            <el-form-item style="width: 200px">
              <el-select
                v-model="formInline.productType"
                style="width: 100%"
                placeholder="请选择商品类型"
              >
                <el-option
                  v-for="item in productTypeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="fetchProductList" icon="Search">
                搜索
              </el-button>
              <el-button
                type="primary"
                @click="resetSearch"
                icon="RefreshRight"
              >
                重置搜索
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-table
        :data="dataList"
        v-loading="isLoading"
        :scrollbar-always-on="false"
        :header-cell-style="{
          textAlign: 'center',
          borderTop: '2px solid #f6f6f6',
          borderBottom: 'none'
        }"
        :row-class-name="tableRowClassName"
        class="table-container"
      >
        <el-table-column prop="code" label="商品编码" min-width="60" />
        <el-table-column prop="ean13" label="商品条码" min-width="60" />
        <el-table-column prop="productImage" label="商品图片" min-width="60">
          <template #default="scope">
            <img
              style="width: 30px; height: 30px"
              :src="scope.row.images[0].url"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="60" />
        <el-table-column prop="buyPrice" label="单价(元)" min-width="60" />
        <el-table-column prop="typeName" label="分类" min-width="60">
          <!-- <template #default="scope">
            {{
              productTypeOptions.find(
                (item: any) => item.value == scope.row.productType
              )?.label
            }}
          </template> -->
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="scope">
            <div class="operation">
              <!-- 查看详情 -->
              <svg-icon
                icon-class="info"
                @click="readInfo(scope.row)"
                size="20px"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next, sizes, jumper"
        :total="pager.total"
        :page-sizes="[10, 20, 30, 40]"
        v-model:current-page="pager.page"
        v-model:page-size="pager.size"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        justify="center"
        class="page-footer"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { onMounted, ref, reactive } from 'vue'
import router from '@/router'
import { productTypeList, productList } from '@/api/product'

const dataList = ref<any>([])
const pager = ref<any>({ total: 0, page: 1, size: 10 })
const productTypeOptions = ref<any>([])
const formInline = reactive<any>({
  productCode: null,
  productBarcode: null,
  productType: null
})
const isLoading = ref(false)

const fetchProductTypeOptions = async () => {
  const data = { supplierId: 11 }
  const res = await productTypeList()
  productTypeOptions.value = res.data
}

const readInfo = (row: any) => {
  router.push({
    name: 'productdetail',
    query: { id: row.id }
  })
}

onMounted(() => {
  fetchProductTypeOptions()
  fetchProductList()
})

const tableRowClassName = (row: any) => {
  return row.rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

const fetchProductList = async () => {
  isLoading.value = true
  const req = {
    page: pager.value.page,
    size: pager.value.size,
    code: formInline.productBarcode,
    // productBarcode: formInline.productBarcode,
    type_id: formInline.productType
  }
  const res = await productList(req)
  dataList.value = res.data.items
  pager.value.total = res.data.total
  isLoading.value = false
}

const resetSearch = () => {
  Object.keys(formInline).forEach((key) => {
    formInline[key] = undefined
  })
  pager.value.page = 1
  pager.value.size = 10
  fetchProductList()
}

const handleSizeChange = (val: number) => {
  pager.value.size = val
  fetchProductList()
}

const handleCurrentChange = (val: number) => {
  pager.value.page = val
  fetchProductList()
}
</script>

<style lang="scss" scoped>
:deep(.el-table .even-row td) {
  text-align: center;
}
:deep(.el-dialog__header) {
  text-align: center;
}
:deep(.el-radio) {
  margin-right: 0;
  font-weight: normal;
  flex: 0 0 50%;
}
:deep(.el-checkbox-group) {
  .el-checkbox {
    margin: 0;
    font-weight: normal;
  }
}
.app-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  .table-container {
    flex: 1;
    overflow: auto;
  }
  .points {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .point_icon_list {
      img {
        margin-left: 2px;
        width: 26px;
        height: 16px;
      }
    }
  }
  .page-footer {
    height: 30px;
  }
  .el-table--default {
    margin-bottom: 20px;
    .operation {
      display: flex;
      justify-content: start;
      .svg-icon {
        flex: 0 0 100%;
      }
    }
  }
}
</style>
