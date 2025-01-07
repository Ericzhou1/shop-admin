<template>
  <div class="supplier app-container">
    <el-row class="" justify="space-between" items="center">
      <el-col :span="21" class="flex">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="" style="width: 200px">
            <el-select
              v-model="formInline.companyId"
              style="width: 100%"
              @change="doGetStoreOptions"
              placeholder="请选择商户公司"
            >
              <el-option
                v-for="item in companyOptions"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="" style="width: 200px">
            <el-select
              v-model="formInline.storeId"
              style="width: 100%"
              placeholder="请选择门店"
              @change="getList"
            >
              <el-option
                v-for="item in storeOptions"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="" style="width: 200px">
            <el-select
              v-model="formInline.spaceId"
              style="width: 100%"
              @change="getList"
              placeholder="请选择空间"
            >
              <el-option
                v-for="item in spaceOptions"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="getList" :icon="Search">
              搜索
            </el-button>
            <el-button type="primary" @click="resetSearch" :icon="RefreshRight">
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
      <el-table-column prop="companyName" label="商户名称" min-width="60" />
      <el-table-column prop="storeName" label="门店名称" min-width="60" />
      <el-table-column prop="spaceType" label="类型名称" min-width="60">
        <template #default="scope">
          {{
            spaceOptions.find((item: any) => item.value == scope.row.spaceType)
              ?.label
          }}
        </template>
      </el-table-column>

      <!--   <el-table-column
        prop="chargingStandard"
        label="收费标准(元/m2)"
        min-width="60"
      />
       <el-table-column prop="totalArea" label="空间总面积(m2)" min-width="60" />
      <el-table-column
        prop="occupiedArea"
        label="已占用面积(m2)"
        min-width="60"
      /> -->
      <el-table-column prop="orderNumber" label="订单号" min-width="60" />

      <!-- <el-table-column prop="occupancyStatus" label="占用状态" min-width="60">
        <template #default="scope">
          <el-tag
            :type="scope.row.occupancyStatus == 'ON' ? 'danger' : 'success'"
            effect="dark"
          >
            {{ scope.row.occupancyStatus == 'ON' ? '占用' : '空闲' }}
          </el-tag>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next, sizes, jumper "
      :total="pager.total"
      :page-sizes="[10, 20, 30, 40]"
      v-model:current-page="pager.page"
      v-model:page-size="pager.pageSize"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      justify="center"
      class="page-footer"
    >
      <template #junmper>
        <el-input placeholder="跳转页号" />
      </template>
    </el-pagination>
  </div>
</template>
<script setup lang="ts">
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import {
  supplierStoreList,
  supplierCompanyOptions,
  supplierStoreOptions,
  supplierSpaceOptions
} from '@/api/procure/supplierSellOrder'
const pager = ref<any>({ total: 0, page: 1, pageSize: 10 })
const companyOptions = ref<any>([])
const storeOptions = ref<any>([])
const spaceOptions = ref<any>([
  { label: '展位', value: 'BOOTH' },
  { label: '仓储', value: 'STORAGE' },
  { label: '堆头', value: 'STACK' }
])
const isLoading = ref(false)
const formInline = reactive<any>({
  companyId: '',
  storeId: '',
  spaceId: ''
})

const dataList = ref<any>()

onMounted(() => {
  doGetCompanyOptions()

  getList()
})
function doGetCompanyOptions() {
  supplierCompanyOptions()
    .then((res) => {
      companyOptions.value = res.data.items
    })
    .catch(() => {})
}

function doGetStoreOptions(e: any) {
  formInline.storeId = ''
  let data = {
    companyId: e
  }
  supplierStoreOptions(data)
    .then((res) => {
      storeOptions.value = res.data.items
    })
    .catch(() => {})
}

function doGetSpaceOptions() {
  let data = {
    storeId: 11
  }
  supplierSpaceOptions(data)
    .then((res) => {
      spaceOptions.value = res.data.items
    })
    .catch(() => {})
}
// 获取列表
function getList() {
  isLoading.value = true
  const req = {
    page: pager.value.page,
    pageSize: pager.value.pageSize,
    companyId: formInline.companyId,
    storeId: formInline.storeId,
    spaceId: formInline.spaceId
  }

  supplierStoreList(req)
    .then((res) => {
      dataList.value = res.data.items
      pager.value.total = res.data.total
      isLoading.value = false
    })
    .catch(() => {
      isLoading.value = false
    })
}
const tableRowClassName = (row: any) => {
  if (row.rowIndex % 2 == 0) {
    return 'even-row'
  } else {
    return 'odd-row'
  }
}

// 重置搜索
const resetSearch = () => {
  formInline.companyId = ''
  formInline.storeId = ''
  formInline.spaceId = ''
  pager.value.page = 1
  pager.value.pageSize = 10
  getList()
}

const handleSizeChange = (val: number) => {
  pager.value.pageSize = val
  getList()
}
// 切换分页
const handleCurrentChange = (val: number) => {
  pager.value.page = val
  getList()
}
</script>
<style lang="scss" scoped>
:deep(.el-table .even-row td) {
  text-align: center;
}
:deep(.el-dialog__header) {
  text-align: center;
}

:deep(.el-checkbox-group) {
  flex-wrap: wrap;
  .el-checkbox {
    margin-right: 0px;
    font-weight: normal;
  }
}
:deep(.el-radio, .el-checkbox) {
  font-weight: normal;
}
.supplier {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  .table-container {
    flex: 1;
    overflow: auto;
  }
  .page-footer {
    height: 30px;
  }
  .el-table--default {
    margin-bottom: 20px;

    .operation {
      display: flex;
      justify-content: center;
      .svg-icon {
        flex: 1;
      }
    }
  }
}
.total-input {
  text-align: center;
  flex-direction: row;
  flex-wrap: nowrap;
  --el-component-size: 30px;
  :deep(.el-select__wrapper) {
    border-radius: 10px 0 0 10px;
    min-height: 32px !important;
  }
  .input-group {
    border: 1px solid var(--el-border-color);
    border-left: none;
    height: 32px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    border-radius: 0 10px 10px 0;
    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color))
        inset;
      cursor: default;
      .el-input__inner {
        cursor: default !important;
        text-align: center;
      }
    }
    :deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
      height: unset !important;
    }
  }
}
</style>
