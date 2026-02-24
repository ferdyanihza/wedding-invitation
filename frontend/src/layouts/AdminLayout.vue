<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-brown-900 text-white flex flex-col fixed inset-y-0 z-30">
      <div class="p-6 border-b border-brown-700">
        <h1 class="font-script text-2xl text-gold-400">Admin Panel</h1>
        <p class="font-sans text-xs text-brown-300 mt-1 tracking-widest uppercase">Wedding Invitation</p>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <RouterLink
          v-for="item in navItems" :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm transition-all duration-200"
          :class="$route.path === item.to
            ? 'bg-gold-600 text-white shadow-md'
            : 'text-brown-300 hover:bg-brown-800 hover:text-white'"
        >
          <span class="text-lg">{{ item.icon }}</span>
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-brown-700">
        <a href="/" target="_blank" class="flex items-center gap-2 px-4 py-2 text-brown-300 hover:text-gold-300 transition text-sm font-sans mb-2">
          <span>🔗</span> Lihat Undangan
        </a>
        <button @click="logout" class="flex items-center gap-2 px-4 py-2 text-brown-300 hover:text-red-300 transition text-sm font-sans w-full">
          <span>🚪</span> Keluar
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 ml-64">
      <!-- Top bar -->
      <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <h2 class="font-serif text-lg text-brown-800">{{ currentPageTitle }}</h2>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center">
            <svg class="w-4 h-4 text-gold-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <span class="text-sm font-sans text-brown-600">Administrator</span>
        </div>
      </header>

      <main class="p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/guestbook', label: 'Buku Tamu', icon: '💌' },
  { to: '/admin/gallery', label: 'Galeri Foto', icon: '📷' },
  { to: '/admin/config', label: 'Konfigurasi', icon: '⚙️' },
]

const currentPageTitle = computed(() => {
  return navItems.find(n => n.to === route.path)?.label || 'Admin Panel'
})

const logout = () => {
  localStorage.removeItem('admin_token')
  router.push('/admin/login')
}
</script>
