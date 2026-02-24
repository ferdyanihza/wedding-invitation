const { GuestBook } = require('../models');
const { body, validationResult } = require('express-validator');

// GET semua ucapan (public, hanya yang approved)
exports.index = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    const filter = { is_approved: true };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      GuestBook.find(filter).sort({ created_at: -1 }).skip(skip).limit(parseInt(limit)),
      GuestBook.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST tambah ucapan (public)
exports.store = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { name, address, attendance, message } = req.body;
    const guest = await GuestBook.create({ name, address, attendance, message });

    res.status(201).json({
      success: true,
      message: 'Terima kasih atas ucapan dan doamu!',
      data: guest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET semua ucapan (admin)
exports.adminIndex = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      GuestBook.find(filter).sort({ created_at: -1 }).skip(skip).limit(parseInt(limit)),
      GuestBook.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH toggle approve
exports.toggleApproval = async (req, res) => {
  try {
    const guest = await GuestBook.findById(req.params.id);
    if (!guest) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });

    guest.is_approved = !guest.is_approved;
    await guest.save();

    res.json({ success: true, message: 'Status berhasil diubah', data: guest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE hapus ucapan
exports.destroy = async (req, res) => {
  try {
    const guest = await GuestBook.findByIdAndDelete(req.params.id);
    if (!guest) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });

    res.json({ success: true, message: 'Data berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Validation rules
exports.validateStore = [
  body('name').trim().notEmpty().withMessage('Nama wajib diisi').isLength({ min: 2, max: 100 }),
  body('message').trim().notEmpty().withMessage('Ucapan wajib diisi').isLength({ max: 1000 }),
  body('attendance').isIn(['hadir', 'tidak_hadir', 'masih_ragu']).withMessage('Status kehadiran tidak valid'),
];
