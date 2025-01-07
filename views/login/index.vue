<template>
  <div class="login-container">
    <!-- 登录表单 -->
    <div class="card-bg">
      <el-card
        shadow="never"
        class="z-1 !border-none w-100 !bg-transparent !rounded-4% <sm:w-83"
      >
        <div class="text-center relative">
          <img
            src="@/assets/logo.png"
            alt=""
            style="max-height: 75px; margin-bottom: 6px"
          />
          <h3>艾兴合供应商管理后台</h3>
        </div>
        <el-form
          ref="loginFormRef"
          :model="loginData"
          :rules="loginRules"
          class="login-form"
        >
          <el-form-item prop="account">
            <div class="p-2">
              <svg-icon icon-class="user" size="17" />
            </div>
            <el-input
              ref="account"
              v-model="loginData.account"
              class="flex-1"
              size="large"
              placeholder="请输用户名"
              name="account"
            />
          </el-form-item>

          <el-tooltip
            :disabled="isCapslock === false"
            content="Caps lock is On"
            placement="right"
          >
            <el-form-item prop="password">
              <span class="p-2">
                <svg-icon icon-class="password" size="17" />
              </span>
              <el-input
                v-model="loginData.password"
                class="flex-1"
                placeholder="请输入密码"
                :type="passwordVisible ? 'input' : 'password'"
                size="large"
                name="password"
                @keyup="checkCapslock"
                @keyup.enter="handleLogin"
              />
              <!-- <span class="mr-2" > -->
              <svg-icon
                @click="passwordVisible = !passwordVisible"
                :icon-class="passwordVisible ? 'eye-open' : 'eye'"
                class="cursor-pointer mr-2"
                color="#DAD2CF"
                size="19"
              />
              <!-- </span> -->
            </el-form-item>
          </el-tooltip>
          <div class="login-code flex justify-between">
            <el-form-item prop="code" class="w-45">
              <span class="p-2">
                <svg-icon icon-class="security_code" size="17" />
              </span>
              <el-input
                v-model="loginData.code"
                placeholder="请输入验证码"
                size="large"
                name="code"
                @keyup="checkCapslock"
                @keyup.enter="handleLogin"
              />
            </el-form-item>
            <el-form-item class="w-25" style="border-color: #d7d0d0">
              <img :src="captchaData.verifyCodeBase" style="width: 100%" />
            </el-form-item>
            <el-button
              size="small"
              style="
                height: 50px;
                border: 1px solid #d7d0d0;
                border-radius: 4px;
                background-color: transparent;
                min-width: unset;
              "
              @click="getCaptcha"
              >刷新
            </el-button>
          </div>

          <el-button
            size="large"
            :loading="loading"
            type="primary"
            class="w-full"
            @click.prevent="handleLogin"
            >登录
          </el-button>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import router from '@/router'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { useSettingsStore } from '@/store/modules/settings'

// 状态管理依赖
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'

// API依赖
import { LocationQuery, LocationQueryValue, useRoute } from 'vue-router'
import { LoginData, CaptchaResult } from '@/api/auth/types'

const settingsStore = useSettingsStore()

const { title, version } = settingsStore
/**
 * 明亮/暗黑主题切换
 */
const isDark = ref<boolean>(settingsStore.theme === 'dark')
const handleThemeChange = (isDark: any) => {
  useToggle(isDark)
  settingsStore.changeSetting({
    key: 'theme',
    value: isDark ? 'dark' : 'light'
  })
}

/**
 * 根据屏幕宽度切换设备模式
 */
const appStore = useAppStore()
const WIDTH = 992 // 响应式布局容器固定宽度  大屏（>=1200px） 中屏（>=992px） 小屏（>=768px）
const { width } = useWindowSize()
watchEffect(() => {
  if (width.value < WIDTH) {
    appStore.toggleDevice('mobile')
  } else {
    appStore.toggleDevice('desktop')
  }
})

const loading = ref(false) // 按钮loading
const isCapslock = ref(false) // 是否大写锁定
const passwordVisible = ref(false) // 密码是否可见
const loginFormRef = ref(ElForm) // 登录表单ref

