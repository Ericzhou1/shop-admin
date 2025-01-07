<template>
  <div>
    <template v-if="type === 'add'">
      <el-descriptions>
        <el-descriptions-item label="可提现金额 ">
          <span style="font-size: 24px; font-weight: 700" class="mr-5">
            {{ supplierInfo.balance }}</span
          >
          <span class="btn" @click="applyAll">全部提现</span>
        </el-descriptions-item>
      </el-descriptions>
      <el-row>
        <el-col :span="12">
          <el-form-item label="提现金额:" required>
            <el-input v-model="applyReq.amount" palceholder="请输入提现金额" />
          </el-form-item>
        </el-col>

        <el-col :span="12" class="pl-2">
          <el-form-item label="账户类型:" required>
            <el-select
              v-model="applyReq.bankType"
              class="w-full"
              @change="bankTypeChange"
            >
              <el-option :value="1" label="对私账户" />
              <el-option :value="2" label="对公账户" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="银行卡账号:">
            <el-input v-model="applyReq.bankCard" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="pl-2">
          <el-form-item label="银行卡户名:">
            <el-input v-model="applyReq.bankAccountName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="pl-2">
          <el-form-item label="银行名称:">
            <el-input v-model="applyReq.bankName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="pl-2">
          <el-form-item label="开户支行:">
            <el-input v-model="applyReq.bankBranch" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="pl-2">
          <el-form-item label="开票金额:">
            <el-input v-model="applyReq.amount" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="pl-2">
          <el-form-item label="发票邮箱:"> 2176992828@qq.com </el-form-item>
        </el-col>
      </el-row>
      <div class="text-center">
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>

    <template v-if="type === 'info'">
      <el-descriptions>
        <el-descriptions-item label="提现金额：">
          <span style="font-size: 24px; font-weight: 700" class="mr-5">
            {{ infoData.amount }}</span
          >
          <el-tag v-if="tab !== 1" :type="statusMap[infoData.status]?.type">
            {{ statusMap[infoData.status]?.name }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions border class="mt-5 mb-5">
        <el-descriptions-item label="选择账户：">
          {{ infoData.bankType === 1 ? '对私账户' : '对公账户' }}
        </el-descriptions-item>
        <el-descriptions-item label="卡号：">
          {{ infoData.bankCard }}
        </el-descriptions-item>
        <el-descriptions-item label="户名：">
          {{ infoData.bankAccountName }}
        </el-descriptions-item>
        <el-descriptions-item label="开户行名称：">
          {{ infoData.bankBranch }}
        </el-descriptions-item>
        <el-descriptions-item label="发起时间：">
          {{ infoData.created }}
        </el-descriptions-item>
        <el-descriptions-item label="提现日期：">
          {{ infoData.auditAt }}
        </el-descriptions-item>
        <el-descriptions-item label="开票金额：">
          {{ infoData.amount }}
        </el-descriptions-item>
      </el-descriptions>
    </template>
  </div>
</template>

<script setup lang="ts">
import { createWidthdraw, withdrawInfo } from '@/api/financial'

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  tab: {
    type: Number,
    default: 0
  },
  supplierInfo: {
    type: Object,
    default: () => {}
  },
  allStatusMap: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['option-success', 'close-dialog'])

const infoData = ref<any>({
  status: 0
})
const applyReq = ref<any>({
  amount: 0,
  bankAccountName: '',
  bankBranch: '',
  bankCard: '',
  bankName: '',
  bankType: 1 // 1 对私 2 对公
})
const statusMap: any = {
  1: {
    name: '待审核',
    type: ''
  },
  2: {
    name: ' 已审核',
    type: 'success'
  },
  3: {
    name: '已驳回',
    type: 'info'
  }
}
onMounted(() => {
  bankTypeChange()
})
const update = async (data: any) => {
  infoData.value = data
  if (props.type !== 'add') {
    const res = await withdrawInfo({ no: data.orderNo })
    infoData.value = res.data
  }
}
const applyAll = () => {
  applyReq.value.amount = props.supplierInfo.balance
}
// 切换账号类型
const bankTypeChange = () => {
  if (applyReq.value.bankType === 1) {
    applyReq.value.bankAccountName =
      props.supplierInfo.paymentAccounts.personalAccountName
    applyReq.value.bankBranch =
      props.supplierInfo.paymentAccounts.personalBankBranch
    applyReq.value.bankCard =
      props.supplierInfo.paymentAccounts.personalAccountNumber
    applyReq.value.bankName =
      props.supplierInfo.paymentAccounts.personalBankName
  } else {
    applyReq.value.bankAccountName =
      props.supplierInfo.paymentAccounts.corporateAccountName
    applyReq.value.bankBranch =
      props.supplierInfo.paymentAccounts.corporateBankBranch
    applyReq.value.bankCard =
      props.supplierInfo.paymentAccounts.corporateAccountNumber
    applyReq.value.bankName =
      props.supplierInfo.paymentAccounts.corporateBankName
  }
}

const save = async () => {
  try {
    if (applyReq.value.amount === 0) {
      ElMessage.warning('提现金额不能为0！')
      return
    } else if (Object.values(applyReq.value).some((value: any) => !value)) {
      ElMessage.warning('请完善信息！')
      return
    }
    await createWidthdraw(applyReq.value)
    emit('option-success')
    ElMessage.success('操作成功！')
  } catch (e: any) {
    console.log(e)
  }
}
defineExpose({
  update
})
</script>
