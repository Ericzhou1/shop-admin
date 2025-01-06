<template>
  <el-form
    ref="formRefOne"
    label-width="auto"
    :model="formData"
    :rules="formRules"
    label-suffix=":"
    class="contentbox"
  >
    <div class="content">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="基本信息" name="first" />
      </el-tabs>
      <!-- 关联商品档案 -->
      <el-form-item label="关联商品档案" required prop="goodsBaseId" class="product-base">
        <div class="flex items-center" @click="dialogVisible = true">
          <el-tag v-if="baseProductData.name" type="success">
            {{ baseProductData.name || '' }}
          </el-tag>
          <el-button type="primary" link class="ml-2">
            {{ formData.goodsBaseId ? '重新选择' : '请选择商品' }}
          </el-button>
        </div>
      </el-form-item>

      <!-- 商品名称 -->
      <el-form-item label="商品名称" required prop="name">
        <el-input v-model="formData.name" placeholder="请输入商品名称" style="max-width: 260px" />
      </el-form-item>

      <!-- 商品分类 -->
      <el-form-item label="商品分类" required prop="classesId">
        <el-cascader
          v-model="formData.classesId"
          :options="productStore.ProductTypeOptions"
          style="width: 260px !important"
          filterable
          clearable
          change-on-select
          :props="{
            value: 'id',
            label: 'name',
            checkStrictly: true,
            emitPath: false,
          }"
          placeholder="请选择商品分类"
          @change="productTypeChange"
        />
      </el-form-item>

      <!-- 商品品牌 -->
      <el-form-item label="商品品牌" required prop="brandId">
        <el-select
          v-model="formData.brandId"
          placeholder="请选择商品品牌"
          style="max-width: 260px"
          filterable
          clearable
        >
          <el-option
            v-for="item in productStore.ProductBrandOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <!-- 商品单位 -->
      <el-form-item label="商品单位" required prop="unitId">
        <el-select
          v-model="formData.unitId"
          placeholder="请选择商品单位"
          style="max-width: 260px"
          filterable
          clearable
        >
          <el-option
            v-for="item in productStore.UnitOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <!-- 商品轮播图 -->
      <el-form-item label="商品轮播图" required prop="multiFiles">
        <div>
          <!-- 可以上传多张 -->
          <MultiUpload
            v-model="multiFiles"
            :limit="5"
            :size="{ width: '146px', height: '146px' }"
            :uploadFileType="['image/jpeg', 'image/png', 'image/jpg']"
            :sizeType="'M'"
            :maxSize="10"
            scene="spc-test"
            :isNeedGoFirst="false"
            @update:model-value="onFileListChange"
          />
          <div class="upload-tips mt-2">
            <el-alert
              :title="`已上传 ${multiFiles.length}/10 张图片`"
              type="info"
              :closable="false"
              show-icon
            />
          </div>
        </div>
      </el-form-item>

      <!-- 支付方式 -->
      <el-form-item label="支付方式" required prop="payTypeCheckData">
        <div class="payment-wrapper">
          <PaymentSelect
            v-model="payTypeCheckData"
            :options="productStore.PayTypeOptions"
            @change="payTypeChecked"
          />
          <div class="payment-tips mt-2">
            <el-alert title="至少选择一种支付方式" type="info" :closable="false" show-icon />
          </div>
        </div>
      </el-form-item>

      <!-- 商品状态 -->
      <el-form-item label="商品状态">
        <el-radio-group v-model="formData.status">
          <el-radio v-for="item in productStore.StatusOption" :value="item.id">
            {{ item.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 是否虚拟商品 -->
      <el-form-item label="是否虚拟商品">
        <el-radio-group v-model="formData.isVirtual">
          <el-radio :value="true">是</el-radio>
          <el-radio :value="false">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="规格库存" name="first" />
      </el-tabs>

      <!-- 商品规格 -->
      <el-form-item label="商品规格" class="product-spec">
        <div class="spec-container">
          <div class="spec-list">
            <div v-for="(specItem, specIndex) in productSpec" :key="specItem.id" class="spec-item">
              <div class="spec-header">
                <span class="spec-name">{{ specItem.name }}</span>
                <el-button type="danger" link @click="deleteProSpec(specIndex)">
                  <el-icon><Close /></el-icon>
                </el-button>
              </div>
              <div class="spec-values">
                <div class="value-list">
                  <el-tag
                    v-for="(tag, index) in specItem.values"
                    :key="tag.id"
                    closable
                    :disable-transitions="false"
                    class="spec-tag"
                    @close="deleteProductTag(tag.id, specIndex)"
                  >
                    {{ tag.value }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>

          <el-text>商品属性：</el-text>
          <div class="batch-toolbar mt-2 mb-2">
            <el-button-group>
              <el-button type="success" :disabled="!productSpec.length" @click="handleSpecGenerate">
                {{ productSpecData.data.length ? '重新生成' : '立即生成' }}
              </el-button>
              <el-button type="primary" @click="openBatchDialog">批量操作</el-button>
              <el-button type="danger" @click="batchDel">批量删除</el-button>
            </el-button-group>
          </div>

          <!-- SKU 表格 -->
          <el-table :data="productSpecData.data" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" width="50" label="序号" />
            <template v-for="hd in productSpec">
              <el-table-column
                align="center"
                :label="hd.name"
                :prop="String(hd.id)"
                :filters="
                  hd.values.map((item: any) => ({
                    text: item.value,
                    value: item.value,
                  }))
                "
                :filter-method="(value: string, row: any) => row[hd.id] === value"
                filter-multiple
                :filter-icon="false"
                @filter-change="handleFilterChange"
              />
            </template>

            <el-table-column label="图片" align="center" width="100">
              <template #default="scope">
                <SingleImageUpload
                  v-model="scope.row.mainImage"
                  :size="{ width: '60px', height: '60px' }"
                  :uploadFileType="['image/jpeg', 'image/png', 'image/jpg']"
                  scene="spc-test"
                />
              </template>
            </el-table-column>
            <el-table-column label="售价" align="center">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.price"
                  :min="0"
                  :precision="2"
                  :controls="false"
                  style="width: 100%"
                />
              </template>
            </el-table-column>
            <el-table-column label="成本价" align="center">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.costPrice"
                  :min="0"
                  :precision="2"
                  :controls="false"
                  style="width: 100%"
                />
              </template>
            </el-table-column>
            <el-table-column label="库存" align="center">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.stock"
                  :min="0"
                  :precision="0"
                  :controls="false"
                  style="width: 100%"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="170" align="center">
              <template #default="scope">
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="deletSpecValueItem(scope.$index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>

      <!-- 批量操作对话框 -->
      <el-dialog
        v-model="batchDialogVisible"
        title="批量操作"
        width="500px"
        :close-on-click-modal="false"
      >
        <div class="batch-operation-form">
          <el-form :model="batchForm" label-width="80px">
            <el-form-item label="操作类型">
              <el-select v-model="batchForm.type" placeholder="请选择操作类型" style="width: 100%">
                <el-option label="售价" value="price" />
                <el-option label="成本价" value="costPrice" />
                <el-option label="库存" value="stock" />
                <el-option label="图片" value="image" />
              </el-select>
            </el-form-item>

            <!-- 售价输入框 -->
            <el-form-item v-if="batchForm.type === 'price'" label="售价">
              <el-input-number
                v-model="batchValues.price"
                :min="0"
                :precision="2"
                :step="0.01"
                placeholder="请输入售价"
                style="width: 100%"
              />
            </el-form-item>

            <!-- 成本价输入框 -->
            <el-form-item v-if="batchForm.type === 'costPrice'" label="成本价">
              <el-input-number
                v-model="batchValues.costPrice"
                :min="0"
                :precision="2"
                :step="0.01"
                placeholder="请输入成本价"
                style="width: 100%"
              />
            </el-form-item>

            <!-- 库存输入框 -->
            <el-form-item v-if="batchForm.type === 'stock'" label="库存">
              <el-input-number
                v-model="batchValues.stock"
                :min="0"
                :precision="0"
                :step="1"
                placeholder="请输入库存"
                style="width: 100%"
              />
            </el-form-item>

            <!-- 图片上传 -->
            <el-form-item v-if="batchForm.type === 'image'" label="图片">
              <div>
                <SingleImageUpload
                  v-model="batchValues.mainImage"
                  :size="{ width: '146px', height: '146px' }"
                  :uploadFileType="['image/jpeg', 'image/png', 'image/jpg']"
                  scene="spc-test"
                />
              </div>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleBatchClose">关闭</el-button>
            <el-button type="primary" @click="handleBatchOperation">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>

    <!-- 选择商品档案 -->
    <el-dialog
      v-model="dialogVisible"
      title="选择商品档案"
      width="1000px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <SelectProductProfile v-model:visible="dialogVisible" @selected="selectedProductBase" />
    </el-dialog>

    <el-row justify="center" class="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="nextStep">下一步</el-button>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
/**
 * StepOne.vue
 *
 * 用于配置商品的基本信息、规格、批量操作等。
 * 包含以下主要功能：
 * 1. 关联商品档案选择
 * 2. 基本信息填写（名称、分类、品牌、单位、轮播图、支付方式、状态等）
 * 3. 规格管理（加载规格列表、生成 SKU 笛卡尔积、批量设置、批量删除等）
 * 4. 校验表单并将数据传递到下一步
 */

import Api from '@/api/index'
import { ElMessageBox, ElMessage } from 'element-plus'
import SelectProductProfile from './SelectProductProfile.vue'
import { useProductStore } from '@/store'
import PaymentSelect from '@/components/PaymentSelect/index.vue'
import MultiUpload from '@/components/Upload/MultiUpload.vue'
import SingleImageUpload from '@/components/Upload/SingleImageUpload.vue'
import { Close } from '@element-plus/icons-vue'
import { watch } from 'vue'

/**
 * 该组件向父组件抛出的事件：
 * - changeStep(step: string, data?: any): 用于切换到下一步或取消操作
 */
const emit = defineEmits(['changeStep'])

/** 商品相关数据，使用 Pinia */
const productStore = useProductStore()

/** 基础 tab 激活页 */
const activeName = ref('first')

/** 表单引用 */
const formRefOne = ref()

/** 已上传的图片列表 */
const multiFiles = ref<any>([])

/** 监听图片列表变化 */
watch(
  multiFiles,
  (newFiles) => {
    formData.value.medias = []
    newFiles.forEach((item: any, index: number) => {
      formData.value.medias.push({
        url: item,
        sort: index + 1,
        type: 1,
      })
    })
  },
  { deep: true }
)

/** 表单数据 */
const formData = ref<any>({
  name: '', // 商品名称
  classesId: undefined, // 分类ID
  brandId: undefined, // 品牌ID
  unitId: undefined, // 单位ID
  medias: [], // 轮播图
  paymentInfo: {}, // 支付方式（记录不同方式的启用状态）
  status: 1, // 商品状态
  isVirtual: false, // 是否是虚拟商品
  goodsBaseId: undefined, // 商品档案ID
  skus: [], // SKU 列表
  specs: [], // 规格列表
})

/** 商品规格列表 */
const productSpec = ref<any>([])

// 监听 productSpec 变化
watch(
  productSpec,
  (newSpec) => {
    // 重组规格数据结构
    formData.value.specs = newSpec.map((spec: any) => ({
      specId: spec.id,
      specValueIds: spec.values.map((value: any) => value.id),
    }))
  },
  { deep: true } // 深度监听
)

/** 控制"选择商品档案"弹窗 */
const dialogVisible = ref(false)

/** 商品档案的基础信息（选中后回填） */
const baseProductData = ref<any>({
  id: 0,
  name: '',
})

/** 复选的支付方式 */
const payTypeCheckData = ref<any>([])

/** 表格规格数据结构 */
interface SpecData {
  header: any[]
  data: any[]
}
const productSpecData = ref<SpecData>({
  header: [],
  data: [],
})

/**
 * 表单校验规则
 * - 校验关联商品、名称、分类、品牌、单位、轮播图、支付方式、以及 SKU 的完整度
 */
const formRules = computed(() => {
  return {
    goodsBaseId: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (!formData.value.goodsBaseId) {
            callback(new Error('请选择关联商品'))
          } else {
            callback()
          }
        },
        trigger: 'change',
      },
    ],
    name: [
      {
        required: true,
        trigger: 'blur',
        message: '请输入商品名称',
      },
    ],
    classesId: [
      {
        required: true,
        trigger: 'blur',
        message: '请选择分类',
      },
    ],
    brandId: [
      {
        required: true,
        trigger: 'blur',
        message: '请选择品牌',
      },
    ],
    unitId: [
      {
        required: true,
        trigger: 'blur',
        message: '请选择单位',
      },
    ],
    multiFiles: [
      {
        required: true,
        validator: (rule: any, value: string, callback: any) => {
          if (multiFiles.value.length === 0) {
            callback(new Error('请上传至少一张商品图片！'))
          } else {
            callback()
          }
        },
      },
    ],
    payTypeCheckData: [
      {
        required: true,

        validator: (rule: any, value: any[], callback: any) => {
          //判断payTypeCheckData有参数

          if (payTypeCheckData.value.length === 0) {
            callback(new Error('请选择支付方式'))
            return
          } else {
            callback()
          }
        },
      },
    ],
    skus: [
      {
        validator: (rule: any, value: any[], callback: any) => {
          if (!productSpecData.value.data.length) {
            callback(new Error('请生成规格组合'))
            return
          }
          // 判断是否有缺失价格或库存的 SKU
          const invalid = productSpecData.value.data.some((item) => {
            return !item.price || !item.stock
          })
          if (invalid) {
            callback(new Error('请完善规格信息'))
            return
          }
          callback()
        },
        trigger: 'change',
      },
    ],
  }
})

