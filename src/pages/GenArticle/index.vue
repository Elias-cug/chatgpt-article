<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { NConfigProvider } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import { nanoid } from 'nanoid'
import { openai } from '@/chatapi/index'
import IconChatgpt from '@/components/SvgIcon/IconChatgpt.vue'
// import IconAdd from '@/components/SvgIcon/IconAdd.vue'
import IconMore from '@/components/SvgIcon/IconMore.vue'
import { usePromptStore } from '@/store/promptStore'
import ParamInputVue from './components/ParamInput.vue'

const store = usePromptStore()

const state = {
  1: '请输入前置资料',
  2: '请补充章节资料，没有则点击发送继续...',
  3: '如需补充，请点击发送进行补充'
}

const stepList = {
  1: '请输入前置资料',
  2: '请输入补充材料，没有则点击发送继续...',
  3: '如需补充，请点击发送进行补充'
}

const genParamForKeys = (msg: string): any => {
  return {
    messages: [{ ...store.keyParam.prompt }, { role: 'user', content: msg }],
    model: 'gpt-3.5-turbo',
    temperature: 1,
    ...store.keyParam.otherParam,
    stream: true,
  }
}

const genParamForArticle = (msg: string): any => {
  return {
    messages: [{ ...store.articleParam.prompt }, { role: 'user', content: msg }],
    model: 'gpt-3.5-turbo',
    temperature: 1,
    ...store.articleParam.otherParam,
    stream: true,
  }
}

const genParamForFinish = (msg: string): any => {
  return {
    messages: [{ ...store.summaryParam.prompt }, { role: 'user', content: msg }],
    model: 'gpt-3.5-turbo',
    temperature: 1,
    ...store.summaryParam.otherParam,
    stream: true,
  }
}

type StepType = 1 | 2

const chatList = ref<any>([])
const message = ref('')
const loading = ref(false)
const curStep = ref<StepType>(1)
const systemName = ref('chat-gpt')
const userName = ref('Lee')
const keyInfo = ref('')

const onSend = async () => {
  loading.value = true
  chatList.value.push({
    user: userName.value,
    message: message.value,
    isHtml: false,
  })
  const msg = message.value
  message.value = ''
  const param: any = {
    1: genParamForKeys(msg),
    2: genParamForArticle(keyInfo.value + message.value),
  }
  const data = await chatCompletions(param[curStep.value])
  if (curStep.value === 1) {
    keyInfo.value = data.message.replace(/<br\/>/g, '').replace(/-/g, '')
  }
  if (curStep.value === 2) {
    await chatCompletions(genParamForFinish(data.message), true)
  }
  
  curStep.value += 1

  if (curStep.value > 2) {
    curStep.value = 1
  }

  loading.value = false
}

const onReset = () => {
  loading.value = false
  curStep.value = 1
}

async function chatCompletions(param: any, flag = false) {
  if (!flag) {
    chatList.value.push({
      user: systemName.value,
      message: '',
      isHtml: false,
    })
  } else {
    const len = chatList.value.length
    const n = chatList.value[len - 1]
    chatList.value.splice(len - 1, 1, {
      user: systemName.value,
      message: n.message + '<br/><br/>',
      isHtml: false,
    })
  }
  const len = chatList.value.length
  const stream: any = await openai.chat.completions.create(param)
  for await (const part of stream) {
    let msg = part.choices[0]?.delta?.content || ''
    msg = msg.replace(/\n/g, '<br/>')
    const n = chatList.value[len - 1]
    chatList.value.splice(len - 1, 1, {
      user: systemName.value,
      message: n.message + msg,
      isHtml: true,
    })
    const ele = document.querySelector('#scrollBar .n-scrollbar-container')
    if (ele) {
      ele.scrollTop = 100000
    }
  }
  return chatList.value[len - 1]
}

onMounted(() => {
  chatList.value.push({
    id: nanoid(4),
    user: systemName.value,
    message: stepList[curStep.value],
    isHtml: false,
  })
})
</script>

<template>
  <div class="article-main h-full">
    <n-config-provider class="h-full flex" :theme="darkTheme">
      <div class="left h-full flex flex-col justify-between w-350px relative flex-shrink-0">
        <div class="left-main flex-1 overflow-auto">
          <n-scrollbar style="height: 100%" trigger="none">
            <ParamInputVue />
          </n-scrollbar>
        </div>
        <div class="left-bottom flex justify-between items-center px-8px">
          <div></div>
          <div class="grow"></div>
          <div class="cursor-pointer"><IconMore /></div>
        </div>
      </div>

      <div class="right relative flex h-full max-w-full flex-1 overflow-hidden">
        <div class="flex h-full w-full max-w-full flex-1 flex-col bg-gray-800">
          <!-- header -->
          <div class="main-header">
            <div></div>
            <div>Article Generator</div>
            <div>
              <n-button @click="onReset">重新开始</n-button>
            </div>
          </div>
          <!-- 聊天内容 -->
          <div id="content" class="message-wrap w-full" :style="{ height: `calc(100% - 196px)` }">
            <n-scrollbar id="scrollBar" style="height: 100%" trigger="none">
              <div v-for="o in chatList" :key="o.id" class="message-item flex text-white">
                <div class="mr-20px shrink-0 self-start">
                  <div
                    v-if="o.user === systemName"
                    class="relative p-1 rounded-sm h-[30px] w-[30px] text-white flex items-center justify-center"
                    style="background-color: rgb(25, 195, 125)"
                  >
                    <IconChatgpt />
                  </div>
                  <div
                    v-else
                    class="relative p-1 rounded-sm h-[30px] w-[30px] text-white flex items-center justify-center"
                    style="background-color: #b93126"
                  >
                    {{ `${o.user.slice(0, 2)}` }}
                  </div>
                </div>
                <div v-show="!o.isHtml">{{ o.message }}</div>
                <div v-show="o.isHtml" v-html="o.message"></div>
              </div>
            </n-scrollbar>
          </div>

          <!-- 输入框 -->
          <div class="absolute bottom-20px w-full p-40px">
            <div
              class="flex w-full items-center py-10px px-4 flex-grow relative border-gray-900/50 text-white bg-gray-700 rounded-xl shadow-xs"
            >
              <n-input
                v-model:value="message"
                class="w-full bg-gray-700 mr-40px"
                type="textarea"
                :placeholder="state[curStep]"
                :autosize="{
                  minRows: 1,
                  maxRows: 5,
                }"
              />
              <n-button :loading="loading" @click="onSend">发送</n-button>
            </div>
          </div>
        </div>
      </div>
    </n-config-provider>
  </div>
</template>
<style lang="scss">
.article-main {
  background-color: rgba(52, 53, 65, 1);
}
.left {
  background-color: rgba(32, 33, 35, 1);
  padding: 8px;
  .left-top {
    border: 1px hsla(0, 0%, 100%, 0.2) solid;
    border-radius: 6px;
    padding: 6px 12px;
  }
  .left-bottom {
    height: 60px;
    border-top: 1px solid hsla(0, 0%, 100%, 0.2);
  }
}
.message-wrap > :nth-child(even) {
  background-color: rgba(68, 70, 84, 0.4);
}
.message-item {
  padding: 20px 20px;
  min-height: 50px;
  display: flex;
  align-items: center;
}
.chat-img {
  background-color: rgb(25, 195, 125);
}
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background-color: rgba(52, 53, 65, 1);
  color: rgba(197, 197, 210);
  border-bottom-width: 1px;
  border-color: rgba(32, 33, 35, 0.5);
}
</style>
