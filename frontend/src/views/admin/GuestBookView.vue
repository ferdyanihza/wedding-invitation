<template>
  <div class="space-y-4">
    <!-- Search & Filter -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
      <input
        v-model="search"
        @input="fetchGuests(true)"
        type="text"
        placeholder="Cari nama atau pesan..."
        class="flex-1 min-w-48 px-4 py-2 rounded-xl border border-gray-200 font-sans text-sm focus:outline-none focus:border-gold-400"
      />
      <span class="font-sans text-sm text-gray-500">Total: <strong>{{ pagination.total }}</strong> ucapan</span>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-sans font-medium text-gray-500 uppercase tracking-wider">Tamu</th>
              <th class="px-6 py-3 text-left text-xs font-sans font-medium text-gray-500 uppercase tracking-wider">Kehadiran</th>
              <th class="px-6 py-3 text-left text-xs font-sans font-medium text-gray-500 uppercase tracking-wider">Ucapan</th>
              <th class="px-6 py-3 text-left text-xs font-sans font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-sans font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="loading" v-for="n in 5" :key="n" class="animate-pulse">
              <td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded w-32" /></td>
              <td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded w-20" /></td>
              <td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded w-48" /></td>
              <td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded w-16" /></td>
              <td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded w-16" /></td>
            </tr>
            <tr
              v-for="guest in guests" :key="guest.id"
              class="hover:bg-gray-50 transition"
              :class="{ 'opacity-60': !guest.is_approved }"
            >
              <td class="px-6 py-4">
                <div>
                  <p class="font-serif text-brown-800 text-sm font-medium">{{ guest.name }}</p>
                  <p v-if="guest.address" class="text-xs text-gray-400 font-sans">📍 {{ guest.address }}</p>
                  <p class="text-xs text-gray-300 font-sans">{{ formatDate(guest.created_at) }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="badgeClass(guest.attendance)" class="text-xs px-2 py-1 rounded-full font-sans">
                  {{ badgeLabel(guest.attendance) }}
                </span>
              </td>
              <td class="px-6 py-4 max-w-xs">
                <p class="text-sm text-gray-600 font-sans line-clamp-2">{{ guest.message }}</p>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="guest.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                  class="text-xs px-2 py-1 rounded-full font-sans"
                >
                  {{ guest.is_approved ? '✓ Tampil' : '⏳ Hidden' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button
                    @click="toggleApproval(guest)"
                    class="text-xs px-3 py-1.5 rounded-lg font-sans transition"
                    :class="guest.is_approved ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' : 'bg-green-50 text-green-700 hover:bg-green-100'"
                  >
                    {{ guest.is_approved ? 'Sembunyikan' : 'Tampilkan' }}
                  </button>
                  <button
                    @click="deleteGuest(guest)"
                    class="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-sans transition"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && guests.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-gray-400 font-sans">Tidak ada ucapan ditemukan</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <p class="text-xs font-sans text-gray-400">Halaman {{ pagination.page }} dari {{ pagination.totalPages }}</p>
        <div class="flex gap-2">
          <button
            :disabled="pagination.page <= 1"
            @click="changePage(pagination.page - 1)"
            class="px-3 py-1.5 text-xs rounded-lg border border-gray-200 font-sans disabled:opacity-40 hover:bg-gray-50 transition"
          >← Prev</button>
          <button
            :disabled="pagination.page >= pagination.totalPages"
            @click="changePage(pagination.page + 1)"
            class="px-3 py-1.5 text-xs rounded-lg border border-gray-200 font-sans disabled:opacity-40 hover:bg-gray-50 transition"
          >Next →</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'
import { toast } from 'vue3-toastify'

const guests = ref([])
const loading = ref(true)
const search = ref('')
const pagination = ref({ page: 1, total: 0, totalPages: 1, limit: 20 })

let searchTimeout = null

const fetchGuests = async (reset = false) => {
  if (reset) pagination.value.page = 1
  loading.value = true
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.value.page,
        limit: pagination.value.limit,
        ...(search.value ? { search: search.value } : {}),
      })
      const { data } = await api.get(`/admin/guestbook?${params}`)
      guests.value = data.data
      pagination.value = data.pagination
    } catch {
      toast.error('Gagal memuat data')
    } finally {
      loading.value = false
    }
  }, 300)
}

const changePage = (p) => {
  pagination.value.page = p
  fetchGuests()
}

const toggleApproval = async (guest) => {
  try {
    await api.patch(`/admin/guestbook/${guest.id}/toggle`)
    guest.is_approved = !guest.is_approved
    toast.success(`Ucapan ${guest.is_approved ? 'ditampilkan' : 'disembunyikan'}`)
  } catch {
    toast.error('Gagal mengubah status')
  }
}

const deleteGuest = async (guest) => {
  if (!confirm(`Hapus ucapan dari "${guest.name}"?`)) return
  try {
    await api.delete(`/admin/guestbook/${guest.id}`)
    guests.value = guests.value.filter(g => g.id !== guest.id)
    pagination.value.total--
    toast.success('Ucapan berhasil dihapus')
  } catch {
    toast.error('Gagal menghapus ucapan')
  }
}

const badgeClass = (att) => ({
  hadir: 'bg-green-100 text-green-700',
  tidak_hadir: 'bg-red-100 text-red-700',
  masih_ragu: 'bg-yellow-100 text-yellow-700',
})[att] || 'bg-gray-100 text-gray-700'

const badgeLabel = (att) => ({
  hadir: '✅ Hadir',
  tidak_hadir: '❌ Tidak Hadir',
  masih_ragu: '🤔 Masih Ragu',
})[att] || att

const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

onMounted(() => fetchGuests())
</script>
