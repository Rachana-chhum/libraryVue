<template>
  
  <div class="member-card bg-white shadow-lg rounded-xl p-6 mb-4 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ member.name }}</h3>
        <div class="space-y-2">
          <p class="text-gray-600 flex items-center">
            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <strong>Email:</strong> 
            <span class="ml-1">{{ member.email }}</span>
          </p>
          <p class="text-gray-500 flex items-center">
            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-1 12a2 2 0 002 2h6a2 2 0 002-2L16 7" />
            </svg>
            <strong>Joined:</strong> 
            <span class="ml-1">{{ formatDate(member.created_at) }}</span>
          </p>
          <div v-if="member.status" class="flex items-center">
            <span 
              :class="getStatusClass(member.status)"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            >
              <span 
                :class="getStatusDotClass(member.status)"
                class="w-2 h-2 rounded-full mr-1.5"
              ></span>
              {{ member.status }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="flex flex-col space-y-2 ml-4">
        <button 
          @click="viewDetails" 
          :disabled="loading"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {{ loading ? 'Loading...' : 'View Details' }}
        </button>
        
        <button 
          @click="$emit('edit', member)"
          class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 flex items-center"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Composables
const router = useRouter()

// Props
const props = defineProps({
  member: {
    type: Object,
    required: true,
    validator: (member) => {
      return member && typeof member === 'object' && member.id && member.name && member.email
    }
  }
})

// Emits
const emit = defineEmits(['edit'])

// Reactive data
const loading = ref(false)

// Methods
const viewDetails = async () => {
  loading.value = true
  try {
    await router.push({ 
      name: 'MemberView', 
      params: { id: props.member.id } 
    })
  } catch (error) {
    console.error('Navigation error:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return 'Invalid Date'
  }
}

const getStatusClass = (status) => {
  const statusClasses = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    suspended: 'bg-gray-100 text-gray-800'
  }
  return statusClasses[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const getStatusDotClass = (status) => {
  const dotClasses = {
    active: 'bg-green-400',
    inactive: 'bg-red-400',
    pending: 'bg-yellow-400',
    suspended: 'bg-gray-400'
  }
  return dotClasses[status?.toLowerCase()] || 'bg-gray-400'
}
</script>

<style scoped>
.member-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.member-card:hover {
  transform: translateY(-2px);
}
</style>