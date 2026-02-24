const mongoose = require('mongoose');

const weddingConfigSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true },
  value: { type: String, default: '' },
  description: { type: String, default: '' },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.model('WeddingConfig', weddingConfigSchema);
