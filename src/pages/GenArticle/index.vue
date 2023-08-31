<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { NConfigProvider } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import { useRouter } from 'vue-router'
import { nanoid } from 'nanoid'
import { get } from 'lodash-es'
import { chatCompletions } from '@/chatapi/index'
import { newsWriter2 } from '@/systemSet/index'
import IconChatgpt from '@/components/SvgIcon/IconChatgpt.vue'
import IconAdd from "@/components/SvgIcon/IconAdd.vue"
import IconMore from "@/components/SvgIcon/IconMore.vue"

const chatUserName = ref('chat-gpt')

const stepList = {
  1: '请输入前置资料',
  2: '请输入扮演的角色（多个用逗号分隔）',
  3: '设置魔法（不需要则直接回车即可）',
  4: '请补充章节资料（没有补充则采用前置资料）',
  5: '结果是否满意（yes/no）',
}

const genParam = (msg: string): any => {
  return {
    messages: [
      { role: 'assistant', content: newsWriter2 },
      { role: 'user', content: msg },
    ],
    model: 'gpt-3.5-turbo',
    stream: false,
    temperature: 0.3,
  }
}

type StepType = 1 | 2 | 3 | 4 | 5

const { push } = useRouter()

const chatList = ref<any>([])
const message = ref('')
const loading = ref(false)
const curStep = ref<StepType>(1)

const genChatMessage = (user: string, message: string): object => {
  return { user, message, id: nanoid(4) }
}

const onSend = async () => {
  loading.value = true
  chatList.value.push(genChatMessage('lee', message.value))
  const msg = message.value
  message.value = ''
  const { data, error } = await chatCompletions(genParam(msg))
  if (data) {
    const msg = get(data, 'choices[0].message.content', '')
    const htmlMsg = msg.replace(/\n/g, '<br/>')
    console.log(htmlMsg)
    chatList.value.push(genChatMessage(chatUserName.value, htmlMsg))
  } else {
    console.log(error)
  }
  loading.value = false
}

const onBack = () => {
  push('/login')
}

onMounted(() => {
  chatList.value.push(genChatMessage(chatUserName.value, stepList[curStep.value]))
})
</script>

<template>
  <div class="article-main h-full">
    <n-config-provider class="h-full flex" :theme="darkTheme">
      <div class="left h-full flex flex-col justify-between w-260px relative flex-shrink-0">
        <div class="left-top mb-1 text-white flex gap-4px items-center cursor-pointer">
          <n-icon size="30"><IconAdd /></n-icon>新会话
        </div>
        <div class="left-main flex-1"></div>
        <div class="left-bottom flex justify-between items-center px-8px">
          <div></div>
          <div class="grow"></div>
          <div class="cursor-pointer"><IconMore /></div>
        </div>
      </div>

      <div class="right relative flex h-full max-w-full flex-1 overflow-hidden">
        <div class="flex h-full w-full max-w-full flex-1 flex-col bg-gray-800">
          <!-- header -->
          <div
            class="main-header"
          >
          <div></div>
          <div>Article Generator</div>
          <div>
            <n-button @click="onBack">退出登录</n-button>
          </div>
          </div>
          <!-- 聊天内容 -->
          <div class="message-wrap w-full overflow-auto" :style="{ height: `calc(100% - 196px)` }">
            <div v-for="o in chatList" :key="o.id" class="message-item flex text-white">
              <div class="mr-20px shrink-0 self-start">
                <div
                  v-if="o.user === chatUserName"
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
              <div v-show="o.user === 'lee'">{{ o.message }}</div>
              <div v-show="o.user === chatUserName" v-html="o.message"></div>
            </div>
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
                :placeholder="stepList[curStep]"
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
  background-color: rgba(52,53,65,1);
}
.left {
  background-color: rgba(32,33,35,1);
  padding: 8px;
  .left-top {
    border: 1px hsla(0,0%,100%,.2) solid;
    border-radius: 6px;
    padding: 8px 20px;
  }
  .left-bottom {
    height: 60px;
    border-top: 1px solid  hsla(0,0%,100%,.2);
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
  background-color: rgba(52,53,65,1);
  color: rgba(197,197,210);
  border-bottom-width: 1px;
  border-color: rgba(32,33,35,.5);
}
</style>
