const mongoose = require('mongoose');

const guestBookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama wajib diisi'],
    trim: true,
    minlength: [2, 'Nama minimal 2 karakter'],
    maxlength: [100, 'Nama maksimal 100 karakter'],
  },
  address: {
    type: String,
    trim: true,
    default: '',
  },
  attendance: {
    type: String,
    enum: ['hadir', 'tidak_hadir', 'masih_ragu'],
    default: 'hadir',
    required: true,
  },
  message: {
    type: String,
    required: [true, 'Ucapan wajib diisi'],
    trim: true,
    maxlength: [1000, 'Ucapan maksimal 1000 karakter'],
  },
  is_approved: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.model('GuestBook', guestBookSchema);
