<script setup lang="ts">
import { RouterView } from 'vue-router'

</script>

<template>
  <div class="h-full">
    <n-message-provider>
      <RouterView />
    </n-message-provider>
  </div>
</template>

<style></style>