/** 初始化加载基础数据 */
onMounted(async () => {
  await productStore.getPayType()
  // 根据 PayTypeOptions 初始化 paymentInfo
  formData.value.paymentInfo = productStore.PayTypeOptions.reduce((acc: any, item: any) => {
    acc[`is${item.nameEn}`] = false
    return acc
  }, {})

  productStore.getProductType()
  productStore.getProductBrand()
  productStore.getUnit()
})

/**
 * 选择商品分类后拉取对应规格列表
 * @param value 分类 ID
 */
const productTypeChange = async (value: any) => {
  if (value) {
    formData.value.classesId = value
  }
  try {
    const data: any = await Api.ProductApi.getProductSpecList({
      classesId: formData.value.classesId,
    })
    // 对每个规格的 values 数组先去重，再只保留最多3个
    productSpec.value = (data.list || []).map((spec: any) => {
      const uniqueValues = (spec.values || []).reduce((unique: any[], current: any) => {
        const exists = unique.find((item) => item.id === current.id)
        if (!exists) {
          unique.push(current)
        }
        return unique
      }, [])
      return {
        ...spec,
        values: uniqueValues,
        // values: uniqueValues.slice(0, 3),
      }
    })
  } catch (error) {
    console.error('获取商品规格列表失败:', error)
    ElMessage.error('获取商品规格列表失败')
    productSpec.value = []
  }
}

