import React, { createContext, useState, useContext } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const addOrder = async (orderData) => {
    try {
      // Kiểm tra dữ liệu trước khi gửi
      if (!orderData.productId || !orderData.quantity) {
        throw new Error("Vui lòng chọn sản phẩm và số lượng");
      }

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...orderData,
          status: "Pending",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi tạo đơn hàng");
      }

      // Thêm đơn hàng vào state
      setOrders((prev) => [...prev, data.order]);

      // Thông báo thành công
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "success",
          message: `Đặt hàng thành công!\nSản phẩm: ${
            data.order.productName
          }\nSố lượng: ${
            data.order.quantity
          }\nTổng tiền: ${data.order.totalPrice.toLocaleString("vi-VN")}đ`,
          timestamp: new Date().toLocaleString(),
        },
      ]);

      // Thông báo cảnh báo nếu hàng sắp hết
      if (data.remainingQuantity <= 10) {
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            type: "warning",
            message: `Cảnh báo: ${data.order.productName} sắp hết hàng (còn ${data.remainingQuantity} cái)`,
            timestamp: new Date().toLocaleString(),
            color: "red",
          },
        ]);
      }

      return data.order;
    } catch (error) {
      console.error("Lỗi:", error);
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "error",
          message: error.message,
          timestamp: new Date().toLocaleString(),
        },
      ]);
      throw error;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        setOrders,
        notifications,
        setNotifications,
        addOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
