<template>
  <div class="space-y-4">
    <!-- Upload section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 class="font-serif text-lg text-brown-800 mb-4">Upload Foto Baru</h3>
      <div
        class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
        :class="isDragging ? 'border-gold-400 bg-gold-50' : 'border-gold-200 hover:border-gold-400 hover:bg-gold-50/30'"
        @click="triggerUpload"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <input type="file" ref="fileInput" accept="image/jpeg,image/jpg,image/png,image/webp" multiple class="hidden" @change="handleFiles" />
        <div class="text-4xl mb-2">📷</div>
        <p class="font-serif text-brown-500 text-sm">Klik atau seret foto ke sini</p>
        <p class="font-sans text-xs text-gray-400 mt-1">JPG, PNG, WEBP — Maks 10MB per foto</p>
      </div>

      <!-- Upload queue -->
      <div v-if="uploadQueue.length > 0" class="mt-4 space-y-2">
        <div v-for="item in uploadQueue" :key="item.id" class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <img :src="item.preview" class="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-sans text-gray-700 truncate">{{ item.file.name }}</p>
            <p class="text-xs text-gray-400 font-sans">{{ formatSize(item.file.size) }}</p>
            <!-- Progress bar -->
            <div v-if="item.status === 'uploading'" class="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-gold-500 rounded-full transition-all duration-300" :style="{ width: item.progress + '%' }" />
            </div>
            <p v-if="item.error" class="text-xs text-red-500 mt-1">{{ item.error }}</p>
          </div>
          <div class="flex-shrink-0">
            <span v-if="item.status === 'uploading'" class="text-xs text-gold-600 font-sans">{{ item.progress }}%</span>
            <span v-else-if="item.status === 'done'" class="text-green-500 text-xl">✓</span>
            <span v-else-if="item.status === 'error'" class="text-red-500 text-xl">✗</span>
            <button v-else @click="removeFromQueue(item.id)" class="text-gray-400 hover:text-red-500 transition text-lg">✕</button>
          </div>
        </div>

        <div class="flex gap-2 mt-2">
          <button
            @click="uploadAll"
            :disabled="uploading || pendingCount === 0"
            class="btn-primary flex-1 justify-center"
          >
            <span v-if="uploading" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            {{ uploading ? `Mengupload... (${doneCount}/${uploadQueue.length})` : `Upload ${pendingCount} Foto` }}
          </button>
          <button @click="clearQueue" class="px-4 py-2 text-sm text-gray-500 hover:text-red-500 font-sans transition">
            Bersihkan
          </button>
        </div>
      </div>
    </div>

    <!-- Gallery grid -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-serif text-lg text-brown-800">Foto Tersimpan ({{ photos.length }})</h3>
        <button @click="fetchPhotos" class="text-xs text-gold-600 font-sans hover:underline">↻ Refresh</button>
      </div>

      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="n in 8" :key="n" class="aspect-square bg-gray-100 rounded-xl animate-pulse" />
      </div>

      <div v-else-if="photos.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="photo in photos" :key="photo.id || photo._id" class="relative group rounded-xl overflow-hidden aspect-square shadow-sm bg-gray-100">
          <img
            :src="photo.url"
            :alt="photo.caption"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            @error="handleImgError($event, photo)"
            loading="lazy"
          />
          <!-- Error state -->
          <div v-if="photo.imgError" class="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-xs font-sans p-2 text-center">
            <div>
              <p class="text-2xl mb-1">🖼️</p>
              <p>Foto tidak ditemukan</p>
            </div>
          </div>
          <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
            <p v-if="photo.caption" class="text-white text-xs text-center font-sans line-clamp-2">{{ photo.caption }}</p>
            <button @click="deletePhoto(photo)" class="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-600 transition font-sans">
              🗑 Hapus
            </button>
          </div>
        </div>
      </div>

      <div v-else class="py-12 text-center text-gray-400">
        <p class="text-4xl mb-2">📷</p>
        <p class="font-sans text-sm">Belum ada foto. Upload foto pertama!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api'
import { toast } from 'vue3-toastify'

const photos = ref([])
const loading = ref(true)
const uploading = ref(false)
const isDragging = ref(false)
const fileInput = ref(null)
const uploadQueue = ref([])

const pendingCount = computed(() => uploadQueue.value.filter(q => q.status === 'pending').length)
const doneCount = computed(() => uploadQueue.value.filter(q => q.status === 'done').length)

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const triggerUpload = () => fileInput.value?.click()

const handleDrop = (e) => {
  isDragging.value = false
  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
  if (!files.length) {
    toast.error('Hanya file gambar yang diterima')
    return
  }
  addToQueue(files)
}

const handleFiles = (e) => {
  const files = Array.from(e.target.files)
  addToQueue(files)
  fileInput.value.value = ''
}

const addToQueue = (files) => {
  files.forEach(file => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error(`${file.name} terlalu besar (maks 10MB)`)
      return
    }
    const id = Math.random().toString(36).slice(2)
    const preview = URL.createObjectURL(file)
    uploadQueue.value.push({ id, file, preview, status: 'pending', progress: 0, error: null })
  })
}

const removeFromQueue = (id) => {
  const item = uploadQueue.value.find(q => q.id === id)
  if (item?.preview) URL.revokeObjectURL(item.preview)
  uploadQueue.value = uploadQueue.value.filter(q => q.id !== id)
}

const clearQueue = () => {
  uploadQueue.value.forEach(q => { if (q.preview) URL.revokeObjectURL(q.preview) })
  uploadQueue.value = []
}

const uploadAll = async () => {
  const pending = uploadQueue.value.filter(q => q.status === 'pending')
  if (!pending.length) return

  uploading.value = true

  for (const item of pending) {
    item.status = 'uploading'
    item.progress = 0
    item.error = null

    try {
      const fd = new FormData()
      fd.append('photo', item.file)
      if (item.caption) fd.append('caption', item.caption)

      const { data } = await api.post('/admin/gallery', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          item.progress = Math.round((e.loaded * 100) / e.total)
        },
        timeout: 60000, // 60 detik timeout
      })

      photos.value.unshift(data.data)
      item.status = 'done'
      item.progress = 100
    } catch (err) {
      item.status = 'error'
      item.error = err.response?.data?.message || err.message || 'Upload gagal'
      toast.error(`Gagal upload: ${item.file.name} — ${item.error}`)
    }
  }

  const doneItems = uploadQueue.value.filter(q => q.status === 'done')
  if (doneItems.length > 0) {
    toast.success(`${doneItems.length} foto berhasil diupload!`)
    // Bersihkan item yang sukses setelah 2 detik
    setTimeout(() => {
      doneItems.forEach(q => { if (q.preview) URL.revokeObjectURL(q.preview) })
      uploadQueue.value = uploadQueue.value.filter(q => q.status !== 'done')
    }, 2000)
  }

  uploading.value = false
}

const handleImgError = (event, photo) => {
  photo.imgError = true
  event.target.style.display = 'none'
}

const deletePhoto = async (photo) => {
  const id = photo.id || photo._id
  if (!confirm('Hapus foto ini?')) return
  try {
    await api.delete(`/admin/gallery/${id}`)
    photos.value = photos.value.filter(p => (p.id || p._id) !== id)
    toast.success('Foto berhasil dihapus')
  } catch {
    toast.error('Gagal menghapus foto')
  }
}

const fetchPhotos = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/gallery')
    photos.value = data.data.map(p => ({ ...p, imgError: false }))
  } catch {
    toast.error('Gagal memuat galeri')
  } finally {
    loading.value = false
  }
}

onMounted(fetchPhotos)
</script>
