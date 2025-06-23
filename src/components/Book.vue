<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="book in books" :key="book.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ book.title }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ book.author }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ book.category }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`">
                {{ book.available ? 'Available' : 'Borrowed' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
              <button class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      books: [
        { id: 1, title: 'Vue.js 3 Fundamentals', author: 'John Doe', category: 'Programming', available: true },
        { id: 2, title: 'Advanced Tailwind CSS', author: 'Jane Smith', category: 'Web Design', available: false },
        { id: 3, title: 'JavaScript ES6+', author: 'Mike Johnson', category: 'Programming', available: true }
      ]
    }
  }
}
</script>