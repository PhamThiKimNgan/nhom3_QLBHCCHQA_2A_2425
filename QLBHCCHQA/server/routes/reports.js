const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Báo cáo doanh thu theo ngày/tuần/tháng/quý
router.get('/revenue', async (req, res) => {
  const { type = 'month' } = req.query;
  let groupBy = 'MONTH(createdAt)';
  if (type === 'day') groupBy = 'DATE(createdAt)';
  if (type === 'week') groupBy = 'WEEK(createdAt)';
  if (type === 'quarter') groupBy = 'QUARTER(createdAt)';
  try {
    const [rows] = await db.query(
      `SELECT ${groupBy} as period, SUM(totalPrice) as revenue
       FROM orders
       GROUP BY period
       ORDER BY period DESC
       LIMIT 12`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Báo cáo tồn kho hiện tại
router.get('/inventory', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT inventory.*, products.name as productName
       FROM inventory
       JOIN products ON inventory.productId = products.id`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Báo cáo sản phẩm bán chạy
router.get('/best-sellers', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT productName, SUM(quantity) as totalSold
       FROM orders
       GROUP BY productName
       ORDER BY totalSold DESC
       LIMIT 10`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Xuất báo cáo ra Excel (giả lập, trả về JSON)
router.get('/export', async (req, res) => {
  // Ở đây bạn có thể dùng thư viện exceljs hoặc jsPDF để xuất file thực tế
  // Hiện tại trả về JSON để frontend xử lý tiếp
  try {
    const [rows] = await db.query('SELECT * FROM orders');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;