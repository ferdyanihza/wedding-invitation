<template>
  <div class="min-h-screen">
    <!-- ===== COVER / OPENING ===== -->
    <section
      v-if="showCover"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style="background: linear-gradient(135deg, #2d1b0e 0%, #4a2a0e 40%, #2d1b0e 100%)"
    >
      <!-- Particle petals -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          v-for="n in 15" :key="n"
          class="petal absolute text-gold-400 text-xl opacity-60"
          :style="{
            left: `${Math.random() * 100}%`,
            '--duration': `${4 + Math.random() * 4}s`,
            '--delay': `${Math.random() * 3}s`,
            '--drift': `${(Math.random() - 0.5) * 80}px`,
          }"
        >{{ ['🌸', '🌺', '✦', '❋', '✿'][n % 5] }}</div>
      </div>

      <!-- Cover content -->
      <div class="relative z-10 text-center px-6 animate-fade-in">
        <p class="font-sans text-gold-300 tracking-[0.4em] text-xs uppercase mb-6">Undangan Pernikahan</p>

        <div class="flex items-center justify-center gap-4 mb-2">
          <div class="h-px w-16 bg-gradient-to-r from-transparent to-gold-400" />
          <svg class="w-8 h-8 text-gold-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
          </svg>
          <div class="h-px w-16 bg-gradient-to-l from-transparent to-gold-400" />
        </div>

        <h1 class="font-script text-shimmer text-6xl md:text-8xl mb-1">
          {{ config.groom_name }}
        </h1>
        <p class="font-sans text-gold-300 tracking-widest text-sm mb-2">&amp;</p>
        <h1 class="font-script text-shimmer text-6xl md:text-8xl mb-8">
          {{ config.bride_name }}
        </h1>

        <p v-if="guestName" class="font-sans text-ivory-200 text-sm mb-2">Kepada Yth.</p>
        <p v-if="guestName" class="font-serif text-gold-200 text-xl mb-8 italic">{{ guestName }}</p>

        <p class="font-serif text-ivory-300 text-sm mb-8">
          {{ formatDate(config.akad_date, 'full') }}
        </p>

        <button
          @click="openInvitation"
          class="group relative px-10 py-4 border border-gold-400 text-gold-200 font-sans tracking-widest text-sm uppercase rounded-full hover:bg-gold-400/10 transition-all duration-500"
        >
          <span class="relative z-10">Buka Undangan</span>
          <div class="absolute inset-0 rounded-full bg-gold-400/0 group-hover:bg-gold-400/10 transition-all duration-500" />
        </button>
      </div>
    </section>

    <!-- ===== MAIN INVITATION ===== -->
    <div v-if="!showCover" class="animate-fade-in">

      <!-- Sticky Nav -->
      <nav class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gold-100 shadow-sm">
        <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <p class="font-script text-gold-600 text-2xl">{{ config.groom_name }} & {{ config.bride_name }}</p>
          <div class="hidden md:flex gap-6 text-xs font-sans tracking-widest uppercase text-brown-400">
            <a href="#acara" class="hover:text-gold-600 transition">Acara</a>
            <a href="#galeri" class="hover:text-gold-600 transition">Galeri</a>
            <a href="#ucapan" class="hover:text-gold-600 transition">Ucapan</a>
            <a href="#hadiah" class="hover:text-gold-600 transition">Hadiah</a>
          </div>
        </div>
      </nav>

      <!-- ===== HERO SECTION ===== -->
      <section class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style="background: linear-gradient(to bottom, #4a2a0e, #2d1b0e)"
      >
        <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div v-for="n in 8" :key="n"
            class="petal absolute text-gold-300 text-3xl"
            :style="{
              left: `${10 + (n * 12) % 80}%`,
              '--duration': `${5 + n}s`,
              '--delay': `${n * 0.5}s`,
              '--drift': `${(n % 2 === 0 ? 1 : -1) * 40}px`,
            }"
          >🌸</div>
        </div>

        <div class="relative z-10 text-center px-6 py-20 max-w-2xl mx-auto">
          <p class="font-sans text-gold-300 tracking-[0.4em] text-xs uppercase mb-6 animate-slide-up">Dengan penuh kebahagiaan kami mengundang</p>

          <div class="flex items-center justify-center gap-4 mb-6">
            <div class="h-px flex-1 max-w-20 bg-gradient-to-r from-transparent to-gold-400/60" />
            <svg class="w-10 h-10 text-gold-400 animate-float" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
            <div class="h-px flex-1 max-w-20 bg-gradient-to-l from-transparent to-gold-400/60" />
          </div>

          <h2 class="font-script text-shimmer text-7xl md:text-9xl leading-none mb-2">{{ config.groom_name }}</h2>
          <p class="font-sans text-gold-300 text-2xl mb-2">&amp;</p>
          <h2 class="font-script text-shimmer text-7xl md:text-9xl leading-none mb-8">{{ config.bride_name }}</h2>

          <div class="divider-ornament">
            <span class="text-gold-400 text-lg">✦</span>
          </div>

          <p class="font-serif text-ivory-200 text-lg md:text-xl leading-relaxed mb-10">
            {{ formatDate(config.akad_date, 'long') }}
          </p>

          <!-- Countdown -->
          <CountdownTimer v-if="config.akad_date" :target-date="config.akad_date" />
        </div>
      </section>

      <!-- ===== COUPLE SECTION ===== -->
      <section class="py-20 px-4 bg-white relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-300 to-transparent" />

        <div class="max-w-3xl mx-auto">
          <p class="section-title">Mempelai</p>
          <p class="section-subtitle">Yang Berbahagia</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Groom -->
            <div class="card-wedding text-center group">
              <div class="w-28 h-28 rounded-full bg-gradient-to-br from-gold-200 to-gold-400 flex items-center justify-center mx-auto mb-4 text-5xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                🤵
              </div>
              <p class="font-sans text-xs tracking-widest uppercase text-gold-500 mb-1">Mempelai Pria</p>
              <h3 class="font-script text-4xl text-brown-800 mb-2">{{ config.groom_name }}</h3>
              <p class="font-serif text-brown-600 text-sm italic mb-3">{{ config.groom_full_name }}</p>
              <div class="h-px bg-gradient-to-r from-transparent via-gold-200 to-transparent my-3" />
              <p class="font-sans text-brown-400 text-xs">Putra dari</p>
              <p class="font-serif text-brown-600 text-sm mt-1">{{ config.groom_father }}</p>
              <p class="font-serif text-brown-600 text-sm">{{ config.groom_mother }}</p>
            </div>

            <!-- Bride -->
            <div class="card-wedding text-center group">
              <div class="w-28 h-28 rounded-full bg-gradient-to-br from-rose-200 to-rose-400 flex items-center justify-center mx-auto mb-4 text-5xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                👰
              </div>
              <p class="font-sans text-xs tracking-widest uppercase text-gold-500 mb-1">Mempelai Wanita</p>
              <h3 class="font-script text-4xl text-brown-800 mb-2">{{ config.bride_name }}</h3>
              <p class="font-serif text-brown-600 text-sm italic mb-3">{{ config.bride_full_name }}</p>
              <div class="h-px bg-gradient-to-r from-transparent via-gold-200 to-transparent my-3" />
              <p class="font-sans text-brown-400 text-xs">Putri dari</p>
              <p class="font-serif text-brown-600 text-sm mt-1">{{ config.bride_father }}</p>
              <p class="font-serif text-brown-600 text-sm">{{ config.bride_mother }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== LOVE STORY ===== -->
      <section v-if="config.love_story" class="py-20 px-4 bg-ivory-100">
        <div class="max-w-2xl mx-auto text-center">
          <p class="section-title">Cerita Kita</p>
          <p class="section-subtitle">Our Love Story</p>
          <div class="card-wedding">
            <p class="font-serif text-brown-600 leading-relaxed text-lg italic">
              "{{ config.love_story }}"
            </p>
          </div>
        </div>
      </section>

      <!-- ===== ACARA SECTION ===== -->
      <section id="acara" class="py-20 px-4 bg-white">
        <div class="max-w-3xl mx-auto">
          <p class="section-title">Acara</p>
          <p class="section-subtitle">Rangkaian Acara Pernikahan</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Akad Nikah -->
            <div class="card-wedding border-l-4 border-gold-400 hover:shadow-xl transition-shadow">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-gold-100 rounded-xl flex items-center justify-center text-xl">🕌</div>
                <div>
                  <h3 class="font-serif font-semibold text-brown-800">Akad Nikah</h3>
                  <p class="text-xs font-sans text-brown-400 tracking-widest uppercase">Ijab Qabul</p>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-brown-600">
                  <svg class="w-4 h-4 text-gold-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span class="font-sans text-sm">{{ formatDate(config.akad_date, 'full') }}</span>
                </div>
                <div class="flex items-center gap-2 text-brown-600">
                  <svg class="w-4 h-4 text-gold-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="font-sans text-sm">{{ formatTime(config.akad_date) }} WIB</span>
                </div>
                <div class="flex items-start gap-2 text-brown-600">
                  <svg class="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span class="font-sans text-sm">{{ config.wedding_location }}</span>
                </div>
              </div>
            </div>

            <!-- Resepsi -->
            <div class="card-wedding border-l-4 border-rose-300 hover:shadow-xl transition-shadow">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-xl">🎊</div>
                <div>
                  <h3 class="font-serif font-semibold text-brown-800">Resepsi</h3>
                  <p class="text-xs font-sans text-brown-400 tracking-widest uppercase">Walimatul Ursy</p>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-brown-600">
                  <svg class="w-4 h-4 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span class="font-sans text-sm">{{ formatDate(config.resepsi_date || config.akad_date, 'full') }}</span>
                </div>
                <div class="flex items-center gap-2 text-brown-600">
                  <svg class="w-4 h-4 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="font-sans text-sm">{{ formatTime(config.resepsi_date || config.akad_date) }} WIB</span>
                </div>
                <div class="flex items-start gap-2 text-brown-600">
                  <svg class="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span class="font-sans text-sm">{{ config.wedding_location }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Maps button -->
          <div class="text-center">
            <a
              :href="config.wedding_maps_url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Buka Google Maps
            </a>

            <a
              v-if="config.live_streaming_url"
              :href="config.live_streaming_url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-outline ml-3"
            >
              🔴 Live Streaming
            </a>
          </div>
        </div>
      </section>

      <!-- ===== GALLERY SECTION ===== -->
      <section id="galeri" class="py-20 px-4 bg-ivory-100">
        <div class="max-w-4xl mx-auto">
          <p class="section-title">Galeri</p>
          <p class="section-subtitle">Momen Berharga Kami</p>
          <PhotoGallery />
        </div>
      </section>

      <!-- ===== GUEST BOOK SECTION ===== -->
      <section id="ucapan" class="py-20 px-4 bg-white">
        <div class="max-w-2xl mx-auto">
          <p class="section-title">Ucapan</p>
          <p class="section-subtitle">Kirimkan Doa & Ucapanmu</p>
          <GuestBook />
        </div>
      </section>

      <!-- ===== GIFT SECTION ===== -->
      <section id="hadiah" class="py-20 px-4 bg-ivory-100">
        <div class="max-w-3xl mx-auto">
          <p class="section-title">Hadiah</p>
          <p class="section-subtitle">Wedding Gift</p>
          <GiftCard :config="config" />
        </div>
      </section>

      <!-- ===== CLOSING SECTION ===== -->
      <section class="py-20 px-4 text-center relative overflow-hidden"
        style="background: linear-gradient(135deg, #2d1b0e 0%, #4a2a0e 60%, #2d1b0e 100%)"
      >
        <div class="absolute inset-0 opacity-10">
          <div v-for="n in 5" :key="n"
            class="petal absolute text-gold-300 text-2xl"
            :style="{
              left: `${20 * n}%`,
              '--duration': `${4 + n}s`,
              '--delay': `${n * 0.7}s`,
              '--drift': `${(n % 2 === 0 ? 1 : -1) * 50}px`,
            }"
          >✿</div>
        </div>

        <div class="relative z-10 max-w-xl mx-auto">
          <svg class="w-16 h-16 text-gold-400 mx-auto mb-6 animate-float" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
          </svg>

          <h2 class="font-script text-shimmer text-5xl md:text-6xl mb-6">
            {{ config.groom_name }} & {{ config.bride_name }}
          </h2>

          <p class="font-serif text-ivory-300 leading-relaxed text-base md:text-lg mb-8">
            Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas kehadiran dan doa restunya, kami mengucapkan terima kasih yang sebesar-besarnya.
          </p>

          <p class="font-sans text-gold-400 tracking-widest text-xs uppercase">
            Wassalamu'alaikum Warahmatullahi Wabarakatuh
          </p>

          <div class="h-px bg-gradient-to-r from-transparent via-gold-600/30 to-transparent my-8" />

          <p class="font-sans text-brown-400 text-xs tracking-widest">
            Made with 💛 by Wedding Digital Invitation
          </p>
        </div>
      </section>
    </div>

    <!-- Floating Music Player -->
    <FloatingMusic v-if="!showCover" :music-url="config.music_url" :music-title="config.music_title" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api'
