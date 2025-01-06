<template>
  <div>
    <!-- 搜索表单区域 -->
    <el-card>
      <el-descriptions :column="4" direction="horizontal">
        <el-descriptions-item label="商品名称：">
          <el-input
            v-model="reqData.name"
            placeholder="请输入商品名称"
            style="max-width: 200px"
            clearable
            @keyup.enter="handleQuery"
            @clear="handleQuery"
          />
        </el-descriptions-item>
        <el-descriptions-item label="商品分类：">
          <el-cascader
            v-model="reqData.classesId"
            :options="productStore.ProductTypeOptions"
            :props="{
              value: 'id',
              label: 'name',
              checkStrictly: true,
            }"
            class="!w-[200px]"
            filterable
            clearable
            placeholder="请选择分类"
            @change="onClassChange"
            @clear="handleQuery"
          />
        </el-descriptions-item>
        <el-descriptions-item>
          <el-button :loading="loading" icon="refresh" @click="handleResetQuery">重置</el-button>
        </el-descriptions-item>
        <el-descriptions-item>
          <el-button :loading="loading" type="primary" icon="search" @click="handleQuery">
            查询
          </el-button>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 商品列表区域 -->
    <el-row class="mt-2" justify="space-between">
      <el-col :span="24">
        <el-card v-loading="loading" element-loading-text="加载中...">
          <template #header>
            <div class="flex items-center justify-between">
              <span>请双击选择商品</span>
              <el-tag v-if="selectData.name" type="success">{{ selectData.name || '' }}</el-tag>
            </div>
          </template>

          <el-empty v-if="!productBaseData.length && !loading" description="暂无数据" />

          <el-table
            v-else
            ref="tableRef"
            :data="productBaseData"
            border
            height="400px"
            row-key="id"
            highlight-current-row
            :current-row-key="selectData?.id"
            @current-change="currentChange"
            @row-dblclick="handleRowDblClick"
          >
            <el-table-column
              label="商品名称"
              prop="name"
              min-width="200"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column label="单位" align="center" width="100">
              <template #default="scope">
                {{ scope.row.unit?.name || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="分类" align="center" width="120" show-overflow-tooltip>
              <template #default="scope">
                {{ scope.row.classes?.name || '-' }}
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页器 -->
          <el-pagination
            v-if="total > 0"
            v-model:current-page="reqData.page"
            v-model:page-size="reqData.size"
            :total="total"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            class="mt-4 flex justify-end"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import Api from '@/api/index'
import { useProductStore } from '@/store'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

// 定义组件事件
const emit = defineEmits(['selected', 'update:visible'])

// 使用商品分类store
const productStore = useProductStore()

// 查询参数
interface QueryParams {
  name?: string
  classesId?: number
  classesLevel?: number
  page: number
  size: number
}

// 初始化数据
const reqData = reactive<QueryParams>({
  name: undefined,
  classesId: undefined,
  classesLevel: undefined,
  page: 1,
  size: 10,
})

// 表格相关数据
const loading = ref(false)
const total = ref(0)
const productBaseData = ref([])
const tableRef = ref()
const selectData = ref<any>({})

// 初始化加载
onMounted(async () => {
  if (props.visible) {
    try {
      // 确保商品分类数据已加载
      if (!productStore.ProductTypeOptions?.length) {
        await productStore.getProductType()
      }
      handleQuery()
    } catch (error) {
      console.error('初始化失败:', error)
      ElMessage.error({
        message: '初始化失败，请刷新重试',
        duration: 3000,
        showClose: true,
      })
    }
  }
})

/**
 * 监听弹窗关闭，重置数据
 */
watch(
  () => props.visible,
  async (newVal) => {
    if (newVal) {
      try {
        // 确保商品分类数据已加载
        if (!productStore.ProductTypeOptions?.length) {
          await productStore.getProductType()
        }

        // 弹窗打开时重置所有数据
        reqData.name = undefined
        reqData.classesId = undefined
        reqData.classesLevel = undefined
        reqData.page = 1
        reqData.size = 10
        // 重置选中数据
        selectData.value = {
          name: '',
          id: undefined,
          unit: {},
          classes: {},
          mainImage: '',
        }
        productBaseData.value = []
        total.value = 0
        // 重置表格选中状态
        if (tableRef.value) {
          tableRef.value.setCurrentRow(null)
        }
        handleQuery()
      } catch (error) {
        console.error('初始化失败:', error)
        ElMessage.error({
          message: '初始化失败，请刷新重试',
          duration: 3000,
          showClose: true,
        })
      }
    }
  }
)

/**
 * 处理分类选择
 * @param value 选中的分类值数组
 */
const onClassChange = (value: any) => {
  if (value?.length) {
    reqData.classesId = value[value.length - 1]
    reqData.classesLevel = value.length
  } else {
    reqData.classesId = undefined
    reqData.classesLevel = undefined
  }
  handleQuery()
}

/**
 * 查询商品列表
 */
const handleQuery = async () => {
  loading.value = true
  try {
    // 构建查询参数
    let params: any = {
      page: reqData.page,
      size: reqData.size,
    }

    // 添加非空查询条件
    if (reqData.name?.trim()) {
      params.name = reqData.name.trim()
    }
    if (reqData.classesId) {
      params.classesId = reqData.classesId
      params.classesLevel = reqData.classesLevel
    }

    const data = await Api.ProductApi.getProductBaseList(params)
    // 先清空数据，避免显示旧数据
    productBaseData.value = []
    if (!data || !Array.isArray(data.list)) {
      throw new Error('接口返回数据格式错误')
    }

    await nextTick()
    productBaseData.value = data.list
    total.value = data.total || 0

    // 如果当前页没有数据且不是第一页，则自动跳转到上一页
    if (productBaseData.value.length === 0 && reqData.page > 1) {
      reqData.page--
      handleQuery()
    }
  } catch (error) {
    console.error('查询商品列表失败:', error)
    ElMessage.error({
      message:
        error instanceof Error && error.message === '接口返回数据格式错误'
          ? '获取数据格式错误，请联系技术支持'
          : '查询商品列表失败，请稍后重试',
      duration: 3000,
      showClose: true,
    })
    productBaseData.value = []
    total.value = 0
    reqData.page = 1 // 重置到第一页
  } finally {
    loading.value = false
  }
}

/**
 * 处理每页条数变化
 * @param val 每页条数
 */
const handleSizeChange = (val: number) => {
  reqData.page = 1 // 切换每页条数时重置为第一页
  reqData.size = val
  handleQuery()
}

/**
 * 处理页码变化
 * @param val 页码
 */
const handleCurrentChange = (val: number) => {
  reqData.page = val
  nextTick(() => {
    handleQuery()
  })
}

/**
 * 重置查询条件
 */
const handleResetQuery = () => {
  // 直接重置数据
  reqData.name = undefined
  reqData.classesId = undefined
  reqData.classesLevel = undefined
  reqData.page = 1
  reqData.size = 10
  handleQuery()
}

/**
 * 处理商品选择
 * @param row 选中的商品数据
 */
const currentChange = (row: any) => {
  // 如果是取消选中，设置默认值
  if (!row) {
    selectData.value = {
      name: '',
      id: undefined,
      unit: {},
      classes: {},
      mainImage: '',
    }
  } else {
    selectData.value = { ...row } // 使用解构赋值避免引用问题
  }
}

/**
 * 双击行选择商品
 * @param row 选中的商品数据
 */
const handleRowDblClick = (row: any) => {
  if (row) {
    // 关闭弹窗并传递数据
    emit('update:visible', false)
    emit('selected', row)
  }
}
</script>

<style lang="scss" scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.el-card__header) {
  padding: 12px 20px;
}

:deep(.el-pagination) {
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
