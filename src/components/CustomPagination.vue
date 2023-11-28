<script setup lang="ts">
defineProps<{
  dataCount: number
  perPage: number
}>()

const emits = defineEmits<{
  (event: 'prevPage'): void
  (event: 'goToPage', value: number): void
  (event: 'nextPage'): void
}>()

function goToPrevPage() {
  emits('prevPage')
}

function goToNextPage() {
  emits('nextPage')
}

function goToSpecificPage(pageNum: number) {
  emits('goToPage', pageNum)
}
</script>

<template>
  <nav class="custom-pagination">
    <ul class="pagination align-middle justify-content-center mt-2">
      <li @click="goToPrevPage" class="page-item page-link cursor-pointer">Previous</li>
      <li
        v-for="pageNum in Math.ceil(dataCount / perPage)"
        :key="pageNum"
        @click="() => goToSpecificPage(pageNum)"
        class="page-item page-link cursor-pointer"
      >
        {{ pageNum }}
      </li>
      <li @click="goToNextPage" class="page-item page-link cursor-pointer">Next</li>
    </ul>
  </nav>
</template>

<style scoped></style>
