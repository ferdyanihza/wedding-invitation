<template>
  <div class="space-y-6">

    <!-- ===== MUSIK UPLOAD (khusus) ===== -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
        <span class="text-xl">🎵</span>
        <h3 class="font-serif text-lg text-brown-800">Musik Latar</h3>
      </div>
      <div class="p-6 space-y-4">
        <!-- Status musik saat ini -->
        <div v-if="currentMusic.url" class="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">🎶</div>
          <div class="flex-1 min-w-0">
            <p class="font-sans text-sm font-medium text-green-800">Musik aktif</p>
            <p class="font-sans text-xs text-green-600 truncate">{{ currentMusic.title }}</p>
            <audio :src="currentMusic.url" controls class="mt-2 h-8 w-full max-w-xs" />
          </div>
          <button @click="deleteMusic" :disabled="deletingMusic" class="flex-shrink-0 text-xs px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-sans transition">
            {{ deletingMusic ? '...' : '🗑 Hapus' }}
          </button>
        </div>
        <div v-else class="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <span class="text-2xl">🔇</span>
          <p class="font-sans text-sm text-gray-500">Belum ada musik. Upload file MP3 di bawah.</p>
        </div>

        <!-- Upload area -->
        <div
          class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
          :class="isDragging ? 'border-gold-400 bg-gold-50' : 'border-gray-200 hover:border-gold-300 hover:bg-gray-50'"
          @click="$refs.musicInput.click()"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop.prevent="handleMusicDrop"
        >
          <input type="file" ref="musicInput" accept=".mp3,.ogg,.wav,.aac,.m4a,audio/*" class="hidden" @change="handleMusicSelect" />
          <div v-if="!uploadingMusic">
            <p class="text-3xl mb-2">🎵</p>
            <p class="font-sans text-sm text-gray-600">Klik atau seret file musik ke sini</p>
            <p class="font-sans text-xs text-gray-400 mt-1">MP3, OGG, WAV, AAC — Maks 20MB</p>
          </div>
          <div v-else class="flex flex-col items-center gap-2">
            <div class="w-8 h-8 border-3 border-gold-400/40 border-t-gold-500 rounded-full animate-spin" />
            <p class="font-sans text-sm text-gold-600">Mengupload {{ uploadingFile }}...</p>
            <div class="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }" />
            </div>
          </div>
        </div>

        <!-- Title input -->
        <div>
          <label class="text-xs font-sans text-gray-500 mb-1 block uppercase tracking-wider">Judul Lagu (tampil di player)</label>
          <div class="flex gap-2">
            <input
              v-model="form.music_title"
              type="text"
              placeholder="Perfect - Ed Sheeran"
              class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 font-sans text-sm text-gray-700 focus:outline-none focus:border-gold-400 transition"
            />
            <button @click="saveMusicTitle" :disabled="saving" class="btn-primary px-4 py-2.5 text-sm">
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== KONFIGURASI LAINNYA ===== -->
    <div v-for="section in sections" :key="section.title" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
        <span class="text-xl">{{ section.icon }}</span>
        <h3 class="font-serif text-lg text-brown-800">{{ section.title }}</h3>
      </div>
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="field in section.fields" :key="field.key" :class="field.span === 2 ? 'md:col-span-2' : ''">
          <label class="text-xs font-sans text-gray-500 mb-1 block uppercase tracking-wider">{{ field.label }}</label>
          <textarea
            v-if="field.type === 'textarea'"
            v-model="form[field.key]"
            rows="3"
            :placeholder="field.placeholder"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-sans text-sm text-gray-700 focus:outline-none focus:border-gold-400 transition resize-none"
          />
          <input
            v-else
            :type="field.type || 'text'"
            v-model="form[field.key]"
            :placeholder="field.placeholder"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-sans text-sm text-gray-700 focus:outline-none focus:border-gold-400 transition"
          />
        </div>
      </div>
    </div>

    <!-- Save button -->
    <div class="flex justify-end">
      <button @click="saveConfig" :disabled="saving" class="btn-primary">
        <span v-if="saving" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        {{ saving ? 'Menyimpan...' : '💾 Simpan Perubahan' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api'
import { toast } from 'vue3-toastify'

const form = ref({})
const saving = ref(false)
const isDragging = ref(false)
const uploadingMusic = ref(false)
const uploadingFile = ref('')
const uploadProgress = ref(0)
const deletingMusic = ref(false)
const currentMusic = reactive({ url: '', title: '' })

const sections = [
  {
    title: 'Mempelai Pria',
    icon: '🤵',
    fields: [
      { key: 'groom_name', label: 'Nama Panggilan', placeholder: 'Rendi' },
      { key: 'groom_full_name', label: 'Nama Lengkap', placeholder: 'Muhammad Rendi Pratama, S.T.' },
      { key: 'groom_father', label: 'Nama Ayah', placeholder: 'Bapak Suparman' },
      { key: 'groom_mother', label: 'Nama Ibu', placeholder: 'Ibu Siti Aminah' },
    ],
  },
  {
    title: 'Mempelai Wanita',
    icon: '👰',
    fields: [
      { key: 'bride_name', label: 'Nama Panggilan', placeholder: 'Mery' },
      { key: 'bride_full_name', label: 'Nama Lengkap', placeholder: 'Mery Anjani, S.Pd.' },
      { key: 'bride_father', label: 'Nama Ayah', placeholder: 'Bapak Bambang Suryadi' },
      { key: 'bride_mother', label: 'Nama Ibu', placeholder: 'Ibu Rahayu Ningsih' },
    ],
  },
  {
    title: 'Tanggal & Lokasi',
    icon: '📅',
    fields: [
      { key: 'akad_date', label: 'Tanggal Akad Nikah', type: 'datetime-local' },
      { key: 'resepsi_date', label: 'Tanggal Resepsi', type: 'datetime-local' },
      { key: 'wedding_location', label: 'Lokasi Pernikahan', placeholder: 'Gedung Serbaguna...', span: 2 },
      { key: 'wedding_maps_url', label: 'Link Google Maps', placeholder: 'https://maps.google.com/?q=...', span: 2 },
      { key: 'live_streaming_url', label: 'Link Live Streaming (opsional)', placeholder: 'https://youtube.com/live/...', span: 2 },
    ],
  },
  {
    title: 'Cerita Cinta',
    icon: '💕',
    fields: [
      { key: 'love_story', label: 'Cerita Singkat', type: 'textarea', placeholder: 'Ceritakan kisah cinta kalian...', span: 2 },
    ],
  },
  {
    title: 'Hadiah (Transfer)',
    icon: '🎁',
    fields: [
      { key: 'bank_name', label: 'Nama Bank', placeholder: 'BCA' },
      { key: 'bank_account_number', label: 'Nomor Rekening', placeholder: '1234567890' },
      { key: 'bank_account_name', label: 'Atas Nama', placeholder: 'Muhammad Rendi Pratama', span: 2 },
      { key: 'gopay_number', label: 'Nomor GoPay', placeholder: '081234567890' },
      { key: 'ovo_number', label: 'Nomor OVO', placeholder: '081234567890' },
    ],
  },
]

const fetchConfig = async () => {
  try {
    const { data } = await api.get('/config')
    const cfg = { ...data.data }
    if (cfg.akad_date) cfg.akad_date = cfg.akad_date.slice(0, 16)
    if (cfg.resepsi_date) cfg.resepsi_date = cfg.resepsi_date.slice(0, 16)
    form.value = cfg

    // Set musik saat ini
    currentMusic.url = cfg.music_url || ''
    currentMusic.title = cfg.music_title || ''
  } catch {
    toast.error('Gagal memuat konfigurasi')
  }
}

const uploadMusicFile = async (file) => {
  if (!file) return
  if (file.size > 20 * 1024 * 1024) {
    toast.error('File terlalu besar. Maksimal 20MB.')
    return
  }

  uploadingFile.value = file.name
  uploadingMusic.value = true
  uploadProgress.value = 0

  try {
    const fd = new FormData()
    fd.append('music', file)

    const { data } = await api.post('/admin/music', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        uploadProgress.value = Math.round((e.loaded * 100) / e.total)
      },
    })

    currentMusic.url = data.data.music_url
    // Refresh config untuk dapat title yang otomatis di-set
    await fetchConfig()
    toast.success(`🎵 "${file.name}" berhasil diupload!`)
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal upload musik')
  } finally {
    uploadingMusic.value = false
    uploadingFile.value = ''
    uploadProgress.value = 0
  }
}

