const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/me', async (req, res) => {
  const userId = 1; // Sửa lại lấy userId thực tế nếu có đăng nhập
  const [rows] = await db.query('SELECT name, email, role FROM users WHERE id = ?', [userId]);
  if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
  res.json(rows[0]);
});

module.exports = router;