/**
 * 多图上传回调
 * @param val 已上传的图片数组
 */
const onFileListChange = (val: any) => {
  multiFiles.value = val
}

/**
 * 删除商品规格(大类)
 * @param index 规格索引
 */
const deleteProSpec = (index: number) => {
  ElMessageBox.confirm('删除规格后需要重新生成数据，是否继续？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 删除规格
      formData.value.specification?.productSpec.splice(index, 1)
      productSpec.value.splice(index, 1)
      // 清空已生成的规格数据
      productSpecData.value.data = []
      ElMessage.success('删除成功，请重新生成规格数据')
    })
    .catch(() => {
      // 用户取消删除操作
    })
}

/**
 * 删除某个规格值（tag）
 * @param tagId 规格值ID
 * @param specIndex 在productSpec中的索引
 */
const deleteProductTag = (tagId: number, specIndex: number) => {
  ElMessageBox.confirm('删除规格值后需要重新生成数据，是否继续？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 删除规格值
      const spec = productSpec.value[specIndex]
      spec.values = spec.values.filter((item: any) => item.id !== tagId)

      // 清空已生成的规格数据
      productSpecData.value.data = []
      ElMessage.success('删除成功，请重新生成规格数据')
    })
    .catch(() => {
      // 用户取消删除操作
    })
}

