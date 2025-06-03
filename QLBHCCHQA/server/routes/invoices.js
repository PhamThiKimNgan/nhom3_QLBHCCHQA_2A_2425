const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Tạo hóa đơn mới
router.post('/', async (req, res) => {
  try {
    const { orderId, total } = req.body;
    const [result] = await db.execute(
      'INSERT INTO invoices (orderId, total) VALUES (?, ?)',
      [orderId, total]
    );
    res.status(201).json({ success: true, invoiceId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lấy danh sách hóa đơn
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT invoices.*, orders.customerName FROM invoices JOIN orders ON invoices.orderId = orders.id ORDER BY invoices.createdAt DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật trạng thái thanh toán
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    await db.execute(
      'UPDATE invoices SET paymentStatus = ? WHERE id = ?',
      [paymentStatus, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;