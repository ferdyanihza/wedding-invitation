<template>
  <div class="space-y-6">
    <!-- Stats cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <p class="font-sans text-sm text-gray-500">Total Ucapan</p>
          <div class="w-10 h-10 bg-gold-100 rounded-xl flex items-center justify-center text-xl">💌</div>
        </div>
        <p class="font-serif text-3xl font-bold text-brown-800">{{ stats.total }}</p>
        <p class="text-xs text-green-600 font-sans mt-1">{{ stats.hadir }} akan hadir</p>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <p class="font-sans text-sm text-gray-500">Konfirmasi Hadir</p>
          <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">✅</div>
        </div>
        <p class="font-serif text-3xl font-bold text-brown-800">{{ stats.hadir }}</p>
        <p class="text-xs text-gray-400 font-sans mt-1">dari {{ stats.total }} ucapan</p>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <p class="font-sans text-sm text-gray-500">Tidak Hadir</p>
          <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-xl">❌</div>
        </div>
        <p class="font-serif text-3xl font-bold text-brown-800">{{ stats.tidak_hadir }}</p>
        <p class="text-xs text-gray-400 font-sans mt-1">{{ stats.masih_ragu }} masih ragu</p>
      </div>
    </div>

    <!-- Countdown -->
    <div class="bg-gradient-to-br from-brown-800 to-brown-900 rounded-2xl p-8 text-center">
      <p class="font-sans text-gold-300 text-xs tracking-widest uppercase mb-3">Hitung Mundur Hari Pernikahan</p>
      <CountdownTimer v-if="weddingDate" :target-date="weddingDate" />
    </div>

    <!-- Recent ucapan -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="font-serif text-lg text-brown-800">Ucapan Terbaru</h3>
        <RouterLink to="/admin/guestbook" class="text-gold-600 text-sm font-sans hover:underline">Lihat semua →</RouterLink>
      </div>
      <div class="divide-y divide-gray-50">
        <div v-for="guest in recentGuests" :key="guest.id" class="px-6 py-4 hover:bg-gray-50 transition">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {{ guest.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <p class="font-serif text-brown-800 text-sm font-medium">{{ guest.name }}</p>
                <span v-if="!guest.is_approved" class="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Pending</span>
              </div>
              <p class="text-gray-500 text-xs font-sans mt-0.5 line-clamp-1">{{ guest.message }}</p>
            </div>
            <span class="text-xs text-gray-300 font-sans ml-auto flex-shrink-0">{{ timeAgo(guest.created_at) }}</span>
          </div>
        </div>
        <div v-if="recentGuests.length === 0" class="px-6 py-8 text-center text-gray-400 font-sans text-sm">
          Belum ada ucapan
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '@/api'
import CountdownTimer from '@/components/CountdownTimer.vue'

const stats = ref({ total: 0, hadir: 0, tidak_hadir: 0, masih_ragu: 0 })
const recentGuests = ref([])
const weddingDate = ref('')

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'baru saja'
  if (mins < 60) return `${mins} menit lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam lalu`
  return `${Math.floor(hours / 24)} hari lalu`
}

onMounted(async () => {
  try {
    const [guestsRes, configRes] = await Promise.all([
      api.get('/admin/guestbook?page=1&limit=5'),
      api.get('/config'),
    ])

    recentGuests.value = guestsRes.data.data
    weddingDate.value = configRes.data.data.akad_date

    // Calculate stats
    const allGuests = guestsRes.data.data
    stats.value.total = guestsRes.data.pagination.total
    allGuests.forEach(g => {
      if (g.attendance === 'hadir') stats.value.hadir++
      else if (g.attendance === 'tidak_hadir') stats.value.tidak_hadir++
      else stats.value.masih_ragu++
    })
  } catch (err) {
    console.error(err)
  }
})
</script>
