<template>
  <div class="app-container">
    <!-- 商品列表 -->
    <div class="search-bar">
      <MoreDivider minHeight="50px" maxHeight="400px">
        <el-form
          ref="queryFormRef"
          :model="queryParams"
          :inline="true"
          label-suffix=":"
          label-width="auto"
        >
          <el-form-item label="商品ID" prop="spuId">
            <el-input
              v-model.number="queryParams.spuId"
              placeholder="请输入要查询的商品ID"
              clearable
              @input="handleSpuIdInput"
              @keyup.enter="handleQuery"
              @clear="handleQuery"
            />
          </el-form-item>
          <el-form-item label="所属商家" prop="shopId">
            <el-select
              v-model="queryParams.shopId"
              clearable
              class="!w-[168px]"
              @change="handleQuery"
              @clear="handleQuery"
            >
              <el-option
                v-for="item in productStore.ShopOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="商品编码" prop="code">
            <el-input
              v-model="queryParams.code"
              placeholder="请输入商品编码"
              clearable
              @keyup.enter="handleQuery"
              @clear="handleQuery"
            />
          </el-form-item>
          <el-form-item label="商品名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入商品名称"
              clearable
              @keyup.enter="handleQuery"
              @clear="handleQuery"
            />
          </el-form-item>
          <el-form-item label="商品分类" prop="classesId">
            <el-cascader
              v-model="queryParams.classesId"
              :options="productStore.ProductTypeOptions"
              :props="{
                value: 'id',
                label: 'name',
              }"
              class="!w-[168px]"
              filterable
              @change="onClassChange"
              @clear="handleQuery"
            />
          </el-form-item>
          <el-form-item label="库存" prop="stock">
            <el-input
              v-model.number="queryParams.stock"
              placeholder="请输入库存"
              clearable
              @input="handleStockInput"
              @keyup.enter="handleQuery"
              @clear="handleQuery"
            />
          </el-form-item>
          <el-form-item label="审核状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择审核状态"
              class="!w-[168px]"
              clearable
              @change="handleQuery"
              @clear="handleQuery"
            >
              <el-option
                v-for="item in productStore.CheckStatusOption"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="上下架" prop="addOrRemove">
            <el-select
              v-model="queryParams.addOrRemove"
              placeholder="请选择商品状态"
              class="!w-[168px]"
              clearable
              @change="handleQuery"
              @clear="handleQuery"
            >
              <el-option
                v-for="item in productStore.StatusOption"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </MoreDivider>
    </div>
    <el-card shadow="never">
      <div class="operation">
        <el-button type="success" icon="plus" :loading="loading" @click="productAdd">
          添加商品
        </el-button>
        <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
        <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
      </div>
      <el-table
        v-loading="tableLoading"
        :data="pageData"
        row-key="spuId"
        style="width: 100%"
        lazy
        :empty-text="loading ? '加载中...' : '暂无数据'"
        @expand-change="expandChange"
      >
        <el-table-column type="expand">
          <template #default="props">
            <TableExpand :row="skuMapObj[props.row.spuId]" />
          </template>
        </el-table-column>
        <el-table-column label="商品ID" prop="spuId" align="center" />
        <el-table-column label="商品编码" prop="code" align="center" width="100" />
        <el-table-column label="商品名称" prop="name" align="center" width="220" />
        <el-table-column label="所属渠道" align="center">
          <template #default="scope">
            <div v-for="item in scope.row.channels" :key="item.id">
              {{ item.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品图片" align="center" width="100">
          <template #default="scope">
            <el-image
              style="width: 58px; height: 58px"
              :src="scope.row.mainImage"
              fit="cover"
              :preview-src-list="[scope.row.mainImage]"
              :z-index="999999"
              preview-teleported
            />
          </template>
        </el-table-column>
        <el-table-column label="商品分类" align="center">
          <template #default="scope">
            {{ scope.row.classes.name }}
          </template>
        </el-table-column>
        <el-table-column label="商品品牌" align="center">
          <template #default="scope">
            {{ scope.row.brand.name }}
          </template>
        </el-table-column>
        <el-table-column label="商品售价" prop="price" align="center" />
        <el-table-column label="成本售价" prop="costPrice" align="center" />
        <el-table-column label="销量" prop="saleNum" align="center" />
        <el-table-column label="库存" prop="stock" align="center" />
        <el-table-column label="商品状态" prop="status" align="center">
          <template #default="scope">
            {{
              productStore.StatusOption.find((item: any) => item.id === scope.row.checkStatus)?.name
            }}
          </template>
        </el-table-column>
        <el-table-column label="审核状态" prop="checkStatus" align="center">
          <template #default="scope">
            {{
              productStore.CheckStatusOption.find((item: any) => item.id === scope.row.checkStatus)
                ?.name
            }}
          </template>
        </el-table-column>
        <el-table-column label="审核原因" prop="checkReason" align="center" />
        <el-table-column label="创建时间" prop="createdAt" align="center" width="220" />
        <el-table-column label="最后一次更新时间" prop="updatedAt" align="center" width="220" />
      </el-table>
      <div class="pagination">
        <pagination
          v-model:total="total"
          v-model:page="queryParams.page"
          v-model:limit="queryParams.size"
          :disabled="loading"
          @pagination="handleQuery"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
/**
 * 商品列表页面
 * 功能：展示商品列表、搜索、分页、SKU展示等
 */
import Api from '@/api/index'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/store'
import TableExpand from './TableExpand.vue'

defineOptions({
  name: 'ProductList',
})

/** 路由实例 */
const router = useRouter()
/** 商品相关的状态管理 */
const productStore = useProductStore()
/** 查询表单引用 */
const queryFormRef = ref(ElForm)

/**
 * 查询参数对象
 * @property {number} spuId - 商品ID
 * @property {number} shopId - 所属商家ID
 * @property {string} code - 商品编码
 * @property {string} name - 商品名称
 * @property {number} classesId - 分类ID
 * @property {number} stock - 库存数量
 * @property {number} status - 审核状态
 * @property {number} addOrRemove - 上下架状态
 */
interface QueryParams {
  [key: string]: number | undefined
  page: number
  size: number
}

const queryParams = reactive<QueryParams>({
  spuId: undefined as number | undefined,
  shopId: undefined,
  code: undefined,
  name: undefined,
  classesId: undefined,
  classesLevel: undefined as number | undefined,
  stock: undefined as number | undefined,
  status: undefined,
  addOrRemove: undefined,
  page: 1,
  size: 10,
})

/** 页面加载状态 */
const loading = ref(false)
/** 表格加载状态（包含行操作的loading） */
const tableLoading = computed(() => {
  return loading.value || pageData.value.some((item: any) => item.loading)
})
/** 表格数据 */
const pageData = ref<any>([])
/** 总数据条数 */
const total = ref(0)
/** SKU数据映射对象 */
const skuMapObj = ref<any>({})

/**
 * 页面初始化
 * 加载基础数据：商品分类、品牌、商家信息
 */
onMounted(async () => {
  try {
    await Promise.all([
      productStore.getProductType(),
      productStore.getProductBrand(),
      productStore.getProductShop(),
    ])
    handleQuery()
  } catch (error) {
    console.error('初始化数据失败:', error)
    ElMessage.error({
      message: '加载基础数据失败，请刷新页面重试',
      duration: 3000,
      showClose: true,
    })
  }
})

/**
 * 处理分类选择变化
 * @param value - 选中的分类值数组
 */
const onClassChange = (value: any) => {
  if (value.length) {
    queryParams.classesId = value[value.length - 1]
    queryParams.classesLevel = value.length
  } else {
    queryParams.classesId = undefined
    queryParams.classesLevel = undefined
  }
  handleQuery()
}

/**
 * 查询商品列表数据
 */
const handleQuery = async () => {
  loading.value = true
  try {
    // 构建查询参数，过滤掉空值
    const params = Object.entries(queryParams).reduce<Record<string, any>>((acc, [key, value]) => {
      // 分页参数直接传递，其他参数需要有值才传
      if (key === 'page' || key === 'size') {
        acc[key] = value
        return acc
      }
      // 过滤掉空值和0
      if (value !== undefined && value !== null && value !== 0) {
        acc[key] = value
      }
      return acc
    }, {})

    const data = await Api.ProductApi.getProductList(params)
    pageData.value = data.list.map((item: any) => {
      item.sku = []
      return item
    })
    total.value = data.total
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error({
      message: '获取商品列表失败，请检查筛选条件后重试',
      duration: 3000,
      showClose: true,
    })
    pageData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

/**
 * 重置查询条件并重新查询
 */
function handleResetQuery() {
  queryFormRef.value.resetFields()
  // 重置所有查询条件
  const currentSize = queryParams.size // 保存当前的size值
  Object.keys(queryParams).forEach((key) => {
    if (key === 'page') {
      ;(queryParams as any)[key] = 1
    } else {
      ;(queryParams as any)[key] = undefined
    }
  })
  queryParams.size = currentSize // 恢复size值

  handleQuery()
  ElMessage.success('重置成功')
}

/**
 * 跳转到新增商品页面
 */
const productAdd = () => {
  router.push('/product/productAdd')
}

/**
 * 处理表格展开行，加载SKU数据
 * @param row - 当前行数据
 * @param expandRow - 展开的行数组
 */
const expandChange = async (row: any, expandRow: any) => {
  try {
    if (expandRow.length) {
      const findIndex = pageData.value.findIndex((item: any) => item.spuId === row.spuId)
      if (findIndex !== -1) {
        const data: any = await Api.ProductApi.getProductSkuData({ spuId: row.spuId })
        skuMapObj.value[row.spuId] = data.list
      }
    }
  } catch (error) {
    console.error('获取商品SKU数据失败:', error)
    ElMessage.error({
      message: `获取商品 ${row.name || row.spuId} 的SKU数据失败`,
      duration: 3000,
      showClose: true,
    })
    skuMapObj.value[row.spuId] = []
  }
}

/**
 * 处理商品ID输入，过滤非数字字符
 * @param value - 输入的值
 */
const handleSpuIdInput = (value: string) => {
  const numValue = value.replace(/[^\d]/g, '')
  if (numValue) {
    queryParams.spuId = parseInt(numValue)
  } else {
    queryParams.spuId = undefined
  }
}

/**
 * 处理库存输入，过滤非数字字符
 * @param value - 输入的值
 */
const handleStockInput = (value: string) => {
  const numValue = value.replace(/[^\d]/g, '')
  if (numValue) {
    queryParams.stock = parseInt(numValue)
  } else {
    queryParams.stock = undefined
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .operation {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    margin-bottom: 20px;
  }

  :deep(.el-card) {
    display: flex;
    flex: 1;

    .el-card__body {
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow: hidden;

      .el-table {
        flex: 1;
      }

      .pagination {
        display: flex;
        flex: 0 0 56px;
        align-items: flex-end;
        justify-content: flex-end;
        width: 100%;
      }
    }
  }
}

:deep(.el-table__expanded-cell) {
  padding: 20px 50px;
  background: #f8f8f9;
  // :deep(.el-table tr) {
  //   background: #f8f8f9;
  // }

  .el-descriptions__table {
    tr {
      background-color: #f8f8f9;
    }
  }
}

:deep(.el-table__expanded-cell:hover) {
  background-color: #f8f8f9 !important;
}
</style>