/**
 * 真正执行规格数据的生成
 */
const specGenerate = () => {
  productSpecData.value.data = cartesianProduct(productSpec.value)
}

/**
 * 删除一行 SKU 数据
 * @param index 在 productSpecData.data 中的行索引
 */
const deletSpecValueItem = (index: number) => {
  ElMessageBox.confirm('确定要删除该规格吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      productSpecData.value.data.splice(index, 1)
      ElMessage.success('删除成功')
    })
    .catch(() => {
      // 用户取消删除操作
    })
}

/** 规格属性（用于笛卡尔积） */
interface Attribute {
  id: number
  name: string
  values: Array<{ id: number; value: string }>
}

/** 笛卡尔积生成的每项结构 */
interface CartesianProductItem {
  [key: string]: string // 使用索引签名，键为属性 id 的字符串，值为规格值
}

/**
 * 根据各规格属性的值数量，先计算可能的笛卡尔积总数
 * @param attributes 规格数组
 * @returns 总组合数
 */
const getSpecCombinationsCount = (attributes: Attribute[]): number => {
  if (!attributes.length) return 0
  return attributes.reduce((acc, attr) => acc * (attr.values?.length ?? 0), 1)
}

/**
 * 计算多规格的笛卡尔积（已移除内部数量限制）
 * @param attributes 规格数组
 * @returns 返回 SKU 数据数组
 */
