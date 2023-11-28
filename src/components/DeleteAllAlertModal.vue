<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

defineProps<{
  isOpen: boolean
}>()

const emits = defineEmits<{
  (event: 'close'): void
  (event: 'deleteAllMessages'): void
}>()

const modal = ref()

function closeModal() {
  emits('close')
}

function deleteActionHandler() {
  emits('deleteAllMessages')
  closeModal()
}

// Close the Modal on clicking anywhere outside the modal component
onClickOutside(modal, closeModal)
</script>

<template>
  <div
    ref="modal"
    v-if="isOpen"
    class="alert-modal border border-dark-subtle rounded-1 p-3 bg-light"
  >
    <div class="alert-modal-header">
      <h5>Delete All Messages</h5>
      <button
        @click="closeModal"
        type="button"
        class="btn-close ml-auto"
        aria-label="Close"
      ></button>
    </div>
    <div class="mt-1">
      <p>Are you sure you want to delete all the messages?</p>
    </div>
    <div class="alert-modal-footer w-fit ml-auto">
      <button @click="closeModal" type="button" class="btn btn-secondary">Close</button>
      <button @click="deleteActionHandler" type="button" class="btn btn-danger">Delete</button>
    </div>
  </div>
</template>

<style scoped></style>
