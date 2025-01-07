/**
 * 登录请求参数
 */
export interface LoginData {
  /**
   * 用户名
   */
  account: string
  /**
   * 密码
   */
  password: string
  /**
   * 验证码
   */
  code: string
  /**
   * 验证码key
   */
  codeKey: string
}

/**
 * 登录响应
 */
export interface LoginResult {
  exp: string
  token: string
}

/**
 * 验证码响应
 */
export interface CaptchaResult {
  /**
   * 验证码缓存key
   */
  // captchaKey: string
  verifyCodeKey: string
  /**
   * 验证码图片Base64字符串
   */
  // captchaBase64: string
  verifyCodeBase: string
}

export interface UpdatePassword {
  // id: number
  password: string
}