const cartesianProduct = (attributes: Attribute[]): CartesianProductItem[] => {
  let result: CartesianProductItem[] = [{}]

  for (const attribute of attributes) {
    const { id, values } = attribute
    const newResult: CartesianProductItem[] = []

    for (const item of result) {
      for (const valueObj of values) {
        const newItem = { ...item }
        newItem[id.toString()] = valueObj.value
        newItem.mainImage = ''
        newItem.originalPrice = ''
        newItem.costPrice = ''
        newItem.price = ''
        newItem.stock = ''
        newResult.push(newItem)
      }
    }
    result = newResult
  }

  return result
}

/**
 * 选择商品档案后的回调
 * @param row 选中的商品档案
 */
const selectedProductBase = (row: any) => {
  baseProductData.value = row
  formData.value.goodsBaseId = row.id
  formData.value.name = row.name
  // 同步商品分类、品牌、单位
  formData.value.classesId = row.classes ? row.classes.id : undefined
  formData.value.brandId = row.brand ? row.brand.id : undefined
  formData.value.unitId = row.unit ? row.unit.id : undefined
  // 回填图片
  multiFiles.value = [row.mainImage]
  // 触发字段校验
  formRefOne.value?.validateField(['goodsBaseId', 'classesId', 'brandId', 'unitId'])
  productTypeChange(row.classes.id)
}

/**
 * 支付方式多选更新
 */
const payTypeChecked = () => {
  productStore.PayTypeOptions.forEach((item: any) => {
    formData.value.paymentInfo[`is${item.nameEn}`] = payTypeCheckData.value.includes(item.nameEn)
  })
}

/**
 * 生成请求参数中的 SKU 列表
 * 将前端展示的 SKU 数据转换为后端需要的结构
 * @returns 转换后的 SKU 数组
 */
const generateRequestParams = () => {
  // 校验数据完整性
  const emptyRows: number[] = []

  productSpecData.value.data.forEach((item: any, index: number) => {
    const rowNum = index + 1

    // 检查该行是否有任何一个字段为空
    if (!item.mainImage || !item.price || !item.costPrice || !item.stock) {
      emptyRows.push(rowNum)
    }
  })

  if (emptyRows.length > 0) {
    ElMessageBox.alert(
      `第 ${emptyRows.join('、')} 行存在空数据，请完善价格数据或图片`,
      '请完善以下信息',
      {
        type: 'warning',
        confirmButtonText: '确定',
      }
    )
    return false
  }

  return productSpecData.value.data.map((item: any) => {
    // 仅作为示例：假设 specId=1 和 specId=2 的用法
    const specs: any = {
      specId: item[1]
        ? productSpec.value
            .find((h: any) => h.id === 1)
            ?.values.find((v: any) => v.value === item[1])?.id
        : 0,
      specValueId: item[2]
        ? productSpec.value
            .find((h: any) => h.id === 2)
            ?.values.find((v: any) => v.value === item[2])?.id
        : 0,
    }

    return {
      mainImage: item.mainImage,
      price: String(item.price),
      costPrice: String(item.costPrice),
      stock: item.stock,
      specs: specs.value,
    }
  })
}

/**
 * 取消按钮
 */
const cancel = () => {
  emit('changeStep', 'cancel')
}

/**
 * 下一步处理函数
 * 验证表单数据并生成 SKU 信息
 */
