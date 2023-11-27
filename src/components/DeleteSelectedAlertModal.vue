<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

const emits = defineEmits<{
  (event: 'close'): void
  (event: 'deleteSelectedMessages'): void
}>()

function closeModal() {
  emits('close')
}

function confirmActionHandler() {
  emits('deleteSelectedMessages')
  closeModal()
}
</script>

<template>
  <div v-if="isOpen" class="modal">
    <div class="modal-bg" @click="closeModal"></div>
    <div class="modal-card">
      <h1>Are you sure you want to delete all the selected messages</h1>
      <button @click="closeModal">Cancel</button><button @click="confirmActionHandler">Yes</button>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
}

.modal-bg {
  height: 100%;
  width: 100%;
  background: #000000/0.8;
}

.modal-card {
  position: absolute;
  top: 5%;
  z-index: 100;
  min-width: 496px;
  padding: 48px;
}
</style>
