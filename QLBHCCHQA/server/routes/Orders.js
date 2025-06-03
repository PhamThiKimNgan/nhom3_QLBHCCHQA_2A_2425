const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all orders
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders ORDER BY createdAt DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST new order
router.post('/', async (req, res) => {
  console.log('Received POST request to /api/orders');
  console.log('Request body:', req.body);
  
  try {
    const {
      customerName,
      phoneNumber,
      address,
      productName,
      size,
      quantity,
      shippingUnit,
      totalPrice,
      notes,
      status,
      customerId // Giả sử bạn có customerId trong đơn hàng
    } = req.body;

    const [result] = await db.execute(
      `INSERT INTO orders (
        customerName, phoneNumber, address, productName, 
        size, quantity, shippingUnit, totalPrice, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [customerName, phoneNumber, address, productName, 
       size, quantity, shippingUnit, totalPrice, notes, status]
    );

    console.log('Order created successfully:', result);

    const pointsToAdd = Math.floor(totalPrice / 1000000) * 10;
    if (pointsToAdd > 0 && customerId) {
      await db.execute(
        'UPDATE customers SET points = points + ? WHERE id = ?',
        [pointsToAdd, customerId]
      );
    }

    res.status(201).json({
      success: true,
      orderId: result.insertId,
      message: 'Tạo đơn hàng thành công'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;