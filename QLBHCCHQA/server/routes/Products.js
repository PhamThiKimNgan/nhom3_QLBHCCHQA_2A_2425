const express = require('express');
const router = express.Router();

let pool;
function setPool(p) {
  pool = p;
}

// Lấy tất cả sản phẩm
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');
  // Ép kiểu price về number
  const products = rows.map(row => ({
    ...row,
    price: Number(row.price)
  }));
  res.json(products);
});

// Thêm sản phẩm mới
router.post('/', async (req, res) => {
  const { code, name, size, color, price, quantity, category, imageUrl } = req.body;
  try {
    await pool.query(
      'INSERT INTO products (code, name, size, color, price, quantity, category, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [code, name, size, color, price, quantity, category, imageUrl]
    );
    res.status(201).json({ message: 'Product added' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Sửa sản phẩm
router.put('/:id', async (req, res) => {
  const { code, name, size, color, price, quantity, category, imageUrl } = req.body;
  const { id } = req.params;
  try {
    await pool.query(
      'UPDATE products SET code=?, name=?, size=?, color=?, price=?, quantity=?, category=?, imageUrl=? WHERE id=?',
      [code, name, size, color, price, quantity, category, imageUrl, id]
    );
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Xóa sản phẩm
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id=?', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = { router, setPool };