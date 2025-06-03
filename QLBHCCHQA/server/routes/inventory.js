const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Lấy danh sách tồn kho
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT inventory.*, products.name as productName FROM inventory JOIN products ON inventory.productId = products.id'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tạo phiếu nhập/xuất kho
router.post('/transaction', async (req, res) => {
  try {
    const { productId, size, color, quantity, type } = req.body;
    const [result] = await db.execute(
      'INSERT INTO stock_transactions (productId, size, color, quantity, type) VALUES (?, ?, ?, ?, ?)',
      [productId, size, color, quantity, type]
    );
    res.status(201).json({ success: true, transactionId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Phê duyệt xuất kho
router.put('/transaction/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    // Lấy thông tin phiếu xuất
    const [[transaction]] = await db.query('SELECT * FROM stock_transactions WHERE id = ?', [id]);
    if (!transaction) return res.status(404).json({ message: 'Không tìm thấy phiếu' });

    // Chỉ cho phép phê duyệt xuất kho
    if (transaction.type !== 'export') return res.status(400).json({ message: 'Chỉ phê duyệt xuất kho' });

    // Kiểm tra tồn kho
    const [[inv]] = await db.query(
      'SELECT * FROM inventory WHERE productId = ? AND size = ? AND color = ?',
      [transaction.productId, transaction.size, transaction.color]
    );
    if (!inv || inv.quantity < transaction.quantity)
      return res.status(400).json({ message: 'Không đủ tồn kho' });

    // Trừ tồn kho và cập nhật trạng thái phiếu
    await db.execute(
      'UPDATE inventory SET quantity = quantity - ? WHERE id = ?',
      [transaction.quantity, inv.id]
    );
    await db.execute(
      'UPDATE stock_transactions SET approved = 1 WHERE id = ?',
      [id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cảnh báo tồn kho dưới 10%
router.get('/low-stock', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT inventory.*, products.name as productName FROM inventory JOIN products ON inventory.productId = products.id WHERE inventory.quantity < 10'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;