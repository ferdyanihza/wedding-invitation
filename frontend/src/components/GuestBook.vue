<template>
  <div>
    <!-- Form ucapan -->
    <form @submit.prevent="submitGuest" class="card-wedding mb-10">
      <h3 class="font-serif text-xl text-brown-700 mb-5 flex items-center gap-2">
        <span class="text-gold-500">✦</span> Tulis Ucapan
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="text-sm font-sans text-brown-500 mb-1 block">Nama *</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Nama lengkap"
            class="w-full px-4 py-2.5 rounded-xl border border-gold-200 bg-ivory-50 font-sans text-brown-800 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition"
            required
          />
        </div>
        <div>
          <label class="text-sm font-sans text-brown-500 mb-1 block">Asal Kota</label>
          <input
            v-model="form.address"
            type="text"
            placeholder="Jakarta, Bandung, dll."
            class="w-full px-4 py-2.5 rounded-xl border border-gold-200 bg-ivory-50 font-sans text-brown-800 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition"
          />
        </div>
      </div>

      <div class="mb-4">
        <label class="text-sm font-sans text-brown-500 mb-1 block">Kehadiran *</label>
        <div class="flex gap-3 flex-wrap">
          <label
            v-for="opt in attendanceOptions" :key="opt.value"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition font-sans text-sm',
              form.attendance === opt.value
                ? 'border-gold-500 bg-gold-50 text-gold-700'
                : 'border-gray-200 text-brown-500 hover:border-gold-300'
            ]"
          >
            <input type="radio" v-model="form.attendance" :value="opt.value" class="hidden" />
            <span>{{ opt.emoji }}</span> {{ opt.label }}
          </label>
        </div>
      </div>

      <div class="mb-5">
        <label class="text-sm font-sans text-brown-500 mb-1 block">Ucapan & Doa *</label>
        <textarea
          v-model="form.message"
          rows="3"
          placeholder="Tulis ucapan dan doa terbaikmu..."
          class="w-full px-4 py-2.5 rounded-xl border border-gold-200 bg-ivory-50 font-sans text-brown-800 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition resize-none"
          required
          maxlength="1000"
        />
        <p class="text-xs text-brown-300 text-right mt-1">{{ form.message.length }}/1000</p>
      </div>

      <button type="submit" :disabled="loading" class="btn-primary w-full justify-center">
        <span v-if="loading" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        <span v-else>💌</span>
        {{ loading ? 'Mengirim...' : 'Kirim Ucapan' }}
      </button>
    </form>

    <!-- Daftar ucapan -->
    <div class="space-y-4">
      <div
        v-for="guest in guests" :key="guest.id"
        class="card-wedding hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-serif font-bold text-lg flex-shrink-0">
            {{ guest.name.charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="font-serif font-semibold text-brown-800">{{ guest.name }}</h4>
              <span v-if="guest.address" class="text-xs text-brown-400 font-sans">📍 {{ guest.address }}</span>
              <span :class="attendanceBadge(guest.attendance).class" class="text-xs px-2 py-0.5 rounded-full font-sans ml-auto">
                {{ attendanceBadge(guest.attendance).label }}
              </span>
            </div>
            <p class="text-brown-600 font-sans text-sm mt-1 leading-relaxed">{{ guest.message }}</p>
            <p class="text-xs text-brown-300 font-sans mt-2">{{ formatDate(guest.created_at) }}</p>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="!loading && guests.length === 0" class="text-center py-12 text-brown-300">
        <p class="text-4xl mb-2">💌</p>
        <p class="font-serif text-lg">Belum ada ucapan</p>
        <p class="font-sans text-sm mt-1">Jadilah yang pertama menulis ucapan!</p>
      </div>

      <!-- Load more -->
      <div v-if="hasMore" class="text-center pt-4">
        <button @click="loadMore" :disabled="loadingMore" class="btn-outline">
          <span v-if="loadingMore" class="w-4 h-4 border-2 border-gold-400/40 border-t-gold-400 rounded-full animate-spin" />
          {{ loadingMore ? 'Memuat...' : 'Muat Lebih Banyak' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'
import { toast } from 'vue3-toastify'

const guests = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const page = ref(1)
const hasMore = ref(false)

const form = ref({
  name: '',
  address: '',
  attendance: 'hadir',
  message: '',
})

const attendanceOptions = [
  { value: 'hadir', label: 'Hadir', emoji: '✅' },
  { value: 'tidak_hadir', label: 'Tidak Hadir', emoji: '❌' },
  { value: 'masih_ragu', label: 'Masih Ragu', emoji: '🤔' },
]

const attendanceBadge = (att) => {
  const map = {
    hadir: { label: '✅ Hadir', class: 'bg-green-100 text-green-700' },
    tidak_hadir: { label: '❌ Tidak Hadir', class: 'bg-red-100 text-red-700' },
    masih_ragu: { label: '🤔 Masih Ragu', class: 'bg-yellow-100 text-yellow-700' },
  }
  return map[att] || { label: att, class: 'bg-gray-100 text-gray-700' }
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const fetchGuests = async (reset = false) => {
  if (reset) { page.value = 1; guests.value = [] }
  loading.value = true
  try {
    const { data } = await api.get(`/guestbook?page=${page.value}&limit=5`)
    guests.value = reset ? data.data : [...guests.value, ...data.data]
    hasMore.value = data.pagination.page < data.pagination.totalPages
  } catch {
    toast.error('Gagal memuat ucapan')
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  page.value++
  loadingMore.value = true
  try {
    const { data } = await api.get(`/guestbook?page=${page.value}&limit=5`)
    guests.value = [...guests.value, ...data.data]
    hasMore.value = data.pagination.page < data.pagination.totalPages
  } catch {
    toast.error('Gagal memuat ucapan')
  } finally {
    loadingMore.value = false
  }
}

const submitGuest = async () => {
  loading.value = true
  try {
    await api.post('/guestbook', form.value)
    toast.success('Terima kasih atas ucapan dan doamu! 💌')
    form.value = { name: '', address: '', attendance: 'hadir', message: '' }
    await fetchGuests(true)
  } catch (err) {
    const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Gagal mengirim ucapan'
    toast.error(msg)
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchGuests(true))
</script>
