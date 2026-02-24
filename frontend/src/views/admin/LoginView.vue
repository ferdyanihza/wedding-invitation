<template>
  <div class="min-h-screen flex items-center justify-center bg-brown-900 px-4"
    style="background: linear-gradient(135deg, #2d1b0e 0%, #4a2a0e 50%, #2d1b0e 100%)"
  >
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="font-script text-shimmer text-5xl mb-2">Admin Panel</h1>
        <p class="font-sans text-brown-300 text-sm tracking-widest uppercase">Wedding Invitation</p>
      </div>

      <div class="bg-white/10 backdrop-blur-sm border border-gold-400/20 rounded-2xl p-8">
        <form @submit.prevent="login" class="space-y-4">
          <div>
            <label class="text-sm font-sans text-brown-200 mb-1 block">Username</label>
            <input
              v-model="form.username"
              type="text"
              placeholder="admin"
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-gold-400/20 text-white placeholder-brown-400 font-sans focus:outline-none focus:border-gold-400 transition"
              required
            />
          </div>

          <div>
            <label class="text-sm font-sans text-brown-200 mb-1 block">Password</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-gold-400/20 text-white placeholder-brown-400 font-sans focus:outline-none focus:border-gold-400 transition"
              required
            />
          </div>

          <p v-if="error" class="text-red-300 text-sm font-sans">{{ error }}</p>

          <button type="submit" :disabled="loading" class="btn-primary w-full justify-center mt-2">
            <span v-if="loading" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            {{ loading ? 'Masuk...' : 'Masuk' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

const router = useRouter()
const form = ref({ username: '', password: '' })
const loading = ref(false)
const error = ref('')

const login = async () => {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.post('/auth/login', form.value)
    localStorage.setItem('admin_token', data.data.token)
    router.push('/admin/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login gagal. Periksa kembali kredensial Anda.'
  } finally {
    loading.value = false
  }
}
</script>
