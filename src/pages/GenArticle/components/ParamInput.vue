<script lang="ts" setup>
import { ref } from 'vue'
import { usePromptStore } from '@/store/promptStore'
import { useMessage } from 'naive-ui'

const store = usePromptStore()
const message = useMessage()

const keyInput = ref(JSON.stringify(store.keyParam))
const articleInput = ref(JSON.stringify(store.articleParam))
const summaryInput = ref(JSON.stringify(store.summaryParam))
const showParamSet = ref(false)

const openCustomParam = () => {
  showParamSet.value = !showParamSet.value
  showParamSet.value && message.info("请注意点击保存后生效")
}

const saveParam = () => {
  try {
    store.setKeyParam(JSON.parse(keyInput.value))
    store.setArticleParam(JSON.parse(articleInput.value))
    store.setSummaryParam(JSON.parse(summaryInput.value))
    message.info("保存成功")
  } catch (error) {
    message.error("json格式错误")
  }
}
</script>

<template>
  <div class="flex flex-col gap-12px p-12px">
    <div class="flex gap-12px justify-between">
      <div class="left-top mb-1 text-white cursor-pointer">
        <div class="flex gap-4px items-center" @click="openCustomParam">自定义参数</div>
      </div>
      <div v-if="showParamSet" class="left-top mb-1 text-white cursor-pointer">
        <div class="flex gap-4px items-center" @click="saveParam">保存参数</div>
      </div>
    </div>
    <div v-if="showParamSet" class="flex flex-col gap-12px">
      <div>
        <div class="text-white mb-8px">关键词生成:</div>
        <n-input type="textarea" :rows="5" v-model:value="keyInput" />
      </div>
      <div>
        <div class="text-white mb-8px">文章生成:</div>
        <n-input type="textarea" :rows="5" v-model:value="articleInput" />
      </div>
      <div>
        <div class="text-white mb-8px">文章补充:</div>
        <n-input type="textarea" :rows="5" v-model:value="summaryInput" />
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>
