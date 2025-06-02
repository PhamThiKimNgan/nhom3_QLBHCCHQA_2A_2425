const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { router: productsRouter, setPool } = require('./routes/Products');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
setPool(pool);

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// API đăng ký
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
  }
  try {
    // Kiểm tra email đã tồn tại chưa
    const [results] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email đã tồn tại.' });
    }
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
    // Thêm user vào database
    await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    res.json({ message: 'Đăng ký thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server.' });
  }
});

// API đăng nhập
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [results] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (results.length === 0) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu sai.' });
    }
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu sai.' });
    }
    res.json({ message: 'Đăng nhập thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server.' });
  }
});

app.use('/api/products', productsRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

