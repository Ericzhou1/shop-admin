<template>
  <div class="app-container">
    <el-row justify="space-between">
      <el-col :span="24" :offset="0">
        <img
          :src="supplierInfo.logo.url"
          style="
            width: 100px;
            height: 100px;
            margin-right: 20px;
            margin-bottom: 20px;
            float: left;
          "
        />
        <el-descriptions border :column="2" :title="supplierInfo.name">
          <el-descriptions-item label="供应商编号">
            {{ supplierInfo.code }}
          </el-descriptions-item>
          <el-descriptions-item label="统一社会信用代码">
            {{ supplierInfo.creditCode }}
          </el-descriptions-item>
          <el-descriptions-item label="供应商分类">
            {{ supplierInfo.typeName }}
          </el-descriptions-item>
          <el-descriptions-item label="成立日期">
            {{ supplierInfo.createDate }}
          </el-descriptions-item>
          <el-descriptions-item label="供应商地址">
            {{ codeToText[supplierInfo.provinceId] }}
            {{ codeToText[supplierInfo.cityId] }}
            {{ codeToText[supplierInfo.districtId] }}
          </el-descriptions-item>
          <el-descriptions-item label="法人代表">
            {{ supplierInfo.legalRepresentative }}
          </el-descriptions-item>
          <el-descriptions-item label="供应商具体地址">
            {{ supplierInfo.address }}
          </el-descriptions-item>
          <el-descriptions-item label="注册资本(万元)">
            {{ supplierInfo.registeredCapital }}
          </el-descriptions-item>
          <el-descriptions-item :span="1" label="供应商简介">
            {{ supplierInfo.intro }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col :span="24" :offset="0" style="margin-top: 20px">
        <el-descriptions border :column="4" title="联系人信息">
          <el-descriptions-item label="联系人姓名">
            {{ supplierInfo.contcat.name }}
          </el-descriptions-item>
          <el-descriptions-item label="手机号">
            {{ supplierInfo.contcat.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="微信号">
            {{ supplierInfo.contcat.weixin }}
          </el-descriptions-item>
          <el-descriptions-item label="邮箱">
            {{ supplierInfo.contcat.email }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col :span="24" :offset="0" style="margin-top: 20px">
        <el-descriptions title="附件信息">
          <el-descriptions-item label="资质图片">
            <el-space size="small">
              <template
                v-for="image in supplierInfo.qualification"
                :key="image.url"
              >
                <img
                  :src="image.url"
                  :alt="image.name"
                  style="
                    width: 100px;
                    height: 100px;
                    margin-left: 20px;
                    margin-top: 20px;
                    float: left;
                  "
                />
              </template>
            </el-space>
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getsupplierInfo } from '../../../api/merchant/companyInformation'
import { regionData, codeToText } from 'element-china-area-data'
const options = regionData
const supplierInfo = ref<any>({
  address: '',
  balance: 0,
  cityId: 0,
  code: '',
  contcat: {
    email: '',
    name: '',
    phone: '',
    weixin: ''
  },
  createDate: '',
  createdAt: '',
  creator: 0,
  creditCode: '',
  districtId: 0,
  id: 0,
  intro: '',
  legalRepresentative: '',
  logo: {
    name: '',
    url: ''
  },
  name: '',
  paymentAccounts: {
    corporateAccountName: '',
    corporateAccountNumber: '',
    corporateBankBranch: '',
    corporateBankName: '',
    personalAccountName: '',
    personalAccountNumber: '',
    personalBankBranch: '',
    personalBankName: ''
  },
  pendingWithdrawal: 0,
  provinceId: 0,
  qualification: [
    {
      name: '',
      url: ''
    }
  ],
  registeredCapital: '',
  sort: 0,
  specialIntro: {
    name: '',
    url: ''
  },
  specialMark: {
    name: '',
    url: ''
  },
  status: 0,
  totalRevenue: 0,
  typeId: 0,
  updatedAt: '',
  website: '',
  withdrawal: 0
})

onMounted(() => {
  getsupplierInfo().then((res: any) => {
    supplierInfo.value = res.data
  })
})
</script>

<style lang="scss" scoped>
:deep(.el-descriptions__content) {
  word-wrap: break-word; /* 确保长单词能换行 */
  word-break: break-all; /* 强制长单词在任何地方换行 */
  overflow-wrap: break-word; /* 确保长单词在需要时换行 */
  white-space: normal !important;
}
.app-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 110px);

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
      justify-content: start;
      .svg-icon {
        flex: 0 0 50%;
      }
    }
  }
}
</style>
