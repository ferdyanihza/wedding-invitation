const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const authController = require('../controllers/authController');
const guestBookController = require('../controllers/guestBookController');
const galleryController = require('../controllers/galleryController');
const weddingConfigController = require('../controllers/weddingConfigController');

// ==================== AUTH ====================
router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.me);

// ==================== WEDDING CONFIG (Public) ====================
router.get('/config', weddingConfigController.getConfig);
router.get('/config/qr-bank', weddingConfigController.getBankQR);

// ==================== GUEST BOOK (Public) ====================
router.get('/guestbook', guestBookController.index);
router.post('/guestbook', guestBookController.validateStore, guestBookController.store);

// ==================== GALLERY (Public) ====================
router.get('/gallery', galleryController.index);

// ==================== ADMIN ROUTES (Protected) ====================
// Admin - Wedding Config
router.put('/admin/config', authMiddleware, weddingConfigController.updateConfig);
router.post('/admin/music', authMiddleware, weddingConfigController.uploadMusic.single('music'), weddingConfigController.uploadMusicFile);
router.delete('/admin/music', authMiddleware, weddingConfigController.deleteMusicFile);

// Admin - Guest Book
router.get('/admin/guestbook', authMiddleware, guestBookController.adminIndex);
router.patch('/admin/guestbook/:id/toggle', authMiddleware, guestBookController.toggleApproval);
router.delete('/admin/guestbook/:id', authMiddleware, guestBookController.destroy);

// Admin - Gallery
router.post('/admin/gallery', authMiddleware, galleryController.upload.single('photo'), galleryController.store);
router.put('/admin/gallery/:id', authMiddleware, galleryController.update);
router.delete('/admin/gallery/:id', authMiddleware, galleryController.destroy);

module.exports = router;
