import { getSuperTableToken, getBaseToken } from '@/api'

export async function login(params: any) {
  const result = await getSuperTableToken({ loginName: params.username, password: params.password })
  return result
}