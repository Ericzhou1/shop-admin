import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { CaptchaResult, LoginData, LoginResult, UpdatePassword } from './types'
import md5 from 'md5'

/**
 * 登录API
 *
 * @param data {LoginData}
 * @returns
 */
export function loginApi(data: LoginData): AxiosPromise<LoginResult> {
  const params = {
    username: data.account,
    password: data.password,
    code: data.code,
    codeKey: data.codeKey
  }
  return request({
    url: '/account/login',
    method: 'post',
    data: params
  })
}

/**
 * 登出API
 */
export function logoutApi() {
  return request({
    url: '/account/logout',
    method: 'post'
  })
}

/**
 * 获取验证码
 */
export function getCaptchaApi(): AxiosPromise<CaptchaResult> {
  return request({
    url: '/account/captcha',
    method: 'post'
  })
}

// 修改密码

export function updatePassword(data: UpdatePassword): AxiosPromise<any> {
  return request({
    url: '/account/update-password',
    method: 'post',
    data: data
  })
}

// 账户权限

export function accountAccess(): AxiosPromise<any> {
  return request({
    url: '/account/menus',
    method: 'post'
  })
}
