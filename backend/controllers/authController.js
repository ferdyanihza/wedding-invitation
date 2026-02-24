const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mendukung dua cara set password:
// 1. ADMIN_PASSWORD=plaintext  (mudah, untuk Docker)
// 2. ADMIN_PASSWORD_HASH=bcrypt_hash  (lebih aman, untuk production manual)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_PLAIN = process.env.ADMIN_PASSWORD || null;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || null;

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(422).json({ success: false, message: 'Username dan password wajib diisi' });
    }

    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({ success: false, message: 'Username atau password salah' });
    }

    let isMatch = false;
    if (ADMIN_PASSWORD_HASH) {
      // Gunakan hash bcrypt jika tersedia
      isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    } else if (ADMIN_PASSWORD_PLAIN) {
      // Fallback ke plaintext comparison (oke untuk dev/Docker)
      isMatch = password === ADMIN_PASSWORD_PLAIN;
    } else {
      // Default jika tidak ada env sama sekali
      isMatch = password === 'admin123';
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Username atau password salah' });
    }

    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES || '7d' }
    );

    res.json({
      success: true,
      message: 'Login berhasil',
      data: { token, username, role: 'admin' },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.me = (req, res) => {
  res.json({ success: true, data: { username: req.user.username, role: req.user.role } });
};
