import OpenAI from 'openai'
import { chatgptKey } from "@/utils/key"
import { HttpsProxyAgent } from 'https-proxy-agent'

export const openai = new OpenAI({
  apiKey: chatgptKey,
  httpAgent: new HttpsProxyAgent('http://127.0.0.1:7890'),
  dangerouslyAllowBrowser: true,
  // baseURL: "http://20.222.195.246/v1"
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


// export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890