const handleMusicSelect = (e) => {
  const file = e.target.files[0]
  if (file) uploadMusicFile(file)
  e.target.value = ''
}

const handleMusicDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) uploadMusicFile(file)
}

const deleteMusic = async () => {
  if (!confirm('Hapus musik latar?')) return
  deletingMusic.value = true
  try {
    await api.delete('/admin/music')
    currentMusic.url = ''
    currentMusic.title = ''
    form.value.music_url = ''
    toast.success('Musik berhasil dihapus')
  } catch {
    toast.error('Gagal menghapus musik')
  } finally {
    deletingMusic.value = false
  }
}

const saveMusicTitle = async () => {
  saving.value = true
  try {
    await api.put('/admin/config', { music_title: form.value.music_title })
    currentMusic.title = form.value.music_title
    toast.success('Judul lagu disimpan ✓')
  } catch {
    toast.error('Gagal menyimpan judul')
  } finally {
    saving.value = false
  }
}

const saveConfig = async () => {
  saving.value = true
  try {
    // Jangan kirim music_url karena diurus via upload endpoint
    const { music_url, ...configToSave } = form.value
    await api.put('/admin/config', configToSave)
    toast.success('Konfigurasi berhasil disimpan! ✓')
  } catch {
    toast.error('Gagal menyimpan konfigurasi')
  } finally {
    saving.value = false
  }
}

onMounted(fetchConfig)
</script>
