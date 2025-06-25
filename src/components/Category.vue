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
      <h2 class="text-lg font-semibold">Categories Table</h2>
      <button 
        @click="openAddModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        :disabled="isLoading"
      >
        Add New Category
      </button>
    </div>

    <!-- Categories Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="category in categories" :key="category.id" class="hover:bg-blue-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ category.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ category.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ category.description || '' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ category.created_at }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ category.updated_at }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button 
                @click="openEditModal(category)" 
                class="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50 transition-colors"
                :disabled="isLoading"
              >
                Edit
              </button>
              <button 
                @click="confirmDelete(category.id)" 
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

    <!-- Add/Edit Category Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-150">
        <div class="p-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
            {{ isEditing ? 'Edit Category' : 'Add New Category' }}
          </h3>
          <form @submit.prevent="isEditing ? handleOptimisticUpdate() : handleOptimisticAdd()">
            <div class="mb-4">
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input
                v-model="currentCategory.name"
                type="text"
                id="name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border transition-colors"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="mb-4">
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <input
                v-model="currentCategory.description"
                type="text"
                id="description"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border transition-colors"
                :disabled="isLoading"
              />
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
          <p class="text-sm text-gray-500 mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
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
              @click="deleteCategory"
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
const categories = ref([]);
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const currentCategory = ref({
  id: null,
  name: '',
  description: '',
  created_at: '',
  updated_at: '',
});
const categoryIdToDelete = ref(null);
const isLoading = ref(false);
const errorMessage = ref('');

// Fetch categories on component mount
onMounted(async () => {
  await fetchCategories();
});

// Fetch all categories
const fetchCategories = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    const response = await api.get('/categories');
    categories.value = response.data;
  } catch (error) {
    console.error('API fetch error:', error);
    errorMessage.value = error.message || 'Failed to load categories. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};

// Open modal for adding a new category
const openAddModal = () => {
  isEditing.value = false;
  currentCategory.value = {
    id: null,
    name: '',
    description: '',
    created_at: '',
    updated_at: '',
  };
  errorMessage.value = '';
  showModal.value = true;
};

// Open modal for editing a category
const openEditModal = (category) => {
  isEditing.value = true;
  currentCategory.value = JSON.parse(JSON.stringify(category));
  errorMessage.value = '';
  showModal.value = true;
};

// Optimistic Add
const handleOptimisticAdd = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';

    const tempId = Date.now().toString();
    const newCategory = {
      ...currentCategory.value,
      id: tempId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    categories.value.unshift(newCategory);
    showModal.value = false;

    const response = await api.post('/categories', currentCategory.value);

    const index = categories.value.findIndex((c) => c.id === tempId);
    if (index !== -1) {
      categories.value.splice(index, 1, response.data);
    }
  } catch (error) {
    console.error('Error adding category:', error);
    categories.value = categories.value.filter((c) => c.id !== tempId);
    errorMessage.value = error.message || 'Failed to add category. Please try again.';
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

    const originalCategory = categories.value.find((c) => c.id === currentCategory.value.id);
    const originalIndex = categories.value.findIndex((c) => c.id === currentCategory.value.id);

    if (originalIndex !== -1) {
      categories.value.splice(originalIndex, 1, { ...currentCategory.value, updated_at: new Date().toISOString() });
    }

    showModal.value = false;

    const response = await api.put(`/categories/${currentCategory.value.id}`, currentCategory.value);

    if (originalIndex !== -1) {
      categories.value.splice(originalIndex, 1, response.data);
    }
  } catch (error) {
    console.error('Error updating category:', error);
    if (originalIndex !== -1 && originalCategory) {
      categories.value.splice(originalIndex, 1, originalCategory);
    }
    errorMessage.value = error.message || 'Failed to update category. Please try again.';
    showModal.value = true;
  } finally {
    isLoading.value = false;
  }
};

// Confirm before deleting
const confirmDelete = (id) => {
  categoryIdToDelete.value = id;
  errorMessage.value = '';
  showDeleteModal.value = true;
};

// Delete a category with optimistic UI update
const deleteCategory = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';

    const categoryToDelete = categories.value.find((c) => c.id === categoryIdToDelete.value);
    const originalCategories = [...categories.value];

    categories.value = categories.value.filter((c) => c.id !== categoryIdToDelete.value);
    showDeleteModal.value = false;

    await api.delete(`/categories/${categoryIdToDelete.value}`);
  } catch (error) {
    console.error('Error deleting category:', error);
    categories.value = originalCategories;
    errorMessage.value = error.message || 'Failed to delete category. Please try again.';
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