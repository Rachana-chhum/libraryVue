<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-10">Category Management</h2>
    </div>
    <Category />
  </div>
</template>

<script>
import Category from '../components/Category.vue';

export default {
  components: { Category }
}
</script>