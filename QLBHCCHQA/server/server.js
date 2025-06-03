const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const ordersRouter = require('./routes/orders');
const inventoryRouter = require('./routes/inventory');
const invoicesRouter = require('./routes/invoices');
const customersRouter = require('./routes/customers');
const reportsRouter = require('./routes/reports');
const usersRouter = require('./routes/users');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Test route để kiểm tra server hoạt động
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Routes
app.use('/api/orders', ordersRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/customers', customersRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/users', usersRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Đã xảy ra lỗi',
    error: err.message
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

if (!response.ok) {
  const error = await response.json();
  alert(error.message || "Có lỗi xảy ra!");
  return;
}