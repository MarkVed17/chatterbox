<script setup lang="ts">
import { onMounted, ref } from 'vue'
import getAllMessages from '@/services/getAllMessages.service'
import type { Message } from '@/types/message'

const chatInput = ref('') // Text Input
const messagesData = ref<Message[]>([]) // Messages
const isLoadingData = ref(false) // Loading State
const chatBox = ref() // Holds a reference to the Text Input element

// Fetch All the Messages
async function fetchMessagesData() {
  isLoadingData.value = true
  const data = await getAllMessages()
  isLoadingData.value = false

  messagesData.value = data
  chatBox.value.focus() // Focus on the Text Input element
}

onMounted(() => {
  fetchMessagesData()
})
</script>

<template>
  <h1>Chatterbox</h1>
  <input ref="chatBox" type="text" v-model="chatInput" placeholder="Type your message..." />
  <button :disabled="!chatInput.length">Post!</button>
  <button :disabled="!messagesData.length">Delete All</button>

  <template v-if="isLoadingData">
    <h1>Loading...</h1>
  </template>

  <template v-else>
    <div v-if="!messagesData.length">Looks empty!</div>
    <div v-for="message in messagesData" :key="message.id">
      <input type="checkbox" />
      {{ message.text }}
      <button>Delete</button>
    </div>
  </template>
</template>

<style scoped></style>
