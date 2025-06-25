<template>
  <div>
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-10">Borrow Management</h2>
    </div>
    <Borrow />
  </div>
</template>

<script>
import Borrow from '../components/Borrow.vue'

export default {
  components: { Borrow }
}
</script>
