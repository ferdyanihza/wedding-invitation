const { Gallery } = require('../models');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const streamifier = require('streamifier');

// Multer pakai memory storage — file tidak disimpan ke disk, langsung stream ke Cloudinary
exports.upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan (JPG, PNG, WEBP)'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Helper: upload buffer ke Cloudinary
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'wedding/gallery', resource_type: 'image', ...options },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// GET semua foto (public)
exports.index = async (req, res) => {
  try {
    const galleries = await Gallery.find({ is_active: true })
      .sort({ sort_order: 1, created_at: -1 });

    const data = galleries.map(g => ({
      ...g.toJSON(),
      id: g._id,
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST upload foto (admin)
exports.store = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(422).json({ success: false, message: 'File gambar wajib diupload' });
    }

    // Upload ke Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });

    const gallery = await Gallery.create({
      filename: result.public_id,        // simpan public_id Cloudinary
      original_name: req.file.originalname,
      url: result.secure_url,            // URL permanen dari Cloudinary
      caption: req.body.caption || '',
      sort_order: parseInt(req.body.sort_order) || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Foto berhasil diupload',
      data: { ...gallery.toJSON(), id: gallery._id },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT update caption/sort
exports.update = async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      {
        ...(req.body.caption !== undefined && { caption: req.body.caption }),
        ...(req.body.sort_order !== undefined && { sort_order: req.body.sort_order }),
        ...(req.body.is_active !== undefined && { is_active: req.body.is_active }),
      },
      { new: true }
    );
    if (!gallery) return res.status(404).json({ success: false, message: 'Foto tidak ditemukan' });
    res.json({ success: true, data: { ...gallery.toJSON(), id: gallery._id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE hapus foto
exports.destroy = async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);
    if (!gallery) return res.status(404).json({ success: false, message: 'Foto tidak ditemukan' });

    // Hapus dari Cloudinary juga
    if (gallery.filename && gallery.filename.startsWith('wedding/')) {
      await cloudinary.uploader.destroy(gallery.filename).catch(() => {});
    }

    res.json({ success: true, message: 'Foto berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
