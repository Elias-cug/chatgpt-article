import { defineStore } from 'pinia'
import { prompts } from '@/prompts/index'

interface PromptStore {
  keyParam: any,
  articleParam: any,
  summaryParam: any
}

export const usePromptStore = defineStore('prompt-store', {
  state: (): PromptStore => ({
    keyParam: {
      prompt: prompts.生成关键信息,
      otherParam: {
        model: 'gpt-3.5-turbo',
        temperature: 1
      }
    },
    articleParam: {
      prompt: prompts.文章生成器,
      otherParam: {
        model: 'gpt-3.5-turbo',
        temperature: 1
      }
    },
    summaryParam: {
      prompt: prompts.文章补充,
      otherParam: {
        model: 'gpt-3.5-turbo',
        temperature: 1
      }
    },
  }),
  actions: {
    setKeyParam(payload: any) {
      this.keyParam = payload
    },
    setArticleParam(payload: any) {
      this.articleParam = payload
    },
    setSummaryParam(payload: any) {
      this.summaryParam = payload
    },
  },
})
