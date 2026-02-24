const { WeddingConfig } = require('../models');
const cloudinary = require('../config/cloudinary');
const QRCode = require('qrcode');
const multer = require('multer');
const streamifier = require('streamifier');

// ==================== MUSIC UPLOAD (Cloudinary) ====================
exports.uploadMusic = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/\.(mp3|ogg|wav|aac|m4a)$/i) || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file audio yang diperbolehkan (MP3, OGG, WAV, AAC)'), false);
    }
  },
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// Helper: upload audio ke Cloudinary
const uploadAudioToCloudinary = (buffer, originalName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'wedding/music',
        resource_type: 'video', // Cloudinary pakai resource_type 'video' untuk audio
        public_id: 'background_music',
        overwrite: true,        // Selalu overwrite file lama
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ==================== DEFAULT CONFIG ====================
const getDefaultConfigs = () => ({
  groom_name: process.env.GROOM_NAME || 'Rendi',
  groom_full_name: process.env.GROOM_FULL_NAME || 'Rendi Pratama, S.T.',
  groom_father: process.env.GROOM_FATHER || 'Bapak Suparman',
  groom_mother: process.env.GROOM_MOTHER || 'Ibu Siti Aminah',
  bride_name: process.env.BRIDE_NAME || 'Mery',
  bride_full_name: process.env.BRIDE_FULL_NAME || 'Mery Anjani, S.Pd.',
  bride_father: process.env.BRIDE_FATHER || 'Bapak Bambang Suryadi',
  bride_mother: process.env.BRIDE_MOTHER || 'Ibu Rahayu Ningsih',
  akad_date: process.env.AKAD_DATE || '2024-12-20T08:00:00',
  resepsi_date: process.env.RESEPSI_DATE || '2024-12-20T11:00:00',
  wedding_location: process.env.WEDDING_LOCATION || 'Gedung Serbaguna, Jl. Merdeka No. 1, Jakarta',
  wedding_maps_url: process.env.WEDDING_MAPS_URL || 'https://maps.google.com/',
  live_streaming_url: '',
  bank_account_name: process.env.BANK_ACCOUNT_NAME || 'Rendi Pratama',
  bank_account_number: process.env.BANK_ACCOUNT_NUMBER || '1234567890',
  bank_name: process.env.BANK_NAME || 'BCA',
  gopay_number: process.env.GOPAY_NUMBER || '081234567890',
  ovo_number: process.env.OVO_NUMBER || '081234567890',
  love_story: 'Kami bertemu di kampus, saling jatuh cinta, dan kini siap melangkah ke jenjang pernikahan bersama.',
  music_url: '',
  music_title: 'Perfect - Ed Sheeran',
});

const getConfigMap = async () => {
  const configs = await WeddingConfig.find();
  const result = getDefaultConfigs();
  configs.forEach(c => { result[c.key] = c.value; });
  return result;
};

// ==================== CONTROLLERS ====================

// GET config (public)
exports.getConfig = async (req, res) => {
  try {
    const data = await getConfigMap();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT update config (admin)
exports.updateConfig = async (req, res) => {
  try {
    const { music_url, ...updates } = req.body; // jangan overwrite music_url via config biasa
    const ops = Object.entries(updates).map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: { $set: { key, value: value || '' } },
        upsert: true,
      },
    }));
    if (ops.length) await WeddingConfig.bulkWrite(ops);
    res.json({ success: true, message: 'Konfigurasi berhasil disimpan' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST upload musik ke Cloudinary (admin)
exports.uploadMusicFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(422).json({ success: false, message: 'File musik wajib diupload' });
    }

    // Upload ke Cloudinary (overwrite file lama otomatis)
    const result = await uploadAudioToCloudinary(req.file.buffer, req.file.originalname);

    // Simpan URL Cloudinary ke config
    await WeddingConfig.findOneAndUpdate(
      { key: 'music_url' },
      { $set: { key: 'music_url', value: result.secure_url } },
      { upsert: true }
    );

    // Set title dari nama file jika belum ada
    const titleDoc = await WeddingConfig.findOne({ key: 'music_title' });
    if (!titleDoc?.value) {
      const titleFromFile = req.file.originalname.replace(/\.[^/.]+$/, '');
      await WeddingConfig.findOneAndUpdate(
        { key: 'music_title' },
        { $set: { key: 'music_title', value: titleFromFile } },
        { upsert: true }
      );
    }

    res.json({
      success: true,
      message: 'Musik berhasil diupload!',
      data: {
        music_url: result.secure_url,
        original_name: req.file.originalname,
        size_kb: Math.round(req.file.size / 1024),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE hapus musik (admin)
exports.deleteMusicFile = async (req, res) => {
  try {
    // Hapus dari Cloudinary
    await cloudinary.uploader.destroy('wedding/music/background_music', {
      resource_type: 'video',
    }).catch(() => {});

    await WeddingConfig.findOneAndUpdate(
      { key: 'music_url' },
      { $set: { value: '' } },
      { upsert: true }
    );

    res.json({ success: true, message: 'Musik berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET QR Bank
exports.getBankQR = async (req, res) => {
  try {
    const cfg = await getConfigMap();
    const qrData = `Bank: ${cfg.bank_name}\nNo. Rekening: ${cfg.bank_account_number}\nAtas Nama: ${cfg.bank_account_name}`;
    const qrImage = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: { dark: '#2d1b0e', light: '#fffdf7' },
    });
    res.json({ success: true, data: { qr: qrImage, info: cfg } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
