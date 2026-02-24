const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  filename: { type: String, required: true },   // Cloudinary public_id
  original_name: { type: String, default: '' },
  url: { type: String, required: true },         // Cloudinary secure_url (permanen)
  caption: { type: String, default: '' },
  sort_order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.model('Gallery', gallerySchema);
