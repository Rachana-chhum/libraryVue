<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div v-if="isLoading" class="p-4 text-center bg-blue-50 text-blue-700">
      <svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <div class="p-4 flex justify-between items-center">
      <h2 class="text-lg font-semibold">Borrowers</h2>
      <button @click="openAddModal" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" :disabled="isLoading">
        Add Borrow
      </button>
    </div>

    <div v-if="errorMessage" class="px-4 text-red-600">{{ errorMessage }}</div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs text-gray-500 uppercase">Book</th>
            <th class="px-6 py-3 text-left text-xs text-gray-500 uppercase">Member</th>
            <th class="px-6 py-3 text-left text-xs text-gray-500 uppercase">Librarian</th>
            <th class="px-6 py-3 text-left text-xs text-gray-500 uppercase">Borrow Date</th>
            <th class="px-6 py-3 text-left text-xs text-gray-500 uppercase">Return Date</th>
            <th class="px-6 py-3 text-left text-xs text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="borrower in borrowers" :key="borrower.id">
            <td class="px-6 py-4">{{ borrower.book?.title || borrower.book_id }}</td>
            <td class="px-6 py-4">{{ borrower.member?.name || borrower.member_id }}</td>
            <td class="px-6 py-4">{{ borrower.librarian?.name || borrower.librarian_id }}</td>
            <td class="px-6 py-4">{{ borrower.borrow_date }}</td>
            <td class="px-6 py-4">{{ borrower.return_date }}</td>
            <td class="px-6 py-4">
              <button @click="openEditModal(borrower)" class="text-blue-600 mr-2">Edit</button>
              <button @click="confirmDelete(borrower.id)" class="text-red-600">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg mb-4">{{ isEditing ? 'Edit Borrow' : 'Add Borrow' }}</h3>
        <form @submit.prevent="isEditing ? handleUpdate() : handleAdd()">
          <div class="mb-3">
            <label>Book ID</label>
            <input v-model="currentBorrow.book_id" type="number" class="w-full border p-2 rounded" required />
          </div>
          <div class="mb-3">
            <label>Member ID</label>
            <input v-model="currentBorrow.member_id" type="number" class="w-full border p-2 rounded" required />
          </div>
          <div class="mb-3">
            <label>Librarian ID</label>
            <input v-model="currentBorrow.librarian_id" type="number" class="w-full border p-2 rounded" required />
          </div>
          <div class="mb-3">
            <label>Borrow Date</label>
            <input v-model="currentBorrow.borrow_date" type="date" class="w-full border p-2 rounded" required />
          </div>
          <div class="mb-3">
            <label>Return Date</label>
            <input v-model="currentBorrow.return_date" type="date" class="w-full border p-2 rounded" required />
          </div>
          <div class="flex justify-end space-x-2 mt-4">
            <button type="button" @click="showModal = false" class="border px-4 py-2 rounded">Cancel</button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" :disabled="isLoading">
              {{ isEditing ? 'Update' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/api'

const borrowers = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const currentBorrow = ref({})
const borrowToDelete = ref(null)

// Fetch borrowers
const fetchBorrowers = async () => {
  try {
    isLoading.value = true
    const res = await api.get('/borrowers')
    borrowers.value = res.data
  } catch (err) {
    errorMessage.value = err.response?.data?.message || err.message || 'Failed to load data'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchBorrowers)

const openAddModal = () => {
  currentBorrow.value = {
    book_id: '',
    member_id: '',
    librarian_id: '',
    borrow_date: '',
    return_date: ''
  }
  isEditing.value = false
  showModal.value = true
}

const openEditModal = (borrower) => {
  currentBorrow.value = { ...borrower }
  isEditing.value = true
  showModal.value = true
}

const handleAdd = async () => {
  try {
    isLoading.value = true
    const res = await api.post('/borrowers', currentBorrow.value)
    borrowers.value.unshift(res.data)
    showModal.value = false
  } catch (err) {
    errorMessage.value = err.response?.data?.message || err.message
  } finally {
    isLoading.value = false
  }
}

const handleUpdate = async () => {
  try {
    isLoading.value = true
    const res = await api.put(`/borrowers/${currentBorrow.value.id}`, currentBorrow.value)
    const index = borrowers.value.findIndex(b => b.id === currentBorrow.value.id)
    if (index !== -1) borrowers.value[index] = res.data
    showModal.value = false
  } catch (err) {
    errorMessage.value = err.response?.data?.message || err.message
  } finally {
    isLoading.value = false
  }
}

const confirmDelete = async (id) => {
  try {
    isLoading.value = true
    await api.delete(`/borrowers/${id}`)
    borrowers.value = borrowers.value.filter(b => b.id !== id)
  } catch (err) {
    errorMessage.value = err.response?.data?.message || err.message
  } finally {
    isLoading.value = false
  }
}
</script>
