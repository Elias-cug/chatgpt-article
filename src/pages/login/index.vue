<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import iconLogo from '@/assets/chat.png'

const { push } = useRouter()


const username = ref()
const password = ref()

const onLogin = async () => {
  push("/")
}
</script>

<template>
  <div class="w-full h-full">
    <div class="w-full h-80% flex flex-col items-center justify-center gap-40px top-20px">
      <img :src="iconLogo" class="w-180px" alt="" />
      <div class="w-full flex flex-col gap-20px px-20%">
        <n-input v-model:value="username" placeholder="用户名"/>
        <n-input v-model:value="password" placeholder="密码" type="password" show-password-on="mousedown"/>
      </div>
      <div class="w-full px-20%">
        <n-button class="w-full" type="primary" @click="onLogin">登录</n-button>
      </div>
    </div>
  </div>
</template>

<style></style>