const nextStep = async () => {
  if (!formRefOne.value) {
    ElMessage.error('表单初始化失败')
    return
  }

  try {
    // 1. 表单验证
    const valid = await formRefOne.value.validate()
    if (!valid) return

    // 2. 检查规格数据
    if (!productSpecData.value?.data?.length) {
      ElMessage.error('请至少添加一条商品规格')
      return
    }

    // 3. 生成 SKU 数据
    const skus = generateRequestParams()
    if (!skus) {
      // generateRequestParams 内部已有错误提示，这里直接返回
      return
    }

    // 4. 更新表单数据并进入下一步
    formData.value.skus = skus
    emit('changeStep', 'two', formData.value)
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('表单验证失败，请检查必填项')
  }
}

/**
 * 当点击"立即生成/重新生成"按钮时触发
 */
const handleSpecGenerate = () => {
  // 如果已有 SKU，则先提示"清空旧数据"
  if (productSpecData.value.data.length) {
    ElMessageBox.confirm('重新生成将清空已有规格数据，是否继续？', '提示', {
      type: 'warning',
    }).then(() => {
      checkAndGenerate()
    })
  } else {
    checkAndGenerate()
  }
}

/**
 * 根据规格数量判断是否继续生成
 */
const checkAndGenerate = () => {
  const count = getSpecCombinationsCount(productSpec.value)
  if (count > 1000) {
    // 超过1000条，直接提示不生成
    ElMessage.warning(`当前规格组合可能达到 ${count} 条，过多，请精简后再试！`)
    return
  } else if (count > 300) {
    // 大于300，小于等于1000，二次确认
    ElMessageBox.confirm(`当前将生成 ${count} 条规格组合，是否继续？`, '提示', {
      type: 'warning',
    })
      .then(() => {
        specGenerate()
      })
      .catch(() => {
        // 用户取消，不生成
      })
  } else {
    // ≤300 直接生成
    specGenerate()
  }
}

/** 选中的 SKU 行 */
const selectedRows = ref<any[]>([])

/** 表格多选变化回调 */
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

/** 批量设置的值 */
const batchValues = reactive({
  price: undefined,
  costPrice: undefined,
  stock: undefined,
  mainImage: '',
})

/** 控制批量操作对话框 */
const batchDialogVisible = ref(false)
/** 批量操作类型：set/reset/delete（暂未使用） */
const batchOperation = ref('set')

/**
 * 批量删除选中的 SKU
 */
const batchDel = () => {
  if (!selectedRows.value.length) {
    ElMessage.warning('请先选择要操作的数据')
    return
  }
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning',
  }).then(() => {
    selectedRows.value.forEach((row) => {
      const idx = productSpecData.value.data.findIndex((item) => item === row)
      if (idx > -1) {
        productSpecData.value.data.splice(idx, 1)
      }
    })
    ElMessage.success('删除成功')
  })
}

/**
 * 打开批量操作对话框
 */
const openBatchDialog = () => {
  if (!selectedRows.value.length) {
    ElMessage.warning('请先选择要操作的数据')
    return
  }
  batchDialogVisible.value = true
}

/**
 * 执行批量操作（演示的旧示例，可删除或保留）
 */
const executeBatchOperation = () => {
  switch (batchOperation.value) {
    case 'set':
      selectedRows.value.forEach((row) => {
        if (batchValues.price !== undefined) row.price = batchValues.price
        if (batchValues.costPrice !== undefined) row.costPrice = batchValues.costPrice
        if (batchValues.stock !== undefined) row.stock = batchValues.stock
      })
      ElMessage.success('批量设置成功')
      break

    case 'reset':
      selectedRows.value.forEach((row) => {
        row.price = 0
        row.costPrice = 0
        row.stock = 0
      })
      ElMessage.success('重置成功')
      break

    case 'delete':
      const selectedIds = selectedRows.value
        .map((row) =>
          productSpecData.value.data.findIndex(
            (item) => JSON.stringify(item) === JSON.stringify(row)
          )
        )
        .filter((index) => index !== -1)

      selectedIds.sort((a, b) => b - a)
      selectedIds.forEach((index) => {
        productSpecData.value.data.splice(index, 1)
      })
      ElMessage.success('删除成功')
      break
  }

  // 重置
  batchValues.price = undefined
  batchValues.costPrice = undefined
  batchValues.stock = undefined
  batchValues.mainImage = ''
}

/** 批量操作表单，用于区分"售价/成本价/库存/图片" */
const batchForm = reactive({
  type: 'price',
})

/**
 * 关闭批量操作对话框
 */
