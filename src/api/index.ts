
import { baseRequest, superTableRequest } from '@/service'

interface LoginParam {
  loginName: string,
  password: string
}

/**
 * 2.0 登录
 * @param loginName
 * @param password
 * @returns
 */
export const getSuperTableToken = async (params: LoginParam) => {
  const result = superTableRequest.get(`/personnelManagement/loginNameToken`, { params })
  return result
}

/**
 * 使用基础模块登录
 * @param loginName
 * @param password
 * @returns
 */
export const getBaseToken = async (params: LoginParam) => {
  const result = baseRequest.get(`/personnelManagement/loginNameToken`, { params })
  return result
}

/**
 * 获取用户基本信息 兼容1.0 2.0
 * @param token
 * @returns
 */
export const getUserMy = async (token: string) => {
  const result = baseRequest.get(`/users/my?token=${token}`)
  return result
}