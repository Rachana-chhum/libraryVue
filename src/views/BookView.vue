<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">Books Management</h2>
      <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        Add New Book
      </button>
    </div>
    
    <Book />
  </div>
</template>

<script>
import Book from '../components/Book.vue'

export default {
  components: { Book }
}
</script>