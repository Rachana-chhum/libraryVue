<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-10">Books Management</h2>
      
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