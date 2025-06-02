import React, { useState, useRef } from "react";
import {
  Phone,
  Package,
  User,
  MapPin,
  FileText,
  Bell,
  Edit3,
  Save,
  X,
  Truck,
} from "lucide-react";
import "./Order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState({
    customerName: "",
    phoneNumber: "",
    address: "",
    productName: "",
    size: "",
    shippingUnit: "",
    notes: "",
    status: "Pending",
  });
  const [editingOrder, setEditingOrder] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const invoiceRef = useRef();

  const products = [
    { name: "Áo thun cotton", basePrice: 150000 },
    { name: "Quần jeans", basePrice: 300000 },
    { name: "Áo khoác hoodie", basePrice: 450000 },
    { name: "Giày sneaker", basePrice: 800000 },
    { name: "Túi xách da", basePrice: 600000 },
  ];

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const shippingOptions = [
    { name: "Viettel Post", fee: 30000 },
    { name: "GHTK", fee: 25000 },
    { name: "Grab", fee: 45000 },
  ];
  const orderStatuses = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const calculateTotal = (productName, shippingUnit) => {
    const product = products.find((p) => p.name === productName);
    const shipping = shippingOptions.find((s) => s.name === shippingUnit);
    return (product?.basePrice || 0) + (shipping?.fee || 0);
  };

  const sendNotification = (phoneNumber, message) => {
    const notification = {
      id: Date.now(),
      phoneNumber,
      message,
      timestamp: new Date().toLocaleString(),
      type: "SMS",
    };
    setNotifications((prev) => [notification, ...prev]);
    setTimeout(() => {
      alert(`SMS sent to ${phoneNumber}: ${message}`);
    }, 500);
  };

  const handleCreateOrder = () => {
    if (
      !currentOrder.customerName ||
      !currentOrder.phoneNumber ||
      !currentOrder.productName
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    const newOrder = {
      ...currentOrder,
      id: Date.now(),
      orderDate: new Date().toLocaleDateString("vi-VN"),
      totalPrice: calculateTotal(
        currentOrder.productName,
        currentOrder.shippingUnit
      ),
      createdAt: new Date(),
    };

    setOrders((prev) => [...prev, newOrder]);

    sendNotification(
      currentOrder.phoneNumber,
      `Đơn hàng #${
        newOrder.id
      } đã được tạo thành công. Tổng tiền: ${newOrder.totalPrice.toLocaleString(
        "vi-VN"
      )}đ. Cảm ơn bạn!`
    );

    setCurrentOrder({
      customerName: "",
      phoneNumber: "",
      address: "",
      productName: "",
      size: "",
      shippingUnit: "",
      notes: "",
      status: "Pending",
    });

    alert("Đơn hàng đã được tạo thành công!");
  };

  const updateOrderStatus = (orderId, newStatus, newNotes = "") => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status: newStatus, notes: newNotes };
          sendNotification(
            order.phoneNumber,
            `Đơn hàng #${orderId} đã được cập nhật: ${newStatus}. ${
              newNotes ? "Ghi chú: " + newNotes : ""
            }`
          );
          return updatedOrder;
        }
        return order;
      })
    );
    setEditingOrder(null);
  };

  const generateInvoice = (order) => {
    const invoiceContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #333; margin: 0;">HÓA ĐƠN BÁN HÀNG</h1>
          <p style="margin: 10px 0;">Số hóa đơn: #${order.id}</p>
          <p style="margin: 0;">Ngày: ${order.orderDate}</p>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div>
            <h3 style="color: #333; margin-bottom: 10px;">Thông tin khách hàng:</h3>
            <p><strong>Tên:</strong> ${order.customerName}</p>
            <p><strong>SĐT:</strong> ${order.phoneNumber}</p>
            <p><strong>Địa chỉ:</strong> ${order.address}</p>
          </div>
          <div>
            <h3 style="color: #333; margin-bottom: 10px;">Thông tin đơn hàng:</h3>
            <p><strong>Trạng thái:</strong> ${order.status}</p>
            <p><strong>Đơn vị vận chuyển:</strong> ${order.shippingUnit}</p>
          </div>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Sản phẩm</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Size</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Giá</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px;">${
                order.productName
              }</td>
              <td style="border: 1px solid #ddd; padding: 12px;">${
                order.size
              }</td>
              <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">
                ${(
                  order.totalPrice -
                    shippingOptions.find((s) => s.name === order.shippingUnit)
                      ?.fee || 0
                ).toLocaleString("vi-VN")}đ
              </td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px;" colspan="2">Phí vận chuyển (${
                order.shippingUnit
              })</td>
              <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">
                ${(
                  shippingOptions.find((s) => s.name === order.shippingUnit)
                    ?.fee || 0
                ).toLocaleString("vi-VN")}đ
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr style="background-color: #f9f9f9; font-weight: bold;">
              <td style="border: 1px solid #ddd; padding: 12px;" colspan="2">Tổng cộng</td>
              <td style="border: 1px solid #ddd; padding: 12px; text-align: right; color: #e11d48;">
                ${order.totalPrice.toLocaleString("vi-VN")}đ
              </td>
            </tr>
          </tfoot>
        </table>
        ${
          order.notes
            ? `
          <div style="margin-bottom: 30px;">
            <h3 style="color: #333;">Ghi chú:</h3>
            <p>${order.notes}</p>
          </div>
        `
            : ""
        }
        <div style="text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p><strong>Cảm ơn quý khách đã mua hàng!</strong></p>
          <p>Mọi thắc mắc xin liên hệ: 1900-xxxx</p>
        </div>
      </div>
    `;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa đơn #${order.id}</title>
          <style>
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${invoiceContent}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="order-management-container">
      <div className="max-width-container">
        <div className="main-header">
          <h1 className="main-title">Tạo đơn đặt hàng</h1>
          <div className="main-subtitle">
            Tạo đơn hàng, xuất hóa đơn và quản lý trạng thái
          </div>
        </div>

        <div className="card form-container">
          <h2 className="form-title">
            <Package style={{ marginRight: 8, color: "#2563eb" }} />
            Tạo đơn hàng mới
          </h2>
          <div className="form-row">
            <div className="form-group">
              <label>
                <User style={{ width: 16, height: 16, marginRight: 4 }} />
                Tên khách hàng *
              </label>
              <input
                type="text"
                required
                value={currentOrder.customerName}
                onChange={(e) =>
                  setCurrentOrder((prev) => ({
                    ...prev,
                    customerName: e.target.value,
                  }))
                }
                placeholder="Nhập tên khách hàng"
              />
            </div>
            <div className="form-group">
              <label>
                <Phone style={{ width: 16, height: 16, marginRight: 4 }} />
                Số điện thoại *
              </label>
              <input
                type="tel"
                required
                value={currentOrder.phoneNumber}
                onChange={(e) =>
                  setCurrentOrder((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                placeholder="0xxxxxxxxx"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>
                <MapPin style={{ width: 16, height: 16, marginRight: 4 }} />
                Địa chỉ
              </label>
              <textarea
                value={currentOrder.address}
                onChange={(e) =>
                  setCurrentOrder((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                rows={2}
                placeholder="Nhập địa chỉ giao hàng"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>
                <Package style={{ width: 16, height: 16, marginRight: 4 }} />
                Sản phẩm *
              </label>
              <select
                required
                value={currentOrder.productName}
                onChange={(e) =>
                  setCurrentOrder((prev) => ({
                    ...prev,
                    productName: e.target.value,
                  }))
                }
              >
                <option value="">Chọn sản phẩm</option>
                {products.map((product) => (
                  <option key={product.name} value={product.name}>
                    {product.name} - {product.basePrice.toLocaleString("vi-VN")}
                    đ
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Size</label>
              <select
                value={currentOrder.size}
                onChange={(e) =>
                  setCurrentOrder((prev) => ({
                    ...prev,
                    size: e.target.value,
                  }))
                }
              >
                <option value="">Chọn size</option>
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>
                <Truck style={{ width: 16, height: 16, marginRight: 4 }} />
                Đơn vị vận chuyển
              </label>
              <select
                value={currentOrder.shippingUnit}
                onChange={(e) =>
                  setCurrentOrder((prev) => ({
                    ...prev,
                    shippingUnit: e.target.value,
                  }))
                }
              >
                <option value="">Chọn đơn vị vận chuyển</option>
                {shippingOptions.map((option) => (
                  <option key={option.name} value={option.name}>
                    {option.name} (+{option.fee.toLocaleString("vi-VN")}đ)
                  </option>
                ))}
              </select>
            </div>
          </div>
          {currentOrder.productName && currentOrder.shippingUnit && (
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <div
                  className="bg-blue-50 p-4 rounded-lg"
                  style={{ marginTop: 8 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Tổng tiền:
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      {calculateTotal(
                        currentOrder.productName,
                        currentOrder.shippingUnit
                      ).toLocaleString("vi-VN")}
                      đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Ghi chú</label>
              <input
                type="text"
                value={currentOrder.notes}
                onChange={(e) =>
                  setCurrentOrder((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                placeholder="Ghi chú cho đơn hàng"
              />
            </div>
            <div className="form-group" style={{ alignSelf: "flex-end" }}>
              <button className="btn-primary" onClick={handleCreateOrder}>
                Tạo đơn hàng
              </button>
            </div>
          </div>
        </div>

        <div className="card notification-panel">
          <h2
            className="form-title"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Bell style={{ marginRight: 8, color: "#16a34a" }} />
            Thông báo đã gửi
          </h2>
          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Chưa có thông báo nào
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="notification-message"
                  style={{
                    background: "#f0fdf4",
                    borderLeft: "4px solid #22c55e",
                    padding: "1rem 1.5rem",
                    borderRadius: "0.7rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    className="notification-title"
                    style={{
                      fontWeight: 600,
                      color: "#16a34a",
                      marginBottom: 4,
                    }}
                  >
                    SMS → {notification.phoneNumber}
                  </div>
                  <div
                    className="text-xs text-green-600"
                    style={{ marginBottom: 4 }}
                  >
                    {notification.timestamp}
                  </div>
                  <div
                    className="notification-message"
                    style={{ color: "#166534" }}
                  >
                    {notification.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card orders-table-container">
          <h2
            className="form-title"
            style={{ display: "flex", alignItems: "center" }}
          >
            <FileText style={{ marginRight: 8, color: "#9333ea" }} />
            Danh sách đơn hàng ({orders.length})
          </h2>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Chưa có đơn hàng nào
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Mã ĐH</th>
                    <th>Khách hàng</th>
                    <th>SĐT</th>
                    <th>Sản phẩm</th>
                    <th>Vận chuyển</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customerName}</td>
                      <td>{order.phoneNumber}</td>
                      <td>
                        {order.productName} {order.size && `(${order.size})`}
                      </td>
                      <td>{order.shippingUnit}</td>
                      <td>{order.totalPrice.toLocaleString("vi-VN")}đ</td>
                      <td>
                        <span
                          className={`status-badge status-${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={() => generateInvoice(order)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                            title="Xuất hóa đơn"
                          >
                            <FileText style={{ width: 16, height: 16 }} />
                          </button>
                          <button
                            onClick={() => setEditingOrder(order)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
                            title="Cập nhật trạng thái"
                          >
                            <Edit3 style={{ width: 16, height: 16 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {editingOrder && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <h3 className="text-lg font-semibold">
                  Cập nhật đơn hàng #{editingOrder.id}
                </h3>
                <button
                  onClick={() => setEditingOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X style={{ width: 24, height: 24 }} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Trạng thái
                  </label>
                  <select
                    value={editingOrder.status}
                    onChange={(e) =>
                      setEditingOrder((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Ghi chú
                  </label>
                  <textarea
                    value={editingOrder.notes || ""}
                    onChange={(e) =>
                      setEditingOrder((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Thêm ghi chú..."
                  />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() =>
                      updateOrderStatus(
                        editingOrder.id,
                        editingOrder.status,
                        editingOrder.notes
                      )
                    }
                    className="btn-primary"
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Save style={{ width: 16, height: 16, marginRight: 6 }} />
                    Cập nhật
                  </button>
                  <button
                    onClick={() => setEditingOrder(null)}
                    className="btn-secondary"
                    style={{
                      flex: 1,
                      background: "#e5e7eb",
                      color: "#334155",
                      borderRadius: "0.5rem",
                      fontWeight: 600,
                      border: "none",
                      padding: "0.8rem 2rem",
                      cursor: "pointer",
                    }}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
