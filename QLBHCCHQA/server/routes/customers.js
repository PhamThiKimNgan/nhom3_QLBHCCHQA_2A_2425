const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Lấy danh sách khách hàng
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM customers');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lấy chi tiết khách hàng theo id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [[customer]] = await db.query('SELECT * FROM customers WHERE id = ?', [id]);
    if (!customer) return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật thông tin khách hàng (bao gồm điểm)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, points } = req.body;
    await db.execute(
      'UPDATE customers SET name = ?, email = ?, phone = ?, points = ? WHERE id = ?',
      [name, email, phone, points, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;