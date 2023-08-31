
import { createRequest } from './request'
import { getServiceEnvConfig } from '../../.env-config'

const { urlForBase, urlForSuperTable } = getServiceEnvConfig(import.meta.env)

export const baseRequest = createRequest({ baseURL: urlForBase })
export const superTableRequest = createRequest({ baseURL: urlForSuperTable })
