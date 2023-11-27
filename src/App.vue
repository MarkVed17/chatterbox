<script setup lang="ts">
import { onMounted, ref } from 'vue'
import getAllMessages from '@/services/getAllMessages.service'
import postMessage from '@/services/postMessage.service'
import deleteMessage from '@/services/deleteMessage.service'
import DeleteAllAlertModal from './components/DeleteAllAlertModal.vue'
import DeleteSelectedAlertModal from './components/DeleteSelectedAlertModal.vue'
import type { Message } from '@/types/message'

const chatInput = ref('') // Text Input
const chatBox = ref() // Holds a reference to the Text Input element
const messagesData = ref<Message[]>([]) // Messages
const isLoadingData = ref(false) // Loading State
const checkedMessagesIds = ref<number[]>([]) // Store all the checked messages id
const isDeleteAllModalOpen = ref(false) // Delete All Messages Alert Modal state
const isDeleteSelectedModalOpen = ref(false) // Delete Selected Messages Alert Modal state
const sortBy = ref('Oldest to Newest') // Sort Messages by timestamp state

// Fetch All the Messages
async function fetchMessagesData() {
  isLoadingData.value = true
  const data = await getAllMessages()
  isLoadingData.value = false

  messagesData.value = data
  chatBox.value.focus() // Focus on the Text Input element
}

// Post a message
async function postMessageHandler() {
  await postMessage({ text: chatInput.value })

  await fetchMessagesData()

  chatInput.value = '' // Clear the Text Input Field
}

// Delete a single message
async function deleteMessageHandler(messageId: number) {
  await deleteMessage(messageId)

  await fetchMessagesData()
}

// Delete multiple messages
async function deleteSelectedMessages() {
  let deleteMessageRequests: Promise<any>[] = []

  // Construct a Array of Promises based on selected messages i.e. a promise for each selected message
  checkedMessagesIds.value.forEach((messageId) =>
    deleteMessageRequests.push(deleteMessage(messageId))
  )

  await Promise.allSettled(deleteMessageRequests)

  await fetchMessagesData()
}

// Delete all the messages
async function deleteAllMessages() {
  let deleteMessageRequests: Promise<any>[] = []

  // Construct a Array of Promises based on all messages ai.e. a promise for each message
  messagesData.value.forEach((message) => deleteMessageRequests.push(deleteMessage(message.id)))

  await Promise.allSettled(deleteMessageRequests)

  await fetchMessagesData()
}

// Set the checkbox input "checked" property
function isMessageChecked(messageId: number) {
  // Check if the 'messageId' is already present in the 'checkedMessagesIds' array
  const isMessageIdPresent = checkedMessagesIds.value.some(
    (currMessageId) => currMessageId === messageId
  )

  if (isMessageIdPresent) {
    return true // Set the "checked" input property as checked
  } else return false // Set the "checked" input property as unchecked
}

// Toggle the checkbox for a message
function toggleCheckbox(messageId: number) {
  // Check if the 'messageId' is already present in the 'checkedMessagesIds' array
  const isMessageIdPresent = checkedMessagesIds.value.some(
    (currMessageId) => currMessageId === messageId
  )

  if (isMessageIdPresent) {
    // If the 'messageId' already exists in the 'checkedMessagesIds' array then remove the 'messageId' from the array
    checkedMessagesIds.value = checkedMessagesIds.value.filter(
      (currMessageId) => currMessageId !== messageId
    )
  } else {
    // Else add the 'messageId' to the 'checkedMessagesIds' array
    checkedMessagesIds.value.push(messageId)
  }
}

// Toggle for Sorting by Timestamp ('Newest to Oldest' OR 'Oldest to Newest' )
function toggleSort() {
  sortBy.value = sortBy.value === 'Newest to Oldest' ? 'Oldest to Newest' : 'Newest to Oldest'

  if (sortBy.value === 'Oldest to Newest') {
    messagesData.value = messagesData.value.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  } else {
    messagesData.value = messagesData.value.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
  }
}

// Fromat the message timestamp relative to the current time
function formatRelativeTime(timestamp: string) {
  const currentDate = new Date()
  const targetDate = new Date(timestamp)

  const timeDifference = currentDate.getTime() - targetDate.getTime()
  const seconds = Math.floor(timeDifference / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) {
    return seconds + ' seconds ago'
  } else if (minutes < 60) {
    return minutes + ' minutes ago'
  } else if (hours < 24) {
    return hours + ' hours ago'
  } else {
    return days + ' days ago'
  }
}

onMounted(() => {
  fetchMessagesData()
})
</script>

<template>
  <h1>Chatterbox</h1>
  <div class="input-group mb-3">
    <input
      ref="chatBox"
      type="text"
      class="form-control"
      v-model="chatInput"
      placeholder="Type your message..."
    />
    <button
      @click="postMessageHandler"
      :disabled="!chatInput.length"
      class="btn btn-primary"
      type="button"
    >
      Post
    </button>
  </div>

  <button
    @click="isDeleteAllModalOpen = true"
    :disabled="!messagesData.length"
    class="btn btn-outline-danger"
  >
    Delete All
  </button>
  <button
    v-if="checkedMessagesIds.length"
    @click="isDeleteSelectedModalOpen = true"
    class="btn btn-outline-danger"
  >
    Delete Selected
  </button>
  <button @click="toggleSort" :disabled="!messagesData.length" class="btn btn-outline-secondary">
    Sort - {{ sortBy }}
  </button>

  <template v-if="isLoadingData">
    <h1>Loading...</h1>
  </template>

  <template v-else>
    <div v-if="!messagesData.length">Looks empty!</div>
    <div class="d-flex flex-column gap-3 mt-4">
      <div v-for="message in messagesData" :key="message.id" class="p-3 border border-dark-subtle">
        <div class="d-flex align-items-center">
          <input
            type="checkbox"
            :checked="isMessageChecked(message.id)"
            @change="toggleCheckbox(message.id)"
          />
          <p class="fw-semibold px-2 mb-0">{{ message.source }}</p>
          <button
            @click="deleteMessageHandler(message.id)"
            class="btn btn-outline-danger btn-sm ml-auto"
          >
            Delete
          </button>
        </div>

        <p class="px-3 mt-1 mb-0">{{ message.text }}</p>

        <p class="w-fit ml-auto mb-0 fw-light">{{ formatRelativeTime(message.timestamp) }}</p>
      </div>
    </div>

    <DeleteAllAlertModal
      :is-open="isDeleteAllModalOpen"
      @close="isDeleteAllModalOpen = false"
      @delete-all-messages="deleteAllMessages"
    />
    <DeleteSelectedAlertModal
      :is-open="isDeleteSelectedModalOpen"
      @close="isDeleteSelectedModalOpen = false"
      @delete-selected-messages="deleteSelectedMessages"
    />
  </template>
</template>

<style scoped>
.ml-auto {
  margin-left: auto;
}

.w-fit {
  width: fit-content;
}
</style>
