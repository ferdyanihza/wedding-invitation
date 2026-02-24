require('dotenv').config();
const mongoose = require('mongoose');
const { GuestBook, WeddingConfig } = require('../models');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB terhubung');

    // Seed Wedding Config
    const configs = [
      { key: 'groom_name', value: 'Rendi' },
      { key: 'groom_full_name', value: 'Muhammad Rendi Pratama, S.T.' },
      { key: 'groom_father', value: 'Bapak Suparman' },
      { key: 'groom_mother', value: 'Ibu Siti Aminah' },
      { key: 'bride_name', value: 'Mery' },
      { key: 'bride_full_name', value: 'Mery Anjani, S.Pd.' },
      { key: 'bride_father', value: 'Bapak Bambang Suryadi' },
      { key: 'bride_mother', value: 'Ibu Rahayu Ningsih' },
      { key: 'akad_date', value: '2024-12-20T08:00:00' },
      { key: 'resepsi_date', value: '2024-12-20T11:00:00' },
      { key: 'wedding_location', value: 'Gedung Serbaguna Bougenvile, Jl. Merdeka No. 1, Jakarta Selatan' },
      { key: 'wedding_maps_url', value: 'https://maps.google.com/?q=-6.2088,106.8456' },
      { key: 'bank_name', value: 'BCA' },
      { key: 'bank_account_number', value: '1234567890' },
      { key: 'bank_account_name', value: 'Muhammad Rendi Pratama' },
      { key: 'gopay_number', value: '081234567890' },
      { key: 'ovo_number', value: '081234567890' },
      { key: 'love_story', value: 'Perkenalan kami dimulai dari sebuah kebetulan di kampus. Sebuah senyum dan sapaan sederhana berubah menjadi percakapan yang mengalir begitu alami. Kami berbagi cerita, tawa, dan mimpi bersama. Kini, kami siap melangkah ke babak baru dalam kehidupan kami — bersatu dalam ikatan suci pernikahan.' },
      { key: 'music_title', value: 'Perfect - Ed Sheeran' },
      { key: 'music_url', value: '' },
    ];

    for (const cfg of configs) {
      await WeddingConfig.findOneAndUpdate({ key: cfg.key }, { $set: cfg }, { upsert: true });
    }
    console.log('✅ Wedding config selesai');

    // Seed Guest Book
    await GuestBook.deleteMany({});
    await GuestBook.insertMany([
      { name: 'Ahmad Fauzi', address: 'Jakarta', attendance: 'hadir', message: 'Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, dan warahmah.' },
      { name: 'Siti Rahayu', address: 'Bandung', attendance: 'hadir', message: 'Barakallahu lakuma! Selamat dan semoga langgeng ya!' },
      { name: 'Budi Santoso', address: 'Surabaya', attendance: 'tidak_hadir', message: 'Maaf tidak bisa hadir, tapi doa terbaik selalu menyertai kalian.' },
      { name: 'Dewi Lestari', address: 'Yogyakarta', attendance: 'masih_ragu', message: 'Selamat ya! Semoga pernikahan kalian penuh berkah dan kebahagiaan.' },
    ]);
    console.log('✅ Guest book selesai');

    console.log('\n✅ Seeding selesai!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding gagal:', error.message);
    process.exit(1);
  }
}

seed();