const handleBatchClose = () => {
  batchDialogVisible.value = false
  batchValues.price = undefined
  batchValues.costPrice = undefined
  batchValues.stock = undefined
  batchValues.mainImage = ''
}

/**
 * 确定批量操作 (与 executeBatchOperation 类似，此处是真正使用的操作逻辑)
 */
const handleBatchOperation = () => {
  if (!selectedRows.value.length) {
    ElMessage.warning('请先选择要操作的数据')
    return
  }

  switch (batchForm.type) {
    case 'price':
      if (batchValues.price === undefined) {
        ElMessage.warning('请输入售价')
        return
      }
      selectedRows.value.forEach((row) => {
        row.price = batchValues.price
      })
      break

    case 'costPrice':
      if (batchValues.costPrice === undefined) {
        ElMessage.warning('请输入成本价')
        return
      }
      selectedRows.value.forEach((row) => {
        row.costPrice = batchValues.costPrice
      })
      break

    case 'stock':
      if (batchValues.stock === undefined) {
        ElMessage.warning('请输入库存')
        return
      }
      selectedRows.value.forEach((row) => {
        row.stock = batchValues.stock
      })
      break

    case 'image':
      if (!batchValues.mainImage) {
        ElMessage.warning('请上传图片')
        return
      }
      selectedRows.value.forEach((row) => {
        row.mainImage = batchValues.mainImage
      })
      break
  }

  ElMessage.success('批量设置成功')

  // 重置
  batchValues.price = undefined
  batchValues.costPrice = undefined
  batchValues.stock = undefined
  batchValues.mainImage = ''
}

/**
 * 处理表格的筛选变化
 * 选中满足筛选条件的行
 * @param filters 筛选器对象
 */
const handleFilterChange = (filters: Record<string, string[]>) => {
  // 清除之前的选择
  selectedRows.value = []

  // 获取所有筛选条件
  const filterConditions = Object.entries(filters).filter(([_, values]) => values.length > 0)

  if (filterConditions.length === 0) {
    return
  }

  // 筛选符合条件的行
  const filteredRows = productSpecData.value.data.filter((row) => {
    return filterConditions.every(([columnId, values]: [string, string[]]) => {
      return values.includes(row[columnId])
    })
  })

  // 更新选中行
  selectedRows.value = filteredRows

  // 设置表格的选中状态
  nextTick(() => {
    const table = document.querySelector('.el-table')
    if (table) {
      filteredRows.forEach((row) => {
        ;(table as any).toggleRowSelection(row, true)
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.product-spec {
  :deep(.el-space) {
    width: 100%;

    .el-space__item {
      width: 100%;
    }
  }
}

.btn {
  display: inline-block;
  cursor: pointer;

  &:active {
    transform: scale(0.9, 0.9);
  }
}

.product-base {
  :deep(.el-select__wrapper.is-disabled) {
    cursor: pointer;
    background-color: #fff;
  }
}

.contentbox {
  display: flex;
  flex-direction: column;
  height: 100%;

  .content {
    flex: 1;
    overflow: auto;
  }

  .footer {
    padding: 10px;
  }
}

.product-profile-text {
  min-width: 250px;
  height: 32px;
  padding: 0 12px;
  line-height: 32px;
  color: var(--el-text-color-regular);
  cursor: pointer;
  background-color: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  transition: var(--el-transition-all);

  &:hover {
    border-color: var(--el-color-primary);
  }

  &:empty::before {
    color: var(--el-text-color-placeholder);
    content: attr(placeholder);
  }
}

.batch-set-dialog {
  :deep(.el-message-box__message) {
    padding: 0;
  }
}

.batch-set-form {
  padding: 10px 0;

  .form-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0;
    }

    label {
      width: 70px;
      padding-right: 12px;
      color: var(--el-text-color-regular);
      text-align: right;
    }
  }
}

.batch-reset-tip,
.batch-delete-tip {
  padding: 20px 0;
}

.batch-operation-form {
  padding: 20px;

  :deep(.el-form-item:last-child) {
    margin-bottom: 0;
  }
}

.spec-container {
  width: 100%;
}

.spec-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.spec-item {
  min-width: 0;
  padding: 16px;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;

  .spec-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    .spec-name {
      overflow: hidden;
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-primary);
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .spec-values {
    .value-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      width: 100%;
    }

    .spec-tag {
      margin: 0;
    }
  }
}
</style>