const loginData = ref<LoginData>({
  account: '',
  password: '',
  code: '',
  codeKey: ''
})

const captchaData = ref<CaptchaResult>({
  verifyCodeKey: '',
  verifyCodeBase: ''
})

const { t } = useI18n()
const loginRules = computed(() => {
  const prefix = appStore.language === 'en' ? 'Please enter ' : '请输入'
  return {
    account: [
      {
        required: true,
        trigger: 'blur',
        message: `${prefix}${t('login.account')}`
      }
    ],
    password: [
      {
        required: true,
        trigger: 'blur',
        message: `${prefix}密码`
      }
    ],
    code: [
      {
        required: true,
        trigger: 'blur',
        message: `${prefix}验证码`
      }
    ]
  }
})

/**
 * 检查输入大小写状态
 */
function checkCapslock(e: any) {
  const { key } = e
  isCapslock.value = key && key.length === 1 && key >= 'A' && key <= 'Z'
}

/**
 * 登录
 */
const route = useRoute()
const userStore = useUserStore()
async function handleLogin() {
  try {
    const valid = await loginFormRef.value.validate()
    if (valid) {
      loading.value = true
      console.log()
      await userStore.login(loginData.value)
      const query: LocationQuery = route.query
      const redirect =
        (query.redirect as LocationQueryValue) ?? '/merchant/companyInformation'
      const otherQueryParams = Object.keys(query).reduce(
        (acc: any, cur: string) => {
          if (cur !== 'redirect') acc[cur] = query[cur]
          return acc
        },
        {}
      )
      router.push({ path: redirect, query: otherQueryParams })
    }
  } catch (error) {
    loginData.value.code = ''
    getCaptcha()
  } finally {
    loading.value = false
  }
}

function getCaptcha() {
  userStore.getCaptcha().then((res) => {
    captchaData.value.verifyCodeBase = res.verifyCodeBase
    captchaData.value.verifyCodeKey = res.verifyCodeKey
    loginData.value.codeKey = res.verifyCodeKey
  })
}

onMounted(() => {
  getCaptcha()
})
</script>

<style lang="scss" scoped>
.dark .login-container {
  background: url('@/assets/images/login-bg-dark.jpg') no-repeat center right;
}

.login-container {
  @apply w-full h-full flex-center;
  justify-content: end;
  align-items: center;
  overflow-y: auto;
  background: url('@/assets/images/login-bg.png') no-repeat;
  background-size: 100% 100%;

  .top-container {
    // max-height: 30px;
    background-color: #5793df;
    color: #fff;
  }
  .card-bg {
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.42);
  }

  :deep(.el-card) {
    background: rgba(255, 255, 255, 0.42);
    border: none;
    min-height: 60%;
    padding: 20px 0;
  }

  .login-form {
    padding: 20px 10px;
    .captcha {
      position: absolute;
      top: 0;
      right: 0;

      .image-slot {
        display: flex;
        align-items: center;
        justify-content: right;
        width: 100%;
        height: 100%;
        font-size: 18px;
        color: var(--el-text-color-secondary);
        background: var(--el-fill-color-light);

        svg {
          margin-right: 10px;
        }
      }
    }
  }
}

.el-form-item {
  background: var(--el-input-bg-color);
  // border: 1px solid #333;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
  &:focus {
    border-color: var(--el-color-primary);
  }
  // border-radius: 5px;
}
:deep(.el-form-item__content) {
  flex-wrap: nowrap;
}
:deep(.el-form-item--default) {
  margin-bottom: 30px;
}

:deep(.el-input) {
  .el-input__wrapper {
    padding: 0;
    background-color: transparent;
    box-shadow: none;

    &.is-focus,
    &:hover {
      box-shadow: none !important;
    }

    input:-webkit-autofill {
      transition: background-color 1000s ease-in-out 0s; /* 通过延时渲染背景色变相去除背景颜色 */
    }
  }
}
</style>
