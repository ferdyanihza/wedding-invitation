<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Bank Transfer Card -->
    <div class="card-wedding text-center">
      <div class="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
        </svg>
      </div>
      <h3 class="font-serif text-xl text-brown-700 mb-4">Transfer Bank</h3>

      <div v-if="qrData" class="mb-4">
        <img :src="qrData.qr" alt="QR Code Bank" class="w-40 h-40 mx-auto rounded-xl shadow-md border border-gold-200" />
      </div>

      <div class="bg-ivory-100 rounded-xl p-4 text-left space-y-2 mb-4">
        <div class="flex justify-between items-center">
          <span class="text-sm font-sans text-brown-400">Bank</span>
          <span class="font-serif font-semibold text-brown-700">{{ config.bank_name }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm font-sans text-brown-400">No. Rekening</span>
          <span class="font-serif font-semibold text-brown-700 flex items-center gap-2">
            {{ config.bank_account_number }}
            <button @click="copyText(config.bank_account_number)" class="text-gold-500 hover:text-gold-600 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm font-sans text-brown-400">Atas Nama</span>
          <span class="font-serif font-semibold text-brown-700">{{ config.bank_account_name }}</span>
        </div>
      </div>
    </div>

    <!-- E-Wallet Card -->
    <div class="card-wedding text-center">
      <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21l4-4 4 4M3 9l9-9 9 9M3 9h18"/>
        </svg>
      </div>
      <h3 class="font-serif text-xl text-brown-700 mb-4">E-Wallet</h3>

      <div class="space-y-3">
        <!-- GoPay -->
        <div class="bg-ivory-100 rounded-xl p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span class="text-white text-xs font-bold">G</span>
            </div>
            <div class="text-left">
              <p class="text-xs text-brown-400 font-sans">GoPay</p>
              <p class="font-serif font-semibold text-brown-700">{{ config.gopay_number }}</p>
            </div>
          </div>
          <button @click="copyText(config.gopay_number)" class="text-gold-500 hover:text-gold-600 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          </button>
        </div>

        <!-- OVO -->
        <div class="bg-ivory-100 rounded-xl p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span class="text-white text-xs font-bold">O</span>
            </div>
            <div class="text-left">
              <p class="text-xs text-brown-400 font-sans">OVO</p>
              <p class="font-serif font-semibold text-brown-700">{{ config.ovo_number }}</p>
            </div>
          </div>
          <button @click="copyText(config.ovo_number)" class="text-gold-500 hover:text-gold-600 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          </button>
        </div>
      </div>

      <p class="text-xs text-brown-300 font-sans mt-4">Hadiah Anda adalah doa dan kehadiran yang berarti bagi kami 🙏</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'
import { toast } from 'vue3-toastify'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
})

const qrData = ref(null)

const fetchQR = async () => {
  try {
    const { data } = await api.get('/config/qr-bank')
    qrData.value = data.data
  } catch {
    console.error('Gagal load QR')
  }
}

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Disalin ke clipboard! ✓')
  } catch {
    toast.error('Gagal menyalin')
  }
}

onMounted(fetchQR)
</script>
