const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getDashboardStats, saveResult } = require('../controllers/dashboardController');

router.get('/stats', authMiddleware, getDashboardStats);
router.post('/result', authMiddleware, saveResult);

module.exports = router;