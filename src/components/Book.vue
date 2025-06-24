```vue
<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <!-- Loading and Error States -->
    <div v-if="isLoading" class="p-4 text-center bg-blue-50 text-blue-700">
      <svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    <div v-if="errorMessage" class="p-4 bg-red-100 text-red-700 rounded mb-4 flex justify-between items-center">
      <span>{{ errorMessage }}</span>
      <button @click="errorMessage = ''" class="text-red-700 font-bold">×</button>
    </div>

    <!-- Header with Add Button -->
    <div class="flex justify-between items-center p-4">
      <h2 class="text-lg font-semibold">Books Management</h2>
      <button 
        @click="openAddModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        :disabled="isLoading"
      >
        Add New Book
      </button>
    </div>

    <!-- Books Table -->
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
          <tr v-for="book in books" :key="book.id" class="hover:bg-blue-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ book.title }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ book.author }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ book.category.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`">
                {{ book.available ? 'Available' : 'Borrowed' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button 
                @click="openEditModal(book)" 
                class="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50 transition-colors"
                :disabled="isLoading"
              >
                Edit
              </button>
              <button 
                @click="confirmDelete(book.id)" 
                class="text-red-600 hover:text-red-900 disabled:opacity-50 transition-colors"
                :disabled="isLoading"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Book Modal (Optimized with optimistic updates) -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-150">
        <div class="p-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
            {{ isEditing ? 'Edit Book' : 'Add New Book' }}
          </h3>
          <form @submit.prevent="isEditing ? handleOptimisticUpdate() : handleOptimisticAdd()">
            <div class="mb-4">
              <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
              <input
                v-model="currentBook.title"
                type="text"
                id="title"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border transition-colors"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="mb-4">
              <label for="author" class="block text-sm font-medium text-gray-700">Author</label>
              <input
                v-model="currentBook.author"
                type="text"
                id="author"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border transition-colors"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="mb-4">
              <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
              <input
                v-model="currentBook.category.name"
                type="text"
                id="category"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border transition-colors"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <div class="mt-1 flex items-center">
                <input
                  v-model="currentBook.available"
                  type="checkbox"
                  id="available"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                  :disabled="isLoading"
                />
                <label for="available" class="ml-2 block text-sm text-gray-700">Available</label>
              </div>
            </div>
            <div v-if="errorMessage" class="mb-4 text-red-600 text-sm">{{ errorMessage }}</div>
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="showModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                :disabled="isLoading"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center min-w-20"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </span>
                <span v-else>{{ isEditing ? 'Update' : 'Save' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-150">
        <div class="p-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">Confirm Delete</h3>
          <p class="text-sm text-gray-500 mb-6">Are you sure you want to delete this book? This action cannot be undone.</p>
          <div v-if="errorMessage" class="mb-4 text-red-600 text-sm">{{ errorMessage }}</div>
          <div class="flex justify-end space-x-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              :disabled="isLoading"
            >
              Cancel
            </button>
            <button
              @click="deleteBook"
              class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center min-w-20"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting
              </span>
              <span v-else>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from '@/api/api';
import { onMounted, ref } from 'vue';

// Reactive state
const books = ref([]);
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const currentBook = ref({
    id: null,
    title: '',
    author: '',
    category: { name: '' },
    available: true,
});
const bookIdToDelete = ref(null);
const isLoading = ref(false);
const errorMessage = ref('');

// Fetch books on component mount
onMounted(async () => {
    await fetchBooks();
});

// Fetch all books
const fetchBooks = async () => {
    try {
        isLoading.value = true;
        errorMessage.value = '';
        const response = await api.get('/books');
        books.value = response.data;
    } catch (error) {
        console.error('API fetch error:', error);
        errorMessage.value = error.message || 'Failed to load books. Please try again later.';
    } finally {
        isLoading.value = false;
    }
};

// Open modal for adding a new book
const openAddModal = () => {
    isEditing.value = false;
    currentBook.value = {
        id: null,
        title: '',
        author: '',
        category: { name: '' },
        available: true,
    };
    errorMessage.value = '';
    showModal.value = true;
};

// Open modal for editing a book
const openEditModal = (book) => {
    isEditing.value = true;
    currentBook.value = JSON.parse(JSON.stringify(book));
    errorMessage.value = '';
    showModal.value = true;
};

// Optimistic Add
const handleOptimisticAdd = async () => {
    try {
        isLoading.value = true;
        errorMessage.value = '';

        const tempId = Date.now().toString();
        const newBook = {
            ...currentBook.value,
            id: tempId,
        };

        books.value.unshift(newBook);
        showModal.value = false;

        const response = await api.post('/books', currentBook.value);

        const index = books.value.findIndex((b) => b.id === tempId);
        if (index !== -1) {
            books.value.splice(index, 1, response.data);
        }
    } catch (error) {
        console.error('Error adding book:', error);
        books.value = books.value.filter((b) => b.id !== tempId);
        errorMessage.value = error.message || 'Failed to add book. Please try again.';
        showModal.value = true;
    } finally {
        isLoading.value = false;
    }
};

// Optimistic Update
const handleOptimisticUpdate = async () => {
    try {
        isLoading.value = true;
        errorMessage.value = '';

        const originalBook = books.value.find((b) => b.id === currentBook.value.id);
        const originalIndex = books.value.findIndex((b) => b.id === currentBook.value.id);

        if (originalIndex !== -1) {
            books.value.splice(originalIndex, 1, { ...currentBook.value });
        }

        showModal.value = false;

        const response = await api.put(`/books/${currentBook.value.id}`, currentBook.value);

        if (originalIndex !== -1) {
            books.value.splice(originalIndex, 1, response.data);
        }
    } catch (error) {
        console.error('Error updating book:', error);
        if (originalIndex !== -1 && originalBook) {
            books.value.splice(originalIndex, 1, originalBook);
        }
        errorMessage.value = error.message || 'Failed to update book. Please try again.';
        showModal.value = true;
    } finally {
        isLoading.value = false;
    }
};

// Confirm before deleting
const confirmDelete = (id) => {
    bookIdToDelete.value = id;
    errorMessage.value = '';
    showDeleteModal.value = true;
};

// Delete a book with optimistic UI update
const deleteBook = async () => {
    try {
        isLoading.value = true;
        errorMessage.value = '';

        const bookToDelete = books.value.find((b) => b.id === bookIdToDelete.value);
        const originalBooks = [...books.value];

        books.value = books.value.filter((b) => b.id !== bookIdToDelete.value);
        showDeleteModal.value = false;

        await api.delete(`/books/${bookIdToDelete.value}`);
    } catch (error) {
        console.error('Error deleting book:', error);
        books.value = originalBooks;
        errorMessage.value = error.message || 'Failed to delete book. Please try again.';
        showDeleteModal.value = true;
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
/* Smooth transitions for better UX */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

/* Button loading spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
