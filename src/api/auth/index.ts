import request from '@/utils/request'

const AuthAPI = {
  /** 登录接口*/
  login(data: any) {
    return request<any, any>({
      url: `/user/login/password`,
      method: 'post',
      data,
    })
  },

  /** 刷新 token 接口*/
  refreshToken(refreshToken: string) {
    return request<any, LoginResult>({
      url: `/refresh-token`,
      method: 'post',
      data: { refreshToken: refreshToken },
      headers: {
        Authorization: 'no-auth',
      },
    })
  },

  /** 注销接口*/
  logout() {
    return request({
      url: `/logout`,
      method: 'delete',
    })
  },

  /** 获取验证码接口*/
  getCaptcha() {
    return request<any, CaptchaResult>({
      url: `/captcha`,
      method: 'get',
    })
  },
}

export default AuthAPI

/** 登录请求参数 */
export interface LoginData {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
}

/** 登录响应 */
export interface LoginResult {
  type: string
  token: string
  shopInfo: string
}

/** 验证码响应 */
export interface CaptchaResult {
  /** 验证码缓存key */
  captchaKey: string
  /** 验证码图片Base64字符串 */
  captchaBase64: string
}
