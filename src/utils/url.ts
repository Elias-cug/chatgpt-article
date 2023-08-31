import qs from 'qs'

export function stringifyUrl(obj: Record<string, string>) {
  return qs.stringify(obj, { addQueryPrefix: true })
}