import CountdownTimer from '@/components/CountdownTimer.vue'
import PhotoGallery from '@/components/PhotoGallery.vue'
import GuestBook from '@/components/GuestBook.vue'
import GiftCard from '@/components/GiftCard.vue'
import FloatingMusic from '@/components/FloatingMusic.vue'

const route = useRoute()
const showCover = ref(true)
const config = ref({
  groom_name: '...',
  bride_name: '...',
  groom_full_name: '',
  bride_full_name: '',
  groom_father: '',
  groom_mother: '',
  bride_father: '',
  bride_mother: '',
  akad_date: '',
  resepsi_date: '',
  wedding_location: '',
  wedding_maps_url: '#',
  live_streaming_url: '',
  love_story: '',
  bank_name: '',
  bank_account_number: '',
  bank_account_name: '',
  gopay_number: '',
  ovo_number: '',
  music_url: '',
  music_title: '',
})

// Nama tamu dari URL query: ?to=NamaUndangan
const guestName = ref(route.query.to || '')

const fetchConfig = async () => {
  try {
    const { data } = await api.get('/config')
    config.value = { ...config.value, ...data.data }
    // Update page title
    document.title = `Undangan Pernikahan ${config.value.groom_name} & ${config.value.bride_name}`
  } catch (err) {
    console.error('Gagal load config:', err)
  }
}

const openInvitation = () => {
  showCover.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const formatDate = (dateStr, format = 'full') => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (format === 'full') {
    return d.toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
  }
  if (format === 'long') {
    return d.toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })
  }
  return d.toLocaleDateString('id-ID')
}

const formatTime = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
}

onMounted(fetchConfig)
</script>
