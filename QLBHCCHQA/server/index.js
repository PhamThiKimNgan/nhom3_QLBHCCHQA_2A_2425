const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

const app = express();
app.use(cors());
app.use(express.json());

// API đăng ký
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
  }
  // Kiểm tra email đã tồn tại chưa
  connection.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: 'Lỗi server.' });
      if (results.length > 0) {
        return res.status(400).json({ message: 'Email đã tồn tại.' });
      }
      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);
      // Thêm user vào database
      connection.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err) => {
          if (err) return res.status(500).json({ message: 'Lỗi server.' });
          res.json({ message: 'Đăng ký thành công!' });
        }
      );
    }
  );
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

