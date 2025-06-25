<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-6">Member List</h1>

    <!-- Add Member Card -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-12 max-w">
      <h2 class="text-xl font-semibold mb-4">Add Member</h2>
      <div class="space-y-4">
        <div>
          <label for="name" class="block text-gray-700 font-medium">Name</label>
          <input
            v-model="form.name"
            id="name"
            type="text"
            class="w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter name"
          />
        </div>
        <div>
          <label for="email" class="block text-gray-700 font-medium">Email</label>
          <input
            v-model="form.email"
            id="email"
            type="email"
            class="w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter email"
          />
        </div>
        <div>
          <label for="address" class="block text-gray-700 font-medium">Address</label>
          <input
            v-model="form.address"
            id="address"
            type="text"
            class="w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter address"
          />
        </div>
        <button
          @click="addMember"
          class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      <div v-if="formError" class="mt-4 text-red-600">{{ formError }}</div>
      <div v-if="successMessage" class="mt-4 text-green-600">{{ successMessage }}</div>
    </div>


    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Member List</h2>
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr class="bg-gray-100 border-b-2 border-gray-300">
            <th class="text-gray-900 font-semibold text-left py-3 px-4">ID</th>
            <th class="text-gray-900 font-semibold text-left py-3 px-4">Name</th>
            <th class="text-gray-900 font-semibold text-left py-3 px-4">Email</th>
            <th class="text-gray-900 font-semibold text-left py-3 px-4">Address</th>
            <th class="text-gray-900 font-semibold text-left py-3 px-4">Created At</th>
            <th class="text-gray-900 font-semibold text-left py-3 px-4">Updated At</th>
            <th class="text-gray-900 font-semibold text-left py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in members" :key="member.id" class="border-b hover:bg-gray-50">
            <td class="text-gray-700 font-normal py-3 px-4">{{ member.id }}</td>
            <td class="text-gray-700 font-normal py-3 px-4">{{ member.name }}</td>
            <td class="text-gray-700 font-normal py-3 px-4">{{ member.email }}</td>
            <td class="text-gray-700 font-normal py-3 px-4">{{ member.address }}</td>
            <td class="text-gray-700 font-normal py-3 px-4">{{ formatDate(member.created_at) }}</td>
            <td class="text-gray-700 font-normal py-3 px-4">{{ formatDate(member.updated_at) }}</td>
            <td class="text-gray-700 font-normal py-3 px-4 flex gap-2">
              <button
                @click="editMember(member)"
                class="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                @click="deleteMember(member.id)"
                class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="loading" class="text-center py-4 text-gray-600">Loading...</div>
      <div v-if="error" class="text-center py-4 text-red-600">{{ error }}</div>
      <div v-if="!loading && !error && members.length === 0" class="text-center py-4 text-gray-600">
        No members found.
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="isEditing" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">Edit Member</h2>
        <div class="space-y-4">
          <div>
            <label for="edit-name" class="block text-gray-700 font-medium">Name</label>
            <input
              v-model="editForm.name"
              id="edit-name"
              type="text"
              class="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label for="edit-email" class="block text-gray-700 font-medium">Email</label>
            <input
              v-model="editForm.email"
              id="edit-email"
              type="email"
              class="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter email"
            />
          </div>
          <div>
            <label for="edit-address" class="block text-gray-700 font-medium">Address</label>
            <input
              v-model="editForm.address"
              id="edit-address"
              type="text"
              class="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter address"
            />
          </div>
          <div class="flex gap-2">
            <button
              @click="updateMember"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Update
            </button>
            <button
              @click="cancelEdit"
              class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
        <div v-if="formError" class="mt-4 text-red-600">{{ formError }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/api'

export default {
  name: 'MemberView',
  data() {
    return {
      members: [],
      loading: false,
      error: null,
      form: {
        name: '',
        email: '',
        address: '',
      },
      editForm: {
        id: null,
        name: '',
        email: '',
        address: '',
      },
      formError: null,
      successMessage: null,
      isEditing: false,
    }
  },
  mounted() {
    this.fetchMembers()
  },
  methods: {
    async fetchMembers() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/members', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        this.members = response.data
      } catch (err) {
        this.error = 'Failed to fetch members. Please try again.'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    async addMember() {
      this.formError = null
      this.successMessage = null

      if (!this.form.name || !this.form.email || !this.form.address) {
        this.formError = 'Please fill out all fields.'
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.form.email)) {
        this.formError = 'Please enter a valid email address.'
        return
      }

      // Optimistically add the member to the table
      const tempId = Date.now(); // Temporary ID for optimistic update
      const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const tempMember = {
        id: tempId,
        name: this.form.name.trim(),
        email: this.form.email.trim().toLowerCase(),
        address: this.form.address.trim(),
        created_at: currentDate,
        updated_at: currentDate,
      };
      this.members.unshift(tempMember);

      try {
        const response = await api.post('/members', {
          name: this.form.name.trim(),
          email: this.form.email.trim().toLowerCase(),
          address: this.form.address.trim(),
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        // Replace the temporary member with the actual response data
        const index = this.members.findIndex(m => m.id === tempId);
        if (index !== -1) {
          this.members[index] = response.data;
        }
        this.successMessage = 'Member added successfully!';
        this.resetForm();
      } catch (err) {
        this.formError = err.response?.data?.message || 'Failed to add member.';
        console.error(err);
        // Remove the temporary member if the add fails
        this.members = this.members.filter(m => m.id !== tempId);
      }
    },
    editMember(member) {
      this.isEditing = true
      this.editForm = { ...member }
    },
    async updateMember() {
      this.formError = null
      this.successMessage = null

      if (!this.editForm.name || !this.editForm.email || !this.editForm.address) {
        this.formError = 'Please fill out all fields.'
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.editForm.email)) {
        this.formError = 'Please enter a valid email address.'
        return
      }

      try {
        const response = await api.put(`/members/${this.editForm.id}`, {
          name: this.editForm.name.trim(),
          email: this.editForm.email.trim().toLowerCase(),
          address: this.editForm.address.trim(),
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        const index = this.members.findIndex(m => m.id === this.editForm.id)
        if (index !== -1) this.members[index] = response.data
        this.successMessage = 'Member updated successfully!'
        this.cancelEdit()
      } catch (err) {
        this.formError = err.response?.data?.message || 'Failed to update member.'
        console.error(err)
      }
    },
    async deleteMember(id) {
      this.formError = null
      this.successMessage = null
      if (!confirm('Are you sure you want to delete this member?')) return

      try {
        await api.delete(`/members/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        this.members = this.members.filter(m => m.id !== id)
        this.successMessage = 'Member deleted successfully!'
      } catch (err) {
        this.formError = 'Failed to delete member.'
        console.error(err)
      }
    },
    cancelEdit() {
      this.isEditing = false
      this.editForm = { id: null, name: '', email: '', address: '' }
      this.formError = null
    },
    resetForm() {
      this.form = { name: '', email: '', address: '' }
      this.formError = null
      this.successMessage = null
    },
    formatDate(dateStr) {
      return new Date(dateStr).toISOString().slice(0, 19).replace('T', ' ')
    },
  },
}
</script>

<style scoped>
/* Tailwind CSS is used directly in the template */
</style>