/**
 * 登录用户信息
 */
export interface UserInfo {
  id: number
  merchant_id: number
  merchant_name: string
  name: string
  username: string
  roleInfo: RoleInfo
  store_id: number
}

interface RoleInfo {
  id: number
  level: number
  name: string
  menu_ids: string[]
}

/**
 * 用户查询对象类型
 */
export interface UserQuery {
  keyword?: string
  genders?: number
  normal?: number
  pagination: PageQuery
}

/**
 * 用户列表
 */
export interface UserList<T> {
  /** 数据列表 */
  users: T
  /** 总数 */
  total: number
}

/**
 * 用户分页对象
 */
export interface UserPageVO {
  faceURL?: string // 头像
  nickname?: string // 昵称
  userID?: string // id
  gender?: number // 性别
  phoneNumber?: number // 手机号
  level?: number // 角色
  status?: string // 在线状态
}

/**
 * 用户表单类型
 */
export interface UserForm {
  /**
   * 用户头像
   */
  avatar?: string
  /**
   * 部门ID
   */
  deptId?: number
  /**
   * 邮箱
   */
  email?: string
  /**
   * 性别
   */
  gender?: number
  /**
   * 用户ID
   */
  id?: number
  mobile?: string
  /**
   * 昵称
   */
  nickname?: string
  /**
   * 角色ID集合
   */
  roleIds?: number[]
  /**
   * 用户状态(1:正常;0:禁用)
   */
  status?: number
  /**
   * 用户名
   */
  username?: string
}
