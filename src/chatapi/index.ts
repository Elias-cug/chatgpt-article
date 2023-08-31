import OpenAI from 'openai'
import { HttpsProxyAgent } from 'https-proxy-agent'

console.log(process.env)

const openai = new OpenAI({
  apiKey: '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',
  httpAgent: new HttpsProxyAgent('http://127.0.0.1:7890'),
  dangerouslyAllowBrowser: true,
})

export function chatCompletions(param: any): any {
  return openai.chat.completions
    .create(param)
    .then(res => {
      return { data: res, error: null }
    })
    .catch(err => {
      return { data: null, error: err }
    })
}
